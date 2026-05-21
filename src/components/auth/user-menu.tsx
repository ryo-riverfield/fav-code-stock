import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

export async function UserMenu() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[200px] truncate font-mono text-xs text-muted-foreground sm:inline">
        {user.email}
      </span>
      <SignOutButton />
    </div>
  );
}
