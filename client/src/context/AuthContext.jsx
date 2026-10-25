import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // The session now lives in an httpOnly cookie on the server, so we have to
  // ask the API who's signed in instead of reading it synchronously.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    auth
      .getCurrentUser()
      .then((u) => alive && setUser(u))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const signup = useCallback(async (data) => {
    const u = await auth.signup(data);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (data) => {
    const u = await auth.login(data);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await auth.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data) => {
      const u = await auth.updateProfile(user.id, data);
      setUser(u);
      return u;
    },
    [user]
  );

  const changePassword = useCallback(
    (current, next) => auth.changePassword(user.id, current, next),
    [user]
  );

  const toggleFavorite = useCallback(
    async (snapshot) => {
      const u = await auth.toggleFavorite(user.id, snapshot);
      setUser(u);
      return u.favorites.some((f) => f.id === snapshot.id);
    },
    [user]
  );

  const isFavorite = useCallback(
    (id) => Boolean(user?.favorites?.some((f) => f.id === String(id))),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      logout,
      updateProfile,
      changePassword,
      toggleFavorite,
      isFavorite,
      favorites: user?.favorites || [],
    }),
    [user, loading, signup, login, logout, updateProfile, changePassword, toggleFavorite, isFavorite]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
