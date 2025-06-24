import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
// import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { createReview } from "@/axios/reviews";

interface ReviewModalProps {
  companyId: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
}
export const ReviewModal: React.FC<ReviewModalProps> = (props) => {
  const { isOpen, onClose, companyId, companyName } = props;
  const [description, setDesc] = useState("");

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("description", description);


      await createReview(companyId, formData);
      // console.log("Review submitted successfully");
      onClose();
    } catch (error) {
      console.error("Error submitting description:", error);
    }
    setDesc("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      closeOnOverlayClick={false}
      className="fixed"
    >
      <ModalBackdrop />
      <ModalContent className="w-full max-w-2xl ">
        <ModalHeader>
          <Heading>{companyName}</Heading>
        </ModalHeader>
        <ModalBody className="">
          <Textarea className="w-full h-52">
            <TextareaInput
              placeholder="Make A Review"
              value={description}
              onChangeText={(text) => setDesc(text)}
            ></TextareaInput>
          </Textarea>
        </ModalBody>
        <ModalFooter className="">
          <Button variant="outline" className="" onPress={onClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            className=""
            onPress={() => {
              handleSubmit();
              onClose();
            }}
          >
            <ButtonText>Submit Review</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
