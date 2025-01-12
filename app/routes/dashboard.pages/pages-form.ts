import { z } from "zod";

export const pageFormSchema = z.object({
  title: z.coerce.string().min(1, { message: "Tittle must not be empty" }),
  slug: z.coerce
    .string()
    .min(1, { message: "Slug must not be empty" })
    // .regex(/^[^/?\ ~!$%\^\&*()+=|\\\[\]{};':]*$/, "String cannot contain '/' or '?'")
    .regex(/^[a-zA-Z0-9@_\-]+$/, {
      message: "Only alphanumeric characters, '@', '_', and '-' are allowed.",
    }),
  published: z.coerce.boolean(),
  description: z.coerce.string()
});

export const linkItemForm = z.object({
  title: z.coerce.string().min(1, { message: "Tittle must not be empty" }),
  url: z.coerce.string().url({ message: "Invalid Url" }),
});
export const titleItemForm = z.object({
  title: z.coerce.string().min(1, { message: "Tittle must not be empty" }),
});
export const pageContentForm = z.array(z.union([linkItemForm, titleItemForm]));
