import type { useRouter } from "next/navigation";
import { createInvitationDraft } from "./invitations";

/** Only allow in-site redirects after login. */
export function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

/** After login / registration: start the chosen template, or go where the user was heading. */
export async function continueAfterAuth(
  router: ReturnType<typeof useRouter>,
  template: string | null,
  next: string | null,
): Promise<void> {
  if (template) {
    try {
      const id = await createInvitationDraft(template);
      router.replace(`/dashboard/invitations/${id}/edit`);
      return;
    } catch {
      /* fall through to the dashboard */
    }
  }
  router.replace(safeNext(next));
}
