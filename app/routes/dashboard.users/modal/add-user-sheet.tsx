import { EyeIcon, EyeOffIcon, LoaderCircle, PlusIcon } from "lucide-react";
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
import { useFetcher } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
// @ts-ignore
import _ from "lodash";
import { useForm } from "~/hooks/use-form";
import { userFormSchema } from "../form/userFormSchema";

const defaultError = () => ({
  username: undefined,
  password: undefined,
  fullname: undefined,
  confirm: undefined,
});

export default function AddUser() {
  const [open, _setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { errors, handleSubmit, validate, setErrors } = useForm(userFormSchema);

  const checkUsernameFetcher = useFetcher();
  const addFetcher = useFetcher();
  const isAddDisable =
    checkUsernameFetcher.state !== "idle" ||
    addFetcher.state === "submitting" ||
    !!errors.password ||
    !!errors.username ||
    !!errors.fullname;

  const setOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setErrors(defaultError());
    }
    _setOpen(isOpen);
  };

  const checkUsernameAvailablilty = (username: string) => {
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
      addFetcher.submit(form, {
        method: "POST",
        action: "/dashboard/users",
      });
    }

    setErrors((prev) => ({ ...prev, confirm: "Password doesn't match" }));
  };

  useEffect(() => {
    // @ts-ignore
    checkUsernameFetcher.data?.exists &&
      setErrors((prev) => ({
        ...prev,
        username: "Username already exist",
      }));
  }, [checkUsernameFetcher.data]);

  return (
    <Sheet open={open}>
      <SheetTrigger asChild>
        <Button className="ml-auto" onClick={() => setOpen(true)}>
          <PlusIcon />
          <span className="hidden md:block">Add new User</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        close={() => setOpen(false)}
      >
        <SheetHeader>
          <SheetTitle>Add a new User</SheetTitle>
          <SheetDescription>
            Create new user here. Click add to save it when you're done.
          </SheetDescription>
        </SheetHeader>
        <addFetcher.Form method="POST" onSubmit={handleSubmit(onSubmit)}>
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
                  onChange={validate((username) => {
                    checkUsernameAvailablilty(username as string);
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
                onBlur={validate()}
                placeholder="Your Fullname"
              />
              {!!errors.fullname && (
                <p className="text-sm text-destructive">{errors.fullname}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
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
              <Label htmlFor="confirm">Confirm Password</Label>
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
          <Button type="submit" className="w-full mt-8" disabled={isAddDisable}>
            <PlusIcon />
            Add new User
          </Button>
        </addFetcher.Form>
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
