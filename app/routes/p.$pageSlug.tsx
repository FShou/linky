import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { ExternalLink } from "lucide-react";
import { Card } from "~/components/ui/card";
import { isLinkContent } from "~/lib/utils";
import { getPageRepo } from "~/repo/pages-repo.server";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const slug = String(params.pageSlug);

  const pageRepo = getPageRepo(context.cloudflare.env);

  const page = await pageRepo.getPublishedBySlug(slug);
  if (!page) {
    throw new Response("Not Found", { status: 404 });
  }
  return page;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.title + " - Page";
  const description = data?.description;
  return [
    {
      title,
    },
    {
      name: "description",
      content: description,
    },
    {
      property: "og:description",
      content: description,
    },
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
    }
  ];
};

export default function PagePublicPage() {
  const page = useLoaderData<typeof loader>();

  return (
    <div className="relative z-20 min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background-attachment:fixed] bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="mx-auto max-w-2xl">
        <div className="space-y-6 py-8">
          <header className="flex flex-col items-center max-w-[100-vw] justify-center">
            <span className="text-4xl  w-full lg:tracking-wide  text-center font-black bg-gradient-to-r from-primary/90 to-red-900 text-transparent bg-clip-text">
              {page.title}
            </span>
            <span className="text-center text-muted-foreground">
              {page.description}
            </span>
          </header>

          {/* Links Section */}
          <div>
            {page.content &&
              page.content.map((item, index) =>
                isLinkContent(item) ? (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block no-underline mt-2 hover:scale-[1.01] duration-300"
                  >
                    <Card className="p-4  active:scale-[1] hover:text-red-900 duration-300 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.title}</span>
                        <ExternalLink className="size-4" />
                      </div>
                    </Card>
                  </a>
                ) : (
                  <div key={index} className="mt-8">
                    <h2 className="text-lg font-semibold mb-1 leading-5">
                      {item.title}
                    </h2>
                    <div className="w-full h-1 bg-gradient-to-r from-primary/90 to-red-900 rounded-full" />
                  </div>
                )
              )}
          </div>

          {/* Footer */}
          <footer className="text-center text-sm text-muted-foreground">
            <p>
              Last updated:{" "}
              {new Intl.DateTimeFormat("id").format(page.updatedAt)}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
