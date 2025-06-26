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
    <VStack className="md:px-20 px-4 gap-4">
      <VStack className="gap-2">
        <Heading size="md" className="md:text-4xl">
          Connect With Top Companies
        </Heading>
        <Text size="sm" className="md:text-lg">
          Join companiescenterllc.com and connect with leading companies
          offering a wide range of services.
        </Text>
        <Link
          href="/companies"
          className="hidden md:inline text-2xl text-btn-primary hover:text-brand-secondary font-semibold underline"
        >
          Browse companies
        </Link>
      </VStack>
      <VStack className="md:flex-row w-full flex flex-wrap gap-x-4 gap-y-8">
        {users.map((user, index) => (
          <Link key={index} href={`companies/${user?.activeRoleId?._id || ""}`}>
            <Card
              variant="outline"
              className="flex-row h-32 md:w-96 p-0 gap-4 bg-white"
            >
                <Image
                  className="h-32 w-32 rounded-l-md object-cover"
                  src={
                    user?.activeRoleId?.companyImages[0] || "/assets/placeholder.jpg"
                  }
                  alt={user?.activeRoleId?.companyName || "Company Logo"}
                  width={1400}
                  height={600}
                />
              <VStack className="justify-between p-2">
                <Heading>{user?.activeRoleId?.companyName}</Heading>
                <Text size="sm" className="md:text-md font-semibold">
                  {user?.activeRoleId?.location?.primary?.address?.address}
                </Text>
              </VStack>
            </Card>
          </Link>
        ))}
      </VStack>
      <Button
        variant="outline"
        onPress={() => router.push("/companies")}
        className="md:hidden "
      >
        <ButtonText> Browse companies</ButtonText>
      </Button>
    </VStack>
  );
};

export default BrowseCompanies;
