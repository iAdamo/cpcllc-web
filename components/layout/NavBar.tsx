import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileSideBar from "../../components/Overlays/MobileSideBar";
import { useRouter, usePathname } from "next/navigation";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import AuthModalManager from "@/screens/auth/AuthModalManager";

const NavBar = () => {
  const [isAuthodalOpen, setIsAuthodalOpen] = useState(false);

  const router = useRouter();
  const currentPath = usePathname();

  const options = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/service" },
    { name: "Hire", href: "/hire" },
  ];

  return (
    <>
      <VStack className="bg-brand-primary justify-center items-center z-10 sticky top-0 w-full">
        <HStack className="py-10 w-full items-center justify-between pr-5">
          <HStack className="gap-2">
            <Button onPress={() => router.replace("/")} className="p-0">
              <Image
                src="/assets/logo-color.png"
                alt="Logo"
                width={200}
                height={80}
              />
            </Button>

            {/** Language */}
            <Button variant="link" className="">
              <ButtonText className="text-text-primary data-[hover=true]:no-underline data-[hover=true]:text-text-primary">
                English
              </ButtonText>
            </Button>
          </HStack>

          {/** Search */}
          <Input className="hidden md:flex w-1/4 bg-white border-none rounded-xl">
            <InputField
              type="text"
              className="bg-transparent text-text-primary border-b border-text-primary"
            />
            <Button className="bg-btn-primary border-none rounded-xl">
              <ButtonText>Search</ButtonText>
            </Button>
          </Input>

          {/* Desktop Navigation */}
          <HStack className="items-center gap-6 hidden md:flex ml-8">
            {options.map((option) => (
              <Link
                key={option.name}
                href={option.href}
                className={`no-underline text-text-primary text-lg font-bold ${
                  currentPath === option.href ? "font-extrabold" : ""
                }`}
              >
                {option.name}
              </Link>
            ))}
            <Button variant="link" onPress={() => setIsAuthodalOpen(true)}>
              <ButtonText className="text-text-primary font-bold data-[hover=true]:no-underline data-[hover=true]:text-text-primary">
                Log in
              </ButtonText>
            </Button>
          </HStack>

          <Link href="/onboarding" className="px-4 py-2 font-bold bg-btn-primary border border-btn-outline rounded-3xl hover:bg-btn-secondary text-text-primary">
            Get Started
          </Link>

          <MobileSideBar />
        </HStack>
      </VStack>

      <AuthModalManager
        isModalOpen={isAuthodalOpen}
        onClose={() => setIsAuthodalOpen(false)}
      />
    </>
  );
};

export default NavBar;
