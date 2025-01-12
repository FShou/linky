import {
  defer,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Await, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";
import { Button } from "~/components/ui/button";
import { getSessionUser } from "~/lib/auth";
import { getAuthRepo } from "~/repo/auth-repo.server";
import { getLinkRepo } from "~/repo/link-repo.server";
import { getPageRepo } from "~/repo/pages-repo.server";
import PageCard from "../dashboard.pages/page-card";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LinkIcon, Newspaper, Plus } from "lucide-react";
import ShortlinkCard from "../dashboard.links/short-link-card";
import PageHeader from "~/components/ui/page-header";
import AddLink from "../dashboard.links/add-link-sheet";
import CardSkeleton from "~/components/ui/card-skeleton";
import ShareLinkDialog from "~/components/share-link-dialog";
import DeletePageDialog from "../dashboard.pages/delete-page-dialog";
import EditFormSheet from "../dashboard.links/edit-link-sheet";
import DeleteModal from "../dashboard.links/delete-link-dialog";
import EmptyList from "~/components/empty-list";

let userId: number;
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const linkRepo = getLinkRepo(context.cloudflare.env);
  const pageRepo = getPageRepo(context.cloudflare.env);
  const authRepo = getAuthRepo(context.cloudflare.env);

  const user = (await getSessionUser(authRepo, request)) as User;
  userId = user.id;

  if (userId == undefined) {
    redirect("/");
  }

  const totalLink = await linkRepo.getTotalLinksByUserId(userId);
  const totalPage = await pageRepo.getTotalPagesByUserId(userId);
  const recentLinks = linkRepo.getRecentLinksByUserId(userId);
  const recentPages = pageRepo.getRecentPagesByUserId(userId);

  return defer({
    totalLink,
    totalPage,
    recentLinks,
    recentPages,
  });
};

export const meta: MetaFunction = () => {
  return [{ title: "Linky - Home" }];
};

export const handle = {
  header: () => (
    <PageHeader
      title="Dashboard"
      subTitle="All info about your links and pages."
    />
  ),
};

export default function DashboardPage() {
  const { totalLink, totalPage, recentLinks, recentPages } =
    useLoaderData<typeof loader>();

  const [shareUrl, setShareUrl] = useState<
    { url: string; title: string } | undefined
  >(undefined);
  const [shareOpen, setShareOpen] = useState(false);

  const [editLink, setEditLink] = useState<Link | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);

  const [deletePageId, setDeletePageId] = useState<number | undefined>();
  const [deletePageOpen, setDeletePageOpen] = useState(false);

  const [deleteLinkId, setDeleteLinkId] = useState<number | undefined>();
  const [deleteLinkOpen, setDeleteLinkOpen] = useState(false);

  const togglePublishFetcher = useFetcher();
  const onTogglePublish = (pageId: number, published: boolean) => {
    const formData = new FormData();
    formData.append("id", pageId.toString());
    formData.append("published", published.toString());
    togglePublishFetcher.submit(formData, {
      method: "PATCH",
      action: "/dashboard/pages",
    });
  };

  const onPageShare = (page: Page) => {
    const url =
      "https://" + import.meta.env.VITE_DOMAIN_ORIGIN + `/p/${page.slug}`;
    setShareUrl({ url, title: page.title + " Page" });
    setShareOpen(true);
  };
  const onLinkShare = (link: Link) => {
    const url =
      "https://" + import.meta.env.VITE_DOMAIN_ORIGIN + `/${link.slug}`;
    setShareUrl({ url, title: link.title + " Link" });
    setShareOpen(true);
  };

  const handleEdit = (link: Link) => {
    setEditLink((_) => link);
    setEditOpen(true);
  };

  const handleDelete = (linkId: number) => {
    setDeleteLinkId(linkId);
    setDeleteLinkOpen(true);
  };
  return (
    <div className="space-y-6">
      <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-[calc(100vw-32px)]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLink}</div>
            <p className="text-xs text-muted-foreground">have been created.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPage}</div>
            <p className="text-xs text-muted-foreground">have been created.</p>
          </CardContent>
        </Card>{" "}
      </div>

      <div className="space-y-3 max-w-[calc(100vw-32px)]">
        <PageHeader title="Recent Links" subTitle="quick access here.">
          <AddLink />
        </PageHeader>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 lg:grid-cols-3">
          <Suspense
            fallback={Array.from({ length: 3 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          >
            <Await resolve={recentLinks}>
              {(links) =>
                links && links.length > 0 ? (
                  links.map((link) => (
                    <ShortlinkCard
                      key={link.id}
                      link={link}
                      handleEdit={handleEdit}
                      handleShare={onLinkShare}
                      handleDelete={handleDelete}
                    />
                  ))
                ) : (
                  <EmptyList message={"You don't have any link yet."} />
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="space-y-3 max-w-[calc(100vw-32px)]">
        <div>
          <PageHeader title="Recent Pages" subTitle="quick access here.">
            <Button asChild>
              <Link to={"/dashboard/pages/create"}>
                <Plus />
                <span className="hidden md:block">Add new Page</span>
              </Link>
            </Button>
          </PageHeader>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 lg:grid-cols-3 ">
          <Suspense
            fallback={Array.from({ length: 3 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          >
            <Await resolve={recentPages}>
              {(pages) =>
                pages && pages.length > 0 ? (
                  pages.map((page) => (
                    <PageCard
                      key={page.id}
                      page={page}
                      onShare={onPageShare}
                      onDelete={(id) => {
                        setDeletePageId(id);
                        setDeletePageOpen(true);
                      }}
                      onTogglePublish={onTogglePublish}
                    />
                  ))
                ) : (
                  <EmptyList message="You not have any page yet." />
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>

      {deletePageId && (
        <DeletePageDialog
          pageId={deletePageId}
          isOpen={deletePageOpen}
          setIsopen={(isOpen: boolean) => {
            setDeletePageOpen(isOpen);
            if (!isOpen)
              // This time out here to ensure animation done before it's unmounted
              setTimeout(() => {
                setDeletePageId(undefined);
              }, 300);
          }}
        />
      )}

      {editLink && (
        <EditFormSheet
          link={editLink}
          isOpen={editOpen}
          setIsOpen={(isOpen: boolean) => {
            setEditOpen(isOpen);
            if (!isOpen)
              // This time out here to ensure animation done before it's unmounted
              setTimeout(() => {
                setEditLink(undefined);
              }, 300);
          }}
        />
      )}

      {deleteLinkId && (
        <DeleteModal
          linkId={deleteLinkId}
          isOpen={deleteLinkOpen}
          setIsopen={(isOpen: boolean) => {
            setDeleteLinkOpen(isOpen);
            if (!isOpen)
              // This time out here to ensure animation done before it's unmounted
              setTimeout(() => {
                setDeleteLinkId(undefined);
              }, 300);
          }}
        />
      )}

      {shareUrl && (
        <ShareLinkDialog
          url={shareUrl.url}
          title={shareUrl.title}
          setOpen={(isOpen: boolean) => {
            setShareOpen(isOpen);
            if (!isOpen) {
              setTimeout(() => {
                setShareUrl(undefined);
              }, 300);
            }
          }}
          open={shareOpen}
        />
      )}
    </div>
  );
}
