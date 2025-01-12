import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "~/components/ui/sheet";
import { useIsMobile } from "~/hooks/use-mobile";
import { LinkForm } from "./link-form";
import { useFetchers } from "@remix-run/react";
import { useEffect } from "react";

interface EditFormSheetProps {
  link: Link;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditFormSheet({
  link,
  isOpen,
  setIsOpen,
}: EditFormSheetProps) {
  const isMobile = useIsMobile();

  const fetchers = useFetchers();
  useEffect(() => {
    // When submitting form close the Sheet
    if (fetchers[0]?.formAction === "/dashboard/links") {
      if (fetchers[0]?.state === "submitting") {
        setIsOpen(false);
      }
    }
  }, [fetchers[0]?.state]);
  return (
    <Sheet open={isOpen}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        close={() => setIsOpen(false)}
      >
        <SheetHeader>
          <SheetTitle>Edit the Link</SheetTitle>
          <SheetDescription>
            Edit your link here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <LinkForm link={link} />
        <Button
          variant={"ghost"}
          onClick={() => setIsOpen(false)}
          className="w-full mt-2"
        >
          Cancel
        </Button>
      </SheetContent>
    </Sheet>
  );
}
