"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { IoAdd } from "react-icons/io5";
import { useEmployeeContext } from "@/contexts/EmployeeContext";

interface CreateNewProps {
  cta: string;
  description: string;
  href: string;
}

const CreateNew = (props: CreateNewProps) => {
  const { isEmployee } = useEmployeeContext();
  const { cta, description, href } = props;
  if (isEmployee) {
    return (
      // TODO: CHANGE BASE WIDTH AFTER UPDATING VERTICAL DISPLAY OF HOTELCHAINITEM.TSX
      <Card className=" mx-auto max-w-[450px] md:max-w-none w-[375px] sm:w-full">
        <CardHeader>
          <CardTitle className="text-center">{cta}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <Button asChild className="h-3/5 pb-3" variant="ghost">
            <Link href={href} className="flex flex-col">
              <IoAdd className="text-6xl" />
              <p className="font-bold text-lg">Create New</p>
            </Link>
          </Button>
        </CardContent>
        <CardFooter>
          <CardDescription className="text-center mx-auto">
            {description}
          </CardDescription>
        </CardFooter>
      </Card>
    );
  }

  return null;
};

export default CreateNew;
