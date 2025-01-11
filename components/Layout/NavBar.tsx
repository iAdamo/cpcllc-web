import {
  VStack,
  HStack,
  Button,
  ButtonText,
  Link,
  LinkText,
} from "@/components/ui";
import Image from "next/image";
import Dropdown from "@/components/Overlays/dropdown";
import MobileSideBar from "../Overlays/MobileSideBar";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();

  const dropdownOptions = [
    { label: "Profile", onPress: () => router.push("/") },
    { label: "Settings", onPress: () => router.push("/") },
    { label: "Logout", onPress: () => router.push("/") },
    { label: "Profile", onPress: () => router.push("/") },
    { label: "Settings", onPress: () => router.push("/") },
    { label: "Logout", onPress: () => router.push("/") },
  ];
  return (
    <VStack className="bg-transparent md:mx-auto md:container">
      <HStack className="bg-red-700 p-4 md:mt-10 items-center justify-between">
        <Button className="p-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent">
          <Image
            className="w-10 h-10"
            src="/assets/homepage/icon-deal.png"
            alt="Icon"
            width={30}
            height={30}
          />
          <ButtonText className="text-2xl md:text-3xl font-extrabold text-blue-400  data-[hover=true]:text-none data-[active=true]:text-none">
            Nextlevity
          </ButtonText>
        </Button>
        <HStack className="items-center gap-6 hidden md:flex ml-auto">
          <Dropdown
            buttonLabel="SERVICES"
            options={dropdownOptions}
            offset={24}
          />
          <Link>
            <LinkText className="no-underline font-extrabold data-[hover=true]:text-yellow-700">
              RESULTS
            </LinkText>
          </Link>
          <Link>
            <LinkText className="no-underline font-extrabold data-[hover=true]:text-yellow-700">
              COMPANY
            </LinkText>
          </Link>
          <Link>
            <LinkText className="no-underline font-extrabold data-[hover=true]:text-yellow-700">
              BLOG
            </LinkText>
          </Link>
          <Button className="bg-yellow-700 data-[hover=true]:bg-blue-400 data-[active=true]:bg-transparent">
            <ButtonText className="">WORK WITH US</ButtonText>
          </Button>
        </HStack>
        {/* Mobile Menu Button (hidden on larger screens) */}
        <MobileSideBar />
      </HStack>
    </VStack>
  );
};

export default NavBar;
