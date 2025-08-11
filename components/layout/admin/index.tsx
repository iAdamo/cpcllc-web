"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import ProfileMenu from "@/components/ProfileMenu";
import { useSession } from "@/context/AuthContext";
import {
  MenuIcon,
  CloseIcon,
  BellIcon,
  ProfileIcon,
} from "@/components/ui/icon";
// import { ProfileIcon } from "@/public/assets/icons/customIcons";

const SideBar = () => {
  return (
    <VStack className="w-1/5 px-4 bg-white h-screen">
      <Heading size="sm">CompaniesCenterLLC</Heading>
      <Text
        size="md"
        className="px-4 rounded w-fit bg-brand-primary border-2 border-blue-200 text-white text-center font-medium"
      >
        Admin
      </Text>
    </VStack>
  );
};

const NavBar = () => {
  return (
    <VStack className="w-full">
      <HStack className="w-full h-fit justify-between items-center p-4 bg-white">
        <HStack className="w-3/5 px-4 justify-between items-center">
          <Heading size="sm">Dashboard</Heading>
          <Button size="lg" variant="link" className="">
            <ButtonIcon as={BellIcon} className="text-brand-primary" />
          </Button>
        </HStack>
        <VStack className="w-1/5 px-4">
          <Button
            size="xl"
            variant="outline"
            className="rounded-full w-fit h-fit p-0 bg-[#F6F6F6] border-0"
          >
            <ButtonIcon
              as={ProfileIcon}
              className="w-12 h-12 fill-brand-primary text-brand-primary"
            />
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default function AdminDashboardBars() {
  return (
    <VStack>
      <HStack>
        <SideBar />
        <NavBar />
      </HStack>
    </VStack>
  );
}
