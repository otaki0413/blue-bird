import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// ルートハンドラの作成
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  /**
   * 認証CodeとユーザーSessionを交換
   * そして今後Supabaseにリクエストする際のCookieとして設定
   */
  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // サインイン後にリダイレクトするURLを指定
  return NextResponse.redirect(requestUrl.origin);
}
