import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { InternalAxiosRequestConfig } from "axios";
import { ApiClientSingleton } from "./conf";
import { getProviderReviews } from "./reviews";

/**
 * REGRESSION (2026-10-20): a business profile's reviews never loaded on the
 * website. It asked GET reviews/:id (one review, by the review's own id) with
 * the owner's account id; reviews are stored against the business's id and
 * listed by GET reviews/provider/:providerId. Its "Write a review" form posted
 * to a route the API no longer has (reviews come from the app, after a job).
 */
const http = ApiClientSingleton.getInstance().axiosInstance;
const original = http.defaults.adapter;
afterEach(() => {
  http.defaults.adapter = original;
});

describe("a business's reviews", () => {
  it("asks the provider list by the business's id and returns its rows", async () => {
    const seen: string[] = [];
    http.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      seen.push(`${config.method} ${config.url} ${JSON.stringify(config.params)}`);
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: { data: [{ _id: "r1", rating: 5, description: "Great" }], stats: {}, page: 1, limit: 20 },
      };
    };
    const rows = await getProviderReviews("biz1");
    expect(seen).toEqual(['get reviews/provider/biz1 {"page":1,"limit":20}']);
    expect(rows).toEqual([{ _id: "r1", rating: 5, description: "Great" }]);
  });

  it("the profile passes the business's id, and the website has no review form", () => {
    const profile = readFileSync(join(__dirname, "..", "screens", "profile", "index.tsx"), "utf8");
    expect(profile).toContain("<ReviewSection providerId={provider._id} />");
    const section = readFileSync(join(__dirname, "..", "screens", "profile", "ReviewSection.tsx"), "utf8");
    expect(section).not.toMatch(/Write a review|createReview/);
  });
});
