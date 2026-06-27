import type { Metadata } from "next";
import { MediaItem } from "@/types";
import { getProviderBySlug } from "@/axios/public";
import ProfilePage from "@/screens/profile";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://companiescenter.com";

// Next.js 15 — `params` is a Promise. Await before accessing properties.
type Params = Promise<{ slug: string }>;

// export async function generateMetadata({
//   params,
// }: {
//   params: Params;
// }): Promise<Metadata> {
//   const { slug } = await params;
//   const provider = await getProviderBySlug(slug);
//   if (!provider) return { title: "Provider not found" };

//   const title = provider?.providerName;
//   const description =
//     `${provider?.providerDescription?.slice(0, 180)}${
//       (provider?.providerDescription?.length ?? 0) > 180 ? "..." : ""
//     }` || "";
//   const logoUrl =
//     (provider.providerLogo as MediaItem)?.thumbnail ||
//     (provider.providerLogo as MediaItem)?.url;
//   const images = [
//     ...(logoUrl ? [logoUrl] : []),
//     ...((provider.providerImages ?? [])
//       .map((m: any) => m?.thumbnail || m?.url)
//       .filter(Boolean) as string[]),
//   ];

//   const canonical = `${APP_URL}/c/${slug}`;
//   return {
//     title,
//     description,
//     alternates: { canonical },
//     openGraph: {
//       type: "profile",
//       url: canonical,
//       title,
//       description,
//       images,
//       siteName: "CompaniesCenter",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images,
//     },
//     other: {
//       // Show Apple's smart banner at the top of mobile Safari.
//       // TODO(ops): replace 0000000000 with the App Store numeric ID once
//       // the app is published.
//       "apple-itunes-app": `app-id=0000000000, app-argument=${canonical}`,
//     },
//   };
// }

export default ProfilePage;
