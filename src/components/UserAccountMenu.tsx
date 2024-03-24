import { User } from "@/lib/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import LogoutDropdownMenuItem from "./LogoutDropdownMenuItem";
import { Employee } from "@/lib/employee";
import { unslugify } from "@/lib/utils";
import Link from "next/link";

interface UserAccountMenuProps {
  user: User;
}

const UserAccountMenu = (props: UserAccountMenuProps) => {
  const { user } = props;

  if (!user) {
    return null;
  }
  const { role, hotel_slug } = user as Employee;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant="ghost" size="sm" className="relative">
          My profile
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-black">{user.full_name}</p>
            <p className="text-xs text-gray-500">{user.address}</p>
          </div>
        </div>
        <DropdownMenuSeparator />

        {role ? (
          <>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-0.5 leading-none">
                <p className="font-medium text-sm text-black">
                  {unslugify(hotel_slug)}
                </p>
                <p className="text-xs text-gray-500">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">Employee dashboard</Link>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href={`/user/${user.sin}/bookings`}>My bookings</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link
            href={role ? `/employees/${user.sin}` : `/customers/${user.sin}`}
          >
            Edit profile
          </Link>
        </DropdownMenuItem>

        <LogoutDropdownMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountMenu;
