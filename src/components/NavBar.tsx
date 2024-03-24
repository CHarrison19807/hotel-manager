import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import { FaHotel } from "react-icons/fa";
import { getServerSideUser } from "@/lib/user";
import UserAccountMenu from "./UserAccountMenu";
import MobileNav from "./MobileNav";
import LoginDropdownMenu from "./LoginDropdownMenu";

const Navbar = async () => {
  const user = await getServerSideUser();

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              <MobileNav />
              <div className="ml-4 flex lg:ml-0">
                <Button asChild variant="ghost" className="text-black py-6">
                  <Link href="/" className="flex items-center gap-4">
                    <FaHotel className="h-10 w-10" />
                    <p className="font-bold text-2xl">DreamStay</p>
                  </Link>
                </Button>
                <div className="lg:gap-1 font-medium items-center py-1 hidden lg:flex">
                  <Button variant="ghost">
                    <Link href="/all/hotel-chains">Hotel Chains</Link>
                  </Button>
                  <Button variant="ghost">
                    <Link href="/all/hotels">Hotels</Link>
                  </Button>
                  <Button variant="ghost">
                    <Link href="/all/hotel-rooms">Hotel Rooms</Link>
                  </Button>
                </div>
              </div>
              <div className="lg:ml-auto">
                {user ? (
                  <UserAccountMenu user={user} />
                ) : (
                  <>
                    <LoginDropdownMenu />
                    <div className="lg:flex gap-3 hidden">
                      <Button>
                        <Link href="/employees">Login as employee</Link>
                      </Button>
                      <Button>
                        <Link href="/customers">Login as customer</Link>
                      </Button>
                    </div>
                  </>
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
