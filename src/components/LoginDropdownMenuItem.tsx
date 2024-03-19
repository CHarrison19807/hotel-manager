import { toast } from "sonner";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Employee } from "@/lib/employee";
import { Customer } from "@/lib/customer";
import { setUser } from "@/lib/user";
import { useRouter, useSearchParams } from "next/navigation";

const LoginDropdownMenuItem = (user: Employee | Customer, href: string) => {
  const router = useRouter();
  const origin = useSearchParams().get("origin");
  return (
    <DropdownMenuItem
      onClick={async () => {
        await setUser(user);
        if (origin) {
          router.push(origin);
        }
        toast.success(`Logged in as ${user.full_name}`);
      }}
    >
      Login as {user.full_name}
    </DropdownMenuItem>
  );
};

export default LoginDropdownMenuItem;
