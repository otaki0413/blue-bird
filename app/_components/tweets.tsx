"use client";

import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    // 古いツイートのインデックスを取得
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    // 新しいツイートに置換
    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });

  // Supabaseクライアント生成
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-tweets")
      .on(
        "postgres_changes",
        {
          event: "*", // 全てのイベントを監視
          schema: "public", // スキーマ名
          table: "tweets", // テーブル名
        },
        (payload) => {
          console.log({ payload });
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id}>
      <p>{tweet.author.name}</p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
