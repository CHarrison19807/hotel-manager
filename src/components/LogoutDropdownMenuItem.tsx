"use client";
import { toast } from "sonner";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { logoutUser } from "@/lib/user";
import { useRouter } from "next/navigation";

const LogoutDropdownMenuItem = () => {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={async () => {
        const result = await logoutUser();
        if (result) {
          router.push("/");
          router.refresh();
          toast.success("Logged out successfully!");
        } else {
          toast.error("Unexpected error logging out!");
        }
      }}
    >
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutDropdownMenuItem;
