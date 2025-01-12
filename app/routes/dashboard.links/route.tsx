import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { getSessionUser } from "~/lib/auth";
import { getAuthRepo } from "~/repo/auth-repo.server";
import { getLinkRepo } from "~/repo/link-repo.server";
import AddLink from "./add-link-sheet";
import EditFormSheet from "./edit-link-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DeleteModal from "./delete-link-dialog";
import ShareLinkDialog from "~/components/share-link-dialog";
import { DAY } from "~/lib/utils";
import ShortlinkCard from "./short-link-card";
import PageHeader from "~/components/ui/page-header";
import SearchBar from "~/components/search-bar";
import EmptyList from "~/components/empty-list";

let userId: number;
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const method = request.method;
  const linkRepo = getLinkRepo(context.cloudflare.env);
  const authRepo = getAuthRepo(context.cloudflare.env);

  const user = (await getSessionUser(authRepo, request)) as User;
  userId = user.id;

  if (userId == undefined) {
    return {
      ok: false,
    };
  }

  const formData = await request.formData();
  const link = String(formData.get("link"));
  const title = String(formData.get("title"));
  const slug = String(formData.get("slug"));
  let id = null;
  if (formData.has("id")) id = Number(formData.get("id"));

  const newLink = {
    id,
    link,
    title,
    slug,
    userId,
  } as Link;

  switch (method) {
    case "POST": {
      const createdLink = await linkRepo.create(newLink);
      if (!createdLink) {
        return { ok: false };
      }
      break;
    }
    case "PUT": {
      const updatedLink = await linkRepo.update(newLink as Link);
      if (!updatedLink) {
        return { ok: false };
      }
      break;
    }
    case "DELETE": {
      await linkRepo.delete(id as number);
      break;
    }
  }

  return { ok: true };
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const linkRepo = getLinkRepo(context.cloudflare.env);
  const authRepo = getAuthRepo(context.cloudflare.env);
  const user = (await getSessionUser(authRepo, request)) as User;
  userId = user.id;

  if (userId == undefined) {
    redirect("/");
  }
  const links = await linkRepo.getAllByUserId(userId);

  return links;
};

export const meta: MetaFunction = () => {
  return [{ title: "Linky - Links" }];
};

export const handle = {
  header: () => (
    <PageHeader title="Links" subTitle="Shorten & manage your link.">
      <AddLink />
    </PageHeader>
  ),
};

export default function LinksPage() {
  const data = useLoaderData<typeof loader>();
  const origin = import.meta.env.VITE_DOMAIN_ORIGIN ?? "";

  const [editLink, setEditLink] = useState<Link | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);

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

  const handleShare = useCallback((link: Link) => {
    const { slug } = link;
    const url = "https://" + origin + `/${slug}`;
    setShareUrl({ url, title: link.title + " Link" });
    setShareOpen(true);
  }, []);

  const handleEdit = useCallback((link: Link) => {
    setEditLink((_) => link);
    setEditOpen(true);
  }, []);

  const handleDelete = useCallback((linkId: number) => {
    setDeleteId(linkId);
    setDeleteOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!(document.activeElement instanceof HTMLInputElement)) {
        if (e.key === "/" && document.activeElement !== searchRef.current) {
          e.preventDefault();
          searchRef.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
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
        placeholder="Search your link here (press '/' to focus)"
      />

      {/* shorlink cards */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 30, opacity: 0, height: 0 }}
          animate={{ y: 0, opacity: 1, height: "auto", width: "auto" }}
          exit={{ opacity: 0 }}
          layout
          className="w-full min-h-56 flex flex-col md:grid max-w-[calc(100vw-32px)] md:grid-cols-2  lg:grid-cols-3 gap-4 "
        >
          {filteredData &&
            filteredData.length > 0 &&
            filteredData.map((it) => {
              return (
                <ShortlinkCard
                  key={it.id}
                  handleShare={() => handleShare(it)}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  link={it}
                />
              );
            })}
          {filteredData?.length === 0 && (
            <EmptyList message="You don't have any link yet or try disable filter." />
          )}
        </motion.div>
      </AnimatePresence>

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

      {deleteId && (
        <DeleteModal
          linkId={deleteId}
          isOpen={deleteOpen}
          setIsopen={(isOpen: boolean) => {
            setDeleteOpen(isOpen);
            if (!isOpen)
              // This time out here to ensure animation done before it's unmounted
              setTimeout(() => {
                setEditLink(undefined);
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
