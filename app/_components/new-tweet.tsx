import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// 新規投稿用のフォームコンポーネント
export default function NewTweet() {
  // フォームの送信時に実行される関数
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    // サーバーアクション用のsupabaseクライアント生成
    const supabase = createServerActionClient<Database>({ cookies });

    // ユーザー情報を取得
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ユーザー情報が存在する場合、ツイートを追加
    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user.id });
    }
    console.log("submitted");
  };

  return (
    <form action={addTweet}>
      <input name="title" className="bg-inherit" />
    </form>
  );
}
