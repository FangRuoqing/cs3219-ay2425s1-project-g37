import { env } from "@peerprep/env";
import { Avatar } from "@peerprep/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@peerprep/ui/dropdown-menu";
import { Link } from "@peerprep/ui/link";
import { getKyErrorMessage, userClient } from "@peerprep/utils/client";
import { ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import { mutate } from "swr";

import { NavLogo } from "~/components/nav-logo";
import { SWR_KEY_USER, useUser } from "~/lib/auth";

function NavAvatar() {
  const { data: user } = useUser();
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar imageUrl={user.imageUrl} username={user.username} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <div>Logged in as</div>
            <div className="max-w-full truncate text-base text-white">@{user.username}</div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`http://localhost:${env.VITE_PEERPREP_FRONTEND_PORT}`}>
              PeerPrep app
              <ArrowUpRight />
            </Link>
          </DropdownMenuItem>
          {/* TODO */}
          <DropdownMenuItem>
            User settings
            <ArrowUpRight />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <button
              onClick={async () => {
                try {
                  await userClient.post("auth/logout");
                  await mutate(SWR_KEY_USER);
                  toast.success("Log out successfully. See you again!");
                } catch (e) {
                  toast.error(getKyErrorMessage(e));
                }
              }}
            >
              Log out
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Redirect away from this layout if the user is not authenticated
export default function AuthProtectedLayout() {
  const { isLoading, data: user } = useUser();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;
  return (
    <div>
      <nav className="container flex flex-row justify-between py-6">
        <NavLogo />
        <NavAvatar />
      </nav>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}