import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import GithubButton from "../_components/github-button";

// ログイン用の非同期関数
export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // セッションが存在する場合、ホームページへリダイレクト
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <GithubButton />
    </div>
  );
}
