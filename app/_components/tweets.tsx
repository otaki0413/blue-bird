"use client";
import { experimental_useOptimistic as useOptimistic } from "react";
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

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id}>
      <p>{tweet.author.name}</p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
