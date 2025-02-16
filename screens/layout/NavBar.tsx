import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileSideBar from "../../components/Overlays/MobileSideBar";
import { useRouter, usePathname } from "next/navigation";
import { logowhite } from "@/public/assets/icons";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";

const NavBar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const options = [
    { name: "Home", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Hire", href: "/hire" },

    { name: "Contact", href: "/contact" },
  ];

  // Memoized styles to avoid unnecessary re-renders
  const styles = useMemo(() => {
    const isContactPage = currentPath === "/contact";

    return {
      navBarClass: isContactPage ? "bg-brand-primary" : "bg-brand-primary",
      navBarLogo: isContactPage ? logowhite : "/assets/logo-color.png",
      linkClass: isContactPage
        ? "no-underline text-white text-lg font-bold hover:text-brand-1"
        : "no-underline text-text-primary text-lg font-bold hover:text-brand-primary",
    };
  }, [currentPath]);

  return (
    <VStack
      className={`items-center justify-center z-10 w-full ${styles.navBarClass}`}
    >
      <HStack className="py-10 w-full items-center justify-between px-10">
        <HStack className="">
          <Button onPress={() => router.replace("/")} className="p-0">
            <Image
              src={styles.navBarLogo}
              alt="Logo"
              width={200}
              height={80}
            />
          </Button>

          {/** Language */}
          <Button>
            <ButtonText className="text-text-primary">English</ButtonText>
          </Button>
        </HStack>

        {/** Search */}
        <Input className="hidden md:flex w-1/4 bg-white border-none rounded-3xl">
          <InputField
            type="text"
            className="bg-transparent text-text-primary border-b border-text-primary"
          />
          <Button className="bg-btn-primary border-none rounded-3xl">
            <ButtonText>Search</ButtonText>
          </Button>
        </Input>

        {/* Desktop Navigation */}
        <HStack className="items-center gap-6 hidden md:flex ml-8">
          {options.map((option) => (
            <Link
              key={option.name}
              href={option.href}
              className={`${styles.linkClass} ${
                currentPath === option.href ? "font-extrabold" : ""
              }`}
            >
              {option.name}
            </Link>
          ))}
        </HStack>

        <Link
          href="#"
          className="text-text-primary bg-btn-primary border border-btn-outline font-bold py-2 px-6 text-center rounded-3xl hover:bg-btn-secondary"
        >
          Get Started
        </Link>

        <MobileSideBar />
      </HStack>
    </VStack>
  );
};

export default NavBar;
