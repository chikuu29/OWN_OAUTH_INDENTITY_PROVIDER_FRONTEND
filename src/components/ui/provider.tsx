"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import system  from "../theme";

export function Provider(props: ColorModeProviderProps) {
  console.log("Provider", props);
  console.log(system);
  
  console.log("defaultSystem", defaultSystem);

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
