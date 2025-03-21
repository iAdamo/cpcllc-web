import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores";

export function AuthHandler() {
  const { session, userData, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (isLoading) return; // Wait until auth is initialized

    setCheckingAuth(false); // Mark authentication check as complete

    // Define pages that are accessible to everyone
    const publicPages = ["/", "/about", "/contact", "/onboarding"];
    const isProtectedPage = !publicPages.includes(pathname);

    // If NOT logged in & trying to access a protected page, redirect to "/"
    if (!session && isProtectedPage) {
      router.replace("/");
      return;
    }

    // If logged in & on "/", redirect to role-based pages
    if (session && pathname === "/") {
      switch (userData?.activeRole) {
        case "Company":
          router.replace("/dashboard");
          break;
        case "Client":
          router.replace("/service");
          break;
        case "admin":
          router.replace("/admin");
          break;
      }
    }

    // If logged in & in the wrong section, redirect to the correct one
    if (session) {
      const correctPage = {
        Company: "/dashboard",
        Client: "/service",
        admin: "/admin",
      }[userData?.activeRole ?? ""];

      if (pathname !== correctPage) {
        if (correctPage) {
          router.replace(correctPage);
        }
      }
    }
  }, [session, userData?.activeRole, pathname, router, isLoading]);

  // Show a loading screen while checking authentication
  if (checkingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return null;
}