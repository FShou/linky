import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import {
  Outlet,
  useFetchers,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import { useEffect } from "react";
import { LOADING_TOAST, SUCCESS_TOAST } from "~/components/toast-default";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useToast } from "~/hooks/use-toast";
import { getSessionUser } from "~/lib/auth";
import { getAuthRepo } from "~/repo/auth-repo.server";
import { destroySession, getSession } from "~/session";
import AppSidebar from "./sidebar";
import { Separator } from "~/components/ui/separator";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const authRepo = getAuthRepo(context.cloudflare.env);
  return getSessionUser(authRepo, request);
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  // Logout
  const authRepo = getAuthRepo(context.cloudflare.env);
  const sessionCookie = await getSession(request.headers.get("Cookie"));
  await authRepo.deleteSession(sessionCookie.get("sessionToken") ?? "");

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(sessionCookie),
    },
  });
};

export default function SidebarLayout() {
  const user = useLoaderData<typeof loader>();
  const matches = useMatches();
  const currentPath = matches[matches.length - 1].pathname;

  const fetchers = useFetchers();
  const { toast } = useToast();

  useEffect(() => {
    if (
      fetchers[0]?.formAction === "/dashboard/links" ||
      fetchers[0]?.formAction === "/dashboard/pages" ||
      fetchers[0]?.formAction === "/dashboard/users"
    ) {
      if (fetchers[0]?.state === "submitting") {
        toast(LOADING_TOAST);
      }
      if (fetchers[0]?.state === "loading") {
        toast(SUCCESS_TOAST);
      }
    }
  }, [fetchers[0]?.state]);

  return (
    <SidebarProvider>
      <AppSidebar currentPath={currentPath} user={user as User} />
      <SidebarInset className="relative z-10">
        <div className="sticky top-0 z-30 border-b drop-shadow-sm flex bg-background rounded-t w-full items-center">
          <SidebarTrigger className="m-4" />
          <Separator orientation="vertical" className="py-4 h-4 self-center" />
          <div className="flex-grow p-4 lg:px-8">
            {matches
              .filter((match) => match.handle && match.handle.header)
              .map((match, index) => (
                <div key={index} className="w-full">
                  {match.handle.header(match)}
                </div>
              ))}
          </div>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full [background-attachment:fixed] bg-white bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <main className="px-4 pb-8 lg:px-8 pt-2 z-20 relative h-full">
          <Outlet context={user} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
