import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AuthButton } from "./_components/auth-button";

// サーバーコンポーネントのため、非同期関数として定義可能
export default async function Home() {
  // Create a new Supabase client
  const supabase = createServerComponentClient({ cookies });
  // Fetch tweets from the database
  const { data: tweets } = await supabase.from("tweets").select();

  // Render the tweets
  return (
    <>
      <AuthButton />
      <pre>{JSON.stringify(tweets, null, 2)}</pre>;
    </>
  );
}
