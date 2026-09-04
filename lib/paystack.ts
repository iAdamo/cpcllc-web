/**
 * Paystack Inline (v2) loader + a thin promise wrapper.
 *
 * We never redirect to Paystack's hosted checkout page. The backend initializes
 * the transaction (converting the USD plan price to NGN server-side) and returns
 * an `accessCode`; here we resume that transaction in Paystack's in-page popup.
 * Card data is entered inside Paystack's secure iframe — it never touches us.
 */

const INLINE_SRC = "https://js.paystack.co/v2/inline.js";

let loader: Promise<void> | null = null;

function loadInline(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack can only load in the browser"));
  }
  if ((window as any).PaystackPop) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${INLINE_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Paystack")),
      );
      if ((window as any).PaystackPop) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = INLINE_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loader = null; // let a later attempt retry
      reject(new Error("Failed to load Paystack"));
    };
    document.body.appendChild(script);
  });
  return loader;
}

export type PaystackResult =
  | { status: "success"; reference?: string }
  | { status: "cancelled" };

/**
 * Open the Paystack Inline popup to complete a server-initialized transaction.
 * Resolves when the popup closes — never rejects on user cancel/error (the
 * server webhook remains the source of truth for granting the subscription).
 */
export async function payWithPaystack(
  accessCode: string,
): Promise<PaystackResult> {
  await loadInline();
  const PaystackPop = (window as any).PaystackPop;
  if (!PaystackPop) throw new Error("Paystack did not initialize");

  return new Promise<PaystackResult>((resolve) => {
    try {
      const popup = new PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: (tx: { reference?: string }) =>
          resolve({ status: "success", reference: tx?.reference }),
        onCancel: () => resolve({ status: "cancelled" }),
        onError: () => resolve({ status: "cancelled" }),
      });
    } catch {
      resolve({ status: "cancelled" });
    }
  });
}
