"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LoginDropdownMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant="ghost" size="sm" className="relative lg:hidden">
          Login
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white w-60" align="end">
        <DropdownMenuItem asChild>
          <Link href="/employees">Login as employeee</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/customers">Login as customer</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginDropdownMenu;
