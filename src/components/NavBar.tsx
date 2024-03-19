import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import { FaHotel } from "react-icons/fa";
import { getServerSideUser } from "@/lib/user";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import LogoutDropdownMenuItem from "./LogoutDropdownMenuItem";

const Navbar = async () => {
  const user = await getServerSideUser();

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <div className="flex justify-between w-full">
                <div className="ml-4 flex lg:ml-0">
                  <Button asChild variant="link" className="text-black">
                    <Link href="/" className="flex items-center gap-4">
                      <FaHotel className="h-10 w-10" />
                      <p className="font-bold text-2xl hidden sm:block">
                        HotelHub
                      </p>
                    </Link>
                  </Button>
                </div>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="overflow-visible">
                      <Button variant="ghost" size="sm" className="relative">
                        My account
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-white w-60" align="end">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-0.5 leading-none">
                          <p className="font-medium text-sm text-black">
                            {user.full_name}
                          </p>
                        </div>
                      </div>

                      <DropdownMenuSeparator />

                      <LogoutDropdownMenuItem />
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex gap-3">
                    <Button>
                      <Link href="/employees">Login as employee</Link>
                    </Button>
                    <Button>
                      <Link href="/customers">Login as customer</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
