import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { star } from "@/public/assets/icons";
import Image from "next/image";
import { getUsers } from "@/axios/users";
import { UserData } from "@/types";

const BrowseCompanies = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { users: response, totalPages } = await getUsers(
        1,
        10
      );
      setUsers(response);
    };
    fetchCompanies();
  }, []);

  return (
    <VStack className="p-20 gap-4">
      <VStack className="gap-2">
        <Heading size="3xl">Connect With Top Companies</Heading>
        <Text>
          Join companiescenterllc.com and connect with leading companies
          offering a wide range of services.
        </Text>
        <Link
          href="/services"
          className="text-2xl text-btn-primary hover:text-brand-secondary font-semibold underline"
        >
          Browse companies
        </Link>
      </VStack>
      <HStack className="w-full flex flex-wrap justify-between gap-y-8">
        {users.map((user, index) => (
          <Link key={index} href={user?.activeRoleId?._id || ""}>
            <Card className="bg-card-primary-1 hover:bg-card-primary-2 w-72 h-32 items-start">
              <VStack className="h-1/2">
                <Heading className="">
                  {user?.activeRoleId?.companyName}
                </Heading>
              </VStack>
              <HStack className="h-1/2 w-full justify-between items-center pr-8">
                <HStack className="gap-2 items-center">
                  <Image
                    className="font-semibold"
                    src={star}
                    alt="Star"
                    width={20}
                    height={20}
                  />

                  <Text className="font-semibold">
                    {`${user?.activeRoleId?.ratings}/5.0` || "5.0"}
                  </Text>
                </HStack>
              </HStack>
            </Card>
          </Link>
        ))}
      </HStack>
    </VStack>
  );
};

export default BrowseCompanies;
