import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  HStack,
  Flex,
  Textarea,
  Text,
  VStack,
  Badge,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Separator,
  Input,
} from "@chakra-ui/react";
import {
  FaArrowUp,
  FaPlus,
  FaCode,
  FaDatabase,
  FaSearch,
  FaFileAlt,
  FaCalculator,
  FaImage,
  FaGlobe,
  FaTools,
} from "react-icons/fa";
import { MdAutoFixHigh, MdAttachFile } from "react-icons/md";
import { RiRobot2Fill } from "react-icons/ri";
import { useColorModeValue } from "@/components/ui/color-mode";
import { InputGroup } from "@/components/ui/input-group";

type MCPTool = {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
  color: string;
};

type MessageInputProps = {
  onSend?: (message: string, selectedTools: MCPTool[]) => void;
  placeholder?: string;
  isLoading?: boolean;
};

const mcpTools: MCPTool[] = [
  {
    id: "code_analyzer",
    name: "Code Analyzer",
    icon: <FaCode />,
    description: "Analyze and review code snippets",
    color: "purple",
  },
  {
    id: "database_query",
    name: "Database Query",
    icon: <FaDatabase />,
    description: "Execute database queries and operations",
    color: "blue",
  },
  {
    id: "web_search",
    name: "Web Search",
    icon: <FaSearch />,
    description: "Search the web for information",
    color: "green",
  },
  {
    id: "document_reader",
    name: "Document Reader",
    icon: <FaFileAlt />,
    description: "Read and analyze documents",
    color: "orange",
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: <FaCalculator />,
    description: "Perform mathematical calculations",
    color: "red",
  },
  {
    id: "image_analyzer",
    name: "Image Analyzer",
    icon: <FaImage />,
    description: "Analyze and describe images",
    color: "pink",
  },
  {
    id: "api_connector",
    name: "API Connector",
    icon: <FaGlobe />,
    description: "Connect to external APIs",
    color: "cyan",
  },
];

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = "Ask anything about your data...",
  isLoading = false,
}) => {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTools, setSelectedTools] = useState<MCPTool[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    onSend?.(trimmed, selectedTools);
    setMessage("");
    setSelectedTools([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTool = (tool: MCPTool) => {
    setSelectedTools((prev) => {
      const exists = prev.find((t) => t.id === tool.id);
      if (exists) {
        return prev.filter((t) => t.id !== tool.id);
      } else {
        return [...prev, tool];
      }
    });
  };

  const removeTool = (toolId: string) => {
    setSelectedTools((prev) => prev.filter((t) => t.id !== toolId));
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, 44),
        200
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const filteredTools = mcpTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box width="100%" maxW="4xl" mx="auto">
      {/* Selected Tools Display */}
      {selectedTools.length > 0 && (
        <Box mb={3}>
          <Text
            fontSize="xs"
            color={placeholderColor}
            mb={2}
            fontWeight="medium"
          >
            Selected MCP Tools:
          </Text>
          <HStack wrap="wrap" gap={2}>
            {selectedTools.map((tool) => (
              <Badge
                key={tool.id}
                colorPalette={tool.color}
                variant="subtle"
                display="flex"
                alignItems="center"
                gap={1}
                px={3}
                py={1}
                borderRadius="full"
                cursor="pointer"
                onClick={() => removeTool(tool.id)}
                _hover={{ transform: "scale(0.95)" }}
                transition="all 0.2s"
              >
                {tool.icon}
                <Text fontSize="xs">{tool.name}</Text>
                <Text fontSize="xs" opacity={0.7}>
                  ×
                </Text>
              </Badge>
            ))}
          </HStack>
        </Box>
      )}

      {/* Main Input Container */}
      <Box
        bg={bgColor}
        border="2px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        boxShadow="lg"
        transition="all 0.2s"
        _hover={{
          borderColor: useColorModeValue("blue.300", "blue.500"),
          boxShadow: "xl",
        }}
        _focusWithin={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
        }}
      >
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          minH="44px"
          maxH="200px"
          color={textColor}
          fontSize="md"
          border="none"
          outline="none"
          resize="none"
          px={4}
          py={3}
          _placeholder={{ color: placeholderColor }}
          _focus={{ boxShadow: "none" }}
          whiteSpace="pre-wrap"
          wordBreak="break-word"
        />

        {/* Bottom Controls */}
        <Flex
          justify="space-between"
          align="center"
          px={3}
          py={2}
          borderTop="1px solid"
          borderTopColor={useColorModeValue("gray.100", "gray.700")}
        >
          {/* Left Side - Tools */}
          <HStack gap={2}>
            {/* MCP Tools Menu */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton
                  aria-label="Select MCP Tools"
                  variant="outline"
                  size="sm"
                  colorPalette="green"
                  _hover={{ bg: hoverBg }}
                >
                  <FaTools />
                </IconButton>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content
                  // minH={"100px"}
                  // maxH="300px"
                  w={"400px"}
                  overflowY="auto"
                  // placement="top-start"
                  css={{
                    transform: "translateY(-10px)",
                  }}
                >
                  <Box px={3} py={2}>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      MCP Tools
                    </Text>
                    <Text fontSize="xs" color={placeholderColor}>
                      Select tools to enhance your query
                    </Text>
                  </Box>
                  <Box
                    p={4}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    w={"100%"}
                  >
                    <InputGroup w={"100%"}>
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        borderRadius="lg"
                        // leftElement={<CiSearch color={subtextColor} />}
                      />
                    </InputGroup>
                  </Box>
                  <Separator />
                  <VStack
                    align="stretch"
                    gap={2}
                    overflowY={"scroll"}
                    maxH="300px"
                    minH={"300px"}
                    p={3}
                  >
                    {filteredTools.map((tool) => (
                      <Menu.Item
                        cursor={"pointer"}
                        key={tool.id}
                        value={tool.id}
                        onClick={() => toggleTool(tool)}
                        bg={
                          selectedTools.find((t) => t.id === tool.id)
                            ? useColorModeValue("blue.50", "blue.900")
                            : "transparent"
                        }
                      >
                        <HStack gap={4} width="100%">
                          <Box color={`${tool.color}.500`}>{tool.icon}</Box>
                          <VStack align="start" gap={0} flex={1}>
                            <Text fontSize="sm" fontWeight="medium">
                              {tool.name}
                            </Text>
                            <Text fontSize="xs" color={placeholderColor}>
                              {tool.description}
                            </Text>
                          </VStack>
                          {selectedTools.find((t) => t.id === tool.id) && (
                            <Box color="blue.500" fontSize="sm">
                              ✓
                            </Box>
                          )}
                        </HStack>
                      </Menu.Item>
                    ))}
                  </VStack>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>

            {/* Attach File Button */}
            <IconButton
              aria-label="Attach file"
              variant="outline"
              size="sm"
              colorPalette="gray"
              _hover={{ bg: hoverBg }}
            >
              <MdAttachFile />
            </IconButton>

            {/* AI Enhance Button */}
            <IconButton
              aria-label="AI enhance"
              variant="outline"
              size="sm"
              colorPalette="purple"
              _hover={{ bg: useColorModeValue("purple.50", "purple.900") }}
            >
              <MdAutoFixHigh />
            </IconButton>
          </HStack>

          {/* Right Side - Send Button */}
          <IconButton
            aria-label="Send message"
            onClick={handleSend}
            colorPalette="blue"
            variant="solid"
            size="md"
            borderRadius="xl"
            // isDisabled={!message.trim() || isLoading}
            // isLoading={isLoading}
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            <FaArrowUp />
          </IconButton>
        </Flex>
      </Box>

      {/* Helper Text */}
      <Text fontSize="xs" color={placeholderColor} textAlign="center" mt={2}>
        Press{" "}
        <kbd
          style={{
            background: useColorModeValue("gray.100", "gray.700"),
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "11px",
          }}
        >
          Enter
        </kbd>{" "}
        to send,{" "}
        <kbd
          style={{
            background: useColorModeValue("gray.100", "gray.700"),
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "11px",
          }}
        >
          Shift + Enter
        </kbd>{" "}
        for new line
      </Text>
    </Box>
  );
};

export default MessageInput;
