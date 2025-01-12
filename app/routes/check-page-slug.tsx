import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getPageRepo } from "~/repo/pages-repo.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const slug = String(formData.get("slug"));
  const pageRepo = getPageRepo(context.cloudflare.env);

  const existingSlug = await pageRepo.getBySlug(slug);

  return { exists: !!existingSlug };
};
