import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { initSkenario } from "./scenario";

export const worker = setupWorker(...handlers);
initSkenario();