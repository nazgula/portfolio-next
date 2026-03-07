import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// jsdom doesn't provide TextEncoder/TextDecoder
if (typeof globalThis.TextDecoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.TextDecoder = TextDecoder as any;
}
if (typeof globalThis.TextEncoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.TextEncoder = TextEncoder as any;
}
