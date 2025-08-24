import { RootState } from "@/app/store";
import {
  Box,
  Text,
  Flex,
  Container,
  IconButton,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router";
import MessageInput from "./MessageInput";
import { FaUser, FaRobot } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Avatar } from "@/components/ui/avatar";
import { BiMessageDetail } from "react-icons/bi";
import { POSTAPI } from "@/app/api";
import { API_SERVICES } from "@/config/api.config";

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

const thinkingPulse = `
  @keyframes thinkingPulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.02);
    }
  }
`;

// Type definitions
interface Progress {
  [key: string]: any;
}

interface Metadata {
  [key: string]: any;
}

interface ConversationData {
  status: string;
  progress: Progress;
  thinkingContent: string;
  thinkingProgress: number;
  thinkingStatus: string;
  responseContent: string;
  metadata: Metadata;
}

interface StreamData {
  v: any;
  p: string;
  o: string;
}

interface ConversationRequest {
  message: string;
  user_id: string;
}

interface Message {
  role: string;
  content: string;
  sender: string;
  message: string;
  isStreaming?: boolean;
  isThinking?: boolean;
  streamId?: string;
  timestamp: string;
}

export default function AIView(params: any) {
  console.log("===CALLING AI VIEW===", params);

  const [searchParams] = useSearchParams();
  const param = useParams();
  const navigate = useNavigate();
  const auth: any = useSelector((state: RootState) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Updated state to handle streaming with proper typing
  const [messages, setMessages] = useState<Message[]>([]);

  // State for managing streaming responses - each with unique IDs
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [currentStreamId, setCurrentStreamId] = useState<string>("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState<string>("");

  // Keep track of active streams to prevent race conditions
  const activeStreamRef = useRef<string>("");

  // Use separate state for each conversation to prevent mixing
  const [conversationData, setConversationData] = useState<ConversationData>({
    status: "",
    progress: {},
    thinkingContent: "",
    thinkingProgress: 0,
    thinkingStatus: "",
    responseContent: "",
    metadata: {},
  });

  const sender = "HUMAN";
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to generate unique IDs for each conversation
  const generateStreamId = () =>
    `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Function to clear chat
  const clearChat = useCallback(() => {
    // Abort any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setMessages([]);
    setIsStreaming(false);
    setStreamingContent("");
    setCurrentStreamId("");
    setIsThinking(false);
    setThinkingText("");
    activeStreamRef.current = ""; // Clear active stream ref
    setConversationData({
      status: "",
      progress: {},
      thinkingContent: "",
      thinkingProgress: 0,
      thinkingStatus: "",
      responseContent: "",
      metadata: {},
    });
  }, []);

  // Fixed: Better scroll control that doesn't affect the entire page
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      container.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages, streamingContent, isThinking]);

  const send = async (userInput: string, selectedTools: any) => {
    // Prevent sending if already streaming (to avoid race conditions)
    if (isStreaming || isThinking) {
      console.log("Already processing a message, ignoring new request");
      return;
    }

    // Generate unique stream ID for this conversation
    const streamId = generateStreamId();
    setCurrentStreamId(streamId);

    // Reset streaming states
    setStreamingContent("");
    setThinkingText("");
    setIsThinking(true);
    setIsStreaming(false);

    // Reset conversation data for new conversation
    setConversationData({
      status: "",
      progress: {},
      thinkingContent: "",
      thinkingProgress: 0,
      thinkingStatus: "",
      responseContent: "",
      metadata: {},
    });

    // Add user message immediately with timestamp
    const userMessage: Message = {
      role: "user",
      content: userInput,
      sender: "human",
      message: userInput,
      streamId: streamId,
      timestamp: new Date().toISOString(),
      isStreaming: false,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        "http://localhost:5173/ai-api/chat/conversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userMessage,
            stream_id: streamId, // Send stream ID to backend if needed
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        handleStreamChunk(chunk, streamId);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error during streaming:", error);

        // Add error message
        const errorMessage: Message = {
          role: "assistant",
          content: `❌ Error: ${error.message}`,
          sender: "assistant",
          message: `❌ Error: ${error.message}`,
          streamId: streamId,
          timestamp: new Date().toISOString(),
          isStreaming: false,
        };

        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } finally {
      //  setIsStreaming(false);
      //   setIsThinking(false);
      // Only clean up if this is still the current stream (not interrupted by a new message)
      // if (currentStreamId === streamId) {
      // Clean up states
      setIsStreaming(false);
      setIsThinking(false);

      // Add final assistant message if we have content
      if (conversationData.responseContent) {
        const assistantMessage: Message = {
          role: "assistant",
          content: conversationData.responseContent,
          sender: "assistant",
          message: conversationData.responseContent,
          streamId: streamId,
          timestamp: new Date().toISOString(),
          isStreaming: false,
        };

        console.log("Adding final assistant message:", assistantMessage);
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      }

      // Reset streaming content and current stream ID
      setStreamingContent("");
      setCurrentStreamId("");
      // } else {
      //   console.log(`Stream ${streamId} was interrupted by newer stream ${currentStreamId}`);
      // }
    }
  };

  const handleStreamChunk = (chunk: string, streamId: string): void => {
    // Only process chunks for the current active stream to prevent mixing
    // if (streamId !== activeStreamRef.current) {
    //   console.log("Ignoring chunk from old/cancelled stream:", streamId, "active:", activeStreamRef.current);
    //   return;
    // }

    const lines = chunk.split("\n");

    lines.forEach((line) => {
      if (line.startsWith("event: ")) {
        const eventType = line.slice(7);
        console.log("Event:", eventType);
      } else if (line.startsWith("data: ")) {
        try {
          const data: StreamData = JSON.parse(line.slice(6));

          if (data.p && data.v !== undefined && data.o) {
            handlePathUpdate(data, streamId);
          }
        } catch (e) {
          console.log("Raw data:", line);
        }
      }
    });
  };

  const handlePathUpdate = (data: StreamData, streamId: string): void => {
    // Only process updates for the current active stream
    // if (streamId !== activeStreamRef.current) {
    //   console.log("Ignoring path update from old/cancelled stream:", streamId, "active:", activeStreamRef.current);
    //   return;
    // }

    const { v: value, p: path, o: operation } = data;

    setConversationData((prev) => {
      const newData: ConversationData = { ...prev };

      // Handle different paths
      if (path === "status") {
        newData.status = String(value);
      } else if (path.startsWith("progress.")) {
        const progressKey = path.replace("progress.", "");
        newData.progress[progressKey] = value;
      } else if (path === "response.thinking_content") {
        if (operation === "APPEND") {
          setThinkingText((prev) => prev + String(value));
        } else if (operation === "SET") {
          setThinkingText(String(value));
        }
      } else if (path === "response.thinking_content.progress") {
        newData.thinkingProgress = parseInt(String(value), 10) || 0;
      } else if (path === "response.thinking_content.status") {
        newData.thinkingStatus = String(value);
      } else if (path === "response.content") {
        newData.responseContent += String(value);
        console.log("Appending to streaming content:", value);

        // Transition from thinking to streaming if needed
        if (isThinking && !isStreaming) {
          setIsThinking(false);
          setIsStreaming(true);
        }

        setStreamingContent((prev) => prev + String(value));
      } else if (path.startsWith("metadata.")) {
        const metadataKey = path.replace("metadata.", "");
        newData.metadata[metadataKey] = value;
      }

      return newData;
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
        {thinkingPulse}
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
        {/* Status Indicator */}
        {(isThinking || isStreaming) && (
          <Box
            position="sticky"
            top={0}
            zIndex={5}
            bg={useColorModeValue("white", "gray.800")}
            borderBottom="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            px={4}
            py={2}
            textAlign="center"
          >
            <HStack justify="center" gap={2}>
              <Spinner
                size="sm"
                color={isThinking ? "orange.500" : "blue.500"}
              />
              <Text fontSize="sm" fontWeight="medium">
                {/* {isThinking 
                  ? (thinkingText ? `AI is thinking: ${thinkingText}` : "AI is thinking...")
                  : "AI is responding..."
                } */}
                {thinkingText}
              </Text>
            </HStack>
          </Box>
        )}

        <Container maxW="4xl" p={4}>
          <VStack align="stretch" gap={6}>
            {messages.map((msg, idx) => {
              // const isCurrentUser = msg.role === sender;
              const assistant = msg.role == "assistant";
              return (
                <Box key={idx}>
                  <HStack
                    align="flex-start"
                    justify={!assistant ? "flex-end" : "flex-start"}
                    gap={3}
                  >
                    {/* Avatar for AI (left side) */}
                    {assistant && (
                      <Avatar
                        // variant={'outline'}
                        cursor={"pointer"}
                        borderRadius={"md"}
                        shape={"square"}
                        size="sm"
                        // bg={assistant ? "blue.500" : "gray.500"}
                        icon={
                          assistant ? (
                            <FaRobot size={20} />
                          ) : (
                            <FaUser size={20} />
                          )
                        }
                        // color="white"
                        colorPalette={"blue"}
                        css={{
                          animation: assistant
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
                      bg={!assistant ? useColorModeValue("white", "blue.950"):''}
                      color={!assistant ? useColorModeValue("black", "white"):''}
                      // colorPalette={'blue'}
                      px={4}
                      py={3}
                      borderRadius="xl"
                      // boxShadow="md"
                      maxW="75%"
                      wordBreak="break-word"
                      border={assistant ? "1px" : "none"}
                      // borderColor={useColorModeValue("gray.200", "gray.600")}
                      position="relative"
                      borderColor={msg.isThinking ? "orange.300" : undefined}
                      borderWidth={msg.isThinking ? "2px" : undefined}
                      css={
                        msg.isThinking
                          ? {
                              animation:
                                "thinkingPulse 2s ease-in-out infinite",
                            }
                          : undefined
                      }
                    >
                      <Text
                        fontSize="2xl"
                        whiteSpace="pre-wrap"
                        lineHeight="1.5"
                        // colorPalette={'blue'}
                      >
                        {/* Show thinking indicator for thinking messages */}
                        {msg.isThinking && (
                          <span
                            style={{
                              display: "inline-block",
                              marginRight: "8px",
                            }}
                          >
                            🤔
                          </span>
                        )}
                        {msg.content}
                        {/* Show typing indicator for streaming messages */}
                        {/* {msg.isStreaming && (
                          <span
                            style={{
                              display: "inline-block",
                              marginLeft: "4px",
                            }}
                          >
                            <Spinner size="xs" color="blue.500" />
                          </span>
                        )} */}
                        {/* Show thinking indicator for thinking messages */}
                        {/* {msg.isThinking && (
                          <span
                            style={{
                              display: "inline-block",
                              marginLeft: "4px",
                            }}
                          >
                            <Spinner size="xs" color="orange.500" />
                          </span>
                        )} */}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              );
            })}
            {streamingContent && (
              <Box>
                <HStack align="flex-start" justify={"flex-start"} gap={3}>
                  <Avatar
                    // variant={'outline'}
                    cursor={"pointer"}
                    borderRadius={"md"}
                    shape={"square"}
                    size="sm"
                    // bg={assistant ? "blue.500" : "gray.500"}
                    icon={<FaRobot size={20} />}
                    // color="white"
                    colorPalette={"blue"}
                    css={{
                      animation:
                        "aiShimmer 2s ease-in-out infinite, aiFloat 3s ease-in-out infinite",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  />

                  {/* Message Content */}
                  <Box
                    // bg={useColorModeValue("white", "blue.950")}
                    color={useColorModeValue("black", "white")}
                    // colorPalette={'blue'}
                    px={4}
                    py={3}
                    borderRadius="xl"
                    // boxShadow="md"
                    maxW="75%"
                    wordBreak="break-word"
                    border={"1px"}
                    // borderColor={useColorModeValue("gray.200", "gray.600")}
                    position="relative"
                    // borderColor={msg.isThinking ? "orange.300" : undefined}
                    // borderWidth={msg.isThinking ? "2px" : undefined}
                    // css={
                    //   msg.isThinking
                    //     ? {
                    //         animation: "thinkingPulse 2s ease-in-out infinite",
                    //       }
                    //     : undefined
                    // }
                  >
                    <Text
                      fontSize="2xl"
                      whiteSpace="pre-wrap"
                      lineHeight="1.5"

                      // colorPalette={'blue'}
                    >
                      {/* Show thinking indicator for thinking messages */}
                      {/* {msg.isThinking && (
                        <span
                          style={{
                            display: "inline-block",
                            marginRight: "8px",
                          }}
                        >
                          🤔
                        </span>
                      )} */}
                      {streamingContent}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            )}

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
                  onClick={clearChat}
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
        <MessageInput onSend={send} isLoading={isStreaming || isThinking} />
        {/* </Container> */}
      </Box>
    </Flex>
  );
}
