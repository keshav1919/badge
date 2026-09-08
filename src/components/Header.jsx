import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import { useUser } from '../context/UserContext';

export const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { currentUser } = useUser();

  const userAvatarSrc = currentUser?.avatarUrl || currentUser?.profilePic;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#DBDBDB] select-none">
      <div className="w-full px-3.5 h-12 flex items-center justify-between">
        {/* Left: Instagram Branding + Back Button */}
        <div className="flex items-center gap-1.5">
          {!isHome && (
            <Link
              to="/"
              className="text-[#262626] p-1 -ml-1.5 active:scale-90 transition-transform"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2]" />
            </Link>
          )}

          {/* Instagram Brand Wordmark */}
          <Link to="/" className="flex items-center gap-1 group shrink-0">
            <span
              className="text-xl font-bold tracking-tight text-[#262626]"
              style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}
            >
              Instagram
            </span>
            <VerifiedBadge size={14} />
          </Link>
        </div>

        {/* Right: Detected Profile Photo DP with Story Ring */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <Link
              to="/plans"
              className="flex items-center gap-1.5 pl-1.5 py-1 rounded-sm active:opacity-75 transition-opacity"
              title={`Detected: @${currentUser.username}`}
            >
              <div className="relative shrink-0">
                <div className="w-7 h-7 rounded-full p-[1.5px] ig-story-gradient">
                  <div className="w-full h-full rounded-full bg-white p-[1px]">
                    {userAvatarSrc ? (
                      <img
                        src={userAvatarSrc}
                        alt={currentUser.username}
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#262626] text-white flex items-center justify-center text-[10px] font-bold">
                        {currentUser.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-left leading-none max-w-[90px]">
                <span className="font-bold text-[11px] text-[#262626] truncate">
                  @{currentUser.username}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              to="/plans"
              className="ig-btn-primary h-7 px-2.5 text-[11px] font-bold rounded-sm"
            >
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
