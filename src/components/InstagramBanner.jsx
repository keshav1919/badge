import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Lock, Globe } from 'lucide-react';

export const InstagramBanner = ({ user: propUser, onChangeUsername }) => {
  const { currentUser } = useUser();
  const user = propUser || currentUser || {
    username: 'horrorgoattv',
    fullName: 'horror goattv',
    followers: '2,529',
    following: '3',
    profilePic: null,
    avatarUrl: null,
    isPrivate: false,
  };

  const [useProxy, setUseProxy] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Avatar source priority: Base64 data URI -> Proxied URL -> Raw URL
  let avatarSrc = null;
  if (!imgFailed) {
    if (useProxy && user.rawProfilePic) {
      avatarSrc = `/api/avatar-proxy?url=${encodeURIComponent(user.rawProfilePic)}`;
    } else {
      avatarSrc = user.avatarUrl || user.profilePic || (user.rawProfilePic ? `/api/avatar-proxy?url=${encodeURIComponent(user.rawProfilePic)}` : null);
    }
  }

  return (
    <div className="w-full max-w-[420px] mx-auto mb-4">
      <div className="bg-black text-[#f5f5f5] rounded-lg border border-neutral-800/80 shadow-xl overflow-hidden p-2.5 relative">
        <header
          className="
            mx-auto
            grid
            w-full
            grid-cols-[115px_1fr]
            overflow-visible
            text-[14px]
            leading-[18px]
            pt-2
          "
        >
          {/* Profile Image Section */}
          <section
            className="
              flex
              h-[105px]
              w-[115px]
              items-center
              justify-center
            "
          >
            <div
              className="
                relative
                block
                h-24
                w-24
                overflow-hidden
                rounded-full
                bg-[#25292e]
                ring-2
                ring-[#0095F6]/40
              "
              aria-label={`${user.username} profile`}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={`${user.username}'s detected Instagram profile picture`}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (!useProxy && user.rawProfilePic) {
                      setUseProxy(true);
                    } else {
                      setImgFailed(true);
                    }
                  }}
                  className="
                    block
                    h-24
                    w-24
                    rounded-full
                    object-cover
                  "
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 flex items-center justify-center text-white text-2xl font-bold">
                  {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              <span
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-full
                  border
                  border-white/10
                "
              ></span>
            </div>
          </section>

          {/* Profile Info Section */}
          <section
            className="
              flex
              min-h-[110px]
              flex-col
              justify-center
              pr-2.5
            "
          >
            <div
              className="
                flex
                flex-col
                items-start
                gap-1.5
                overflow-hidden
              "
            >
              {/* Username + Options Button */}
              <div
                className="
                  flex
                  h-8
                  items-center
                  justify-start
                  gap-2
                  w-full
                "
              >
                <div
                  className="
                    flex
                    max-w-[200px]
                    items-center
                    gap-1.5
                    overflow-hidden
                  "
                >
                  <h1
                    className="
                      m-0
                      max-w-full
                      overflow-hidden
                      text-ellipsis
                      whitespace-nowrap
                      text-[19px]
                      font-bold
                      leading-[22px]
                      text-white
                    "
                    title={user.username}
                  >
                    {user.username}
                  </h1>
                  {user.isPrivate && (
                    <span title="Private Account" className="text-neutral-400">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {onChangeUsername && (
                  <button
                    type="button"
                    onClick={onChangeUsername}
                    aria-label="Change account"
                    title="Change account"
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-sm
                      p-1
                      text-neutral-400
                      hover:text-white
                      hover:bg-white/10
                      transition-colors
                      ml-auto
                    "
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="6" r="1.5"></circle>
                      <circle cx="12" cy="12" r="1.5"></circle>
                      <circle cx="12" cy="18" r="1.5"></circle>
                    </svg>
                  </button>
                )}
              </div>

              {/* Display Name */}
              <div
                className="
                  flex
                  items-center
                  justify-start
                "
              >
                <span className="block text-[14px] leading-[18px] text-neutral-300 font-medium">
                  {user.fullName || user.username}
                </span>
              </div>

              {/* Followers / Following */}
              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-start
                  text-[13px]
                  leading-[18px]
                  text-neutral-300
                  pt-0.5
                "
              >
                <span className="inline">
                  <span className="font-semibold text-white">{user.followers || '0'}</span> followers
                </span>

                <span className="mx-2 text-neutral-600">•</span>

                <span className="inline">
                  <span className="font-semibold text-white">{user.following || '0'}</span> following
                </span>

                {user.posts && user.posts !== '0' && (
                  <>
                    <span className="mx-2 text-neutral-600">•</span>
                    <span className="inline">
                      <span className="font-semibold text-white">{user.posts}</span> posts
                    </span>
                  </>
                )}
              </div>
            </div>
          </section>
        </header>

        {/* Account status note footer */}
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 px-1">
          <span className="flex items-center gap-1.5">
            {user.isPrivate ? (
              <>
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Private Profile Verified</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 text-[#0095F6]" />
                <span>Public Profile Verified</span>
              </>
            )}
          </span>
          {onChangeUsername && (
            <button
              onClick={onChangeUsername}
              className="text-[#0095F6] hover:underline font-semibold"
            >
              Change
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramBanner;
