import Image from "next/image";
import { VStack } from "@/components/ui/vstack";
import { SearchEngine } from "@/components/SearchEngine";
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
    <header className="hidden md:flex -mt-20 relative">
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
      <VStack className="absolute inset-0 z-10 h-full bg-gradient-to-b from-brand-secondary via-transparent to-brand-transparent opacity-50"></VStack>
      <VStack className="absolute z-50 inset-0 mt-24">
        <VStack className="mt-44 w-1/2 pl-24 gap-10">
          <h1
            className="text-white text-6xl font-extrablack"
            style={{
              textShadow:
                "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 black",
            }}
          >
            CompanyCenterLLC
          </h1>
          <h2 className="text-white text-xl font-semibold pr-14">
            Your Trusted Platform for Connecting with Leading Companies. Whether
            you&apos;re looking to hire or get hired, we provide a comprehensive
            marketplace for businesses and job seekers.
          </h2>
          <SearchEngine />
        </VStack>
      </VStack>
    </header>
  );
};

export default HomeHeader;
