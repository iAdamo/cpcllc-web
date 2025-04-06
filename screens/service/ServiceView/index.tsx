"use client";

import { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getServices } from "@/axios/services";
import { ServiceData } from "@/types";
import ServiceCard from "@/components/ServiceCard";
import { useParams } from "next/navigation";

const ServiceView = () => {
    const { id } = useParams();


  return (
    <VStack className="h-full mt-40 bg-blue-600">
      <Text>{id}</Text>
    </VStack>
  );
};

export default ServiceView;
