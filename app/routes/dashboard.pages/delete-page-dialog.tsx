import { useFetcher } from "@remix-run/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

interface DeleteModalProps {
  pageId: number;
  isOpen?: boolean;
  setIsopen: (isOpen: boolean) => void;
}

export default function DeletePageDialog({
  pageId,
  setIsopen,
  isOpen,
}: DeleteModalProps) {
  const deleteFetcher = useFetcher();

  const setOpen = (isOpen: boolean) => {
    setIsopen(isOpen);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", pageId.toString());
    deleteFetcher.submit(formData, {
      action: "/dashboard/pages",
      method: "DELETE",
    });
    setOpen(false)
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your page
            and remove your data from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            asChild
          >
            <Button onClick={handleDelete} variant={"destructive"}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
