"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const AuthButton = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // サインアウト処理
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // ページをリフレッシュ
    router.refresh();
  };

  // サインイン処理
  const handleSignIn = async () => {
    // GitHub OAuthで認証する
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
    console.log("clicked");
  };

  return (
    <>
      <button onClick={handleSignIn}>Login</button>
      <button onClick={handleSignOut}>Logout</button>
    </>
  );
};
