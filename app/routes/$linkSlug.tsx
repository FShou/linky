import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { getLinkRepo } from "~/repo/link-repo.server";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const linkRepo = getLinkRepo(context.cloudflare.env);
  const slug = params.linkSlug;
  if (!slug) throw new Response("Not Found", { status: 404 });
  const link = await linkRepo.getBySlug(slug.toString());
  if (!link) throw new Response("Not Found", { status: 404 });

  return link;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.title + " - Link";
  return [
    { title },
    {
      property: "og:image",
      content: `https://${import.meta.env.VITE_DOMAIN_ORIGIN}/preview-wa.png`,
    },
    {
      name: "twitter:image",
      content: `https://${import.meta.env.VITE_DOMAIN_ORIGIN}/preview-tw.png`,
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
  ];
};

export default function RedirectPage() {
  const data = useLoaderData<typeof loader>();
  const link = data.link;

  useEffect(() => {
    window.location.href = link;
  }, []);

  return (
    <div className="relative z-20 min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-muted to-white">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="-mt-[100px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
            <div className="w-16 h-16 relative">
              <Loader2 className="w-16 h-16 text-red-900 animate-spin" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Redirecting you
            </h1>
            <p className="text-gray-500 text-center">
              Please wait while we redirect you to your destination...
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-center w-full">
              <a
                href={data.link}
                className="text-red-900/80 hover:text-red-900 mt-32 "
              >
                {" "}
                Clik here
              </a>{" "}
              if you not redirected.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
