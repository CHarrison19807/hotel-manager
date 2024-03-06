"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface EmployeeContextType {
  isEmployee: boolean;
  setIsEmployee: (isEmployee: boolean) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [isEmployee, setIsEmployee] = useState<boolean>(false);

  return (
    <EmployeeContext.Provider value={{ isEmployee, setIsEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error(
      "useEmployeeContext must be used within an EmployeeProvider"
    );
  }
  return context;
};

export { EmployeeProvider, useEmployeeContext };
