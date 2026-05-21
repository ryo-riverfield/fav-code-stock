import { LoginForm } from "@/components/auth/login-form";
import { getAppSubtitle, isProduction } from "@/lib/env";

const AUTH_ERRORS: Record<string, string> = {
  auth_callback: "認証に失敗しました。もう一度お試しください。",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authError = params.error
    ? (AUTH_ERRORS[params.error] ?? "エラーが発生しました")
    : undefined;

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <LoginForm
        authError={authError}
        appSubtitle={getAppSubtitle()}
        showDevBadge={!isProduction()}
      />
    </div>
  );
}
