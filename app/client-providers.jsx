"use client";

import { ReduxProvider } from "./providers";
import { HeroUIProvider } from "@heroui/react";

export default function ClientProviders({ children }) {
  return (
    <HeroUIProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </HeroUIProvider>
  );
}
