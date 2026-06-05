import { Metadata } from "next";
import FavoritesPage from "@/screens/favorites";

export const metadata: Metadata = {
  title: "Your Favorites — CompaniesCenterLLC",
  description: "Saved providers and tasks you love",
};

export default function Page() {
  return <FavoritesPage />;
}
