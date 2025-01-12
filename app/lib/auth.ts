import { redirect } from "@remix-run/cloudflare";
import { commitSession, destroySession, getSession } from "~/session";

export async function getSessionUser(authRepo: IAuthRepository,request: Request<unknown, CfProperties<unknown>>){
  const sessionCookie = await getSession(request.headers.get("Cookie"));
  const sessionToken = sessionCookie.get("sessionToken");
  const session = await authRepo.getSession(sessionToken ?? "");
  if (!session) {
    sessionCookie.flash("error", "You are not logged in");
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(sessionCookie),
      },
    });
  }
  const isSessionValid = session.expiresAt >= new Date(Date.now());
  if (!isSessionValid) {
    sessionCookie.flash("error", "Your session is expires");
    await authRepo.deleteSession(sessionCookie.get("sessionToken") ?? "");
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(sessionCookie),
      },
    });
  }
  const user = session.user;
  return user;
}
