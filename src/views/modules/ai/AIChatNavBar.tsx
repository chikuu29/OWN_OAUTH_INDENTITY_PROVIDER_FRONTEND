import { useColorModeValue } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import PanelNavBarAction from "@/ui/components/navbar/AppNavBarAction";
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
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { AiOutlineWechatWork, AiOutlineRobot } from "react-icons/ai";
import { CiEdit, CiShare1, CiBookmark, CiSettings } from "react-icons/ci";
import { FaRobot, FaShare, FaDownload, FaCopy } from "react-icons/fa";
import { FiShare, FiMoreHorizontal, FiSidebar } from "react-icons/fi";
import {
  MdOutlineHistoryToggleOff,
  MdMoreVert,
  MdBookmark,
  MdBookmarkBorder,
} from "react-icons/md";
import { PiSidebar, PiSparkle } from "react-icons/pi";
import { RiRobot2Fill } from "react-icons/ri";

interface AIChatNavBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  chatTitle?: string;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  onNewChat?: () => void;
}

const AIChatNavBar = ({
  isSidebarOpen,
  onToggleSidebar,
  chatTitle = "New Conversation",
  isBookmarked = false,
  onBookmark,
  onShare,
  onNewChat,
}: AIChatNavBarProps) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.800");

  return (
    <Box
      bg={bgColor}
      borderBottom="1px solid"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={10}
      backdropFilter="blur(10px)"
      boxShadow="sm"
    >
      <Flex align="center" justify="space-between" px={4} py={3} maxW="100%">
        {/* Left Section */}
        <HStack gap={3}>
          {/* Sidebar Toggle - only show when sidebar is closed */}
          {!isSidebarOpen && (
            <Tooltip content="Open sidebar">
              <IconButton
                aria-label="Toggle sidebar"
                onClick={onToggleSidebar}
                variant="ghost"
                size="md"
                _hover={{ bg: hoverBg }}
                borderRadius="xl"
              >
                <FiSidebar size={18} />
              </IconButton>
            </Tooltip>
          )}

          {/* New Chat Button - only show when sidebar is closed */}
          {!isSidebarOpen && (
            <>
              <Tooltip content="Start new chat">
                <IconButton
                  aria-label="New chat"
                  onClick={onNewChat}
                  variant="ghost"
                  size="md"
                  _hover={{ bg: hoverBg }}
                  borderRadius="xl"
                  color="blue.500"
                >
                  <CiEdit size={20} />
                </IconButton>
              </Tooltip>

              {/* Chat Info */}
              <HStack gap={3} flex={1} minW={0}>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg={useColorModeValue("blue.50", "blue.900")}
                  color="blue.500"
                >
                  <RiRobot2Fill size={16} />
                </Box>
                <VStack align="start" gap={0} minW={0}>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color={textColor}
                    // noOfLines={1}
                    maxW="300px"
                  >
                    {chatTitle}
                  </Text>
                  <HStack gap={1} align="center">
                    <Box w={2} h={2} borderRadius="full" bg="green.400" />
                    <Text fontSize="xs" color={subtextColor}>
                      Online • Claude Sonnet 4
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </>
          )}
        </HStack>

        {/* Right Section */}
        <HStack gap={2}>
          {/* Bookmark Button */}
          <Tooltip content={isBookmarked ? "Remove bookmark" : "Bookmark chat"}>
            <IconButton
              aria-label="Bookmark"
              onClick={onBookmark}
              variant="ghost"
              size="sm"
              _hover={{ bg: hoverBg }}
              borderRadius="lg"
              color={isBookmarked ? "yellow.500" : subtextColor}
            >
              {isBookmarked ? (
                <MdBookmark size={18} />
              ) : (
                <MdBookmarkBorder size={18} />
              )}
            </IconButton>
          </Tooltip>

          {/* Share Button */}
          <Tooltip content="Share conversation">
            <Button
              // leftIcon={<FaShare size={14} />}
              onClick={onShare}
              variant="outline"
              size="sm"
              borderRadius="xl"
              colorPalette="blue"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "md",
              }}
              transition="all 0.2s"
              fontWeight="medium"
            >
              Share
            </Button>
          </Tooltip>

          <Separator orientation="vertical" height="24px" />

          {/* More Options */}
          <Tooltip content="More options">
            <IconButton
              aria-label="More options"
              variant="ghost"
              size="sm"
              _hover={{ bg: hoverBg }}
              borderRadius="lg"
            >
              <MdMoreVert size={18} />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <PanelNavBarAction showAuthFullName={false} />
        </HStack>
      </Flex>

      {/* Optional: Secondary toolbar for additional actions */}
      <Box
        px={4}
        py={2}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <HStack gap={2} justify="center">
          <Tooltip content="Download conversation">
            <IconButton
              aria-label="Download"
              variant="ghost"
              size="xs"
              color={subtextColor}
              _hover={{ color: textColor }}
            >
              <FaDownload size={12} />
            </IconButton>
          </Tooltip>

          <Tooltip content="Copy conversation">
            <IconButton
              aria-label="Copy"
              variant="ghost"
              size="xs"
              color={subtextColor}
              _hover={{ color: textColor }}
            >
              <FaCopy size={12} />
            </IconButton>
          </Tooltip>

          <Separator orientation="vertical" height="16px" />

          <Text fontSize="xs" color={subtextColor}>
            Last updated: 2 minutes ago
          </Text>

          <Separator orientation="vertical" height="16px" />

          <Badge size="sm" colorPalette="green" variant="subtle">
            Auto-save enabled
          </Badge>
        </HStack>
      </Box>
    </Box>
  );
};

export default memo(AIChatNavBar);
