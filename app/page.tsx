import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./_components/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./_components/new-tweet";
import Tweets from "./_components/tweets";

export const dynamic = "force-dynamic";

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

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });

  // 各ツイートに対して変換を行い、下記のプロパティを追加した新しい配列を返す
  // user_has_liked_tweet: いいねをしているかどうか
  // likes: いいねの数
  // 取得データがnullまたはundefinedの場合、空配列を返す
  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find(
        (like) => like.user_id === session.user.id,
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex justify-between border border-t-0 border-gray-800 px-4 py-6">
        <h1 className="text-xl font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      <NewTweet user={session.user} />
      <Tweets tweets={tweets} />
    </div>
  );
}
