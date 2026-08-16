import type { RendererSettings } from "@/shared/types";

export type CommentLoadingMode = "auto" | "manual";

export const resolveCommentLoadingMode = (
  settings: Pick<RendererSettings, "autoSearchEnabled">,
): CommentLoadingMode => (settings.autoSearchEnabled ? "auto" : "manual");
