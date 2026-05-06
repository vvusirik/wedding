"use client";

import { createContext, useContext } from "react";

export interface Guest {
  firstName: string;
  lastName: string;
  tags: string[];
}

const GuestContext = createContext<Guest>({ firstName: "", lastName: "", tags: [] });

export function GuestProvider({
  guest,
  children,
}: {
  guest: Guest;
  children: React.ReactNode;
}) {
  return <GuestContext.Provider value={guest}>{children}</GuestContext.Provider>;
}

export function useGuest() {
  return useContext(GuestContext);
}
