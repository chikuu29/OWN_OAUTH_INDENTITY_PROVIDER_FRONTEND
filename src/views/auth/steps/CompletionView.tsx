import React from "react";
import { VStack, Box, Circle, Heading, Text, Button } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

const CompletionView = () => (
    <VStack gap={8} textAlign="center" py={{ base: 10, md: 16 }}>
       <Box position="relative">
          <Circle size="24" bg="green.100" color="green.600">
             <FaCheck size={48} />
          </Circle>
          {/* Decorative particles could go here */}
       </Box>
      <VStack gap={2}>
        <Heading size="2xl">You're All Set!</Heading>
        <Text color="gray.500" maxW="md" mx="auto" fontSize="lg">
            Your organization has been successfully set up and is ready to use. 
            Redirecting you to the dashboard...
        </Text>
      </VStack>
      <Button 
        colorPalette="blue" 
        size="xl" 
        px={12} 
        mt={4} 
        onClick={() => {}}
        bgGradient="linear(to-r, blue.500, teal.500)"
        _hover={{ bgGradient: "linear(to-r, blue.600, teal.600)", transform: "translateY(-2px)" }}
        borderRadius="full"
      >
          Go to Dashboard
      </Button>
    </VStack>
);

export default CompletionView;
