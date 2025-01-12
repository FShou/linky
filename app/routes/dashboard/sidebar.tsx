import {
  ChevronDownIcon,
  HomeIcon,
  LinkIcon,
  LogOutIcon,
  NewspaperIcon,
  User,
  UserCircle2Icon,
  UserIcon,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { Form, Link } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import EditUserDialog from "./edit-user-dialog";

const sidebarItems = [
  {
    title: "Home",
    route: "/dashboard/home",
    icon: <HomeIcon className="size-10" />,
  },
  {
    title: "Links",
    route: "/dashboard/links",
    icon: <LinkIcon className="size-10" />,
  },
  {
    title: "Pages",
    route: "/dashboard/pages",
    icon: <NewspaperIcon className="size-10" />,
  },
];

interface AppSidebarProps {
  currentPath: string;
  user: User;
}

export default function AppSidebar({ currentPath, user }: AppSidebarProps) {
  const sidebar = useSidebar();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        {/* UserMenu */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton variant={"outline"} className="h-12">
                  <UserCircle2Icon />
                  <span className="font-medium">{user.fullname}</span>
                  <ChevronDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                className="w-[--radix-popper-anchor-width]"
              >
                {user.username !== "admin" && (
                  <DropdownMenuItem asChild>
                    {/* <Link to={"/account/"}> */}
                    {/*   <span className="w-full">Account</span> */}
                    {/*   <UserIcon /> */}
                    {/* </Link> */}
                    <EditUserDialog user={user} />
                  </DropdownMenuItem>
                )}
                <Form method="POST">
                  <DropdownMenuItem asChild>
                    <span className="relative">
                      <input
                        type="submit"
                        value="Sign Out"
                        className="text-start w-full"
                      />
                      <LogOutIcon className="absolute right-2" />
                    </span>
                  </DropdownMenuItem>
                </Form>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigations */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((it) => (
                <SidebarMenuItem key={it.title}>
                  <SidebarMenuButton
                    isActive={currentPath.includes(it.route)}
                    size={"lg"}
                    asChild
                  >
                    <Link
                      to={it.route}
                      prefetch="viewport"
                      replace
                      onClick={() => {
                        setTimeout(() => {
                          sidebar.setOpenMobile(false);
                        }, 100);
                      }}
                    >
                      {it.icon}
                      <span className="tracking-normal font-medium">
                        {it.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user.username === "admin" && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={currentPath.includes("/dashboard/users")}
                    size={"lg"}
                    asChild
                  >
                    <Link
                      to={"/dashboard/users"}
                      prefetch="viewport"
                      replace
                      onClick={() => {
                        setTimeout(() => {
                          sidebar.setOpenMobile(false);
                        }, 100);
                      }}
                    >
                      <Users />
                      <span className="tracking-normal font-medium">Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        {/* Branding */}
        <div>
          <p className="font-semibold">Linky</p>
          <p className="text-xs text-muted-foreground">
            Manage your link with ease
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
