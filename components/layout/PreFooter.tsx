import { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { Icon, ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";

const PreFooter = () => {
  const info = [
    {
      title: "Industries We Serve",
      links: [
        { name: "E-Commerce", href: "/industries/e-commerce" },
        { name: "Healthcare", href: "/industries/healthcare" },
        { name: "Real Estate", href: "/industries/real-estate" },
        { name: "Tech Startups", href: "/industries/tech-startups" },
        { name: "Education", href: "/industries/education" },
        { name: "Hospitality", href: "/industries/hospitality" },
      ],
    },
    {
      title: "For Clients",
      links: [
        { name: "Client Portal", href: "/client-portal" },
        { name: "Service Packages", href: "/service-packages" },
        { name: "Project Tracker", href: "/project-tracker" },
        { name: "Billing & Invoices", href: "/billing" },
        { name: "Feedback & Support", href: "/feedback-support" },
      ],
    },
    {
      title: "For Companies",
      links: [
        { name: "How to find work", href: "/client-portal" },
        { name: "Direct Contracts", href: "/service-packages" },
        { name: "Find jobs worldwide", href: "/project-tracker" },
        { name: "Find freelance jobs in the USA", href: "/billing" },
        { name: "Win work with ads", href: "/feedback-support" },
        {
          name: "Exclusive resources with Company Plus",
          href: "/company-support",
        },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Webinars & Events", href: "/resources/webinars" },
        { name: "Marketing Guides", href: "/resources/marketing-guides" },
        { name: "Tools & Templates", href: "/resources/tools-templates" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <VStack className="md:mt-20 z-50">
      <HStack className="md:hidden p-4 flex-wrap justify-between">
        {info.map((item, index) => (
          <VStack
            key={item.title}
            className="md:flex-col gap-2 w-full md:w-auto"
          >
            <Pressable onPress={() => toggleDropdown(index)}>
              <HStack className="justify-between py-2">
                <Heading size="sm" className="">
                  {item.title}
                </Heading>
                <Icon
                  as={openIndex === index ? ChevronUpIcon : ChevronDownIcon}
                  size="lg"
                  color="gray"
                />
              </HStack>
            </Pressable>

            {openIndex === index &&
              item.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="no-underline text-primary-100 hover:underline hover:text-primary-100"
                >
                  {link.name}
                </Link>
              ))}
          </VStack>
        ))}
      </HStack>
      <HStack className="hidden md:flex p-4 my-4 flex-wrap justify-between">
        {info.map((item) => (
          <VStack key={item.title} className="md:flex-col gap-2">
            <Heading size="sm">{item.title}</Heading>
            {item.links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="no-underline font-medium text-primary-100 hover:underline hover:text-primary-100"
              >
                {link.name}
              </Link>
            ))}
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
};

export default PreFooter;
