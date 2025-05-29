import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "../ui/heading";

interface ReviewModalProps {
  companyId: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
}
export const reviewModal: React.FC<ReviewModalProps> = (props) => {
  const { isOpen, onClose, companyId, companyName } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      className="fixed"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>Make A Review</ModalHeader>
        <ModalBody>
          <VStack>
            <Heading>{companyName}</Heading>
          </VStack>
        </ModalBody>
        <ModalFooter>{/* Action buttons go here */}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};
