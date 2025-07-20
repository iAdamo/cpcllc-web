import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import AuthModalManager from "@/screens/auth/AuthModalManager";
import ProfileMenu from "@/components/ProfileMenu";
import { useSession } from "@/context/AuthContext";
import { SearchEngine, MSearchEngine } from "@/components/SearchEngine";
import { MenuIcon, CloseIcon } from "@/components/ui/icon";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerBody,
} from "@/components/ui/drawer";
import { Divider } from "@/components/ui/divider";
import VerifyCodeModal from "@/screens/auth/VerifyCodeModal";

const NavBar = () => {
  const [isAuthodalOpen, setIsAuthodalOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const { session, userData, logout, setUserData } = useSession();
  const router = useRouter();
  const currentPath = usePathname();

  const options = [
    { name: "Home", href: "/" },
    { name: "Companies", href: "/companies" },
  ];

  const options2 = [
    ...(session ? [{ name: "My Requests", href: "/requests" }] : []),
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
      buttonClass: !isHome ? "bg-white" : "bg-brand-primary",
    };
  }, [currentPath]);

  return (
    <>
      {/** Verify Code Modal */}
      <VerifyCodeModal
        isOpen={userData! && !userData?.verified}
        onClose={() => userData?.verified}
        email={userData?.email || ""}
        onVerified={() => {
          router.replace("/cpc/" + userData?.id);
        }}
        isVerified={!userData?.verified}
      />

      {/** Desktop */}
      <VStack
        className={`hidden md:flex justify-center items-center ${
          currentPath !== "/" ? "fixed top-0 h-28" : "h-20"
        } z-50 w-full ${styles.navBarClass}`}
      >
        <HStack className="py-10 w-full items-center gap-10 pr-5">
          <HStack className="items-center">
            <Pressable onPress={() => router.replace("/")}>
              <Image
                src={styles.navBarLogo}
                alt="Logo"
                width={200}
                height={80}
                priority
              />
            </Pressable>

            {/** Language */}
            <Button variant="link" size="xs" className="">
              <ButtonText
                className={`${
                  currentPath === "/" && "text-white"
                } text-lg data-[hover=true]:no-underline data-[hover=true]:text-text-primary`}
              >
                English
              </ButtonText>
            </Button>
          </HStack>

          {/** Search */}
          {currentPath !== "/" && (
            <div className="w-[35rem]">
              <SearchEngine />
            </div>
          )}
          <HStack className="gap-32 ml-auto">
            {currentPath === "/" ? (
              <>
                <HStack className="items-center gap-14 hidden md:flex">
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
                    className="bg-btn-primary data-[hover=true]:bg-brand-primary"
                  >
                    <ButtonText className="text-white ">Get Started</ButtonText>
                  </Button>
                </HStack>
              </>
            ) : (
              <HStack className="items-center justify-between gap-4 hidden md:flex ">
                {options2.map((option) => (
                  <Link
                    key={option.name}
                    href={option.href}
                    className={`no-underline text-md leading-sm font-semibold ${
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
          initialView="signIn"
        />
      </VStack>
      {/**Mobile */}
      <VStack className="md:hidden w-full z-50 gap-2 p-2 fixed top-0 bg-brand-primary">
        <HStack className="justify-between items-center">
          <Button size="sm" className="bg-brand-secondary">
            <ButtonText>Open in App</ButtonText>
          </Button>
          <Button
            variant="outline"
            className="border-none"
            onPress={() => router.replace("/")}
          >
            <ButtonText>CPCLLC</ButtonText>
          </Button>
          <Button
            variant="link"
            size="xl"
            onPress={() => setShowDrawer((prev) => !prev)}
            className=""
          >
            <ButtonIcon
              className="text-white"
              as={showDrawer ? CloseIcon : MenuIcon}
            />
          </Button>
          <Drawer
            isOpen={showDrawer}
            onClose={() => setShowDrawer(false)}
            size="sm"
            anchor="top"
            className="md:hidden fixed z-50"
          >
            <DrawerBackdrop className="bg-transparent" />
            <DrawerContent className="h-screen mt-16 p-2">
              <DrawerBody className="w-full h-full m-0 justify-start">
                {!session && (
                  <Button
                    variant="link"
                    onPress={() => setIsAuthodalOpen(true)}
                    className="justify-start"
                  >
                    <ButtonText className="font-normal">Log In</ButtonText>
                  </Button>
                )}

                <Divider orientation="horizontal" className="w-full" />
                <Button
                  variant="link"
                  onPress={() => {
                    setShowDrawer(false);
                    router.push("/companies");
                  }}
                  className="justify-start"
                >
                  <ButtonText className="font-normal">Companies</ButtonText>
                </Button>
                <Divider orientation="horizontal" className="w-full" />
                {userData && (
                  <>
                    <Button
                      isDisabled={!userData?.activeRoleId}
                      variant="link"
                      onPress={() => {
                        setUserData({
                          ...userData,
                          activeRole:
                            userData?.activeRole === "Client"
                              ? "Company"
                              : "Client",
                        });
                        setShowDrawer(false);
                      }}
                      className="justify-start"
                    >
                      <ButtonText className="font-normal">{`Switch to ${
                        userData?.activeRole === "Client" ? "Company" : "Client"
                      }`}</ButtonText>
                    </Button>
                    <Divider orientation="horizontal" className="w-full" />

                    <Button
                      variant="link"
                      onPress={() => {
                        setShowDrawer(false);
                        logout();
                      }}
                      className="justify-start"
                    >
                      <ButtonText className="font-normal">Logout</ButtonText>
                    </Button>
                  </>
                )}

                <Divider orientation="horizontal" className="w-full" />

                {!session && (
                  <Button
                    onPress={() => {
                      setShowDrawer(false);
                      router.push("/onboarding");
                    }}
                    className="justify-start bottom-0 mt-96 mx-auto"
                  >
                    <ButtonText className="font-normal text-start">
                      Sign Up
                    </ButtonText>
                  </Button>
                )}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </HStack>
        <VStack className="-z-50">
          <MSearchEngine />
        </VStack>
      </VStack>
    </>
  );
};

export default NavBar;
