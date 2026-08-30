import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicInvoice } from "@/axios/public";

// Next.js 15 — params is a Promise.
type Params = Promise<{ token: string }>;

const NAVY = "#162660";

const money = (cents = 0, currency = "USD") => {
  const symbol = currency === "NGN" ? "₦" : "$";
  return `${symbol}${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const fmtDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const STATUS_LABEL: Record<string, string> = {
  unpaid: "Awaiting payment",
  paid: "Paid",
  overdue: "Overdue",
  pending: "Awaiting response",
  accepted: "Accepted",
  declined: "Declined",
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { token } = await params;
  const doc = await getPublicInvoice(token);
  if (!doc) return { title: "Invoice not found" };
  const label = doc.kind === "invoice" ? "Invoice" : "Estimate";
  return {
    title: `${label} ${doc.number} — ${doc.business?.name ?? "CompaniesCenter"}`,
    description: `${label} ${doc.number} for ${money(doc.totalCents, doc.currency)}.`,
    robots: { index: false }, // shared link, not for search
  };
}

export default async function PublicInvoicePage({
  params,
}: {
  params: Params;
}) {
  const { token } = await params;
  const doc = await getPublicInvoice(token);
  if (!doc) notFound();

  const isInvoice = doc.kind === "invoice";
  const label = isInvoice ? "Invoice" : "Estimate";
  const isPaid = doc.status === "paid";
  const balanceCents = doc.totalCents - (isPaid ? doc.totalCents : 0);
  const bandLabel = isInvoice ? "Balance due" : "Total";
  const bandCents = isInvoice ? balanceCents : doc.totalCents;
  const dueText = isInvoice
    ? fmtDate(doc.dueDate) || "On receipt"
    : fmtDate(doc.expiryDate) || "—";
  const servicePeriod =
    doc.serviceStart || doc.serviceEnd
      ? `${fmtDate(doc.serviceStart)}${doc.serviceEnd ? ` – ${fmtDate(doc.serviceEnd)}` : ""}`
      : "";
  const b = doc.business ?? {};
  const bank = b.bankDetails ?? {};
  const bankLines = [
    bank.bankName,
    bank.accountName,
    bank.accountNumber && `Account ${bank.accountNumber}`,
    bank.routingNumber && `Routing ${bank.routingNumber}`,
    bank.swift && `SWIFT ${bank.swift}`,
  ].filter(Boolean);
  const payLines = bankLines.length
    ? bankLines
    : [b.email && `Remittance to ${b.email}`, b.phone, b.address].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#e6e3db] py-8 px-4 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl">
        {/* Action bar (hidden in print) */}
        <div className="mb-4 flex items-center justify-between print:hidden">
          <span className="text-sm text-neutral-500">
            {b.name} · {label} {doc.number}
          </span>
          {doc.pdfUrl ? (
            <a
              href={doc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: NAVY }}
            >
              Download PDF
            </a>
          ) : null}
        </div>

        <article className="overflow-hidden rounded-2xl bg-[#fdfbf6] shadow-xl print:shadow-none print:rounded-none">
          {/* Masthead */}
          <header
            className="flex items-start justify-between gap-6 px-8 py-7 text-white"
            style={{ backgroundColor: NAVY }}
          >
            <div className="flex flex-col gap-4">
              {b.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.logo}
                  alt={`${b.name} logo`}
                  className="h-14 max-w-[180px] object-contain object-left"
                />
              ) : null}
              <div>
                <div className="text-3xl font-extrabold tracking-tight">
                  {label} {doc.number}
                </div>
                <div className="mt-1 text-sm text-white/70">
                  {[b.name, b.address, b.phone, b.email].filter(Boolean).join(" · ")}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 text-right">
              <span className="rounded-md bg-amber-400 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-900">
                {STATUS_LABEL[doc.status] ?? doc.status}
              </span>
              <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 font-mono text-[11px]">
                <dt className="text-white/60 uppercase tracking-wider">Issued</dt>
                <dd>{fmtDate(doc.issueDate)}</dd>
                <dt className="text-white/60 uppercase tracking-wider">
                  {isInvoice ? "Due" : "Valid"}
                </dt>
                <dd>{dueText}</dd>
                <dt className="text-white/60 uppercase tracking-wider">Ref</dt>
                <dd>{doc.number}</dd>
              </dl>
            </div>
          </header>

          {/* Tiles */}
          <section className="grid grid-cols-3 gap-3 px-8 pt-6">
            <div className="rounded-xl bg-[#e9edf6] p-4">
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#162660]">
                {bandLabel}
              </div>
              <div className="mt-1 text-xl font-extrabold text-neutral-900">
                {money(bandCents, doc.currency)}
              </div>
              <div className="mt-1 font-mono text-[10px] text-neutral-500">
                {doc.currency} · {doc.number}
              </div>
            </div>
            <div className="rounded-xl bg-amber-400 p-4">
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-800/70">
                {isInvoice ? "Pay by" : "Valid until"}
              </div>
              <div className="mt-1 text-xl font-extrabold text-neutral-900">
                {dueText}
              </div>
            </div>
            <div className="rounded-xl border-2 border-[#162660] p-4">
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#162660]">
                Reference
              </div>
              <div className="mt-1 font-mono text-xl font-extrabold text-neutral-900">
                {doc.number}
              </div>
            </div>
          </section>

          {/* Parties */}
          <section className="flex flex-wrap gap-10 px-8 pt-7">
            <div className="min-w-[180px]">
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                Billed to
              </div>
              <div className="mt-1 text-[15px] font-bold text-neutral-900">
                {doc.customer?.name || "—"}
              </div>
              {[doc.customer?.address, doc.customer?.email, doc.customer?.phone]
                .filter(Boolean)
                .map((l: string, i: number) => (
                  <div key={i} className="text-[13px] text-neutral-500">
                    {l}
                  </div>
                ))}
            </div>
            <div className="min-w-[180px]">
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                From
              </div>
              <div className="mt-1 text-[15px] font-bold text-neutral-900">
                {b.name}
              </div>
              {[b.address, b.email, b.phone]
                .filter(Boolean)
                .map((l: string, i: number) => (
                  <div key={i} className="text-[13px] text-neutral-500">
                    {l}
                  </div>
                ))}
            </div>
            {servicePeriod || doc.approvedBy ? (
              <div className="min-w-[160px]">
                <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                  Service period
                </div>
                {servicePeriod ? (
                  <div className="mt-1 text-[13px] text-neutral-600">
                    {servicePeriod}
                  </div>
                ) : null}
                {doc.approvedBy ? (
                  <div className="text-[13px] text-neutral-600">
                    Approved by {doc.approvedBy}
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Items */}
          <section className="mt-6">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: NAVY }} className="text-white">
                  <th className="px-8 py-3 text-left font-mono text-[9px] font-bold uppercase tracking-widest">
                    Item
                  </th>
                  <th className="px-2 py-3 text-right font-mono text-[9px] font-bold uppercase tracking-widest">
                    Qty
                  </th>
                  <th className="px-2 py-3 text-right font-mono text-[9px] font-bold uppercase tracking-widest">
                    Rate
                  </th>
                  <th className="px-8 py-3 text-right font-mono text-[9px] font-bold uppercase tracking-widest">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {(doc.lineItems ?? []).map((l: any, i: number) => {
                  const [first, ...rest] = String(l.description).split("\n");
                  const body = rest.join("\n").trim();
                  return (
                    <tr
                      key={i}
                      className={i % 2 ? "bg-[#f4f2ec]" : ""}
                    >
                      <td className="px-8 py-3 align-top">
                        <div className="text-[12.5px] font-bold text-neutral-900">
                          {first}
                        </div>
                        {body ? (
                          <div className="mt-0.5 whitespace-pre-line text-[11px] text-neutral-500">
                            {body}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-2 py-3 text-right align-top font-mono text-[11.5px] text-neutral-600">
                        {l.quantity}
                      </td>
                      <td className="px-2 py-3 text-right align-top font-mono text-[11.5px] text-neutral-600">
                        {money(l.unitPriceCents, doc.currency)}
                      </td>
                      <td className="px-8 py-3 text-right align-top font-mono text-[12px] font-bold text-neutral-900">
                        {money(
                          Math.round(l.quantity * l.unitPriceCents),
                          doc.currency,
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* Totals */}
          <section className="flex justify-end px-8 pt-4">
            <div className="w-72">
              <Row label="Subtotal" value={money(doc.subtotalCents, doc.currency)} />
              {doc.discountAppliedCents > 0 ? (
                <Row
                  label="Discount"
                  value={`- ${money(doc.discountAppliedCents, doc.currency)}`}
                />
              ) : null}
              {isInvoice || doc.taxCents > 0 ? (
                <Row label="Tax" value={money(doc.taxCents, doc.currency)} />
              ) : null}
              {isInvoice && isPaid ? (
                <Row label="Paid" value={`- ${money(doc.totalCents, doc.currency)}`} />
              ) : null}
              <div
                className="mt-1 flex items-center justify-between rounded-xl px-4 py-3 text-white"
                style={{ backgroundColor: NAVY }}
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  {bandLabel}
                </span>
                <span className="font-mono text-lg font-extrabold">
                  {money(bandCents, doc.currency)}
                </span>
              </div>
            </div>
          </section>

          {/* Footer */}
          {payLines.length || b.invoiceTerms || doc.notes ? (
            <section className="mx-8 mt-6 flex flex-wrap gap-8 border-t border-neutral-200 pt-4">
              {payLines.length ? (
                <FootCol title="Payment" lines={payLines as string[]} />
              ) : null}
              {b.invoiceTerms ? (
                <FootCol title="Terms" lines={[b.invoiceTerms]} />
              ) : null}
              {doc.notes ? <FootCol title="Notes" lines={[doc.notes]} /> : null}
            </section>
          ) : null}
          <footer
            className="mt-5 flex items-center justify-between px-8 py-3 font-mono text-[9px] font-semibold uppercase tracking-widest text-white/70"
            style={{ backgroundColor: NAVY }}
          >
            <span>
              {b.name}
              {b.taxId ? ` · EIN ${b.taxId}` : ""}
            </span>
            <span>Thank you for your business</span>
          </footer>
        </article>

        <p className="mt-4 text-center text-xs text-neutral-500 print:hidden">
          Powered by CompaniesCenter
        </p>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 text-[12.5px]">
      <span className="text-neutral-500">{label}</span>
      <span className="font-mono text-neutral-900">{value}</span>
    </div>
  );
}

function FootCol({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="flex-1 min-w-[160px]">
      <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#162660]">
        {title}
      </div>
      <div className="mt-1 whitespace-pre-line font-mono text-[11px] leading-relaxed text-neutral-700">
        {lines.join("\n")}
      </div>
    </div>
  );
}
