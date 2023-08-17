"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function GithubButton() {
  // サインイン処理
  const handleSignIn = async () => {
    const supabase = createClientComponentClient<Database>();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex flex-col items-center justify-center gap-4 rounded-xl p-8 hover:bg-gray-800"
    >
      <Image
        src="/images/github-mark-white.png"
        alt="Github Logo"
        width={100}
        height={100}
      />
      <span className="font-bold">ログイン</span>
    </button>
  );
}
