import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
import {
  PAYMENT_CONFIG,
  DEFAULT_PAYMENT_CONFIG,
  getStoredSettings,
  updatePaymentConfig,
  resetPaymentConfig,
} from '../config/payment';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_PAYMENT_CONFIG,
    ...(getStoredSettings() || {}),
  }));
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync state from server on mount
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public-settings`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setIsOnline(true);
        if (data && typeof data.amount === 'number') {
          const merged = {
            amount: data.amount,
            upiId: data.upiId || PAYMENT_CONFIG.upiId,
            payeeName: data.payeeName || PAYMENT_CONFIG.payeeName,
            transactionNote: data.transactionNote || PAYMENT_CONFIG.transactionNote,
          };
          updatePaymentConfig(merged);
          setSettings((prev) => ({ ...prev, ...merged }));
        }
      } else {
        setIsOnline(false);
      }
    } catch (err) {
      console.warn('Backend public-settings not reachable, using local config:', err);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();

    const handleUpdate = (e) => {
      if (e.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener('app_settings_updated', handleUpdate);
    return () => window.removeEventListener('app_settings_updated', handleUpdate);
  }, [refreshSettings]);

  // Save settings both to the server (if available) and to local browser config
  const saveSettings = async (newValues, adminPassword) => {
    let serverOk = false;
    let serverMessage = '';

    // 1. Attempt to update on shared backend server
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          adminPassword,
          amount: Number(newValues.amount),
          upiId: newValues.upiId,
          payeeName: newValues.payeeName,
          transactionNote: newValues.transactionNote || 'Verified Badge',
          newAdminPassword: newValues.newAdminPassword || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        serverOk = true;
        serverMessage = json.message || 'Server updated';
      } else {
        throw new Error(json.detail || 'Server rejected changes');
      }
    } catch (err) {
      // If server returned 401 Unauthorized, throw so admin is alerted
      if (err.message && err.message.toLowerCase().includes('password')) {
        throw err;
      }
      serverMessage = `Saved locally (Server unreachable: ${err.message})`;
    }

    // 2. Always persist locally in browser
    updatePaymentConfig({
      amount: Number(newValues.amount),
      upiId: newValues.upiId,
      payeeName: newValues.payeeName,
      transactionNote: newValues.transactionNote || 'Verified Badge',
    });

    setSettings((prev) => ({
      ...prev,
      amount: Number(newValues.amount),
      upiId: newValues.upiId,
      payeeName: newValues.payeeName,
      transactionNote: newValues.transactionNote || 'Verified Badge',
    }));

    return { serverOk, serverMessage };
  };

  const resetDefaults = () => {
    resetPaymentConfig();
    setSettings({ ...DEFAULT_PAYMENT_CONFIG });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isOnline,
        loading,
        refreshSettings,
        saveSettings,
        resetDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
};
