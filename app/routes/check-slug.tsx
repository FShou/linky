import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getLinkRepo } from "~/repo/link-repo.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const slug = String(formData.get("slug"));

  const usedSlugs = new Map([
    ["login", true],
    ["logout", true],
    ["dashboard", true],
    ["p", true],
    ["check-slug", true],
    ["check-page-slug", true],
    ["check-username", true],
    ["seeder", true],
  ]);

  if (usedSlugs.has(slug)) {
    return {
      exists: true,
    };
  }

  const linkRepo = getLinkRepo(context.cloudflare.env);

  const existingSlug = await linkRepo.getBySlug(slug);

  return { exists: !!existingSlug };
};
