import { EyeIcon, EyeOffIcon, LoaderCircle, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useIsMobile } from "~/hooks/use-mobile";
import { useFetcher } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";

import { useForm } from "~/hooks/use-form";
import { editUserFormSchema } from "../form/userFormSchema";
const defaultError = () => ({
  username: undefined,
  password: undefined,
  fullname: undefined,
  confirm: undefined,
});

interface EditUserFormSheetProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditUserFormSheet({
  user,
  isOpen,
  setIsOpen,
}: EditUserFormSheetProps) {
  const { fullname, username, id } = user;

  const { errors, handleSubmit, validate, setErrors } = useForm(editUserFormSchema);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setErrors(defaultError());
    }
    setIsOpen(isOpen);
  };
  const isMobile = useIsMobile();
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
      form.append("id", id.toString())
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
      checkUsernameFetcher.formData?.get("username") !== username &&
      setErrors((prev) => ({
        ...prev,
        slug: "Slug already exist",
      }));
  }, [checkUsernameFetcher.data]);

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        close={() => setOpen(false)}
      >
        <SheetHeader>
          <SheetTitle>Edit the User</SheetTitle>
          <SheetDescription>
            Edit the User here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <editFetcher.Form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span hidden={checkUsernameFetcher.state === "idle"}>
                  <LoaderCircle
                    strokeWidth={3}
                    className="absolute right-2 top-[6px] text-muted-foreground animate-spin"
                  />
                </span>
                <Input
                  name="username"
                  disabled={username === "admin"}
                  readOnly={username === "admin"}
                  defaultValue={username}
                  onChange={validate((username) => {
                    checkUsernameAvailability(username as string);
                  })}
                  placeholder="Username"
                />
              </div>
              {!!errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            <div>
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                name="fullname"
                defaultValue={fullname}
                onBlur={validate()}
                placeholder="Your Fullname"
              />
              {!!errors.fullname && (
                <p className="text-sm text-destructive">{errors.fullname}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="relative flex items-center">
                <Input
                  id="password"
                  name="password"
                  onBlur={validate()}
                  onChange={validate()}
                  placeholder="Your Password"
                  type={showPassword ? "text" : "password"}
                />
                {showPassword ? (
                  <EyeOffIcon
                    className="absolute right-3"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                ) : (
                  <EyeIcon
                    className="absolute right-3"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                )}
              </div>
              {!!errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirm">Confirm New Password</Label>
              <div className="relative flex items-center">
                <Input
                  name="confirm"
                  onBlur={validate()}
                  onChange={validate()}
                  placeholder="Confirm Your Password"
                  type={showConfirmPassword ? "text" : "password"}
                />
                {showConfirmPassword ? (
                  <EyeOffIcon
                    className="absolute right-3"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  />
                ) : (
                  <EyeIcon
                    className="absolute right-3"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  />
                )}
              </div>
              {!!errors.confirm && (
                <p className="text-sm text-destructive">{errors.confirm}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full mt-8" disabled={isDisabled}>
            <Save />
            Save User
          </Button>
        </editFetcher.Form>
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
