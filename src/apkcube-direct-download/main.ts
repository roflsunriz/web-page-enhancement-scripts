import { installGateBypass } from "./gate-bypass";
import { startPlayPageButton } from "./play-page";
import { startBlockedDownloadRecovery } from "./blocked-recovery";

if (window.location.hostname === "apkcube.com") {
  installGateBypass();
  startBlockedDownloadRecovery();
} else if (window.location.hostname === "play.google.com") {
  startPlayPageButton();
}
