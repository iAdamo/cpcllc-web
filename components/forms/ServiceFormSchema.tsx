import { z } from "zod";

const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const ServiceFormSchema = z.object({
  title: z
    .string()
    .min(30, "Title must be at least 30 characters long")
    .max(80, "Title must be at most 80 characters long"),
  category: z.enum(
    ["plumbing", "house-cleaning", "electrical-work", "industrial-painting"],
    {
      errorMap: () => ({ message: "Invalid category" }),
    }
  ),
  description: z
    .string()
    .min(300, "Description must be at least 300 characters long")
    .max(1500, "Description must be at most 1500 characters long"),
  price: z.number().min(5, "Price must be at least 5"),
  location: z.string().min(1, "Location is required"),
  images: z
    .array(z.instanceof(File))
    .min(1, "Images are required")
    .refine(
      (files) => files.every((file) => file.size <= MAX_IMAGE_SIZE_BYTES),
      {
        message: `Each image must be less than ${MAX_IMAGE_SIZE_MB}MB`,
      }
    ),
});

export type ServiceFormSchemaType = z.infer<typeof ServiceFormSchema>;
