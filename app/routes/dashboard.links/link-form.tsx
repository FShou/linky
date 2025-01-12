import { useFetcher } from "@remix-run/react";
import { LoaderCircle, PlusIcon, SaveIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { linkFormSchema } from "./link-form-schema";
import { useForm } from "~/hooks/use-form";

function useCheckLinkSlug() {
  const checkSlugFetcher = useFetcher();

  const checkSlugAvailablilty = useCallback((slug: string) => {
    const checkSlugForm = new FormData();
    checkSlugForm.append("slug", slug);
    checkSlugFetcher.submit(checkSlugForm, {
      method: "POST",
      action: "/check-slug",
    });
  }, []);

  return {
    linkSlugFetchState: checkSlugFetcher.state,
    linkSlugResponse: checkSlugFetcher.data,
    checkSlugAvailablilty,
  };
}

const defaultError = () => ({
  link: undefined,
  title: undefined,
  slug: undefined,
});

interface LinkFormProps {
  link?: Link;
}

export const LinkForm = ({ link }: LinkFormProps) => {
  const { errors, handleSubmit, validate, setErrors } = useForm(linkFormSchema);
  const { linkSlugFetchState, linkSlugResponse, checkSlugAvailablilty } =
    useCheckLinkSlug();
  const linkMutator = useFetcher();

  const isAddDisable =
    linkSlugFetchState !== "idle" ||
    linkMutator.state === "submitting" ||
    Object.values(errors).some((error) => error);

  const onSubmit = useCallback((form: FormData) => {
    if (!link) {
      linkMutator.submit(form, {
        method: "POST",
        action: "/dashboard/links",
      });
    } else {
      form.append("id", link.id.toString());
      linkMutator.submit(form, {
        method: "PUT",
        action: "/dashboard/links",
      });
    }
  }, []);

  useEffect(() => {
    if (linkMutator.state === "loading") {
      setErrors(defaultError);
    }
  }, [linkMutator.state]);

  useEffect(() => {
    // @ts-ignore
    linkSlugResponse?.exists &&
      setErrors((prev) => ({
        ...prev,
        slug: "Slug already exist",
      }));
  }, [linkSlugResponse]);
  return (
    <linkMutator.Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <div>
          <Label htmlFor="link">Link</Label>
          <Input
            name="link"
            defaultValue={link?.link}
            onBlur={validate()}
            placeholder="Your link, e.g: https://www.google.com"
          />
          {!!errors.link && (
            <p className="text-sm text-destructive">{errors.link}</p>
          )}
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            onBlur={validate()}
            defaultValue={link?.title}
            placeholder="Title for your link"
          />
          {!!errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>
        <div>
          <Label htmlFor="slug">Shortlink Slug</Label>
          <div className="relative">
            <span hidden={linkSlugFetchState === "idle"}>
              <LoaderCircle
                strokeWidth={3}
                className="absolute right-2 top-[6px] text-muted-foreground animate-spin"
              />
            </span>
            <Input
              name="slug"
              defaultValue={link?.slug}
              onChange={validate((slug) => {
                if (slug === link?.slug) {
                  return;
                }
                checkSlugAvailablilty(slug as string);
              })}
              placeholder="e.g., 'free-guide' (appears as pc.d/free-guide)"
            />
          </div>
          {!!errors.slug && (
            <p className="text-sm text-destructive">{errors.slug}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full mt-8" disabled={isAddDisable}>
        {!link && (
          <>
            <PlusIcon />
            Add new Link
          </>
        )}
        {link && (
          <>
            <SaveIcon />
            Save Link
          </>
        )}
      </Button>
    </linkMutator.Form>
  );
};
