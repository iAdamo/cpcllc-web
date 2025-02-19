import { useRef } from "react";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "@/components/ui/scroll-view";
import Link from "next/link";

const SectionOne = () => {
  const scrollRef = useRef<ScrollView>(null);

  const services = [
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
    {
      name: "lorem ipsum donor",
      link: "#",
    },
  ];
  return (
    <VStack className="fixed top-28 z-10 bg-white">
      <ScrollView
        ref={scrollRef}
        horizontal
        className="overflow-x-scroll [&::-webkit-scrollbar]:hidden gap-2"
      >
        {services.map((service, index) => (
          <Link
            key={index}
            href={service.link}
            className="p-3 text-text-secondary border font-semibold hover:border-2 hover:border-text-secondary"
          >
            {service.name}
          </Link>
        ))}
      </ScrollView>
    </VStack>
  );
};

export default SectionOne;
