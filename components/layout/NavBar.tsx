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
import { MenuIcon, CloseIcon, ChevronDownIcon } from "@/components/ui/icon";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerBody,
} from "@/components/ui/drawer";
import { Divider } from "@/components/ui/divider";
import VerifyCodeModal from "@/screens/auth/VerifyCodeModal";
import { useTranslation } from "@/context/TranslationContext"; // Update the path to the correct location

const NavBar = () => {
  const [isAuthodalOpen, setIsAuthodalOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const { session, userData, logout, setUserData } = useSession();
  const router = useRouter();
  const currentPath = usePathname();
  const { t, language, setLanguage } = useTranslation();

  const options = [
    { name: t("home"), href: "/" },
    { name: t("companies"), href: "/companies" },
  ];

  const options2 = [
    ...(session ? [{ name: t("myRequests"), href: "/requests" }] : []),
    { name: t("favorites"), href: "/favorites" },
    ...(userData?.activeRole !== "Company"
      ? [{ name: t("beACompany"), href: "/onboarding" }]
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

  const handleLanguageChange = (lang: "en" | "es") => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  return (
    <>
      {/** Verify Code Modal */}
      <VerifyCodeModal
        isOpen={userData! && !userData?.verified}
        onClose={() => userData?.verified}
        email={userData?.email || ""}
        onVerified={() => {
          setIsAuthodalOpen(false);
          if (userData?.id) {
            setUserData({
              ...userData,
              verified: true,
            });
          } else {
            console.error("User ID is undefined");
          }
          router.replace("/cpc/" + userData?.id);
        }}
        isVerified={!userData?.verified}
      />

      {/** Desktop */}
      <VStack
        className={`hidden md:flex justify-center items-center ${
          currentPath !== "/" ? "fixed top-0 h-28" : "h-20"
        } z-40 w-full ${styles.navBarClass}`}
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

            {/** Language Selector */}
            <div className="relative ml-4">
              <Button
                variant="link"
                size="xs"
                onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center"
              >
                <ButtonText
                  className={`${
                    currentPath === "/" ? "text-white" : "text-text-primary"
                  } text-lg data-[hover=true]:no-underline data-[hover=true]:text-text-primary`}
                >
                  {language === "en" ? t("english") : t("spanish")}
                </ButtonText>
                <ButtonIcon as={ChevronDownIcon} className="ml-1 text-white w-6 h-6" />
              </Button>

              {showLanguageDropdown && (
                <div className="absolute flex-row flex gap-4 top-full left-0 mt-1 rounded-md shadow-lg z-50">
                  <Button
                    size="xs"
                    onPress={() => handleLanguageChange("en")}
                    className="bg-white data-[hover=true]:bg-white"
                  >
                    <ButtonText className="text-text-primary data-[hover=true]:text-blue-600">
                      English
                    </ButtonText>
                  </Button>
                  <Button
                    size="xs"
                    onPress={() => handleLanguageChange("es")}
                    className="bg-white data-[hover=true]:bg-white"
                  >
                    <ButtonText className="text-text-primary data-[hover=true]:text-blue-600">
                      Español
                    </ButtonText>
                  </Button>
                </div>
              )}
            </div>
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
                    <ButtonText className="">{t("logIn")}</ButtonText>
                  </Button>

                  <Button
                    onPress={() => router.push("/onboarding")}
                    className="bg-btn-primary data-[hover=true]:bg-brand-primary"
                  >
                    <ButtonText className="text-white ">
                      {t("getStarted")}
                    </ButtonText>
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
                {/** User Profile Menu */}
                {userData && (
                  <ProfileMenu
                    options={[
                      ...(userData?.activeRoleId
                        ? [
                            {
                              name: t("profile"),
                              onPress: () => {
                                setUserData({
                                  ...userData,
                                  activeRole:
                                    userData?.activeRole === "Client"
                                      ? "Company"
                                      : "Company",
                                });
                              },
                            },
                            {
                              name: t("membership"),
                              onPress: () => router.replace("/profile"),
                            },
                          ]
                        : []),

                      {
                        name: t("settings"),
                        onPress: () => router.replace("/settings"),
                      },
                    ]}
                    offset={30}
                  />
                )}
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
            <ButtonText>{t("openInApp")}</ButtonText>
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
                {/* Language Selector in Mobile Menu */}
                <div className="mb-4">
                  <Button
                    variant="link"
                    size="sm"
                    onPress={() => handleLanguageChange("en")}
                    className={`mr-2 ${language === "en" ? "font-bold" : ""}`}
                  >
                    <ButtonText>English</ButtonText>
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onPress={() => handleLanguageChange("es")}
                    className={`${language === "es" ? "font-bold" : ""}`}
                  >
                    <ButtonText>Español</ButtonText>
                  </Button>
                </div>
                <Divider orientation="horizontal" className="w-full" />

                {!session && (
                  <>
                    <Button
                      variant="link"
                      onPress={() => setIsAuthodalOpen(true)}
                      className="justify-start"
                    >
                      <ButtonText className="font-normal">
                        {t("logIn")}
                      </ButtonText>
                    </Button>
                    <Divider orientation="horizontal" className="w-full" />
                    <Button
                      variant="link"
                      onPress={() => {
                        setShowDrawer(false);
                        router.push("/companies");
                      }}
                      className="justify-start"
                    >
                      <ButtonText className="font-normal">
                        {t("companies")}
                      </ButtonText>
                    </Button>
                    <Divider orientation="horizontal" className="w-full" />
                  </>
                )}
                {userData && (
                  <>
                    <Button
                      isDisabled={!userData?.activeRoleId}
                      variant="link"
                      onPress={() => {
                        setShowDrawer(false);
                        setUserData({
                          ...userData,
                          activeRole:
                            userData?.activeRole === "Client"
                              ? "Company"
                              : "Client",
                        });
                      }}
                      className="justify-start"
                    >
                      <ButtonText className="font-normal">{`${t("switchTo")} ${
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
                      <ButtonText className="font-normal">
                        {t("logout")}
                      </ButtonText>
                    </Button>
                  </>
                )}

                {!session && (
                  <Button
                    variant="link"
                    onPress={() => {
                      setShowDrawer(false);
                      router.push("/onboarding");
                    }}
                    className="justify-start"
                  >
                    <ButtonText className="">{t("signUp")}</ButtonText>
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
