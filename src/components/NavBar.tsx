"use client";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button, buttonVariants } from "./ui/button";
import { FaHotel } from "react-icons/fa";
import { useEmployeeContext } from "@/contexts/EmployeeContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { isEmployee, setIsEmployee } = useEmployeeContext();

  const handleSwitch = () => {
    setIsEmployee(!isEmployee);
    router.refresh();
  };

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
                <Button
                  className="mr-4 lg:mr-0"
                  variant="ghost"
                  onClick={handleSwitch}
                >
                  <p className="font-medium">
                    Switch to {isEmployee ? "Customer" : "Employee"}
                  </p>
                </Button>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
