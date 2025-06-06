import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VStack } from "@/components/ui/vstack";
// import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
// import { star } from "@/public/assets/icons";
import Image from "next/image";
import { getUsers } from "@/axios/users";
import { UserData } from "@/types";

const BrowseCompanies = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { users: response } = await getUsers(1, 10);
      setUsers(response);
    };
    fetchCompanies();
  }, []);

  return (
    <VStack className="md:p-20 p-4 gap-4">
      <VStack className="gap-2">
        <Heading size="xl" className="md:text-4xl">
          Connect With Top Companies
        </Heading>
        <Text size="md" className="md:text-lg">
          Join companiescenterllc.com and connect with leading companies
          offering a wide range of services.
        </Text>
        <Link
          href="/services"
          className="hidden md:inline text-2xl text-btn-primary hover:text-brand-secondary font-semibold underline"
        >
          Browse companies
        </Link>
      </VStack>
      <VStack className="md:flex-row w-full flex flex-wrap justify-between gap-y-8">
        {users.map((user, index) => (
          <Link key={index} href={user?.activeRoleId?._id || ""}>
            <Card
              variant="outline"
              className="flex-row w-full p-0 gap-4 bg-white"
            >
              <VStack>
                <Image
                  className="h-32 w-32 rounded-l-md object-cover"
                  src={
                    user?.activeRoleId?.companyLogo || "/assets/placeholder.jpg"
                  }
                  alt={user?.activeRoleId?.companyName || "Company Logo"}
                  width={1400}
                  height={600}
                />
              </VStack>
              <VStack className="justify-between p-2">
                <Heading>{user?.activeRoleId?.companyName}</Heading>
                <Text>
                  {user?.activeRoleId?.location?.primary?.address?.address}
                </Text>
              </VStack>
            </Card>
          </Link>
        ))}
      </VStack>
      <Button
        variant="outline"
        onPress={() => router.push("/services")}
        className="md:hidden"
      >
        <ButtonText> Browse companies</ButtonText>
      </Button>
    </VStack>
  );
};

export default BrowseCompanies;
