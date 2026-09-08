import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext(null);

const STORAGE_KEY = 'verifyassist_active_user';

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only accept cached user if it has a valid detected profile photo data URI
        if (parsed?.username && typeof parsed?.avatarUrl === 'string' && parsed.avatarUrl.startsWith('data:image')) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (rawUsername) => {
    const cleanUsername = rawUsername.trim().replace(/^@/, '').toLowerCase();
    if (!cleanUsername) {
      setError('Please enter a username');
      return { success: false, error: 'Please enter a username' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/instagram/${encodeURIComponent(cleanUsername)}`);
      const data = await res.json();

      if (data && data.exists) {
        const userObj = {
          username: data.username,
          fullName: data.fullName || data.username,
          profilePic: data.profilePic,
          avatarUrl: data.avatarUrl || data.profilePic,
          followers: data.followers || '0',
          following: data.following || '0',
          posts: data.posts || '0',
          isPrivate: Boolean(data.isPrivate),
        };
        setCurrentUser(userObj);
        setIsLoading(false);
        return { success: true, user: userObj };
      } else {
        const errMessage = data?.error || 'Account not found on Instagram. Please enter a valid username.';
        setError(errMessage);
        setIsLoading(false);
        return { success: false, error: errMessage };
      }
    } catch (err) {
      console.warn('Instagram fetch error:', err);
      const errMessage = 'Unable to verify account right now. Please try again.';
      setError(errMessage);
      setIsLoading(false);
      return { success: false, error: errMessage };
    }
  }, []);

  // Auto-detect Instagram profile photo on mount or whenever currentUser lacks high-res photo
  useEffect(() => {
    if (!currentUser || !currentUser.avatarUrl || !currentUser.avatarUrl.startsWith('data:image')) {
      const targetUser = currentUser?.username || 'horrorgoattv';
      fetchUser(targetUser);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } catch (e) {
        console.error('Failed to cache user to localStorage', e);
      }
    }
  }, [currentUser, fetchUser]);

  const clearUser = useCallback(() => {
    setCurrentUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        fetchUser,
        clearUser,
        isLoading,
        error,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
