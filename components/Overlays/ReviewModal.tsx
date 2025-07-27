import { useState, useRef, ChangeEvent } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Star } from "lucide-react";
import { RemoveIcon } from "@/components/ui/icon";
import Image from "next/image";
import { createReview } from "@/axios/reviews";
import { ReviewData } from "@/types";

interface ReviewModalProps {
  companyId: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
  setNewReviews: (newReview: ReviewData[]) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = (props) => {
  const { isOpen, onClose, companyId, companyName, setNewReviews } = props;
  const [description, setDesc] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, 5 - images.length); // Limit to 5 images
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim() || rating === 0) {
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("description", description);
      formData.append("rating", rating.toString());

      // Append each image file to the FormData
      images.forEach((image, index) => {
        formData.append(`images`, image, `image_${index}.jpg`);
      });

      const newReviews = await createReview(companyId, formData);
      setNewReviews([newReviews]);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setDesc("");
    setRating(0);
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      className="fixed"
    >
      <ModalBackdrop />
      <ModalContent className="w-full max-w-2xl">
        <ModalHeader>
          <Heading>Review {companyName}</Heading>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Star Rating */}
          <div className="flex items-center justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} out of 5`}
              >
                <Star
                  size={32}
                  fill={star <= rating ? "#FFD700" : "transparent"}
                  color={star <= rating ? "#FFD700" : "#D1D5DB"}
                />
              </button>
            ))}
          </div>

          {/* Review Text */}
          <Textarea className="w-full h-40">
            <TextareaInput
              placeholder="Share your experience with this company..."
              value={description}
              onChangeText={(text) => setDesc(text)}
            />
          </Textarea>

          {/* Image Upload */}
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
              id="review-images"
            />
            <label
              htmlFor="review-images"
              className="inline-block px-4 py-2 mb-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            >
              Add Photos ({images.length}/5)
            </label>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      width={80}
                      height={80}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-20 h-20 rounded-md"
                    />
                    <Button
                      className="absolute top-0 right-0 p-0 h-0 text-white bg-red-500 rounded-full -translate-y-1/2 translate-x-1/2"
                      size="xs"
                      onPress={() => removeImage(index)}
                      aria-label="Remove image"
                    >
                      <ButtonIcon as={RemoveIcon} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="justify-between">
          <Button
            variant="outline"
            onPress={handleClose}
            disabled={isUploading}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            className="bg-btn-primary"
            onPress={handleSubmit}
            disabled={isUploading}
          >
            <ButtonText>
              {isUploading ? "Submitting..." : "Submit Review"}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
