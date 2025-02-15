// NotFound.js
import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router";
// import { useHistory } from 'react-router';

const NoPageFound = () => {
  // const history = useHistory();

  // const handleGoHome = () => {
  //     history.push('/'); // Change this to your home route
  // };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
    >
      <Heading
        display="inline-block"
        as="h1"
        size="xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you&apos;re looking for does not seem to exist
      </Text>

      <Button
        // bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        // color="white"
        variant="solid"
        as={Link}
        // to="/" // Navigates to home
        // variant="solid"
        colorScheme="blue"
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NoPageFound;
