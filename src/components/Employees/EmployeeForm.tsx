"use client";

import { Hotel } from "@/lib/hotel";
import { Employee } from "@/lib/employee";
import employeeValidate, {
  TEmployeeValidate,
} from "@/lib/validators/employeeValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createEmployee, deleteEmployee, updateEmployee } from "@/lib/employee";
import { toast } from "sonner";
import FormWrapper from "../FormWrapper";
import { cn, formatSIN } from "@/lib/utils";
import { isManagerAtHotel, isSelf, setUser } from "@/lib/user";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface EmployeeFormProps {
  hotels: Hotel[];
  employee?: Employee | null;
}

const EmployeeForm = (props: EmployeeFormProps) => {
  const { hotels, employee } = props;

  const { full_name, address, sin, role, hotel_slug } = employee ?? {};
  const form: any = useForm<TEmployeeValidate>({
    defaultValues: {
      address,
      full_name,
      sin,
      role,
      hotel_slug,
    },
    resolver: zodResolver(employeeValidate),
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleDelete = async (sin: string, hotel_slug: string) => {
    setIsLoading(true);
    if ((await isSelf(sin)) || (await isManagerAtHotel(hotel_slug))) {
      const result = await deleteEmployee(sin);
      if (result) {
        toast.error(result);
      } else {
        toast.success(`Successfully deleted employee!`);
        router.push("/employees");
        router.refresh();
      }
    } else {
      toast.error("You are not authorized to perform this action!");
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: TEmployeeValidate) => {
    setIsLoading(true);
    const { full_name, address, sin, role, hotel_slug } = data;
    let result: string;
    const newEmployee = {
      full_name,
      address,
      sin,
      role,
      hotel_slug,
    };
    if (employee) {
      if (await isSelf(sin)) {
        if (role === "manager" && !(await isManagerAtHotel(hotel_slug))) {
          toast.error("You are not authorized to perform this action!");
          setIsLoading(false);
          return;
        }
        result = await updateEmployee(newEmployee);
        if (result) {
          toast.error(result);
        } else {
          await setUser(newEmployee);
          toast.success(`Successfully updated employee!`);
          router.push("/employees");
          router.refresh();
        }
      } else if (await isManagerAtHotel(hotel_slug)) {
        result = await updateEmployee(newEmployee);
        if (result) {
          toast.error(result);
        } else {
          toast.success(`Successfully updated employee!`);
          router.push("/employees");
          router.refresh();
        }
      } else {
        toast.error("You are not authorized to perform this action!");
      }
    } else {
      // TODO: add check for if the hotel has no employees
      if ((await isSelf(sin)) || (await isManagerAtHotel(hotel_slug))) {
        result = await createEmployee({
          full_name,
          address,
          sin,
          role,
          hotel_slug,
        });
        if (result) {
          toast.error(result);
        } else {
          toast.success(`Successfully created employee!`);
          router.push("/employees");
          router.refresh();
        }
      } else {
        toast.error("You are not authorized to perform this action!");
      }
    }
    setIsLoading(false);
  };

  return (
    <FormWrapper headerText={employee ? "Edit Employee" : "Create Employee"}>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={role}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hotel_slug"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Hotel</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between font-normal"
                          >
                            {field.value
                              ? `${
                                  hotels.find(
                                    (hotel) => hotel.hotel_slug === field.value
                                  )?.hotel_name
                                }`
                              : "Select hotel"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[375px]">
                        <Command>
                          <CommandInput placeholder="Search customers..." />
                          <CommandEmpty>No customers found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {hotels.map((hotel) => (
                                <CommandItem
                                  value={hotel.hotel_slug}
                                  key={hotel.hotel_slug}
                                  onSelect={() => {
                                    form.setValue(
                                      "hotel_slug",
                                      hotel.hotel_slug
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      hotel.hotel_slug === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {hotel.hotel_name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123-456-789"
                        {...field}
                        disabled={sin !== undefined}
                        value={
                          sin === undefined ? sin : formatSIN(sin as string)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 pt-4">
                <Button disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin mr-3" />
                      <span>Loading</span>
                    </div>
                  ) : (
                    <p>Submit</p>
                  )}
                </Button>
                {employee && (
                  <Button
                    type="button"
                    onClick={() =>
                      handleDelete(sin as string, hotel_slug as string)
                    }
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin mr-3" />
                        <span>Loading</span>
                      </div>
                    ) : (
                      <p>Delete {full_name}</p>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </FormWrapper>
  );
};

export default EmployeeForm;
