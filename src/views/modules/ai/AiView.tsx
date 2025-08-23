import { RootState } from "@/app/store";
import {
  Box,
  Text,
  Flex,
  Container,
  IconButton,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import MessageInput from "./MessageInput";
import { CiEdit } from "react-icons/ci";
import { FaUser, FaRobot } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Avatar } from "@/components/ui/avatar";

export default function AIView(params: any) {
  console.log("===CALLING AI VIEW===", params);
  const navigate = useNavigate();
  const auth: any = useSelector((state: RootState) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const messages = [
    { sender: "User1", text: "Hello 👋" },
    {
      sender: "AI",
      text: "Of course! Here's a short and sweet English poem for you:\n\n---\n\n**Whispers of the Sky**  \nThe sun peeks out with a golden smile,  \nPainting the world in light for a while.  \nBirds sing songs in a gentle breeze,  \nDancing with leaves on quiet trees.  \n\nThe clouds drift by in cotton white,  \nTelling tales in the soft daylight.  \nAnd as the stars begin to gleam,  \nThe night arrives like a peaceful dream.\n\n---\n\nWould you like the poem to be about something specific—like love, nature, friendship, or dreams?",
    },
    {
      sender: "User1",
      text: "Give me in table format",
    },
    {
      sender: "AI",
      text: "Sure! Here's the poem from above presented in a **table format** for easier reading or formatting:\n\n| **Line Number** | **Poem Line**                              |\n|-----------------|---------------------------------------------|\n| 1               | The sun peeks out with a golden smile,     |\n| 2               | Painting the world in light for a while.   |\n| 3               | Birds sing songs in a gentle breeze,       |\n| 4               | Dancing with leaves on quiet trees.        |\n| 5               | The clouds drift by in cotton white,       |\n| 6               | Telling tales in the soft daylight.        |\n| 7               | And as the stars begin to gleam,           |\n| 8               | The night arrives like a peaceful dream.   |\n\nWould you like this in a downloadable table format (like PDF or Excel), or should I generate a different style of poem in a table?",
    },
    {
      sender: "User1",
      text: "This is the last message that should be visible",
    }
  ];

  const currentUser = "User1";

  // Fixed: Better scroll control that doesn't affect the entire page
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      // Use scrollTop instead of scrollIntoView to control scrolling within container
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      console.log("container",container);
      
      // Smooth scroll to bottom within the container only
      container.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <Flex
      direction="column"
      height="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
    >
     

      {/* Messages Container - Fixed height calculation */}
      <Box
        ref={messagesContainerRef}
        flex="1"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            width: "8px",
            background: useColorModeValue("gray.100", "gray.700"),
          },
          "&::-webkit-scrollbar-thumb": {
            background: useColorModeValue("gray.300", "gray.600"),
            borderRadius: "24px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: useColorModeValue("gray.400", "gray.500"),
          },
        }}
      >
        <Container maxW="xl" p={4}>
          <VStack align="stretch" gap={6}>
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.sender === currentUser;
              const isAI = msg.sender === "AI";
              
              return (
                <Box key={idx}>
                  <HStack 
                    align="flex-start" 
                    justify={isCurrentUser ? "flex-end" : "flex-start"}
                    gap={3}
                  >
                    {/* Avatar for AI (left side) */}
                    {!isCurrentUser && (
                      <Avatar
                        size="sm"
                        bg={isAI ? "blue.500" : "gray.500"}
                        icon={isAI ? <FaRobot /> : <FaUser />}
                        color="white"
                      />
                    )}
                    
                    {/* Message Content */}
                    <Box
                      bg={isCurrentUser
                        ? useColorModeValue("blue.500", "blue.600")
                        : useColorModeValue("white", "gray.700")
                      }
                      color={
                        isCurrentUser
                          ? "white"
                          : useColorModeValue("black", "white")
                      }
                      px={4}
                      py={3}
                      borderRadius="xl"
                      boxShadow="md"
                      maxW="75%"
                      wordBreak="break-word"
                      border={!isCurrentUser ? "1px" : "none"}
                      borderColor={useColorModeValue("gray.200", "gray.600")}
                    >
                      <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="1.5">
                        {msg.text}
                      </Text>
                    </Box>
                    
                    {/* Avatar for User (right side) */}
                    {isCurrentUser && (
                      <Avatar
                        size="sm"
                        bg="green.500"
                        icon={<FaUser />}
                        color="white"
                      />
                    )}
                  </HStack>
                </Box>
              );
            })}

             {/* New Chat Button */}
            <Box textAlign="center" py={4}>
              <IconButton
                aria-label="New Chat"
                colorPalette="blue"
                variant="solid"
                size="sm"
                borderRadius="full"
                px={4}
                py={2}
              >
                <CiEdit />
                New Chat
              </IconButton>
            </Box>
            
            {/* Scroll anchor - this ensures the last message is visible */}
            <div ref={messagesEndRef} style={{ height: '20px' }} />
          </VStack>
        </Container>
      </Box>

      {/* Fixed Input Container */}
      <Box
        position="sticky"
        bottom={0}
        width="100%"
        display="flex"
        justifyContent="center"
        padding={4}
        // bg={useColorModeValue("white", "gray.800")}
        borderTop="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        // boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
        zIndex={10}
      >
        <Container maxW="xl" width="100%">
          <MessageInput />
        </Container>
      </Box>
    </Flex>
  );
}