import {
  Center,
  Box,
  Heading,
  Stack,
  Input,
  Button,
  Text,
  // useColorModeValue,
  PinInput,
  // PinInputField,
  HStack,
  Flex,
} from "@chakra-ui/react";

const AppOtp = () => {
  //   const bgColor = useColorModeValue("gray.100", "gray.800");
  //   const boxBg = useColorModeValue("white", "gray.700");
  // let bgColor = useColorModeValue("white", "gray.950");
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex="9999"
      bg="rgba(0, 0, 0, 0.8)"
    >
      <Center height="100vh">
        <Box
          // bg={bgColor}
          w={"100%"}
          p={8}
          borderRadius="8px"
          boxShadow="lg"
          width="full"
          maxW="sm"
          textAlign="center"
        >
          <Heading mb={4} fontSize="2xl">
            Enter OTP
          </Heading>
          <Text mb={6} color="gray.500">
            We’ve sent an OTP to your registered email.
          </Text>
          <Stack >
            <HStack>
              {/* <PinInput size="lg">
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput> */}
            </HStack>

            {/* <PinInput mask/> */}
            <Button colorScheme="teal" size="lg" variant={'outline'}>
              Verify
            </Button>
          </Stack>
        </Box>
      </Center>
    </Box>
  );
};

export default AppOtp;
