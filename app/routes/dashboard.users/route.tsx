import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";
import { Separator } from "~/components/ui/separator";
import { getSessionUser } from "~/lib/auth";
import { getAuthRepo } from "~/repo/auth-repo.server";
import { DataTable } from "./user-table";
import { columns } from "./user-column";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-row-action";
import AddUser from "./modal/add-user-sheet";
import { useState } from "react";
import DeleteUserDialog from "./modal/delete-user-dialog";
import EditUserFormSheet from "./modal/edit-user-sheet";

let sessionUser: User;
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const authRepo = getAuthRepo(context.cloudflare.env);
  if (!sessionUser) {
    const newUser = (await getSessionUser(authRepo, request)) as User;
    if (newUser.username !== "admin") redirect("/");
    sessionUser = newUser;
  }
  if (sessionUser == undefined) {
    redirect("/");
  }

  const formData = await request.formData();
  const username = String(formData.get("username"));
  const fullname = String(formData.get("fullname"));
  let id = null;
  if (formData.has("id")) id = Number(formData.get("id"));

  switch (request.method) {
    case "POST": {
      const password = String(formData.get("password"));
      const newUser = await authRepo.createUser(username, password, fullname);
      if (!newUser) return { ok: false };
      break;
    }
    case "PUT": {
      if (!id) {
        return { ok: false };
      }
      if (sessionUser.username === "admin") {
        const password = String(formData.get("password"));
        const updatedUser = await authRepo.updateUserForAdmin({
          id,
          username,
          fullname,
          password,
        } as User);
        if (!updatedUser) return { ok: false };
        break;
      }
      if (formData.has("old-password")) {
        const oldPassword = String(formData.get("old-password"));
        const password = String(formData.get("password"));
        const updatedUser = await authRepo.updateUser(
          {
            id,
            username,
            fullname,
            password,
          } as User,
          oldPassword
        );
        if (!updatedUser) return { ok: false };
      } else {
        const updatedUser = await authRepo.updateUser({
          id,
          username,
          fullname,
        } as User);
        if (!updatedUser) return { ok: false };
      }
      break;
    }
    case "DELETE": {
      if (!id) {
        return { ok: false };
      }
      await authRepo.deleteUser(id);
      break;
    }
  }

  return {
    ok: true,
  };
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const authRepo = getAuthRepo(context.cloudflare.env);
  const newUser = (await getSessionUser(authRepo, request)) as User;
  if (newUser.username !== "admin") redirect("/");
  sessionUser = newUser;
  if (sessionUser == undefined) {
    redirect("/");
  }
  if (sessionUser.username !== "admin") {
    throw new Response("Unauthorized", { status: 401 });
  }
  const users = await authRepo.getAllUser();
  return users;
};


export const meta: MetaFunction = () => {
  return [{ title: "Linky - Users" }];
};


export const handle = {
  header: () => (
        <PageHeader title="Users" subTitle="Manage who can access this app.">
          <AddUser />
        </PageHeader>
  ),
};


export default function UsersPage() {
  const data = useLoaderData<typeof loader>();

  const [deleteUser, setDeleteId] = useState<User | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editUser, setEditUser] = useState<User | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);

  const columnAction: ColumnDef<User> = {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    ),
  };

  const handleEdit = (user: User) => {
    setEditUser(user)
    setEditOpen(true)
  };

  const handleDelete = (user: User) => {
    setDeleteId(user);
    setDeleteOpen(true);
  };

  const allColumns = [...columns, columnAction];

  return (
    <div>
      <div className="max-w-[calc(100vw-32px)]">
        {data && <DataTable data={data} columns={allColumns} />}
      </div>
      {deleteUser && (
        <DeleteUserDialog
          user={deleteUser}
          isOpen={deleteOpen}
          setIsOpen={(isOpen: boolean) => {
            setDeleteOpen(isOpen);
            if (!isOpen)
              // This time out here to ensure animation done before it's unmounted
              setTimeout(() => {
                setDeleteId(undefined);
              }, 300);
          }}
        />
      )}

      {editUser && (
        <EditUserFormSheet
          user={editUser}
          isOpen={editOpen}
          setIsOpen={(isOpen: boolean) => {
            setEditOpen(isOpen);
            if (!isOpen)
              // This time out here to ensure animation done before it's unmounted
              setTimeout(() => {
                setEditUser(undefined);
              }, 300);
          }}
        />
      )}
    </div>
  );
}
