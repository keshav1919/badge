import https from 'node:https';
import http from 'node:http';

/**
 * Clean & decode basic HTML entities
 */
function decodeHtmlEntities(str = '') {
  return str
    .replace(/&#0*64;/g, '@')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2022;/g, '•');
}

/**
 * Fetch Instagram profile information using server-side crawler user agent
 */
export async function fetchInstagramProfile(rawUsername) {
  const cleanUsername = rawUsername.trim().replace(/^@/, '').replace(/\/$/, '').toLowerCase();

  if (!cleanUsername || !/^[a-zA-Z0-9._]{1,30}$/.test(cleanUsername)) {
    return { exists: false, error: 'Invalid username format' };
  }

  const url = `https://www.instagram.com/${cleanUsername}/`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok && response.status === 404) {
      return { exists: false, error: 'User does not exist on Instagram' };
    }

    const html = await response.text();

    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1]) : '';

    const isMissing =
      title.includes('Page Not Found') ||
      title.includes("isn't available") ||
      title.includes('Page not found') ||
      (!html.includes('og:image') && !title.toLowerCase().includes(`@${cleanUsername}`));

    if (isMissing) {
      return { exists: false, error: 'User does not exist on Instagram' };
    }

    // Extract meta tags
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);

    // Extract Full Name / Display Name
    let fullName = cleanUsername;
    if (ogTitleMatch) {
      const decodedTitle = decodeHtmlEntities(ogTitleMatch[1]);
      const nameMatch = decodedTitle.match(/^(.*?)\s*\(@/);
      if (nameMatch && nameMatch[1]?.trim()) {
        fullName = nameMatch[1].trim();
      }
    }

    // Extract Stats: Followers, Following, Posts
    let followers = '0';
    let following = '0';
    let posts = '0';

    if (descMatch) {
      const decodedDesc = decodeHtmlEntities(descMatch[1]);
      const followersMatch = decodedDesc.match(/([\d,.]+[KMkm]?)\s+Followers/i);
      const followingMatch = decodedDesc.match(/([\d,.]+[KMkm]?)\s+Following/i);
      const postsMatch = decodedDesc.match(/([\d,.]+[KMkm]?)\s+Posts/i);

      if (followersMatch) followers = followersMatch[1];
      if (followingMatch) following = followingMatch[1];
      if (postsMatch) posts = postsMatch[1];
    }

    // Private account detection
    const isPrivate =
      html.includes('"is_private":true') ||
      html.includes('This Account is Private') ||
      html.includes('This account is private') ||
      html.includes('Follow to see their photos and videos');

    // Multi-source profile picture detection
    let rawProfilePic = null;
    const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    const twImgMatch = html.match(/<meta\s+(?:name|property)=["']twitter:image["']\s+content=["']([^"']+)["']/i);
    const hdJsonMatch = html.match(/"profile_pic_url_hd"\s*:\s*"([^"]+)"/i);
    const stdJsonMatch = html.match(/"profile_pic_url"\s*:\s*"([^"]+)"/i);

    if (ogImgMatch && ogImgMatch[1]) {
      rawProfilePic = decodeHtmlEntities(ogImgMatch[1]);
    } else if (twImgMatch && twImgMatch[1]) {
      rawProfilePic = decodeHtmlEntities(twImgMatch[1]);
    } else if (hdJsonMatch && hdJsonMatch[1]) {
      rawProfilePic = decodeHtmlEntities(hdJsonMatch[1].replace(/\\u0026/g, '&').replace(/\\/g, ''));
    } else if (stdJsonMatch && stdJsonMatch[1]) {
      rawProfilePic = decodeHtmlEntities(stdJsonMatch[1].replace(/\\u0026/g, '&').replace(/\\/g, ''));
    }

    let avatarDataUri = null;

    if (rawProfilePic) {
      try {
        const imgRes = await fetch(rawProfilePic, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Referer': 'https://www.instagram.com/',
          },
        });
        if (imgRes.ok) {
          const buf = await imgRes.arrayBuffer();
          const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
          avatarDataUri = `data:${contentType};base64,${Buffer.from(buf).toString('base64')}`;
        }
      } catch (imgErr) {
        console.warn(`[InstagramService] Avatar base64 conversion warning:`, imgErr.message);
      }
    }

    const finalAvatar = avatarDataUri || rawProfilePic;

    return {
      exists: true,
      username: cleanUsername,
      fullName: fullName || cleanUsername,
      profilePic: finalAvatar,
      avatarUrl: finalAvatar,
      rawProfilePic,
      followers,
      following,
      posts,
      isPrivate,
    };
  } catch (error) {
    console.error(`[InstagramService] Error fetching ${cleanUsername}:`, error.message);
    return { exists: false, error: 'Network error connecting to Instagram' };
  }
}

/**
 * Proxy Instagram CDN avatar images to prevent referrer/CORS blocking in client browsers
 */
export async function proxyAvatarImage(imageUrl, res) {
  if (!imageUrl) {
    res.statusCode = 400;
    res.end('Missing image URL');
    return;
  }

  try {
    const targetUrl = new URL(imageUrl);
    const client = targetUrl.protocol === 'https:' ? https : http;

    const request = client.get(
      imageUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, {
          'Content-Type': proxyRes.headers['content-type'] || 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        });
        proxyRes.pipe(res);
      }
    );

    request.on('error', (err) => {
      console.error('[AvatarProxy] Request error:', err.message);
      res.statusCode = 502;
      res.end('Bad Gateway');
    });
  } catch (err) {
    console.error('[AvatarProxy] Invalid URL:', err.message);
    res.statusCode = 400;
    res.end('Invalid URL');
  }
}
