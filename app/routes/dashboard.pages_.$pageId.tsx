import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { LoaderCircle, Plus, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import PageHeader from "~/components/ui/page-header";
import { useForm } from "~/hooks/use-form";
import {
  linkItemForm,
  pageContentForm,
  pageFormSchema,
  titleItemForm,
} from "./dashboard.pages/pages-form";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { isLinkContent } from "~/lib/utils";
import LinkContentFormInput from "~/components/link-content-form-input";
import TitleContentFormInput from "~/components/title-content-form-input";
import { DragDropProvider } from "@dnd-kit/react";
import { getPageRepo } from "~/repo/pages-repo.server";
import { getAuthRepo } from "~/repo/auth-repo.server";
import { getSessionUser } from "~/lib/auth";
import { Switch } from "~/components/ui/switch";

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const id = Number(params.pageId);

  const pageRepo = getPageRepo(context.cloudflare.env);
  const authRepo = getAuthRepo(context.cloudflare.env);

  const user = (await getSessionUser(authRepo, request)) as User;
  const userId = user.id;

  const page = await pageRepo.getByIdAndUserId(id, userId);
  if (!page) {
    throw new Response("Not Found", { status: 404 });
  }
  return page;
};

export const meta: MetaFunction = () => {
  return [{ title: "Linky - Edit Page" }];
};


export const handle = {
  header: () => (
      <PageHeader title="Edit Page" subTitle="Edit your page here">
      <Button
        onClick={() => {
          const form = document.getElementById("page-form") as HTMLFormElement
          form.requestSubmit()
        }}
      >
        <Save />
        <span className="hidden md:block">Save Page</span>
      </Button>
    </PageHeader>
  ),
};

const linkErrorDefault = () => ({
  title: "",
  url: "",
} as LinkContent);

const titleErrorDefault = () => ({
  title: "",
} as TitleContent);

const contentErrorsDefault = (content: PageContent) => {
  const result = [];
  for (const item of content) {
    if (isLinkContent(item)) result.push(linkErrorDefault());
    else result.push(titleErrorDefault());
  }
  return result;
};

export default function EditPagesPage() {
  const page: Page = useLoaderData<typeof loader>();

  const [content, setContent] = useState<PageContent>(page.content ?? []);

  const [contentErrors, setContentErrors] = useState<PageContent>(
    page.content ? contentErrorsDefault(page.content) : []
  );

  const {
    errors: pageDataerrors,
    setErrors: setPageErrors,
    validate: validatePageData,
    handleSubmit,
  } = useForm(pageFormSchema);

  const pageDataFormRef = useRef<HTMLFormElement>(null);
  const pageContentFormRef = useRef<HTMLFormElement>(null);

  const navigate = useNavigate();

  const checkSlugFetcher = useFetcher();
  const addPageFetcher = useFetcher();
  const checkSlugAvailablilty = (slug: string) => {
    if (slug === page.slug) return;
    const checkSlugForm = new FormData();
    checkSlugForm.append("slug", slug);
    checkSlugFetcher.submit(checkSlugForm, {
      method: "POST",
      action: "/check-page-slug",
    });
  };

  const validateContentItemField = (
    idx: number,
    contentItem: ContentItem,
    name: string
  ) => {
    let schema;
    if (isLinkContent(contentItem)) {
      schema = linkItemForm;
    } else {
      schema = titleItemForm;
    }
    //@ts-ignore
    const fieldSchema = schema.shape[name];
    //@ts-ignore
    const result = fieldSchema.safeParse(contentItem[name]);
    const error = result.success ? "" : result.error.issues[0].message;
    setContentErrors((prev) => {
      const updatedError = [...prev];
      //@ts-ignore
      updatedError[idx][name] = error;
      return updatedError;
    });
  };

  const handleContentChange = (
    idx: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    // Handle validation
    setContent((prev) => {
      const updatedContent = [...prev];
      // @ts-ignore
      updatedContent[idx][e.target.name] = e.target.value;
      validateContentItemField(idx, updatedContent[idx], e.target.name);
      return updatedContent;
    });
  };

  const addContentItem = (type: "link" | "title") => {
    let item: ContentItem;
    if (type === "link") {
      item = { title: "", url: "", id: crypto.randomUUID() } as LinkContent;
      setContentErrors((prev) => [...prev, linkErrorDefault() as LinkContent]);
    }
    if (type === "title") {
      item = { title: "", id: crypto.randomUUID() } as TitleContent;
      setContentErrors((prev) => [
        ...prev,
        titleErrorDefault() as TitleContent,
      ]);
    }

    setContent((prev) => [...prev, item]);
  };

  const deleteContentItem = (idx: number) => {
    setContent((prev) => {
      const updatedContent = [...prev];
      updatedContent.splice(idx, 1);
      return updatedContent;
    });
    setContentErrors((prev) => {
      const updatedContent = [...prev];
      updatedContent.splice(idx, 1);
      return updatedContent;
    });
  };

  const handleDragEnd = (source: number, target: number) => {
    if (source !== target) {
      setContent((prev) => {
        const updatedContent = [...prev];
        const [movedItem] = updatedContent.splice(source, 1);
        updatedContent.splice(target, 0, movedItem);
        return updatedContent;
      });

      setContentErrors((prev) => {
        const updatedContentErrors = [...prev];
        const [movedItemError] = updatedContentErrors.splice(source, 1);
        updatedContentErrors.splice(target, 0, movedItemError);
        return updatedContentErrors;
      });
    }
  };

  const onSubmit = (formData: FormData) => {
    const pageContent = JSON.stringify(content);
    const result = pageContentForm.safeParse(content);
    if (!result.success) {
      for (const error of result.error.errors) {
        setContentErrors((prev) => {
          const updatedError = [...prev];
          //@ts-ignore
          updatedError[error.path[0]][error.path[1]] = error.message;
          return updatedError;
        });
      }
      return;
    }
    formData.append("content", pageContent);
    formData.append("id", page.id.toString());
    addPageFetcher.submit(formData, {
      method: "PUT",
      action: "/dashboard/pages",
    });
    navigate(-1);
  };

  useEffect(() => {
    // @ts-ignore
    checkSlugFetcher.data?.exists &&
      setPageErrors((prev) => ({
        ...prev,
        slug: "Slug already exist",
      }));
  }, [checkSlugFetcher.data]);

  return (
    <div>
      <div className="flex flex-col items-center w-full -destructive">
        <div className="flex flex-col gap-y-4 w-full max-w-screen-md">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle>Page Data</CardTitle>
              <CardDescription>The page data here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="page-form" ref={pageDataFormRef} onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2 mb-2">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      name="title"
                      defaultValue={page.title}
                      onBlur={validatePageData()}
                      onChange={validatePageData()}
                      placeholder="Title for your link"
                    />
                    {!!pageDataerrors.title && (
                      <p className="text-sm text-destructive">
                        {pageDataerrors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slug">Page Slug</Label>
                    <div className="relative">
                      <span hidden={checkSlugFetcher.state === "idle"}>
                        <LoaderCircle
                          strokeWidth={3}
                          className="absolute right-2 top-[6px] text-muted-foreground animate-spin"
                        />
                      </span>
                      <Input
                        name="slug"
                        defaultValue={page.slug}
                        onChange={validatePageData((slug) => {
                          checkSlugAvailablilty(slug as string);
                        })}
                        placeholder="e.g., 'free-guide' (appears as pc.d/free-guide)"
                      />
                    </div>
                    {!!pageDataerrors.slug && (
                      <p className="text-sm text-destructive">
                        {pageDataerrors.slug}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      name="description"
                      defaultValue={page.description ?? ""}
                      onBlur={validatePageData()}
                      onChange={validatePageData()}
                      placeholder="Description for the page"
                    />
                    {!!pageDataerrors.description && (
                      <p className="text-sm text-destructive">
                        {pageDataerrors.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium">Published</span>
                    <Switch
                      name="published"
                      defaultChecked={page.published}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>


          <Card className="max-w-[100vw-16px]">
            <CardHeader className="text-center pb-4">
              <CardTitle>Page Content</CardTitle>
              <CardDescription>Modify page content here.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6 max-w-[calc(100vw-16px)]">
              <form ref={pageContentFormRef} className="space-y-3">
                <DragDropProvider
                  onDragEnd={(event) => {
                    const { 
                      previousIndex,
                      initialIndex
                      // @ts-ignore
                    } = event.operation.source.sortable;
                    handleDragEnd(initialIndex, previousIndex);
                  }}
                >
                  {content.map((it, idx) => {
                    if (isLinkContent(it)) {
                      return (
                        <LinkContentFormInput
                          key={it.id}
                          id={it.id}
                          idx={idx}
                          title={it.title}
                          url={it.url}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            handleContentChange(idx, e);
                          }}
                          onDelete={() => {
                            deleteContentItem(idx);
                          }}
                          errors={contentErrors[idx] as LinkContent}
                        />
                      );
                    }
                    return (
                      <TitleContentFormInput
                        key={it.id}
                        id={it.id}
                        idx={idx}
                        title={it.title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          handleContentChange(idx, e);
                        }}
                        onDelete={() => {
                          deleteContentItem(idx);
                        }}
                        errors={contentErrors[idx] as TitleContent}
                      />
                    );
                  })}
                  {content.length === 0 && (
                    <div className="w-full text-muted-foreground text-center border-2 border-dashed rounded-md h-32 flex items-center justify-center">
                      <span>Nothing here yet. add some content</span>
                    </div>
                  )}
                </DragDropProvider>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                variant={"ghost"}
                className="ml-auto"
                onClick={() => {
                  addContentItem("title");
                }}
              >
                <Plus />
                <span> Add Title </span>
              </Button>
              <Button
                variant={"ghost"}
                className="ml-2"
                onClick={() => {
                  addContentItem("link");
                }}
              >
                <Plus />
                <span> Add Link</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
