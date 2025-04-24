import Image from "next/image";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  carousel0,
  carousel1,
  carousel2,
  carousel3,
  carousel4,
} from "@/public/assets/homepage";

const carouselImages = [carousel0, carousel1, carousel2, carousel3, carousel4];

const HomeHeader = () => {
  return (
    <VStack className="-mt-20 mb-20 relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        loop
        pagination={{ clickable: true }}
        className="w-full h-[760px]"
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
      <VStack className="absolute inset-0 z-50 h-full bg-gradient-to-b from-brand-secondary via-transparent to-brand-transparent opacity-50"></VStack>
      <VStack className="absolute z-50 inset-0 h-full">
        <VStack className="mt-44 w-1/2 pl-24 gap-10">
          <p
            className="text-white text-6xl font-extrablack"
            style={{
              textShadow:
                "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 black",
            }}
          >
            Welcome To CompanyCenterLLC
          </p>
          <p className="text-white text-xl font-extrabold">
            Your Trusted Platform for Connecting with Leading Companies. Whether
            you&apos;re looking to hire or get hired, we provide a comprehensive
            marketplace for businesses and job seekers.
          </p>

          <Input className="hidden md:flex w-full h-14 bg-white">
            <InputField
              type="text"
              placeholder="Search..."
              className="bg-transparent text-black  font-bold text-lg"
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
