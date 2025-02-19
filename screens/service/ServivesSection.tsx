import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { star } from "@/public/assets/icons";
import { Card } from "@/components/ui/card";

const ServicesSection = () => {
  const services = [
    {
      name: "Barbing and Saloon Service",
      description: "We give preium haircuts to suit your fashion needs",
      location: {
        first: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        second: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        third: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
      },
      media: {
        image: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
        video: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
      },
      price: {
        min: 1000,
        max: 5000,
      },
      link: "#",
      company: "Cut de Cut",
      ratings: "4.2",
    },
    {
      name: "Barbing and Saloon Service",
      description: "We give preium haircuts to suit your fashion needs",
      location: {
        first: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        second: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        third: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
      },
      media: {
        image: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
        video: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
      },
      price: {
        min: 1000,
        max: 5000,
      },
      link: "#",
      company: "Cut de Cut",
      ratings: "4.2",
    },
    {
      name: "Barbing and Saloon Service",
      description: "We give preium haircuts to suit your fashion needs",
      location: {
        first: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        second: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        third: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
      },
      media: {
        image: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
        video: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
      },
      price: {
        min: 1000,
        max: 5000,
      },
      link: "#",
      company: "Cut de Cut",
      ratings: "4.2",
    },
    {
      name: "Barbing and Saloon Service",
      description: "We give preium haircuts to suit your fashion needs",
      location: {
        first: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        second: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        third: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
      },
      media: {
        image: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
        video: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
      },
      price: {
        min: 1000,
        max: 5000,
      },
      link: "#",
      company: "Cut de Cut",
      ratings: "4.2",
    },
    {
      name: "Barbing and Saloon Service",
      description: "We give preium haircuts to suit your fashion needs",
      location: {
        first: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        second: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        third: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
      },
      media: {
        image: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
        video: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
      },
      price: {
        min: 1000,
        max: 5000,
      },
      link: "#",
      company: "Cut de Cut",
      ratings: "4.2",
    },
    {
      name: "Barbing and Saloon Service",
      description: "We give preium haircuts to suit your fashion needs",
      location: {
        first: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        second: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        third: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
      },
      media: {
        image: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
        video: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
      },
      price: {
        min: 1000,
        max: 5000,
      },
      link: "#",
      company: "Cut de Cut",
      ratings: "4.2",
    },
    {
      name: "Barbing and Saloon Service",
      description: "We give preium haircuts to suit your fashion needs",
      location: {
        first: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        second: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
        third: {
          city: "De Voe",
          state: "Florida",
          country: "United States",
          coords: {
            latitude: 9.34333,
            longitude: 4.43222,
          },
        },
      },
      media: {
        image: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
        video: {
          primary: "/assets/homepage/home-client.jpg",
          secondary: "/assets/homepage/icon-deal.png",
        },
      },
      price: {
        min: 1000,
        max: 5000,
      },
      link: "#",
      company: "Cut de Cut",
      ratings: "4.2",
    },
  ];
  return (
    <VStack className="my-10 p-10">
      <Heading>Services</Heading>
      <HStack></HStack>
      <VStack className="grid md:grid-cols-4 grid-cols-2 gap-4 p-4 h-auto">
        {services.map((service, index) => (
          <Link key={index} href={service.link}>
            <Card variant="filled" className="gap-4">
              <VStack>
                <Image
                  className="h-40"
                  src={service.media.image.primary}
                  alt={service.name}
                  width={1400}
                  height={600}
                />
              </VStack>
              <VStack className="gap-4">
                <Text className="font-semibold">{service.name}</Text>
                <HStack className="w-full justify-between items-center pr-8">
                  <HStack className="gap-2 items-center">
                    <Image
                      className="font-semibold"
                      src={star}
                      alt="Star"
                      width={20}
                      height={20}
                    />

                    <Text className="font-semibold">{`${service.ratings}/5.0`}</Text>
                  </HStack>
                  <VStack>
                    <Text className="font-semibold">
                      {service.location.first.country}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Card>
          </Link>
        ))}
      </VStack>
    </VStack>
  );
};

export default ServicesSection;
