import React from "react";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@/components/ui/drawer";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  MenuIcon,
} from "@/components/ui/icon";
import { Link, LinkText } from "@/components/ui/link";
import { Pressable } from "@/components/ui/pressable";

const MobileSideBar = () => {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [viewAllComponents, setViewAllComponents] = React.useState(false);

  const services = ["Service 1", "Service 2", "Service 3"];

  return (
    <>
      <Button
        className="md:hidden bg-yellow-500 data-[hover=true]:bg-yellow-400 data-[active=true]:bg-yellow-300"
        onPress={() => {
          setShowDrawer(true);
        }}
      >
        <ButtonIcon as={MenuIcon} />
      </Button>
      <Drawer
        isOpen={showDrawer}
        onClose={() => {
          setShowDrawer(false);
          setViewAllComponents(false);
        }}
        size="lg"
        anchor="left"
        className="md:hidden fixed h-screen"
      >
        <DrawerBackdrop />
        <DrawerContent className="w-auto h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden">
          <DrawerHeader>
            <Button className="bg-yellow-500 data-[hover=true]:bg-yellow-400 data-[active=true]:bg-yellow-300">
              <ButtonText className="">
                Work With Nextlevity Strategies
              </ButtonText>
            </Button>
          </DrawerHeader>
          <DrawerBody>
            <Text size="2xl" className="hidden text-typography-800">
              LogIn
            </Text>
            <VStack className="mt-4 gap-4">
              <VStack>
                {viewAllComponents ? (
                  <Pressable
                    onPress={() => {
                      setViewAllComponents(false);
                    }}
                  >
                    <HStack className="justify-between">
                      <Text className="font-extrabold text-yellow-500 hover:text-purple-500">
                        SERVICES
                      </Text>
                      <Icon as={ChevronUpIcon} />
                    </HStack>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      setViewAllComponents(true);
                    }}
                  >
                    <HStack className="justify-between">
                      <Text className="font-extrabold text-purple-500 hover:text-yellow-500">
                        SERVICES
                      </Text>
                      <Icon as={ChevronDownIcon} size="sm" />
                    </HStack>
                  </Pressable>
                )}
                {viewAllComponents && (
                  <VStack className="pl-2 mt-2 ">
                    {services.map((service) => (
                      <Pressable
                        key={service}
                        className="w-full hover:bg-gray-50 hover:bg-opacity-20 rounded-md"
                      >
                        <HStack className="justify-between w-full p-2">
                          <Text className="font-bold text-center">
                            {service}
                          </Text>
                          <Icon as={ArrowRightIcon} />
                        </HStack>
                      </Pressable>
                    ))}
                  </VStack>
                )}
              </VStack>
              <Link>
                <LinkText className="no-underline text-purple-500 font-extrabold data-[hover=true]:text-yellow-500">
                  ABOUT
                </LinkText>
              </Link>
              <Link>
                <LinkText className="no-underline text-purple-500 font-extrabold data-[hover=true]:text-yellow-500">
                  RESULTS
                </LinkText>
              </Link>
              <Link>
                <LinkText className="no-underline text-purple-500 font-extrabold data-[hover=true]:text-yellow-500">
                  COMPANY
                </LinkText>
              </Link>
              <Link>
                <LinkText className="no-underline text-purple-500 font-extrabold data-[hover=true]:text-yellow-500">
                  BLOG
                </LinkText>
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileSideBar;
