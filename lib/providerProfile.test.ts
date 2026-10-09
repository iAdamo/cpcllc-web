import { describe, expect, it } from "vitest";
import { ownerIdOf, providerProfileOf } from "@/lib/providerProfile";

/** Every shape `activeRoleId` arrives in on the website. */
describe("providerProfileOf", () => {
  it("is null for a client: no field, null, or the sign-in stub", () => {
    expect(providerProfileOf({})).toBeNull();
    expect(providerProfileOf({ activeRoleId: null })).toBeNull();
    expect(providerProfileOf({ activeRoleId: { permissions: [] } })).toBeNull();
    expect(providerProfileOf({ activeRoleId: "6700000000000000000000aa" })).toBeNull();
    expect(providerProfileOf(null)).toBeNull();
  });

  it("is the business for a provider", () => {
    const business = { _id: "p1", providerName: "Fixit Co", permissions: [] };
    expect(providerProfileOf({ activeRoleId: business })).toBe(business);
  });
});

describe("ownerIdOf", () => {
  it("the id from either shape of owner", () => {
    expect(ownerIdOf({ owner: "u1" })).toBe("u1");
    expect(ownerIdOf({ owner: { _id: "u1", firstName: "Bob" } })).toBe("u1");
    expect(ownerIdOf({ owner: null })).toBeNull();
    expect(ownerIdOf({ owner: {} })).toBeNull();
    expect(ownerIdOf(null)).toBeNull();
  });
});
