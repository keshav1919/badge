import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ShieldCheck,
  Headphones,
  Sparkles,
  CreditCard,
  Loader2,
} from 'lucide-react';
import MetaLogo from './MetaLogo';
import VerifiedBadge from './VerifiedBadge';
import { PAYMENT_CONFIG } from '../config/payment';
import { formatCurrency } from '../utils/formatters';
import { useUser } from '../context/UserContext';
import paymentService from '../services/paymentService';

export const PlanCard = ({ onOpenUsernameModal }) => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const displayUser = currentUser || {
    username: 'your_account',
    fullName: 'Your Instagram Account',
    followers: '0',
    profilePic: null,
    avatarUrl: null,
  };

  const handleDirectPay = async () => {
    setIsProcessing(true);
    try {
      const res = await paymentService.createPayment({
        customerData: {
          username: displayUser.username,
          email: `${displayUser.username}@example.com`,
          phone: '9876543210',
        },
      });

      if (res?.session) {
        navigate(`/payment?session=${res.session.sessionId}`);
      } else {
        navigate('/payment');
      }
    } catch (err) {
      console.error('Payment initialization failed:', err);
      navigate('/payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const benefits = [
    {
      title: 'A verified badge',
      desc: 'Build trust with your audience showing you are an authentic public presence.',
      icon: VerifiedBadge,
      isCustomBadge: true,
    },
    {
      title: 'Proactive account protection',
      desc: 'Expert audit to safeguard your account against impersonation and security gaps.',
      icon: ShieldCheck,
      color: 'text-[#0095F6]',
    },
    {
      title: 'Direct human support',
      desc: 'Get fast answers from a dedicated specialist regarding your verification status.',
      icon: Headphones,
      color: 'text-[#0095F6]',
    },
    {
      title: 'Full application walkthrough',
      desc: 'Step-by-step submission checklist tailored specifically to your niche.',
      icon: Sparkles,
      color: 'text-[#0095F6]',
    },
  ];

  const avatarSrc = displayUser.avatarUrl || displayUser.profilePic;

  return (
    <>
      {/* Top Meta Accounts Center Page Header (Spacious, authentic Meta styling) */}
      <div className="text-left mb-4 px-1">
        <div className="flex items-center gap-2 mb-2">
          <MetaLogo height={14} />
          <span className="text-[#8A8D91] text-xs leading-none">•</span>
          <span className="text-xs font-semibold text-[#65676B] tracking-tight">
            Accounts Center
          </span>
        </div>
        <h1 className="text-[22px] font-bold text-[#1C1E21] tracking-tight leading-[1.25] mb-1.5">
          Set up verification assistance on Instagram
        </h1>
        <p className="text-[13.5px] text-[#65676B] leading-[1.45]">
          Guided account review, eligibility preparation, and onboarding in one place.
        </p>
      </div>

      {/* Selected Account Profile Card (Native Instagram card) */}
      <div className="bg-white rounded-2xl border border-black/[0.08] p-3.5 mb-3 flex items-center justify-between text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full p-[2px] ig-story-gradient shrink-0">
            <div className="w-full h-full rounded-full bg-white p-[1.5px] overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayUser.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#262626] text-white flex items-center justify-center text-sm font-bold">
                  {(displayUser.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[14px] text-[#1C1E21] truncate">
              @{displayUser.username}
            </div>
            <div className="text-[12px] text-[#65676B] truncate flex items-center gap-1 mt-0.5">
              <span>Instagram</span>
              <span>•</span>
              <span>{displayUser.followers || '0'} followers</span>
              {displayUser.isPrivate !== undefined && (
                <>
                  <span>•</span>
                  <span>{displayUser.isPrivate ? 'Private' : 'Public'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {onOpenUsernameModal && (
            <button
              type="button"
              onClick={onOpenUsernameModal}
              className="text-xs font-semibold text-[#0095F6] hover:text-[#1877F2] transition-colors px-1 py-0.5 cursor-pointer"
            >
              Change
            </button>
          )}
          <div className="w-5 h-5 rounded-full bg-[#0095F6] flex items-center justify-center text-white shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Pricing Summary Card */}
      <div className="bg-white rounded-2xl border border-black/[0.08] p-4 mb-3 flex items-center justify-between text-left">
        <div>
          <span className="text-[14px] font-bold text-[#1C1E21] block">
            Annual guidance plan
          </span>
          <p className="text-[12px] text-[#65676B] mt-0.5">
            Yearly subscription • Cancel anytime before renewal
          </p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <span className="text-xl font-black text-[#0095F6]">
            {formatCurrency(PAYMENT_CONFIG.amount)}
          </span>
          <span className="text-xs font-semibold text-[#65676B]"> / yr</span>
        </div>
      </div>

      {/* Meta Accounts Center What's Included Feature List */}
      <div className="bg-white rounded-2xl border border-black/[0.08] p-4 text-left space-y-3.5 mb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#65676B]">
          What's included with verification assistance:
        </div>

        <div className="space-y-3">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {b.isCustomBadge ? (
                    <VerifiedBadge size={19} color="#3897F0" />
                  ) : (
                    <Icon className={`w-[19px] h-[19px] ${b.color || 'text-[#0095F6]'}`} />
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[13.5px] font-bold text-[#1C1E21] leading-tight">
                    {b.title}
                  </div>
                  <div className="text-[12px] text-[#65676B] leading-relaxed">
                    {b.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permanently Fixed Footer Bottom Bar with Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.08] p-3">
        <div className="max-w-[420px] mx-auto flex items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-[#65676B] tracking-wide">
              Verification Plan
            </div>
            <div className="text-lg font-black text-[#1C1E21] leading-tight">
              {formatCurrency(PAYMENT_CONFIG.amount)}{' '}
              <span className="text-xs font-normal text-[#65676B]">/ yr</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDirectPay}
            disabled={isProcessing}
            className="flex-1 max-w-[200px] h-11 rounded-full bg-[#0095F6] hover:bg-[#1877F2] active:bg-[#0081D6] text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay {formatCurrency(PAYMENT_CONFIG.amount)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PlanCard;
