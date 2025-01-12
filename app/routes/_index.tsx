import {
  json,
  LoaderFunctionArgs,
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { CheckIcon, EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { getAuthRepo } from "~/repo/auth-repo.server";
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
import { commitSession, getSession } from "~/session";
import Logo from "~/components/Logo";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const authRepo = getAuthRepo(context.cloudflare.env);
  const formData = await request.formData();
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  const sessionCookie = await getSession(request.headers.get("Cookie"));

  const session = await authRepo.login(username, password);
  if (!session) {
    sessionCookie.flash("error", "Invalid username or password");
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(sessionCookie),
      },
    });
  }

  sessionCookie.set("sessionToken", session.session_token as string);

  return redirect("/dashboard/home", {
    headers: {
      "Set-Cookie": await commitSession(sessionCookie),
    },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("sessionToken")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/dashboard/home");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const meta: MetaFunction = () => {
  return [{ title: "Linky - Login" }];
};

export default function Index() {
  const { error } = useLoaderData<typeof loader>();
  const [showPassword, setShowPassword] = useState(false);
  const { state: fetchState, location } = useNavigation();

  return (
    <div className="flex  md:flex-row h-[100dvh] items-center justify-center">
      <div className="hidden lg:flex basis-1/4 lg:basis-1/2 p-2 flex-col  size-full text-primary-foreground">
        <div className="p-6 rounded-xl size-full flex bg-primary ">
          <div className="hidden lg:block  mt-auto">
            <p className="font-semibold text-lg ">
              Linky crafted for managing your links
            </p>
            <p className="text-sm">by F.Shou</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center items-center gap-6 grow p-4 lg:p-8">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="flex flex-col justify-center items-center -mt-[80px] text-center">
          <Logo size={48} />
          <h1 className="mt-4 font-bold text-3xl">Welcome to Linky</h1>
          <p className="text-muted-foreground">
            Shorten and manage your links with ease.
          </p>
        </div>
        <Card className="md:w-[500px]">
          <CardHeader>
            <CardTitle className="text-lg text-center">
              Sign In to your account
            </CardTitle>
            <CardDescription className="text-sm text-center">
              To continue using the app you must be Signed In.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Your username"
                  type="text"
                  disabled={fetchState === "submitting"}
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Your Password"
                    type={showPassword ? "text" : "password"}
                    disabled={fetchState === "submitting"}
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
              </div>
              <Button
                size={"lg"}
                className="w-full font-semibold mt-3"
                type="submit"
                disabled={fetchState === "submitting"}
              >
                {fetchState === "idle" && "Sign In"}
                {fetchState === "submitting" && (
                  <>
                    <LoaderCircleIcon
                      strokeWidth={4}
                      className="animate-spin"
                    />
                    Signing In
                  </>
                )}
                {fetchState === "loading" && location.pathname !== "/" && (
                  <>
                    <CheckIcon strokeWidth={4} />
                    Success
                  </>
                )}
                {fetchState === "loading" && location.pathname === "/" && (
                  <>Sign In</>
                )}
              </Button>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            {error && fetchState === "idle" && (
              <p className="self-start text-sm mx-1 text-destructive">
                {error}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
