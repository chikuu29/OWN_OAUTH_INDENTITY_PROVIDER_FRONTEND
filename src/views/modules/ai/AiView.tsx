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
import { FaUser, FaRobot, FaAngleDoubleDown } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Avatar } from "@/components/ui/avatar";
import { BiMessageDetail } from "react-icons/bi";
import { POSTAPI } from "@/app/api";
import { API_SERVICES } from "@/config/api.config";
import { log } from "console";

// CSS animations
const aiShimmer = `
  @keyframes aiShimmer {
    0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4); }
  }
`;

const aiFloat = `
  @keyframes aiFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-2px) rotate(1deg); }
    50% { transform: translateY(-4px) rotate(0deg); }
    75% { transform: translateY(-2px) rotate(-1deg); }
  }
`;

const userFloat = `
  @keyframes userFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
  }
`;

const thinkingPulse = `
  @keyframes thinkingPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.02); }
  }
`;

const statusAnimation = `@keyframes moveBorder {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}`;
// Simplified types
interface Message {
  message?: string; // Added optional message field
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status: "complete" | "thinking" | "streaming";
  thinkingContent?: string;
}

interface StreamData {
  v: any;
  p: string;
  o: string;
}

export default function AIView(params: any) {
  console.log("===CALLING AI VIEW===", params);
  // All useColorModeValue calls at the top
  const scrollTrackColor = useColorModeValue("gray.100", "gray.700");
  const scrollThumbColor = useColorModeValue("gray.300", "gray.600");
  const scrollThumbHoverColor = useColorModeValue("gray.400", "gray.500");
  const statusBgColor = useColorModeValue("gray.100", "gray.800");
  const statusBorderColor = useColorModeValue("gray.200", "gray.700");
  const userMsgBgColor = useColorModeValue("white", "blue.950");
  const userMsgTextColor = useColorModeValue("black", "white");
  const assistantMsgTextColor = useColorModeValue("black", "white");
  const inputBorderColor = useColorModeValue("gray.200", "gray.700");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Simplified state - single source of truth
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate unique message ID
  const generateMessageId = () =>
    `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Clear chat function
  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setIsProcessing(false);
  }, []);

  // Main send function
  const send = async (userInput: string, selectedTools: any) => {
    if (isProcessing) {
      console.log("Already processing, ignoring new request");
      return;
    }

    setIsProcessing(true);

    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
      role: "user",
      message: userInput,
      content: userInput,
      timestamp: new Date().toISOString(),
      status: "complete",
    };

    // Add assistant message in thinking state
    const assistantMessageId = generateMessageId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      status: "thinking",
      thinkingContent: "",
    };

    // Add both messages at once
    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        "http://localhost:5173/ai-api/chat/conversation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userMessage),
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
        handleStreamChunk(chunk, assistantMessageId);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error during streaming:", error);

        // Update the assistant message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: `❌ Error: ${error.message}`,
                  status: "complete" as const,
                }
              : msg
          )
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle streaming chunks
  const handleStreamChunk = (chunk: string, messageId: string): void => {
    const lines = chunk.split("\n");

    lines.forEach((line) => {
      if (line.startsWith("data: ")) {
        try {
          const data: StreamData = JSON.parse(line.slice(6));
          if (data.p && data.v !== undefined && data.o) {
            handlePathUpdate(data, messageId);
          }
        } catch (e) {
          console.log("Raw data:", line);
        }
      }
    });
  };

  // Handle path updates
  const handlePathUpdate = (data: StreamData, messageId: string): void => {
    const { v: value, p: path, o: operation } = data;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;

        if (path === "response.thinking_content") {
          const newThinkingContent =
            operation === "APPEND"
              ? (msg.thinkingContent || "") + String(value)
              : String(value);

          return {
            ...msg,
            thinkingContent: newThinkingContent,
            status: "thinking" as const,
          };
        }

        if (path === "response.content") {
          const newContent = msg.content + String(value);

          return {
            ...msg,
            content: newContent,
            status: "streaming" as const,
            thinkingContent: undefined, // Clear thinking content when streaming starts
          };
        }

        return msg;
      })
    );

    // Mark as complete when streaming finishes (you might need to detect this differently)
    // This is a simplified approach - you might want to handle this based on your stream end signal
  };

  // Mark streaming as complete (call this when you detect stream end)
  const markStreamComplete = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status: "complete" as const } : msg
      )
    );
  };

  // Get current status for display
  const getCurrentStatus = () => {
    const processingMessage = messages.find(
      (msg) =>
        msg.role === "assistant" &&
        (msg.status === "thinking" || msg.status === "streaming")
    );

    if (!processingMessage) return null;

    if (processingMessage.status === "thinking") {
      return {
        type: "thinking",
        content: processingMessage.thinkingContent || "AI is thinking...",
      };
    }

    if (processingMessage.status === "streaming") {
      return {
        type: "streaming",
        content: "AI is responding...",
      };
    }

    return null;
  };

  const currentStatus = getCurrentStatus();

  

  return (
    <Flex direction="column" height="100vh">
      <style>
        {aiShimmer}
        {aiFloat}
        {userFloat}
        {thinkingPulse}
        {statusAnimation}
      </style>

      {/* Messages Container */}
      <Box
        ref={messagesContainerRef}
        flex="1"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": {
            width: "8px",
            background: scrollTrackColor,
          },
          "&::-webkit-scrollbar-thumb": {
            background: scrollThumbColor,
            borderRadius: "24px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: scrollThumbHoverColor,
          },
        }}
        // position="relative"
      >
        {/* Status Indicator */}
        {currentStatus && (
          <Box
            position="sticky"
            top={0}
            zIndex={5}
            px={4}
            py={2}
            textAlign="center"
          >
            <IconButton
              p={2}
              bg={statusBgColor}
              aria-label="Bookmark"
              variant="ghost"
              size="sm"
              // _hover={{ bg: hoverBg }}
              borderRadius="lg"
              // color={isBookmarked ? "yellow.500" : subtextColor}
            >
              <Spinner size="sm" color="green.500" />
              <Text fontSize="sm" fontWeight="medium">
                {currentStatus.content}
              </Text>
            </IconButton>
          </Box>
        )}

        <Container maxW="4xl" p={4}>
          <VStack align="stretch" gap={6}>
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";

              // Don't render empty assistant messages that are just starting
              if (
                isAssistant &&
                !msg.content &&
                msg.status === "thinking" &&
                !msg.thinkingContent
              ) {
                return null;
              }

              return (
                <Box key={msg.id}>
                  <HStack
                    align="flex-start"
                    justify={isAssistant ? "flex-start" : "flex-end"}
                    justifyItems={"center"}
                    gap={3}
                    p={2}
                  >
                    {/* Avatar for AI (left side) */}
                    {isAssistant && (
                      <Avatar
                        cursor="pointer"
                        borderRadius="md"
                        shape="square"
                        size="sm"
                        icon={<FaRobot size={20} />}
                        colorPalette="blue"
                        css={{
                          animation:
                            "aiShimmer 2s ease-in-out infinite, aiFloat 3s ease-in-out infinite",
                          "&:hover": { transform: "scale(1.1)" },
                          transition: "all 0.3s ease",
                        }}
                      />
                    )}

                    {/* Message Content */}
                    <Box
                      bg={!isAssistant ? userMsgBgColor : ""}
                      color={
                        !isAssistant ? userMsgTextColor : assistantMsgTextColor
                      }
                      borderRadius="xl"
                      maxW="75%"
                      wordBreak="break-word"
                      border={isAssistant ? "1px" : "none"}
                      borderColor={
                        msg.status === "thinking" ? "orange.300" : undefined
                      }
                      borderWidth={
                        msg.status === "thinking" ? "2px" : undefined
                      }
                      css={
                        msg.status === "thinking"
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
                      >
                        {/* Show thinking content if in thinking state */}
                        {msg.status === "thinking" && msg.thinkingContent && (
                          <>
                            <span style={{ marginRight: "8px" }}>🤔</span>
                            {msg.thinkingContent}
                          </>
                        )}

                        {/* Show main content if available */}
                        {msg.content && (
                          <>
                            {msg.status === "streaming" && (
                              <span style={{ marginRight: "8px" }}>💭</span>
                            )}
                            {msg.content}
                          </>
                        )}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              );
            })}

            {/* New Chat Button */}
            {messages.length > 5 && (
              <>
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
              </>
            )}
            

            <div ref={messagesEndRef} style={{ height: "20px" }} />
          </VStack>
        </Container>
      </Box>

     
      <Box
        position="sticky"
        bottom={0}
        width="100%"
        display="flex"
        justifyContent="center"
        padding={4}
        borderTop="1px"
        borderColor={inputBorderColor}
        zIndex={10}
      >
        <MessageInput onSend={send} isLoading={isProcessing} messagesContainerRef={messagesContainerRef} />
      </Box>

      {/* Add blink animation for cursor */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </Flex>
  );
}
