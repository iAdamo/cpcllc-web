import { describe, expect, it } from "vitest";
import { userMessageOf } from "./errorService";

/**
 * REGRESSION: the Broadcast Center read `response.data.message`, but the API
 * nests its message under `error`, so a refused submit showed "Request failed
 * with status code 400" instead of the reason ("A popup needs an image").
 */
describe("userMessageOf", () => {
  const apiError = (message: string, status = 400) =>
    Object.assign(new Error(`Request failed with status code ${status}`), {
      response: { status, data: { success: false, error: { code: "VALIDATION_FAILED", message } } },
    });

  it("the API's own words, whether or not the interceptor ran", () => {
    expect(userMessageOf(apiError("A popup needs an image"), "Save failed")).toBe("A popup needs an image");
    const intercepted = Object.assign(apiError("ignored"), {
      appError: { userMessage: "Images can be up to 5 MB" },
    });
    expect(userMessageOf(intercepted, "Save failed")).toBe("Images can be up to 5 MB");
  });

  it("friendly copy per status when the API chose none", () => {
    const e = Object.assign(new Error("x"), { response: { status: 403, data: {} } });
    expect(userMessageOf(e, "Save failed")).toBe("You do not have permission to perform this action.");
  });

  it("the fallback for anything that isn't an API response", () => {
    expect(userMessageOf(new Error("boom"), "Save failed")).toBe("Save failed");
    expect(userMessageOf(undefined, "Save failed")).toBe("Save failed");
  });
});
