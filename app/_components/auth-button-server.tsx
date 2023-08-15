import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonClient from "./auth-button-client";

// 非同期サーバーコンポーネント
export default async function AuthButtonServer() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // ユーザーセッションをSupabaseからフェッチする
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // クライアントコンポーネントにセッションを渡す
  return <AuthButtonClient session={session} />;
}
