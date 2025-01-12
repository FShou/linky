import { z } from "zod";
export const linkFormSchema = z.object({
  title: z.coerce.string().min(1, { message: "Tittle must not be empty" }),
  link: z.coerce.string().url(),
  slug: z.coerce
    .string()
    .min(1, { message: "Slug must not be empty" })
    // .regex(/^[^/?\ ~!$%\^\&*()+=|\\\[\]{};':]*$/, "String cannot contain '/' or '?'")
    .regex(/^[a-zA-Z0-9@_\-]+$/, {
      message: "Only alphanumeric characters, '@', '_', and '-' are allowed.",
    }),
});
