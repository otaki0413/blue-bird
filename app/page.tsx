import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./_components/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./_components/new-tweet";

// サーバーコンポーネントのため、非同期関数として定義可能
export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // セッションが存在しない場合、ログインページへリダイレクト
  if (!session) {
    redirect("/login");
  }

  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, profiles(*)");

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
