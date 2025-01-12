import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useIsMobile } from "~/hooks/use-mobile";
import { useFetchers } from "@remix-run/react";
import { useEffect, useState } from "react";
import { LinkForm } from "./link-form";

interface LinkFormSheetProps {}

export default function AddLink({}: LinkFormSheetProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const fetchers = useFetchers();
  useEffect(() => {
    // When submitting form close the Sheet
    if (fetchers[0]?.formAction === "/dashboard/links") {
      if (fetchers[0]?.state === "submitting") {
        setOpen(false);
      }
    }
  }, [fetchers[0]?.state]);

  return (
    <Sheet open={open}>
      <SheetTrigger asChild>
        <Button className="ml-auto" onClick={() => setOpen(true)}>
          <PlusIcon />
          <span className="hidden md:block">Add new Link</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        close={() => setOpen(false)}
      >
        <SheetHeader>
          <SheetTitle>Add a new Link</SheetTitle>
          <SheetDescription>
            Create your link here. Click add to save it when you're done.
          </SheetDescription>
        </SheetHeader>
        <LinkForm />
        <Button
          variant={"ghost"}
          onClick={() => setOpen(false)}
          className="w-full mt-2"
        >
          Cancel
        </Button>
      </SheetContent>
    </Sheet>
  );
}
