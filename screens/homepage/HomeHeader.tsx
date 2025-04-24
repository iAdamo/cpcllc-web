import Image from "next/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { carousel0, carousel1, HomeHeada } from "@/public/assets/homepage";

const carouselImages = [HomeHeada, carousel0, carousel1];

const HomeHeader = () => {
  return (
    <VStack className="-mt-20 mb-20 relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 8000 }}
        loop
        pagination={{ clickable: true }}
        className="w-full h-[720px]"
      >
        {carouselImages.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              className="object-cover w-full h-full rounded-lg"
              src={src}
              alt={`slide-${index}`}
              width={1920}
              height={1080}
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <VStack className="absolute inset-0 z-50 h-full bg-gradient-to-b from-brand-secondary via-transparent to-brand-transparent opacity-40"></VStack>
      <VStack className="absolute z-50 inset-0 h-full">
        <VStack className="mt-44 w-1/2 pl-20 gap-10">
          <Heading className="md:text-5xl text-4xl font-extrabold text-brand-secondary">
            Welcome to companiescenterllc.com
          </Heading>
          <Text size="lg" className="font-semibold leading-6 text-black">
            Your Trusted Platform for Connecting with Leading Companies. Whether
            you&apos;re looking to hire or get hired, we provide a comprehensive
            marketplace for businesses and job seekers.
          </Text>

          <Input className="hidden md:flex w-full h-14 bg-white">
            <InputField
              type="text"
              placeholder="Search..."
              className="bg-transparent text-text-primary"
            />
            <InputSlot className="pr-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
          </Input>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default HomeHeader;
