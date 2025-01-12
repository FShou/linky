import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
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
import { toast } from "~/hooks/use-toast";

interface DeleteUserDialogProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DeleteUserDialog({
  user,
  isOpen,
  setIsOpen,
}: DeleteUserDialogProps) {
  const deleteFetcher = useFetcher();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", user.id.toString());
    deleteFetcher.submit(formData, {
      method: "DELETE",
      action: "/dashboard/users",
    });
    setIsOpen(false);
  };

  useEffect(()=>{
    if(user.username === "admin"){
      toast({
        title: "Warning",
        description: "admin user cannot be deleted.",
        variant: "destructive"
      })
      setIsOpen(false)
    }
  },[user])

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the User 
            and remove associated data from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
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
  );
}
