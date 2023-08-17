"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Likes({ tweet }: { tweet: TweetWithAuthor }) {
  const router = useRouter();
  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ユーザーが存在する場合、いいねを追加
    if (user) {
      // すでにいいねがされているかどうかで処理を分岐
      if (tweet.user_has_liked_tweet) {
        // いいねを削除
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        // いいねを追加
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
      // ページを更新
      router.refresh();
    }
  };
  return <button onClick={handleLikes}>{tweet.likes} Likes</button>;
}
