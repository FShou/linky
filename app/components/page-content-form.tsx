import { DragDropProvider } from "@dnd-kit/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { isLinkContent } from "~/lib/utils";
import LinkContentFormInput from "./link-content-form-input";
import TitleContentFormInput from "./title-content-form-input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  linkItemForm,
  pageContentForm,
  titleItemForm,
} from "~/routes/dashboard.pages/pages-form";
import { ChangeEvent, useState } from "react";

interface PageContentFormProps {
  content: PageContent;
  setContent: React.Dispatch<React.SetStateAction<PageContent>>;
  formRef: React.RefObject<HTMLFormElement>;
  finalValidateSuccess: () => void;
}

const linkErrorDefault = () => ({
  title: "",
  url: "",
});

const titleErrorDefault = () => ({
  title: "",
});

export default function PageContentForm({
  content,
  setContent,
  formRef,
  finalValidateSuccess,
}: PageContentFormProps) {
  const [contentErrors, setContentErrors] = useState<PageContent>([]);


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
      item = { title: "", url: "" } as LinkContent;
      setContentErrors((prev) => [...prev, linkErrorDefault()]);
    }
    if (type === "title") {
      item = { title: "" } as TitleContent;
      setContentErrors((prev) => [...prev, titleErrorDefault()]);
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
    if (target && source !== target) {
      const updatedContent = [...content];
      const [movedItem] = updatedContent.splice(source, 1);
      updatedContent.splice(target, 0, movedItem);
      const updatedContentErrors = [...contentErrors];
      const [movedItemError] = updatedContent.splice(source, 1);
      updatedContentErrors.splice(target, 0, movedItemError);

      setContent(updatedContent);
      setContentErrors(updatedContentErrors);
    }
  };

  return (
    <Card className="max-w-[100vw-16px]">
      <CardHeader className="text-center pb-4">
        <CardTitle>Page Content</CardTitle>
        <CardDescription>Modify page content here.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6 max-w-[calc(100vw-16px)]">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
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
              finalValidateSuccess();
          }}
          className="space-y-3"
        >
          <DragDropProvider
            onDragEnd={(e) => {
              handleDragEnd(
                e.operation.source?.id as number,
                e.operation.target?.id as number
              );
            }}
          >
            {content.map((it, idx) => {
              if (isLinkContent(it)) {
                return (
                  <LinkContentFormInput
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
              <div className="w-full text-muted-foreground text-center h-32 flex items-center justify-center">
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
  );
}
