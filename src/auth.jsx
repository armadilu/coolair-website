import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { DEMO_USERS } from "./data";

// Real auth via Supabase (blueprint §7): one login, three roles.
// The demo accounts (customer/admin/tech @demo.com) still work locally so the
// staff dashboards can be shown before real staff users exist in the database.

const AuthContext = createContext(null);

async function profileFor(sbUser) {
  let role = "customer";
  let name = sbUser.user_metadata?.name || sbUser.email.split("@")[0];
  const { data } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", sbUser.id)
    .maybeSingle();
  if (data) {
    role = data.role || role;
    name = data.name || name;
  }
  return { id: sbUser.id, email: sbUser.email, name, role, supabase: true };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("coolair_demo_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) profileFor(session.user).then(setUser);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) profileFor(session.user).then(setUser);
      else if (!localStorage.getItem("coolair_demo_user")) setUser(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    // Demo accounts first (local-only, for showing staff dashboards)
    const demo = DEMO_USERS.find(
      (u) => u.email === email.toLowerCase().trim() && u.password === password
    );
    if (demo) {
      const session = { name: demo.name, email: demo.email, role: demo.role };
      localStorage.setItem("coolair_demo_user", JSON.stringify(session));
      setUser(session);
      return { user: session };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { error: error.message };
    const profile = await profileFor(data.user);
    setUser(profile);
    return { user: profile };
  };

  const signup = async (name, email, password) => {
    if (!name || !email || password.length < 6)
      return { error: "Fill all fields — password needs 6+ characters." };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    if (!data.session)
      return {
        error:
          "Account created — check your email for a confirmation link, then log in. (Or disable 'Confirm email' in Supabase → Authentication → Providers for instant login.)",
      };
    const profile = await profileFor(data.user);
    setUser(profile);
    return { user: profile };
  };

  const logout = async () => {
    localStorage.removeItem("coolair_demo_user");
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
