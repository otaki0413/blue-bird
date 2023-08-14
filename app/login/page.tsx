import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonClient from "../_components/auth-button-client";

// ログイン用の非同期関数
export default async function Login() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // セッションが存在する場合、ホームページへリダイレクト
  if (session) {
    redirect("/");
  }

  return <AuthButtonClient session={session} />;
}
