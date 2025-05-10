import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileSideBar from "../../components/Overlays/MobileSideBar";
import { useRouter, usePathname } from "next/navigation";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import AuthModalManager from "@/screens/auth/AuthModalManager";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/icon";
import ProfileMenu from "@/components/ProfileMenu";
import { useSession } from "@/context/AuthContext";

const NavBar = () => {
  const [isAuthodalOpen, setIsAuthodalOpen] = useState(false);

  const { userData } = useSession();
  const router = useRouter();
  const currentPath = usePathname();

  const options = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/service" },
    { name: "Hire", href: "/hire" },
  ];

  const options2 = [
    { name: "My Requests", href: "/requests" },
    { name: "Inbox", href: "/inbox" },
    { name: "Favorites", href: "/favorites" },
    ...(userData?.activeRole !== "Company"
      ? [{ name: "Be a Company", href: "/onboarding" }]
      : []),
  ];

  const styles = useMemo(() => {
    const isHome = currentPath === "/";

    return {
      navBarClass: !isHome && "bg-white",
      navBarLogo: !isHome ? "/assets/logo-white.svg" : "/assets/logo-color.svg",
      linkClass: !isHome
        ? "no-underline text-white text-lg font-bold hover:text-brand-1"
        : "no-underline text-text-primary text-lg font-bold hover:text-brand-0",
      buttonClass: !isHome ? "bg-white" : "bg-brand-0",
    };
  }, [currentPath]);

  return (
    <>
      <VStack
        className={`bg-transparent h-20 justify-center items-center ${
          currentPath !== "/" && "fixed top-0"
        } z-10 w-full ${styles.navBarClass}`}
      >
        <HStack className="py-10 w-full items-center pr-5">
          <HStack className="gap-10">
            <Button
              variant="link"
              onPress={() => router.replace("/")}
              className="p-0"
            >
              <Image
                src={styles.navBarLogo}
                alt="Logo"
                width={200}
                height={80}
                priority
              />
            </Button>

            {/** Language */}
            <Button variant="link" className="">
              <ButtonText className="text-white text-lg data-[hover=true]:no-underline data-[hover=true]:text-text-primary">
                English
              </ButtonText>
            </Button>
          </HStack>

          {/** Search */}
          {currentPath !== "/" && (
            <Input className="hidden md:flex w-1/3 bg-white">
              <InputField
                type="text"
                placeholder="Search..."
                className="bg-transparent text-text-primary"
              />

              <InputSlot className="pr-3">
                <InputIcon as={SearchIcon} />
              </InputSlot>
            </Input>
          )}
          <HStack className="gap-32 ml-auto">
            {currentPath === "/" ? (
              <>
                <HStack className="items-center gap-8 hidden md:flex">
                  {options.map((option) => (
                    <Link
                      key={option.name}
                      href={option.href}
                      className={` text-white text-lg font-bold ${
                        currentPath === option.href ? "font-extrabold" : ""
                      }`}
                    >
                      {option.name}
                    </Link>
                  ))}
                </HStack>
                <HStack space="lg" className="ml-auto">
                  <Button
                    onPress={() => setIsAuthodalOpen(true)}
                    className="bg-[#FFFFFF20] data-[hover=true]:bg-[#FFFFFF40]"
                  >
                    <ButtonText className="">Log in</ButtonText>
                  </Button>

                  <Button
                    onPress={() => router.push("/onboarding")}
                    className="bg-btn-primary data-[hover=true]:bg-blue-500"
                  >
                    <ButtonText className="text-white ">Get Started</ButtonText>
                  </Button>
                </HStack>

                <MobileSideBar />
              </>
            ) : (
              <HStack className="items-center gap-6 hidden md:flex ml-8">
                {options2.map((option) => (
                  <Link
                    key={option.name}
                    href={option.href}
                    className={`no-underline text-md font-semibold ${
                      currentPath === option.href ? "font-extrabold" : ""
                    }`}
                  >
                    {option.name}
                  </Link>
                ))}
                {}
                <ProfileMenu
                  options={[
                    {
                      name: "Profile",
                      onPress: () => router.replace(`/cpc/${userData?.id}`),
                    },
                    {
                      name: "Membership",
                      onPress: () => router.replace("/profile"),
                    },
                    {
                      name: "Settings",
                      onPress: () => router.replace("/settings"),
                    },
                  ]}
                  offset={20}
                />
              </HStack>
            )}
          </HStack>
        </HStack>
        <AuthModalManager
          isModalOpen={isAuthodalOpen}
          onClose={() => setIsAuthodalOpen(false)}
        />
      </VStack>
    </>
  );
};

export default NavBar;
