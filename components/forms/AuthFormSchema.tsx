import { z } from "zod";

export const FormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(15, "Username must not exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  code: z.string().regex(new RegExp("^[0-9]{6}$"), "Code must be 6 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      new RegExp(".*[A-Z].*"),
      "Password must contain at least one uppercase letter"
    )
    .regex(
      new RegExp(".*[a-z].*"),
      "Password must contain at least one lowercase letter"
    )
    .regex(new RegExp(".*[0-9].*"), "Password must contain at least one number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
