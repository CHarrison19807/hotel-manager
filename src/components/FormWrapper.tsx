import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { FaHotel } from "react-icons/fa";

const FormWrapper = ({
  className,
  children,
  headerText,
}: {
  className?: string;
  children: ReactNode;
  headerText: string;
}) => {
  return (
    <div
      className={cn(
        "container relative flex pt-20 flex-col items-center justify-center lg:px-0",
        className
      )}
    >
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[375px]">
        <div className="flex flex-col space-y-2 items-center text-center">
          <FaHotel className="w-20 h-20" />
          <h1 className="text-2xl font-bold">{headerText}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
