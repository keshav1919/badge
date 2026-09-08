import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign, ArrowRight, Loader2, AlertCircle, X, ShieldCheck, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const UsernameModal = ({ isOpen, onClose, redirectPath = '/plans' }) => {
  const navigate = useNavigate();
  const { fetchUser, isLoading, currentUser } = useUser();
  const [usernameInput, setUsernameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const clean = usernameInput.trim().replace(/^@/, '');
    if (!clean) {
      setErrorMessage('Please enter an Instagram username');
      return;
    }

    setErrorMessage('');
    const result = await fetchUser(clean);

    if (result.success) {
      if (onClose) onClose();
      if (redirectPath) {
        navigate(redirectPath);
      }
    } else {
      setErrorMessage(result.error || 'Account not found on Instagram. Please enter a valid username.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-lg border border-[#DBDBDB] shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="space-y-1.5 pr-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0095F6] bg-blue-50 px-2 py-0.5 rounded-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Profile Photo & Details Verification</span>
          </div>
          <h2 className="text-xl font-black text-[#0F1419] tracking-tight">
            Enter Your Instagram Username
          </h2>
          <p className="text-xs text-[#737373] leading-relaxed">
            We will detect your profile photo and verify your account live from Instagram (both public and private accounts supported).
          </p>
        </div>

        {/* Clickable Currently Detected Profile */}
        {currentUser && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                if (redirectPath) navigate(redirectPath);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-50 border border-blue-200 hover:border-[#0095F6] shadow-2xs hover:shadow-xs cursor-pointer transition-all text-left group active:scale-[0.99]"
              title={`Continue with @${currentUser.username}`}
            >
              <div className="w-11 h-11 rounded-full p-[2px] ig-story-gradient shrink-0">
                <div className="w-full h-full rounded-full bg-white p-[1px]">
                  {currentUser.avatarUrl || currentUser.profilePic ? (
                    <img
                      src={currentUser.avatarUrl || currentUser.profilePic}
                      alt={currentUser.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#262626] text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-xs font-bold text-[#0F1419] truncate group-hover:text-[#0095F6] transition-colors">
                    Currently Active: @{currentUser.username}
                  </div>
                  <span className="text-[10px] font-bold text-[#0095F6] bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0 group-hover:bg-[#0095F6] group-hover:text-white transition-all">
                    Continue →
                  </span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Instagram Profile • {currentUser.followers} followers</span>
                </div>
              </div>
            </button>

            {/* Subtle Divider */}
            <div className="relative flex items-center">
              <div className="grow border-t border-[#EFEFEF]"></div>
              <span className="shrink mx-2 text-[10px] uppercase font-bold text-neutral-400">
                or enter another username
              </span>
              <div className="grow border-t border-[#EFEFEF]"></div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-sm flex items-start gap-2 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-snug">
              <strong className="font-semibold block">Invalid username</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Username Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="modal-ig-username" className="block text-xs font-bold text-[#0F1419]">
              Instagram Handle
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                id="modal-ig-username"
                type="text"
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="enter username"
                className={`w-full pl-10 pr-4 py-2.5 rounded-sm border text-sm font-medium transition-all outline-none ${
                  errorMessage
                    ? 'border-rose-400 bg-rose-50/20 text-[#0F1419] focus:ring-1 focus:ring-rose-400'
                    : 'border-[#DBDBDB] bg-neutral-50/50 text-[#0F1419] focus:border-[#0095F6] focus:bg-white focus:ring-1 focus:ring-[#0095F6]'
                }`}
              />
            </div>
            <p className="text-[11px] text-[#737373] pl-0.5">
              Enter your exact account username without @.
            </p>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!usernameInput.trim() || isLoading}
            className={`w-full inline-flex items-center justify-center gap-2 font-bold py-3 px-5 rounded-sm text-sm transition-all shadow-xs ${
              usernameInput.trim() && !isLoading
                ? 'bg-[#0095F6] hover:bg-[#0081d6] active:scale-[0.99] text-white cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking Instagram...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Note */}
        <p className="text-[11px] text-center text-neutral-400 flex items-center justify-center gap-1.5 pt-1">
          <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>No password or login required. Pure live account audit.</span>
        </p>
      </div>
    </div>
  );
};

export default UsernameModal;
