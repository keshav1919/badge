import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Shield,
  Key,
  CreditCard,
  QrCode,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Lock,
  LogOut,
  Server,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { API_BASE_URL } from '../config/api';

export const Admin = () => {
  const { settings, isOnline, saveSettings, resetDefaults } = useSettings();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth_token') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Form fields
  const [amount, setAmount] = useState(settings.amount || 30);
  const [upiId, setUpiId] = useState(settings.upiId || 'paytm.s1x87m2@pty');
  const [payeeName, setPayeeName] = useState(settings.payeeName || 'Verified Badge');
  const [transactionNote, setTransactionNote] = useState(settings.transactionNote || 'Verified Badge');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Live QR canvas
  const canvasRef = useRef(null);

  // Sync form when settings load/change
  useEffect(() => {
    setAmount(settings.amount);
    setUpiId(settings.upiId);
    setPayeeName(settings.payeeName);
    setTransactionNote(settings.transactionNote);
  }, [settings]);

  // Construct NPCI UPI Intent URI for preview
  const previewUpiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${encodeURIComponent(Number(amount).toFixed(2))}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // Render live QR canvas whenever amount, upiId, payeeName, or note changes
  useEffect(() => {
    if (!canvasRef.current || !isAuthenticated) return;
    try {
      QRCode.toCanvas(
        canvasRef.current,
        previewUpiUri,
        {
          width: 180,
          margin: 1,
          color: {
            dark: '#111827',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('Admin QR preview error:', error);
        }
      );
    } catch (err) {
      console.error('QR rendering error:', err);
    }
  }, [previewUpiUri, isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    // Default password or current password check
    if (passwordInput === 'admin123' || passwordInput === sessionStorage.getItem('admin_pwd')) {
      sessionStorage.setItem('admin_auth_token', 'true');
      sessionStorage.setItem('admin_pwd', passwordInput);
      setIsAuthenticated(true);
    } else {
      // Also try validating against server settings
      fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword: passwordInput,
          amount: Number(settings.amount),
          upiId: settings.upiId,
          payeeName: settings.payeeName,
          transactionNote: settings.transactionNote,
        }),
      })
        .then((res) => {
          if (res.ok) {
            sessionStorage.setItem('admin_auth_token', 'true');
            sessionStorage.setItem('admin_pwd', passwordInput);
            setIsAuthenticated(true);
          } else {
            setAuthError('Incorrect admin password. Default is admin123');
          }
        })
        .catch(() => {
          setAuthError('Incorrect admin password. Default is admin123');
        });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth_token');
    sessionStorage.removeItem('admin_pwd');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    const currentPwd = sessionStorage.getItem('admin_pwd') || 'admin123';

    try {
      const result = await saveSettings(
        {
          amount: Number(amount),
          upiId: upiId.trim(),
          payeeName: payeeName.trim(),
          transactionNote: transactionNote.trim(),
          newAdminPassword: newPassword ? newPassword.trim() : undefined,
        },
        currentPwd
      );

      if (newPassword) {
        sessionStorage.setItem('admin_pwd', newPassword.trim());
        setNewPassword('');
      }

      setSaveMessage(
        result.serverOk
          ? '✅ Settings saved to server and browser successfully!'
          : `⚠️ Saved locally in browser. (${result.serverMessage})`
      );

      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err) {
      setSaveError(`❌ Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all pricing and UPI settings back to default (₹30, paytm.s1x87m2@pty)?')) {
      resetDefaults();
      setAmount(30);
      setUpiId('paytm.s1x87m2@pty');
      setPayeeName('Verified Badge');
      setTransactionNote('Verified Badge');
      setSaveMessage('Restored default settings.');
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  // ── 1. LOGIN SCREEN ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-xl p-6 text-center">
          <div className="w-14 h-14 bg-blue-50 text-[#0064E0] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Panel</h1>
          <p className="text-xs text-gray-500 mb-6">
            Enter your admin password to manage pricing, UPI payments, and API settings.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Admin Password"
                className="w-full px-4 py-3 pr-10 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0064E0] focus:border-transparent outline-none transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {authError && (
              <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#0064E0] hover:bg-[#0051B8] active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <span className="text-[11px] text-gray-400">
              Default password: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">admin123</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. ADMIN DASHBOARD ──
  return (
    <div className="p-4 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-[#0064E0] rounded-xl flex items-center justify-center border border-blue-100">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-[11px] font-medium text-gray-500">
                {isOnline ? 'Backend Online (Sync Active)' : 'Local Storage Mode'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          title="Log Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications */}
      {saveMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">{saveMessage}</span>
        </div>
      )}

      {saveError && (
        <div className="p-3.5 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-medium">{saveError}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Card 1: Payment & UPI Settings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <CreditCard className="w-4 h-4 text-[#0064E0]" />
            <h2 className="text-sm font-semibold text-gray-900">Subscription & UPI Settings</h2>
          </div>

          {/* Price (Amount in INR) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Subscription Price (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0064E0] focus:border-transparent outline-none transition-all"
                placeholder="30"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Current amount charged to customers across all checkout pages.
            </p>
          </div>

          {/* Recipient UPI ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Recipient UPI ID (VPA)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
              placeholder="paytm.s1x87m2@pty"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0064E0] focus:border-transparent outline-none transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Payments are routed directly to this UPI address via QR & mobile intents.
            </p>
          </div>

          {/* Payee / Business Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Payee Display Name
            </label>
            <input
              type="text"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              required
              placeholder="Verified Badge"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0064E0] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Transaction Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              UPI Transaction Note
            </label>
            <input
              type="text"
              value={transactionNote}
              onChange={(e) => setTransactionNote(e.target.value)}
              placeholder="Verified Badge"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0064E0] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Card 2: Live Test QR Preview */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#0064E0]" />
              <h2 className="text-sm font-semibold text-gray-900">Live Test QR Preview</h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Preview
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl border border-gray-100">
            <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
            <div className="mt-3 text-center">
              <div className="text-xs font-bold text-gray-800">
                ₹{Number(amount).toFixed(2)} to <span className="font-mono text-[#0064E0]">{upiId}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Scan with PhonePe, GPay, or Paytm to verify the payment request.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Backend API Connection Info */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Server className="w-4 h-4 text-[#0064E0]" />
            <h2 className="text-sm font-semibold text-gray-900">Backend Connection & API Key</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Active API Base URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={API_BASE_URL || 'Local Proxy (http://localhost:8000)'}
                className="w-full px-3.5 py-2 text-xs bg-gray-100 border border-gray-200 rounded-xl font-mono text-gray-600 outline-none"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Configure <code>VITE_API_BASE_URL</code> in your Netlify site settings to point to your live backend tunnel.
            </p>
          </div>
        </div>

        {/* Card 4: Change Password */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Key className="w-4 h-4 text-[#0064E0]" />
            <h2 className="text-sm font-semibold text-gray-900">Change Admin Password</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              New Password (leave empty to keep current)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0064E0] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2.5">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-[#0064E0] hover:bg-[#0051B8] active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Settings to Server & Web'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Reset to Defaults (₹30, Paytm)</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
