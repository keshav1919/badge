import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Zap,
  Activity,
  Layers,
  FileCheck,
  CreditCard,
  Send,
  Lock,
  Globe,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  AtSign,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import MetaLogo from '../components/MetaLogo';
import VerifiedBadge from '../components/VerifiedBadge';
import { UsernameModal } from '../components/UsernameModal';
import { FAQ_ITEMS } from '../data/faq';
import { PAYMENT_CONFIG } from '../config/payment';
import { useUser } from '../context/UserContext';

export const Home = () => {
  const navigate = useNavigate();
  const { fetchUser, isLoading, currentUser } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroUsername, setHeroUsername] = useState('');
  const [heroError, setHeroError] = useState('');

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    const clean = heroUsername.trim().replace(/^@/, '');
    if (!clean) {
      setHeroError('Please enter your Instagram username');
      return;
    }

    setHeroError('');
    const result = await fetchUser(clean);
    if (result.success) {
      navigate('/plans');
    } else {
      setHeroError(result.error || 'Account not found on Instagram. Please enter a valid username.');
    }
  };

  const benefits = [
    {
      icon: Search,
      title: 'Verification Guidance',
      description: 'Step-by-step submission checklist tailored to Instagram standards.',
      color: 'text-[#0095F6] bg-blue-50',
    },
    {
      icon: FileCheck,
      title: 'Profile Audit',
      description: 'Comprehensive review of your bio, photo, and public presence.',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: 'Direct WhatsApp and email assistance for active subscribers.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: Activity,
      title: 'Instant Activation',
      description: 'Quick automated verification assistance onboarding for your account.',
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: Layers,
      title: 'Enter Username',
      description: 'Click Get Started and enter your Instagram handle for real-time audit.',
    },
    {
      number: '02',
      icon: Search,
      title: 'Profile Photo Detection',
      description: 'We detect your profile photo, stats, and account readiness live.',
    },
    {
      number: '03',
      icon: CreditCard,
      title: 'Complete Payment',
      description: 'Pay ₹1 securely via UPI (Google Pay, PhonePe, Paytm, BHIM).',
    },
    {
      number: '04',
      icon: Send,
      title: 'Submit Application',
      description: 'Follow personalized advisory notes to submit your verification.',
    },
  ];

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-4 space-y-6 select-none">
      {/* Username Modal Triggered on Get Started */}
      <UsernameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        redirectPath="/plans"
      />

      {/* Hero Section */}
      <section className="space-y-4">
        {/* Official Meta Advisory Badge with SVG Logo */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-blue-50 border border-blue-200 text-[11px] font-bold text-[#0095F6]">
          <MetaLogo size={14} />
          <span>Meta Accounts Center Assistance</span>
        </div>

        {/* Headline & Price */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black text-[#0F1419] tracking-tight leading-tight">
            Get Verification Assistance for{' '}
            <span className="text-[#0095F6]">
              {PAYMENT_CONFIG.currencySymbol}{PAYMENT_CONFIG.amount}/year
            </span>
          </h1>

          <p className="text-xs text-[#737373] leading-relaxed">
            Audit your profile photo and readiness live from Instagram. Receive personalized guidance to prepare your account for official platform review.
          </p>
        </div>

        {/* PRIMARY CTA: Get Started Button (Opens Username Modal) */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full ig-btn-primary h-12 text-sm font-bold rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Direct Quick Username Input Form */}
        <div className="bg-white p-3 rounded-lg border border-[#DBDBDB] shadow-2xs space-y-2">
          <label className="block text-[11px] font-bold text-[#0F1419]">
            Or enter your Instagram username directly:
          </label>

          <form onSubmit={handleHeroSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                <AtSign className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={heroUsername}
                onChange={(e) => {
                  setHeroUsername(e.target.value);
                  if (heroError) setHeroError('');
                }}
                placeholder="enter username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                className={`w-full pl-8 pr-3 py-2 rounded-sm border text-xs font-medium outline-none transition-all ${
                  heroError
                    ? 'border-rose-400 bg-rose-50/20 text-[#0F1419]'
                    : 'border-[#DBDBDB] bg-neutral-50/50 text-[#0F1419] focus:bg-white focus:border-[#0095F6]'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#0095F6] hover:bg-[#0081d6] active:scale-95 text-white font-bold py-2 px-3.5 rounded-sm text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {heroError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-[11px] p-2 rounded-sm flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{heroError}</span>
            </div>
          )}
        </div>

        {/* Live Detected Instagram Account Card (If Present) */}
        {currentUser && (
          <div className="bg-white p-3.5 rounded-lg border border-neutral-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Detected Instagram Profile
              </span>
              <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                {currentUser.isPrivate ? (
                  <>
                    <Lock className="w-3 h-3 text-neutral-400" />
                    <span>Private</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3 text-[#0095F6]" />
                    <span>Public</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full p-[1.5px] ig-story-gradient">
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
                        {currentUser.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1 font-bold text-xs text-[#0F1419]">
                  <span className="truncate">@{currentUser.username}</span>
                  <VerifiedBadge size={13} />
                </div>
                <div className="text-[11px] text-[#737373] truncate">
                  {currentUser.fullName || currentUser.username}
                </div>
                <div className="text-[10px] font-semibold text-neutral-600 mt-0.5">
                  <span className="text-[#0F1419] font-bold">{currentUser.followers}</span> followers • <span className="text-[#0F1419] font-bold">{currentUser.following}</span> following
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/plans')}
                className="bg-[#0095F6] hover:bg-[#0081d6] active:scale-95 text-white font-bold py-1.5 px-3 rounded-sm text-[11px] flex items-center gap-1 shrink-0"
              >
                <span>View Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Trust Badges with SVG Icons */}
        <div className="flex items-center justify-between text-[11px] text-[#737373] pt-1 px-1">
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>No Passwords</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0095F6] shrink-0" />
            <span>Public & Private</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Live Audit</span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-3 pt-2">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0095F6]">
            Why Choose VerifyAssist
          </span>
          <h2 className="text-lg font-extrabold text-[#0F1419] tracking-tight">
            Account Guidance From Day One
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-[#DBDBDB] p-3 shadow-2xs space-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center mb-1.5 ${b.color}`}>
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="text-xs font-bold text-[#0F1419]">
                    {b.title}
                  </h3>
                  <p className="text-[11px] text-[#737373] leading-snug mt-0.5">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="space-y-3 pt-2">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0095F6]">
            How It Works
          </span>
          <h2 className="text-lg font-extrabold text-[#0F1419] tracking-tight">
            4 Steps to Prepare Your Account
          </h2>
        </div>

        <div className="space-y-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-[#DBDBDB] p-3 flex items-start gap-3 shadow-2xs"
              >
                <div className="w-7 h-7 rounded-sm bg-blue-50 text-[#0095F6] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {s.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-[#0F1419] flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-[#0095F6]" />
                    <span>{s.title}</span>
                  </h3>
                  <p className="text-[11px] text-[#737373] leading-snug mt-0.5">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Get Started CTA Card */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200/80 rounded-lg space-y-2.5 text-center">
          <h3 className="font-bold text-xs text-[#0F1419]">
            Ready to audit your profile photo & readiness?
          </h3>
          <p className="text-[11px] text-[#737373]">
            Personalized checklist and expert audit delivered within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#0095F6] hover:bg-[#0081d6] active:scale-[0.98] text-white text-xs font-bold py-3 px-4 rounded-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Get Started · {PAYMENT_CONFIG.currencySymbol}{PAYMENT_CONFIG.amount}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* FAQ Snippet Section */}
      <section className="space-y-3 pt-2">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0095F6]">
            Questions & Answers
          </span>
          <h2 className="text-lg font-extrabold text-[#0F1419] tracking-tight">
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.slice(0, 3).map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-[#DBDBDB] p-3 shadow-2xs space-y-1">
              <h3 className="font-bold text-xs text-[#0F1419] flex items-start gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#0095F6] shrink-0 mt-0.5" />
                <span>{item.question}</span>
              </h3>
              <p className="text-[11px] text-[#737373] leading-relaxed pl-5">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => navigate('/faq')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0095F6] hover:underline cursor-pointer"
          >
            <span>View All Questions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
