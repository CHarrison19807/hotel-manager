"use client";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import { FaHotel } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useUser from "@/app/hooks/useUser";

const Navbar = () => {
  const router = useRouter();
  const { user, userRole, setUser, clearUser } = useUser();

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <div className="flex justify-between w-full">
                <div className="ml-4 flex lg:ml-0">
                  <Button asChild variant="link">
                    <Link href="/" className="flex items-center gap-4">
                      <FaHotel className="h-10 w-10" />
                      <p className="font-bold text-2xl hidden sm:block">
                        HotelHub
                      </p>
                    </Link>
                  </Button>
                </div>
                {user ? (
                  <Button variant="secondary" onClick={clearUser}>
                    Logout
                  </Button>
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
