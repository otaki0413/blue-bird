import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

// 新規投稿用のフォームコンポーネント
export default function NewTweet({ user }: { user: User }) {
  // フォームの送信時に実行される関数
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    // サーバーアクション用のsupabaseクライアント生成
    const supabase = createServerActionClient<Database>({ cookies });

    // ユーザー情報が存在する場合、ツイートを追加
    await supabase.from("tweets").insert({ title, user_id: user.id });
  };

  return (
    <form action={addTweet} className="border border-t-0 border-gray-800">
      <div className="flex px-4 py-8">
        <div className="h-12 w-12">
          <Image
            src={user.user_metadata.avatar_url}
            alt="user avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input
          name="title"
          className="ml-2 flex-1 bg-inherit px-2 text-2xl leading-loose placeholder-gray-500"
          placeholder="What is happening?"
        />
      </div>
    </form>
  );
}
