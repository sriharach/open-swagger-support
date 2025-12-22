'use client'

import { HeroUIProvider } from "@heroui/react";

interface HeroProviderProps {
  children: React.ReactNode;
}
const HeroProvider = ({ children }: HeroProviderProps) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};

export default HeroProvider;
