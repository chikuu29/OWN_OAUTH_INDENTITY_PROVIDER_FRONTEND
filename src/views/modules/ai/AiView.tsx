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
import { useNavigate, useParams, useSearchParams } from "react-router";
import MessageInput from "./MessageInput";
import { CiEdit } from "react-icons/ci";
import { FaUser, FaRobot } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Avatar } from "@/components/ui/avatar";
import { BiMessageDetail } from "react-icons/bi";
import { POSTAPI } from "@/app/api";
import { API_SERVICES } from "@/config/api.config";
import { log } from "console";

// Add CSS animations
const aiShimmer = `
  @keyframes aiShimmer {
    0%, 100% {
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4);
    }
  }
`;

const aiFloat = `
  @keyframes aiFloat {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-2px) rotate(1deg);
    }
    50% {
      transform: translateY(-4px) rotate(0deg);
    }
    75% {
      transform: translateY(-2px) rotate(-1deg);
    }
  }
`;

const userFloat = `
  @keyframes userFloat {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-3px);
    }
  }
`;

export default function AIView(params: any) {
  console.log("===CALLING AI VIEW===", params);
  const [searchParams] = useSearchParams();
  const param = useParams();
  console.log("param", param);
  console.log("searchParams", searchParams);

  const navigate = useNavigate();
  const auth: any = useSelector((state: RootState) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    Array<{ sender: string; text: string }>
  >([
    // {role:'system', text: 'You are a helpful assistant that translates English to French.'},
    // {
    //   sender: "user",
    //   text: 'Translate the following English text to French: "Hello, how are you?"',
    // },
    // { sender: "assistant", text: "Bonjour, comment ça va?" },
    // {
    //   sender: "user",
    //   text: 'Translate the following English text to French: "What is your name?"',
    // },
  ]);

  const sender = "user";

  // Fixed: Better scroll control that doesn't affect the entire page
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      // Use scrollTop instead of scrollIntoView to control scrolling within container
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      console.log("container", container);

      // Smooth scroll to bottom within the container only
      container.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const send = (userInput: string, selectedTools: any) => {
    // Implement your send logic here
    // For now, just log to console
    console.log("Send triggered", userInput, selectedTools);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userInput },
    ]);

    POSTAPI({
      path: "chat/conversation",
      data: { message: userInput, tools: selectedTools },
      service: API_SERVICES.AI,
      isPrivateApi: true,
    }).subscribe((response: any) => {
      console.log("===response from api", response);
    });
  };

  return (
    <Flex
      direction="column"
      height="100vh"
      // bg={useColorModeValue("gray.50", "gray.900")}
    >
      {/* Inject CSS animations */}
      <style>
        {aiShimmer}
        {aiFloat}
        {userFloat}
      </style>

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
              const isCurrentUser = msg.sender === sender;
              const isAI = msg.sender === "assistant";

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
                        // variant={'outline'}
                        cursor={"pointer"}
                        borderRadius={"md"}
                        shape={"square"}
                        size="sm"
                        // bg={isAI ? "blue.500" : "gray.500"}
                        icon={
                          isAI ? <FaRobot size={20} /> : <FaUser size={20} />
                        }
                        // color="white"
                        colorPalette={"blue"}
                        css={{
                          animation: isAI
                            ? "aiShimmer 2s ease-in-out infinite, aiFloat 3s ease-in-out infinite"
                            : "userFloat 4s ease-in-out infinite",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      />
                    )}

                    {/* Message Content */}
                    <Box
                      bg={
                        isCurrentUser
                          ? useColorModeValue("gray.950", "green.950")
                          : useColorModeValue("white", "blue.950")
                      }
                      color={
                        isCurrentUser
                          ? "white"
                          : useColorModeValue("black", "white")
                      }
                      // colorPalette={'blue'}
                      px={4}
                      py={3}
                      borderRadius="xl"
                      boxShadow="md"
                      maxW="75%"
                      wordBreak="break-word"
                      border={!isCurrentUser ? "1px" : "none"}
                      // borderColor={useColorModeValue("gray.200", "gray.600")}
                    >
                      <Text
                        fontSize="sm"
                        whiteSpace="pre-wrap"
                        lineHeight="1.5"
                        // colorPalette={'blue'}
                      >
                        {msg.text}
                      </Text>
                    </Box>

                    {/* Avatar for User (right side) */}
                    {/* {isCurrentUser && (
                      <Avatar
                        // variant={'outline'}
                        cursor={"pointer"}
                        borderRadius={"md"}
                        shape={"square"}
                        size="sm"
                        icon={
                          isAI ? <FaRobot size={20} /> : <FaUser size={20} />
                        }
                        // color="white"
                        // colorPalette={"blue"}
                        // css={{
                        //   animation: isAI
                        //     ? "aiShimmer 2s ease-in-out infinite, aiFloat 3s ease-in-out infinite"
                        //     : "userFloat 4s ease-in-out infinite ",
                        //   "&:hover": {
                        //     transform: "scale(1.1)",
                        //   },
                        //   transition: "all 0.3s ease",
                        // }}
                      />
                    )} */}
                  </HStack>
                </Box>
              );
            })}

            {/* New Chat Button */}
            {messages.length > 5 && (
              <Box textAlign="center" py={4} mb={8}>
                <IconButton
                  aria-label="New Chat"
                  colorPalette="blue"
                  variant="solid"
                  size="sm"
                  borderRadius="full"
                  px={4}
                  py={2}
                >
                  <BiMessageDetail />
                  New Chat
                </IconButton>
              </Box>
            )}

            {/* Scroll anchor - this ensures the last message is visible */}
            <div ref={messagesEndRef} style={{ height: "20px" }} />
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
        {/* <Container maxW="xl" width="100%"> */}
        <MessageInput onSend={send} />
        {/* </Container> */}
      </Box>
    </Flex>
  );
}
