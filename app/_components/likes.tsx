"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { IconHeart } from "@tabler/icons-react";

export default function Likes({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (newTweet: TweetWithAuthor) => void;
}) {
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
        // 楽観的更新(いいね削除)
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        // DB更新(いいね削除)
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        // 楽観的更新(いいね追加)
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          user_has_liked_tweet: !tweet.user_has_liked_tweet,
        });
        // DB更新(いいね追加)
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
      }
      // ページを更新
      router.refresh();
    }
  };
  return (
    <button onClick={handleLikes} className="group flex items-center">
      <IconHeart
        width={16}
        height={16}
        className={`group-hover:fill-red-600 group-hover:stroke-red-600 ${
          tweet.user_has_liked_tweet
            ? "fill-red-600 stroke-red-600"
            : "fill-none stroke-gray-600"
        }`}
      />
      <span
        className={`ml-2 text-sm group-hover:text-red-600 ${
          tweet.user_has_liked_tweet ? "text-red-600" : "text-gray-600"
        }`}
      >
        {tweet.likes}
      </span>
    </button>
  );
}
