import { installPageImageRequestCache } from "../shared/page-image-candidates";
import { bootstrapImageCollectorUserscript } from "./runtime/bootstrap";

installPageImageRequestCache();
void bootstrapImageCollectorUserscript();
