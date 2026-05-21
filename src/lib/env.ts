export type AppEnvironment = "production" | "development";

const APP_NAME = "Developer Stock";

/** 本番: Vercel production のみ。それ以外（ローカル・Preview）は開発扱い */
export function getAppEnvironment(): AppEnvironment {
  if (process.env.VERCEL_ENV === "production") {
    return "production";
  }
  return "development";
}

export function isProduction(): boolean {
  return getAppEnvironment() === "production";
}

/** ブラウザタブ・画面見出し用 */
export function getAppTitle(): string {
  return isProduction() ? APP_NAME : `${APP_NAME}（開発）`;
}

/** ヘッダー上のサブタイトル */
export function getAppSubtitle(): string {
  return isProduction() ? "fav-code-stock" : "fav-code-stock · 開発環境";
}
