import { z } from "zod";

export const userFormSchema = z.object({
  username: z.coerce
    .string()
    .min(1, { message: "Username must not be empty" })
    .regex(/^[a-zA-Z0-9@_\-]+$/, {
      message: "Only alphanumeric characters, '@', '_', and '-' are allowed.",
    }),
  fullname: z.coerce.string().min(1, { message: "Fullname must not be empty" }),
  password: z.coerce
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  confirm: z.coerce.string().min(8, {
    message: "Confirm password must be at least 8 characters long",
  }),
});

export const editUserFormSchema = z.object({
  username: z.coerce
    .string()
    .min(1, { message: "Username must not be empty" })
    .regex(/^[a-zA-Z0-9@_\-]+$/, {
      message: "Only alphanumeric characters, '@', '_', and '-' are allowed.",
    }),
  fullname: z.coerce.string().min(1, { message: "Fullname must not be empty" }),
  password: z.coerce
    .string()
    .nullable()
    .refine((v) => v == null || v == "" || v.length > 7, {
      message: "New Password must be at least 8 characters long",
    }),
  confirm: z.coerce.string().nullable()
});
