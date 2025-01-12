import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getAuthRepo } from "~/repo/auth-repo.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = String(formData.get("username"));

  const authRepo = getAuthRepo(context.cloudflare.env);

  const existingUser = await authRepo.getUserByUsername(username);

  return { exists: !!existingUser };
};
