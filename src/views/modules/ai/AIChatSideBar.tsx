import { useColorModeValue } from "@/components/ui/color-mode";
import { useAppNavigate } from "@/utils/services/appServices";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Badge,
  VStack,
  Text,
  HStack,
  Button,
  Separator,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { 
  CiEdit, 
  CiSearch, 
  CiTrash,
  CiCalendar,
  CiClock2,
  CiStar
} from "react-icons/ci";
import { 
  FaRobot,
  FaChevronDown,
  FaChevronRight,
  FaFilter
} from "react-icons/fa";
import { 
  MdOutlineHistoryToggleOff,
  MdClose,
  MdMoreVert,
  MdPushPin
} from "react-icons/md";
import { 
  PiSidebar,
  PiChatCircle,
  PiSparkle
} from "react-icons/pi";
import { RiRobot2Fill } from "react-icons/ri";

interface AIChatSideBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

interface ChatItem {
  id: number;
  title: string;
  timestamp: string;
  isPinned?: boolean;
  isStarred?: boolean;
  preview?: string;
}

interface ChatGroup {
  [key: string]: ChatItem[];
}

const AIChatSideBar = ({
  isSidebarOpen,
  onToggleSidebar,
}: AIChatSideBarProps) => {
  const appNavigate = useAppNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Today", "Yesterday"]));
  
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const activeBg = useColorModeValue("blue.50", "blue.900");

  // Organized chat history with better structure
  const chatHistory: ChatGroup = {
    "Pinned": [
      { 
        id: 101, 
        title: "Important Project Discussion", 
        timestamp: "2 hours ago",
        isPinned: true,
        preview: "Let's discuss the Q4 roadmap and key deliverables..."
      },
      { 
        id: 102, 
        title: "Code Review Session", 
        timestamp: "1 day ago",
        isPinned: true,
        preview: "Need to review the authentication module changes..."
      }
    ],
    "Today": [
      { 
        id: 1, 
        title: "Database Optimization Query", 
        timestamp: "1 hour ago",
        preview: "How can I optimize my PostgreSQL queries for better performance?"
      },
      { 
        id: 2, 
        title: "React Component Design", 
        timestamp: "3 hours ago",
        isStarred: true,
        preview: "Best practices for creating reusable React components..."
      },
      { 
        id: 3, 
        title: "API Integration Help", 
        timestamp: "5 hours ago",
        preview: "Need help integrating third-party payment API..."
      }
    ],
    "Yesterday": [
      { 
        id: 4, 
        title: "Docker Container Setup", 
        timestamp: "1 day ago",
        preview: "Steps to containerize my Node.js application..."
      },
      { 
        id: 5, 
        title: "CSS Grid Layout", 
        timestamp: "1 day ago",
        preview: "Creating responsive layouts with CSS Grid..."
      }
    ],
    "This Week": [
      { 
        id: 6, 
        title: "Machine Learning Basics", 
        timestamp: "3 days ago",
        preview: "Introduction to neural networks and deep learning..."
      },
      { 
        id: 7, 
        title: "Security Best Practices", 
        timestamp: "4 days ago",
        preview: "Implementing security measures in web applications..."
      },
      { 
        id: 8, 
        title: "Performance Monitoring", 
        timestamp: "5 days ago",
        preview: "Tools and techniques for application performance monitoring..."
      }
    ],
    "Last Week": [
      { 
        id: 9, 
        title: "GraphQL vs REST API", 
        timestamp: "1 week ago",
        preview: "Comparing GraphQL and REST API architectures..."
      },
      { 
        id: 10, 
        title: "Cloud Deployment Guide", 
        timestamp: "1 week ago",
        preview: "Deploying applications to AWS, Azure, and GCP..."
      }
    ]
  };

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const filteredHistory = Object.entries(chatHistory).reduce((acc, [group, chats]) => {
    const filtered = chats.filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[group] = filtered;
    }
    return acc;
  }, {} as ChatGroup);

  return (
    <Box
      w="320px"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      h="100vh"
      position="absolute"
      left="0"
      top="0"
      transform={isSidebarOpen ? "translateX(0)" : "translateX(-100%)"}
      transition="transform 0.3s ease-in-out"
      boxShadow="xl"
      zIndex={1000}
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <Flex alignItems="center" justify="space-between" mb={4}>
          <HStack gap={2}>
            <Box 
              p={2} 
              borderRadius="lg" 
              bg={useColorModeValue("blue.100", "blue.900")}
              color="blue.500"
            >
              <RiRobot2Fill size={20} />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                AI Assistant
              </Text>
              <Text fontSize="xs" color={subtextColor}>
                Powered by Claude
              </Text>
            </VStack>
          </HStack>
          
          <IconButton
            aria-label="Close sidebar"
            onClick={onToggleSidebar}
            variant="ghost"
            size="sm"
            color={subtextColor}
          >
            <MdClose />
          </IconButton>
        </Flex>

        {/* New Chat Button */}
        <Button
          w="100%"
          colorPalette="blue"
          variant="solid"
          size="md"
          borderRadius="xl"
          onClick={() => appNavigate("home")}
          _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
          transition="all 0.2s"
        >
          <CiEdit />
          Start New Chat
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <InputGroup>
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="lg"
            // leftElement={<CiSearch color={subtextColor} />}
          />
        </InputGroup>
      </Box>

      {/* Chat History */}
      <Box flex="1" overflowY="auto">
        <VStack align="stretch" gap={0} p={2}>
          {Object.entries(filteredHistory).map(([groupName, chats]) => (
            <Box key={groupName} w="100%">
              {/* Group Header */}
              <Button
                variant="ghost"
                size="sm"
                w="100%"
                justifyContent="space-between"
                onClick={() => toggleGroup(groupName)}
                py={3}
                px={3}
                borderRadius="lg"
                _hover={{ bg: hoverBg }}
              >
                <HStack gap={2}>
                  <Text fontSize="sm" fontWeight="semibold" color={subtextColor}>
                    {groupName}
                  </Text>
                  <Badge size="sm" variant="subtle">
                    {chats.length}
                  </Badge>
                </HStack>
                {expandedGroups.has(groupName) ? 
                  <FaChevronDown size={12} /> : 
                  <FaChevronRight size={12} />
                }
              </Button>

              {/* Chat Items */}
              {expandedGroups.has(groupName) && (
                <VStack align="stretch" gap={1} pl={2} mt={1} mb={3}>
                  {chats.map((chat) => (
                    <Box
                      key={chat.id}
                      p={3}
                      borderRadius="lg"
                      cursor="pointer"
                      _hover={{ bg: hoverBg }}
                      transition="all 0.2s"
                      border="1px solid transparent"
                      // _hover={{ borderColor: borderColor }}
                    >
                      <Flex justify="space-between" align="start" mb={1}>
                        <HStack gap={2} flex={1} minW={0}>
                          {chat.isPinned && (
                            <MdPushPin size={12} color="orange" />
                          )}
                          {chat.isStarred && (
                            <CiStar size={12} color="gold" />
                          )}
                          <Text 
                            fontSize="sm" 
                            fontWeight="medium" 
                            color={textColor}
                            // noOfLines={1}
                            flex={1}
                          >
                            {chat.title}
                          </Text>
                        </HStack>
                        
                        <IconButton
                          aria-label="More options"
                          size="xs"
                          variant="ghost"
                          opacity={0}
                          _groupHover={{ opacity: 1 }}
                        >
                          <MdMoreVert size={12} />
                        </IconButton>
                      </Flex>
                      
                      {chat.preview && (
                        <Text 
                          fontSize="xs" 
                          color={subtextColor}
                          // noOfLines={2}
                          lineHeight="short"
                          mb={1}
                        >
                          {chat.preview}
                        </Text>
                      )}
                      
                      <HStack justify="space-between" align="center">
                        <Text fontSize="xs" color={subtextColor}>
                          {chat.timestamp}
                        </Text>
                        <HStack gap={1}>
                          <Box w={2} h={2} borderRadius="full" bg="green.400" />
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Footer */}
      <Box p={4} borderTop="1px solid" borderColor={borderColor}>
        <HStack justify="space-between">
          <Text fontSize="xs" color={subtextColor}>
            {Object.values(chatHistory).flat().length} conversations
          </Text>
          <HStack gap={1}>
            <IconButton
              aria-label="Settings"
              size="xs"
              variant="ghost"
              color={subtextColor}
            >
              <FaFilter />
            </IconButton>
            <IconButton
              aria-label="Clear history"
              size="xs"
              variant="ghost"
              color={subtextColor}
            >
              <CiTrash />
            </IconButton>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default memo(AIChatSideBar);