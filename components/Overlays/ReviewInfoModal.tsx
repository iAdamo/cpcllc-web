import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import renderStars from "@/components/RenderStars";
import Image from "next/image";
import { ReviewData } from "@/types";
import { getInitial } from "@/utils/GetInitials";
import { format } from "date-fns";

interface ReviewInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewData;
}

const ReviewInfoModal: React.FC<ReviewInfoModalProps> = (props) => {
  const { isOpen, onClose, review } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="fixed">
      <ModalBackdrop />
      <ModalContent className="h-auto max-h-[32rem] max-w-3xl">
        <ModalHeader className="flex-row gap-3 items-start">
          <Avatar size="md" className="shrink-0">
            <AvatarFallbackText className="text-sm">
              {getInitial(review.user?.firstName || review.user?.email)}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: review.user?.profilePicture || "" }} />
          </Avatar>
          <VStack className="flex-1 gap-1">
            <HStack className="justify-between items-start">
              <VStack>
                <Heading size="sm" className="font-semibold text-gray-800">
                  {review.user?.firstName && review.user?.lastName
                    ? `${review.user.firstName} ${review.user.lastName}`
                    : "Anonymous User"}
                </Heading>
                <HStack className="gap-1 items-center">
                  {/**<div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          fill={index < review.rating ? "#FFD700" : "#D1D5DB"}
                          color={index < review.rating ? "#FFD700" : "#D1D5DB"}
                        />
                      ))}
                    </div>*/}
                  {renderStars(review.rating)}
                  <Text className="text-sm text-gray-500 ml-1">
                    {review.rating?.toFixed(1)}
                  </Text>
                </HStack>
              </VStack>
              <Text className="text-sm text-gray-400">
                {format(new Date(review.createdAt), "MMM d, yyyy")}
              </Text>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalBody className="mt-8 max-h-60 p-4 rounded border border-gray-200">
          <Text className="text-gray-700">{review.description}</Text>
        </ModalBody>
        {review.images && review.images.length > 0 && (
          <ModalFooter className="h-56 w-full p-2 rounded gap-4 grid grid-cols-2 overflow-auto">
            {review.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                width={4000}
                height={4000}
                className="w-auto h-auto object-cover rounded"
              />
            ))}
          </ModalFooter>
        )}
        <small className="mt-2 self-end text-typography-500 ">
          {review.company.companyName}
        </small>
      </ModalContent>
    </Modal>
  );
};
export default ReviewInfoModal;
