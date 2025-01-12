import {  LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { getAuthRepo } from "~/repo/auth-repo.server";
import { getLinkRepo } from "~/repo/link-repo.server";
import { getPageRepo } from "~/repo/pages-repo.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const authRepo = getAuthRepo(context.cloudflare.env);
  const linkRepo = getLinkRepo(context.cloudflare.env)

  const pageRepo = getPageRepo(context.cloudflare.env);
  await authRepo.seedDb();
  await pageRepo.seed()
  await linkRepo.seedDb()
  return redirect("/")
};
