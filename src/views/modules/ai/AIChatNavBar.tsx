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
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { AiOutlineWechatWork } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { FaIoxhost } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import { PiSidebar } from "react-icons/pi";

interface AIChatNavBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}
const AIChatNavBar = ({isSidebarOpen,onToggleSidebar}:AIChatNavBarProps) => {


 
  return (
    <Box>
      <Flex align="center" p={2}>
        {!isSidebarOpen && (
          <>
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
              borderRadius={"full"}
              // onClick={handleShare}
              userSelect="none"
              p={2}
            >
              {<FiShare />}
              Share
            </IconButton>
          </Tooltip>
          <PanelNavBarAction showAuthFullName={false} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default memo(AIChatNavBar);
