"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const MobileNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant="ghost" size="sm" className="relative lg:hidden">
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white w-60" align="end">
        <DropdownMenuItem asChild>
          <Link href="/all/hotel-chains">Hotel Chains</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/all/hotels">Hotels</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/all/hotel-rooms">Hotel Rooms</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileNav;
