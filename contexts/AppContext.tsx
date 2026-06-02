"use client";

import { createContext, useContext } from "react";

type AppContextValue = {
  isDesktop: boolean;
  isLoading: boolean;
};

export const AppContext = createContext<AppContextValue>({
  isDesktop: true,
  isLoading: true,
});

export function useApp() {
  return useContext(AppContext);
}
