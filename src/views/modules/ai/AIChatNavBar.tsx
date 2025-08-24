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
import { memo, useState, useEffect } from "react";
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
import { SiHomepage } from "react-icons/si";
import { useNavigate } from "react-router";

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
  // All hooks must be called at the top level, before any conditional logic
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  // Move all useColorModeValue calls to the top level
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.800");
  const blueBg = useColorModeValue("blue.50", "blue.900");
  const grayBg = useColorModeValue("gray.50", "gray.800");
  
  const navigate = useNavigate();
  
  // Debug hook order - this should always run
  useEffect(() => {
    // This effect ensures consistent hook ordering
    console.log("AIChatNavBar mounted with props:", { isSidebarOpen, chatTitle, isBookmarked });
  }, [isSidebarOpen, chatTitle, isBookmarked]);
  
  // Additional debug effect to ensure hooks are called in order
  useEffect(() => {
    console.log("AIChatNavBar hooks initialized successfully");
  }, []);
  
  return (
    <Box
      // bg={bgColor}
      // borderBottom="1px solid"
      // borderColor={borderColor}
      position="sticky"
      // top={0}
      // zIndex={10}
      // backdropFilter="blur(10px)"
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
                variant="solid"
                size="sm"
                colorPalette="blue"
                // _hover={{ bg: hoverBg }}
                _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                transition="all 0.2s"
                borderRadius="sm"
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
                  variant="solid"
                  size="sm"
                  // _hover={{ bg: hoverBg }}
                  borderRadius="sm"
                  colorPalette="blue"
                  // color="blue.500"
                >
                  <CiEdit size={20} />
                </IconButton>
              </Tooltip>

              {/* Chat Info */}
              <Box display={{ base: "none", sm: "none", xl: "block" }}>
                <HStack gap={3} flex={1} minW={0}>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={blueBg}
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
              </Box>
            </>
          )}
        </HStack>

        {/* Right Section */}
        <HStack gap={2}>
          {/* Bookmark Button */}
          <Tooltip content={"Go To Application Home Page"}>
            <IconButton
              aria-label="Go To Application Home Page"
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              // _hover={{ bg: "orange.100" }}
              borderRadius="lg"
              // color={isBookmarked ? "yellow.500" : subtextColor}
              colorPalette={"orange"}
            >
              <SiHomepage size={18} />
            </IconButton>
          </Tooltip>
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
      {/* <Box
        px={4}
        py={2}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={grayBg}
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
      </Box> */}
    </Box>
  );
};

export default memo(AIChatNavBar);
