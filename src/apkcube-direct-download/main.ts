import { installGateBypass } from "./gate-bypass";
import { startPlayPageButton } from "./play-page";

if (window.location.hostname === "apkcube.com") {
  installGateBypass();
} else if (window.location.hostname === "play.google.com") {
  startPlayPageButton();
}
