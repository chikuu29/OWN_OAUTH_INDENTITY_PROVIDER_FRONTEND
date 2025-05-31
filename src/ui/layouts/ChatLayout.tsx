import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  VStack,
  Text,
} from "@chakra-ui/react";
// import Navbar from "../../components/navbar/AppNavBar";
// import PanelSideBar from "../../components/sidebar/PanelSideBar";
import { memo, useState } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
// import { APP_CONFIG_STATE } from "../../../app/interfaces/app.interface";
// import { RootState } from "../../../app/store";
// import AppFooter from "../../components/footer/AppFooter";
import Appbreadcurmb from "@/ui/components/navbar/Appbreadcurmb";
import Navbar from "../components/navbar/AppNavBar";
import PanelNavBarAction from "../../ui/components/navbar/AppNavBarAction";
import { FaShareAlt } from "react-icons/fa";
import { Tooltip } from "@/components/ui/tooltip";
import { PiSidebar } from "react-icons/pi";
import { AiOutlineWechat, AiOutlineWechatWork } from "react-icons/ai";
import { useColorModeValue } from "@/components/ui/color-mode";
const ChatLayout = () => {
  console.log("%c====EXECUTE CHAT LAYOUT=====", "color:white");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  // Dummy data (grouped by date)
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
    <Box h="100vh" w="100vw" overflow={"hidden"}>
      <Flex h="calc(100vh - 64px)" position="relative">
        {/* {isSidebarOpen && ( */}
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
          <Flex alignItems={"center"} justify={"space-between"} mb={3}>
            <Heading size="md" userSelect="none">
              💬 ChatBoard
            </Heading>
            <IconButton
              aria-label="Toggle sidebar"
              onClick={toggleSidebar}
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
              colorPalette="blue"
              variant="solid"
              size="sm"
              w="100%"
            >
              <AiOutlineWechat /> New Chat
            </IconButton>
          </Box>

          {/* Chat History Grouped by Date */}
          <VStack
            align="start"
            gap={3}
            overflowY="auto"
            maxH="calc(100vh - 150px)"
          >
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
        {/* )} */}
        <Box
          flex="1"
          color={"darkblue"}
          ml={isSidebarOpen ? "250px" : "0"}
          transition="margin-left 0.3s ease-in-out"
        >
          {/* CHAT NAV BAR */}
          <Box>
            <Flex align="center" p={2}>
              {!isSidebarOpen && (
                <>
                  <IconButton
                    aria-label="Toggle sidebar"
                    onClick={toggleSidebar}
                    variant="outline"
                    p={2}
                    size="sm"
                    me={2}
                    // display={{ base: "inline-flex", md: "none" }}
                  >
                    <PiSidebar />
                  </IconButton>
                  <Tooltip content="New chat" showArrow>
                    <IconButton
                      // icon={<HamburgerIcon />}
                      aria-label="Toggle sidebar"
                      // onClick={onToggleSidebar}
                      variant="outline"
                      p={2}
                      size="sm"
                      me={2}
                      // display={{ base: "inline-flex", md: "none" }}
                    >
                      <AiOutlineWechatWork />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              
              <Flex align="center" ml="auto">
                <Tooltip content="Share chat" showArrow>
                  <IconButton
                    me={2}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    // onClick={handleShare}
                    userSelect="none"
                    p={2}
                  >
                    {<FaShareAlt />}
                    Share
                  </IconButton>
                </Tooltip>
                <PanelNavBarAction />
              </Flex>
            </Flex>
          </Box>
          {/* CHAR BODY */}

          <Outlet></Outlet>
        </Box>
      </Flex>
    </Box>
  );
};

export default memo(ChatLayout);
