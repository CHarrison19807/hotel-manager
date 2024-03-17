import { Customer } from "@/lib/customer";
import { Employee } from "@/lib/employee";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = Employee | Customer | null;

type UserState = {
  userRole: "regular" | "manager" | "customer" | null;
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      userRole: null,
      setUser: (user) =>
        set({
          user,
          userRole: (user as Employee).role || "customer",
        }),
      clearUser: () => set({ user: null, userRole: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUser;
