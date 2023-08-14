"use client";

import { useRouter } from "next/navigation";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

export default function AuthButtonClient({
  session,
}: {
  session: Session | null;
}) {
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

  return session ? (
    // Sessionがあるかどうかで認証ボタンを切り替える
    <button onClick={handleSignOut}>Logout</button>
  ) : (
    <button onClick={handleSignIn}>Login</button>
  );
}
