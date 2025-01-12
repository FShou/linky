import {
  ActionFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import SearchBar from "~/components/search-bar";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";
import { getSessionUser } from "~/lib/auth";
import { DAY } from "~/lib/utils";
import { getAuthRepo } from "~/repo/auth-repo.server";
import { getPageRepo } from "~/repo/pages-repo.server";
import PageCard from "./page-card";
import DeletePageDialog from "./delete-page-dialog";
import ShareLinkDialog from "~/components/share-link-dialog";
import EmptyList from "~/components/empty-list";

let userId: number;
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const pageRepo = getPageRepo(context.cloudflare.env);
  const authRepo = getAuthRepo(context.cloudflare.env);

  const user = (await getSessionUser(authRepo, request)) as User;
  userId = user.id;

  if (userId == undefined) {
    return {
      ok: false,
    };
  }

  const formData = await request.formData();
  const slug = String(formData.get("slug"));
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const content = JSON.parse(String(formData.get("content"))) as PageContent;
  const published = Boolean(!!formData.get("published"));

  let id = null;
  if (formData.has("id")) id = Number(formData.get("id"));

  if (request.method === "PATCH") {
    if (!id) {
      return {
        ok: false,
      };
    }
    const published = String(formData.get("published")) === "true";
    const updatedPage = await pageRepo.setPublished(id, published);
    if (!!updatedPage) return { ok: true };
    else return { ok: false };
  }

  switch (request.method) {
    case "POST": {
      const newPage = await pageRepo.create({
        slug,
        title,
        content,
        published,
        description,
        userId,
      } as Page);
      if (!newPage) {
        return {
          ok: false,
        };
      }
      break;
    }
    case "PUT": {
      if (!id) {
        return {
          ok: false,
        };
      }
      const updatedPage = await pageRepo.update({
        id,
        slug,
        title,
        content,
        published,
        description,
        userId,
      } as Page);
      if (!updatedPage) {
        return { ok: false };
      }
      break;
    }
    case "DELETE": {
      if (!id) return { ok: false };
      await pageRepo.delete(id);
      break;
    }
  }

  return {
    ok: true,
  };
};

export const loader = async ({ request, context }: ActionFunctionArgs) => {
  const pageRepo = getPageRepo(context.cloudflare.env);
  const authRepo = getAuthRepo(context.cloudflare.env);

  const user = (await getSessionUser(authRepo, request)) as User;
  userId = user.id;

  if (userId == undefined) {
    redirect("/");
  }

  const pages = await pageRepo.getAllByUserId(userId);
  return pages;
};

export const meta: MetaFunction = () => {
  return [{ title: "Linky - Pages" }];
};

export const handle = {
  header: () => (
    <PageHeader title="Pages" subTitle="Your links in one page.">
      <Button asChild>
        <Link to={"/dashboard/pages/create"}>
          <Plus />
          <span className="hidden md:block">Add new Page</span>
        </Link>
      </Button>
    </PageHeader>
  ),
};

export default function PagesPage() {
  const data = useLoaderData<typeof loader>();

  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [shareUrl, setShareUrl] = useState<
    { url: string; title: string } | undefined
  >(undefined);
  const [shareOpen, setShareOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const [sortBy, setSortBy] = useState("");

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const filteredData = useMemo(() => {
    return data
      ?.filter(
        (it) =>
          it.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          it.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
        }
        return b.createdAt.getMilliseconds() - a.createdAt.getMilliseconds();
      })
      .filter((it) => {
        if (dateRange.from === undefined || dateRange.to === undefined) {
          return true;
        }
        if (dateRange.from && dateRange.to) {
          return (
            it.updatedAt >= dateRange.from &&
            it.updatedAt < new Date(dateRange.to.getTime() + DAY) // + 1 Day
          );
        }
      });
  }, [data, searchTerm, sortBy, dateRange]);

  const togglePublishFetcher = useFetcher();

  const onTogglePublish = useCallback((pageId: number, published: boolean) => {
    const formData = new FormData();
    formData.append("id", pageId.toString());
    formData.append("published", published.toString());
    togglePublishFetcher.submit(formData, {
      method: "PATCH",
      action: "/dashboard/pages",
    });
  }, []);

  const onShare = useCallback((page: Page) => {
    const url =
      "https://" + import.meta.env.VITE_DOMAIN_ORIGIN + `/p/${page.slug}`;
    setShareUrl({ url, title: page.title + " Page" });
    setShareOpen(true);
  }, []);

  return (
    <div>
      <SearchBar
        searchRef={searchRef}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        dateRange={dateRange}
        setDateRange={setDateRange}
        placeholder="Search your Page here (press '/' to focus)"
      />

      <AnimatePresence>
        <motion.div
          exit={{ opacity: 0 }}
          initial={{ y: 30, opacity: 0, height: 0 }}
          animate={{ y: 0, opacity: 1, height: "auto", width: "auto" }}
          layout
          className="w-full min-h-86 flex flex-col md:grid max-w-[calc(100vw-32px)]  md:grid-cols-2  lg:grid-cols-3 gap-4"
        >
          {filteredData &&
            filteredData.map((it) => {
              return (
                <PageCard
                  key={it.id}
                  onShare={onShare}
                  page={it}
                  onDelete={(id) => {
                    setDeleteId(id);
                    setDeleteOpen(true);
                  }}
                  onTogglePublish={onTogglePublish}
                />
              );
            })}
          {filteredData?.length === 0 && (
            <EmptyList message="You not have any page yet or try disable filter." />
          )}
        </motion.div>
      </AnimatePresence>

      {deleteId && (
        <DeletePageDialog
          pageId={deleteId}
          isOpen={deleteOpen}
          setIsopen={(isOpen: boolean) => {
            setDeleteOpen(isOpen);
            if (!isOpen)
              // This time out here to ensure animation done before it's unmounted
              setTimeout(() => {
                setDeleteId(undefined);
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
