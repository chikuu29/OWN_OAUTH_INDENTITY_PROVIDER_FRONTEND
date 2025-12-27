import React from "react";
import { Box, Circle, Heading, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { FaCreditCard } from "react-icons/fa";

const PaymentForm = () => (
    <Box 
      p={{ base: 8, md: 16 }} 
      border="2px dashed" 
      borderColor="gray.300" 
      borderRadius="xl" 
      textAlign="center" 
      bg={useColorModeValue("gray.50", "whiteAlpha.50")}
    >
       <Circle size="16" bg="blue.100" color="blue.600" mx="auto" mb={6}>
           <FaCreditCard size={32} />
       </Circle>
       <Heading size="md" mb={2}>Payment Integration</Heading>
       <Text color="gray.500" maxW="sm" mx="auto">
         This is a placeholder for a secure Stripe Element. 
         No actual payment processing occurs here yet.
       </Text>
    </Box>
);

export default PaymentForm;
