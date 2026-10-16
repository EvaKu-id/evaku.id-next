import { setupWorker } from "msw/browser";
import { bundleHandlers } from "./bundle-handlers";
import { handlers } from "./handlers";
import { initSkenario } from "./scenario";

export const worker = setupWorker(...bundleHandlers, ...handlers);
initSkenario();
