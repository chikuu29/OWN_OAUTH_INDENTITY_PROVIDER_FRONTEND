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
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaIoxhost } from "react-icons/fa";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import { PiSidebar } from "react-icons/pi";


interface AIChatSideBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}
const AIChatSideBar = ({
  isSidebarOpen,
  onToggleSidebar,
}: AIChatSideBarProps) => {
  const appNavigate = useAppNavigate();
  const chatHistory = {
    "2025-05-31": [
      { id: 1, title: "Chat with John" },
      { id: 2, title: "Marketing Meeting" },
    ],
    "2025-05-30": [
      { id: 3, title: "Team Sync" },
      { id: 4, title: "Bug Report" },
    ],

    "2025qqq-05-30": [
      { id: 3, title: "Team Sync" },
      { id: 4, title: "Bug Report" },
    ],
    "20qqq25-05-31": [
      { id: 1, title: "Chat with John" },
      { id: 2, title: "Marketing Meeting" },
    ],
    "2025-05-qqqq30": [
      { id: 3, title: "Team Sync" },
      { id: 4, title: "Bug Report" },
    ],
    "2025-05-3qq1": [
      { id: 1, title: "Chat with John" },
      { id: 2, title: "Marketing Meeting" },
    ],
    "2025q-05-30": [
      { id: 3, title: "Team Sync" },
      { id: 4, title: "Bug Report" },
    ],
    "2025-q05q-31": [
      { id: 1, title: "Chat with John" },
      { id: 2, title: "Marketing Meeting" },
    ],
    "2025-05q-30": [
      { id: 3, title: "Team Sync" },
      { id: 4, title: "Bug Report" },
    ],
    "2025-05-3q1": [
      { id: 1, title: "Chat with John" },
      { id: 2, title: "Marketing Meeting" },
    ],
    "2025-05-30q": [
      { id: 3, title: "Team Sync" },
      { id: 4, title: "Bug Report" },
    ],
    "2025-05-s3q1": [
      { id: 1, title: "Chat with John" },
      { id: 2, title: "Marketing Meeting" },
    ],
    "2025-0ssw5-30q": [
      { id: 3, title: "Team Sync" },
      { id: 4, title: "Bug Report" },
    ],
  };

  return (
    <Box
      w="250px"
      // bg="gray.100"
      // boxShadow="md"
      h="100vh"
      position="absolute"
      left="0"
      top="0"
      // transition="0.5s linear"
      transform={isSidebarOpen ? "translateX(0)" : "translateX(-100%)"}
      transition="transform 0.3s ease-in-out"
      boxShadow="md"
      p={2}
    >
      <Flex
        alignItems={"center"}
        justify={"space-between"}
        mb={2}
        pb={2}
        borderBottom="1px solid"
        borderColor="gray.700"
      >
        <Heading
          size="md"
          userSelect="none"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <FaIoxhost /> AI ChatBoard
        </Heading>
        <IconButton
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          variant="outline"
          p={2}
          size="sm"
          me={2}
          // display={{ base: "inline-flex", md: "none" }}
        >
          <PiSidebar />
        </IconButton>
      </Flex>
      {/* New Chat Button */}
      <Box mb={4}>
        <IconButton
          aria-label="New Chat"
          // colorPalette="blue"
          variant="ghost"
          size="sm"
          w="100%"
          justifyContent="flex-start"
          ps={1}
          onClick={(e) => appNavigate("home")} // Pass the handler
        >
          <CiEdit /> New Chat
        </IconButton>
      </Box>

      <Flex align="center" width="100%">
        <Box flex="1" height="1px" bg="gray.700" />
        <Badge
          mx={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MdOutlineHistoryToggleOff style={{ marginRight: 4 }} />
          HISTORY
        </Badge>
        <Box flex="1" height="1px" bg="gray.700" />
      </Flex>
      {/* Chat History Grouped by Date */}
      <VStack align="start" gap={3} overflowY="auto" maxH="calc(100vh - 150px)">
        {Object.entries(chatHistory).map(([date, chats]) => (
          <Box key={date} w="100%">
            <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
              {date}
            </Text>
            {chats.map((chat) => (
              <Box
                key={chat.id}
                p={2}
                _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
                borderRadius="md"
                cursor="pointer"
              >
                <Text fontSize="sm">{chat.title}</Text>
              </Box>
            ))}
            {/* <Divider my={2} /> */}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default memo(AIChatSideBar);
