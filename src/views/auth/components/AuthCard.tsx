import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import React from "react";

interface AuthCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  maxW?: string;
}

// Apple-style "App Open" animation (Spring Scale + Fade)
const slideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: scale(0.8); 
    filter: blur(5px);
  }
  100% { 
    opacity: 1; 
    transform: scale(1); 
    filter: blur(0px);
  }
`;

/**
 * AuthCard Component
 * ...
 */
export const AuthCard: React.FC<AuthCardProps> = ({ icon, title, subtitle, children, maxW = "md" }) => {
  // --- Color System ---
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue(
    "linear(to-r, blue.500, purple.600)",
    "linear(to-r, blue.600, purple.700)"
  );
  
  // Background Gradients & Colors
  const backgroundGradient = useColorModeValue(
    "linear(to-br, blue.50, indigo.100, purple.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  
  // Decorative "Blob" colors
  const decorativeBg1 = useColorModeValue("blue.100", "blue.800");
  const decorativeBg2 = useColorModeValue("purple.100", "purple.800");

  // Snappy spring-like curve typical of macOS interactions
  const animation = `${slideIn} 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.2)`;

  return (
    // ...
    <Box
      minH="100vh"
      bgGradient={backgroundGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
      overflow="hidden"
    >
      {/* --- Decorative Background Elements (Blobs) --- */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="200px"
        h="200px"
        bg={decorativeBg1}
        borderRadius="full"
        opacity="0.1"
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="10%"
        w="300px"
        h="300px"
        bg={decorativeBg2}
        borderRadius="full"
        opacity="0.1"
        filter="blur(50px)"
      />

      {/* --- Main Card Container --- */}
      <Box
        maxW={maxW}
        w="full"
        bg={bgColor}
        borderRadius="2xl"
        boxShadow="2xl"
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
        position="relative"
        animation={animation} // Apply Animation
        // Gradient Top Border Effect
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          bgGradient: "linear(to-r, blue.500, purple.500, pink.500)",
        }}
      >
        {/* --- Header Section --- */}
        <Box
          bgGradient={headerBg}
          p={8}
          textAlign="center"
          position="relative"
        >
          <VStack gap={4}>
            {/* Icon Container */}
            <Box
              w="80px"
              h="80px"
              bg="white/10"
              backdropFilter="blur(10px)"
              border="2px solid white"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="2xl"
              mb={2}
            >
              {icon}
            </Box>
            
            <Heading size="2xl" fontWeight="800" letterSpacing="tight">
              {title}
            </Heading>
            <Text fontSize="lg" color="white/80" fontWeight="medium">
              {subtitle}
            </Text>
          </VStack>
        </Box>

        {/* --- Form Content Section --- */}
        <Box p={8}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
