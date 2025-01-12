import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useForm } from "~/hooks/use-form";
import { editUserFormSchema } from "../dashboard.users/form/userFormSchema";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2, UserIcon } from "lucide-react";
import { useFetcher } from "@remix-run/react";

const defaultError = () => ({
  username: undefined,
  password: undefined,
  fullname: undefined,
  confirm: undefined,
});

export default function EditUserDialog({ user }: { user: User }) {
  const [open, _setOpen] = useState(false);
  const { validate, errors, setErrors, handleSubmit } =
    useForm(editUserFormSchema);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setOpen = (open: boolean) => {
    _setOpen(open);
    setErrors(defaultError());
  };

  const checkUsernameFetcher = useFetcher();
  const editFetcher = useFetcher();
  const isDisabled =
    checkUsernameFetcher.state !== "idle" ||
    editFetcher.state === "submitting" ||
    !!errors.password ||
    !!errors.username ||
    !!errors.fullname;

  const checkUsernameAvailability = (username: string) => {
    const checkSlugForm = new FormData();
    checkSlugForm.append("username", username);
    checkUsernameFetcher.submit(checkSlugForm, {
      method: "POST",
      action: "/check-username",
    });
  };

  const onSubmit = (form: FormData) => {
    const password = String(form.get("password"));
    const confirm = String(form.get("confirm"));
    if (password === confirm) {
      setErrors(defaultError());
      setOpen(false);
      form.append("id", user.id.toString());
      editFetcher.submit(form, {
        method: "PUT",
        action: "/dashboard/users",
      });
    }

    setErrors((prev) => ({ ...prev, confirm: "Password doesn't match" }));
  };

  useEffect(() => {
    // @ts-ignore
    checkUsernameFetcher.data?.exists &&
      checkUsernameFetcher.formData?.get("username") !== user.username &&
      setErrors((prev) => ({
        ...prev,
        slug: "Slug already exist",
      }));
  }, [checkUsernameFetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={"sm"}
          className="w-full flex justify-between font-normal text-[14px] px-2"
        >
          Account
          <UserIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Make changes to your account. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-x-4">
              <Label htmlFor="fullname" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                defaultValue={user.fullname}
                onChange={validate()}
                className="col-span-3"
              />
              <div className="col-span-1"></div>
              {!!errors.fullname && (
                <span className="col-span-3 text-destructive text-sm">
                  {errors.fullname}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-x-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                defaultValue={user.username}
                onChange={validate((username) => {
                  checkUsernameAvailability(username as string);
                })}
                className="col-span-3"
              />
              <div className="col-span-1"></div>
              {!!errors.username && (
                <span className="col-span-3 text-destructive text-sm">
                  {errors.username}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-x-4">
              <Label htmlFor="password" className="text-right">
                New Password
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="password"
                  name="password"
                  placeholder="New Password"
                  onChange={validate()}
                  type={showPassword ? "text" : "password"}
                />
                {showPassword ? (
                  <EyeOffIcon
                    className="absolute top-1.5 right-3"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                ) : (
                  <EyeIcon
                    className="absolute top-1.5 right-3"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                )}
              </div>
              <div className="col-span-1"></div>
              {!!errors.password && (
                <span className="col-span-3 text-destructive text-sm">
                  {errors.password}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-x-4">
              <Label htmlFor="confirm" className="text-right">
                Confirm Password
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="confirm"
                  name="confirm"
                  placeholder="Confirm Password"
                  onChange={validate()}
                  className="col-span-3"
                  type={showConfirmPassword ? "text" : "password"}
                />
                {showConfirmPassword ? (
                  <EyeOffIcon
                    className="absolute top-1.5 right-3"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  />
                ) : (
                  <EyeIcon
                    className="absolute top-1.5 right-3"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  />
                )}
              </div>
              <div className="col-span-1"></div>
              {!!errors.confirm && (
                <span className="col-span-3 text-destructive text-sm">
                  {errors.confirm}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isDisabled}>
              {editFetcher.state !== "idle" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
