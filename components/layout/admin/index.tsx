"use client";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import {
  BellIcon,
  ProfileIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SettingsIcon,
  UsersIcon,
  DashboardIcon,
  AnalyticsIcon,
  LogoutIcon,
} from "@/components/ui/icon";
// import { ProfileIcon } from "@/public/assets/icons/customIcons";
import { useDashboardStore } from "@/stores/dashboard-store";

const SideBar = () => {
  const { activeView, setActiveView, sidebarOpen, toggleSidebar } =
    useDashboardStore();

  const options = [
    {
      name: "dashboard",
      icon: DashboardIcon,
    },
    {
      name: "users",
      icon: UsersIcon,
    },
    {
      name: "settings",
      icon: SettingsIcon,
    },
    {
      name: "analytics",
      icon: AnalyticsIcon,
    },
    {
      name: "logout",
      icon: LogoutIcon,
    },
  ];

  return (
    <VStack
      className={`${
        sidebarOpen ? "w-1/5 gap-8" : "w-20 gap-4"
      } pt-4 bg-white transition-all duration-300`}
    >
      <VStack
        className={`${
          sidebarOpen && "flex-row"
        } w-full items-start justify-between h-fit px-4`}
      >
        <VStack className="transition-all duration-300">
          <Heading size="sm">{sidebarOpen ? "CompaniesCenterLLC" : ""}</Heading>
          <Text
            size="sm"
            className="px-2 rounded w-fit bg-blue-700 border-2 border-blue-200 text-white text-center font-medium"
          >
            Admin
          </Text>
        </VStack>
        <Button size="xl" variant="link" onPress={toggleSidebar}>
          <ButtonIcon
            as={sidebarOpen ? ChevronsLeftIcon : ChevronsRightIcon}
            className="w-6 h-6 text-blue-600"
          />
        </Button>
      </VStack>
      <VStack className={`${!sidebarOpen && "px-2"} w-full gap-6`}>
        {options.map((view, index) => (
          <Button
            key={index}
            size="lg"
            variant="outline"
            className={`${
              view.name === "logout"
                ? "data-[hover=true]:bg-red-200/90 dark:bg-red-900/50 dark:data-[hover=true]:bg-red-800/70"
                : activeView === view.name
                ? "bg-blue-100/80 data-[hover=true]:bg-blue-200/90 dark:bg-blue-900/50 dark:data-[hover=true]:bg-blue-800/70"
                : "data-[hover=true]:bg-gray-100/50 dark:data-[hover=true]:bg-gray-800/50"
            } w-full justify-start border-none rounded-none transition-colors duration-200`}
            onPress={() => setActiveView(view.name as any)}
          >
            <ButtonIcon
              as={view.icon}
              className={`${
                view.name === "logout"
                  ? "text-transparent data-[hover=true]:text-red-600 dark:text-red-400 dark:data-[hover=true]:text-red-300"
                  : activeView === view.name
                  ? "text-blue-600 data-[hover=true]:text-blue-700 dark:text-blue-300 dark:data-[hover=true]:text-blue-200"
                  : "text-gray-600 data-[hover=true]:text-gray-700 dark:text-gray-400 dark:data-[hover=true]:text-gray-300"
              } text-lg transition-colors duration-200`}
            />
            {sidebarOpen && (
              <ButtonText
                size="md"
                className={`${
                  view.name === "logout"
                    ? "text-red-500 data-[hover=true]:text-red-700 dark:text-red-400 dark:data-[hover=true]:text-red-300"
                    : activeView === view.name
                    ? "text-blue-600 data-[hover=true]:text-blue-700 dark:text-blue-300 dark:data-[hover=true]:text-blue-200"
                    : "text-gray-700 data-[hover=true]:text-gray-800 dark:text-gray-300 dark:data-[hover=true]:text-gray-200"
                } font-medium ml-3 transition-colors duration-200`}
              >
                {view.name.charAt(0).toUpperCase() + view.name.slice(1)}
              </ButtonText>
            )}
          </Button>
        ))}
      </VStack>
    </VStack>
  );
};

const NavBar = () => {
  const { activeView } = useDashboardStore();

  return (
    <VStack className="w-full">
      <HStack className="w-full items-center p-4 bg-white">
        <HStack className="w-full px-4 justify-between items-center">
          <Heading size="sm">
            {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          </Heading>
          <Button size="lg" variant="link" className="">
            <ButtonIcon as={BellIcon} className="text-blue-700" />
          </Button>
        </HStack>
        <VStack className="w-1/4 bg-blue-500 items-start">
          <Button variant="link" className="w-auto gap-2 p-0 h-0 bg-red-500">
            <ButtonIcon
              as={ProfileIcon}
              className="w-11 h-11 rounded-full bg-[#F6F6F6] fill-blue-700 text-blue-700"
            />
            <VStack>
              <ButtonText size="xs" className="">
                De ArmasAlejandro
              </ButtonText>
              <Text size="sm">Admin</Text>
            </VStack>
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HStack className="w-full h-screen">
      <SideBar />
      <VStack className="flex-1 overflow-hidden">
        <NavBar />
        <VStack className="flex-1 overflow-y-auto p-4 bg-[#F6F6F6] rounded-md">{children}</VStack>
      </VStack>
    </HStack>
  );
}
