import { Box, Flex, Icon, IconButton } from "@chakra-ui/react";

import PanelNavBarAction from "./AppNavBarAction";
import { MdMenu } from "react-icons/md";
import { SidebarResponsive } from "../sidebar/PanelSideBar";
import Brand from "../Brand/Brand";
// import TopNavMenuBuilder from "./TopNavMenuBuilder";
import { memo } from "react";
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode";
// import React from "react";
interface AppNavType {
  DISPLAY_TYPE: any[];
  FEATURE: any[];
  requiredSideBar: boolean;
  togglesidebar: () => void;
}

const AppNav = ({
  DISPLAY_TYPE,
  FEATURE,
  requiredSideBar = true,
  togglesidebar,
  ...rest
}: AppNavType & any) => {
  console.log("===CALLING NAVBAR===");
  const bgColor = useColorModeValue("white", "dark.100");
  return (
    <Box minH="50px">
      <Box
        w="100%"
        boxShadow="md"
        // position="fixed"
        // position="sticky"
        // top="1"
        // left="0"
        zIndex={999}
        // minH="75px"
        position="fixed"
        top="0"
        left="0"
        bg={bgColor}
      >
        <Flex
          w="100%"
          // zIndex={999}
          px={4}
          align={"center"}
          justify={"space-between"}
          // px={4}
          //  position="fixed"
          // boxShadow="md"
          // {...rest}
        >
          <Flex alignItems={"center"} gap={1}>
            <Box>
              {DISPLAY_TYPE.SHOW_SIDE_NAV_MENU && (
                <IconButton
                  aria-label="Menu"
                  // icon={<Icon as={MdMenu} h="20px" w="20px" />}
                  display={{ base: "none", sm: "none", xl: "block" }}
                  cursor="pointer"
                  variant="outline"
                  onClick={togglesidebar}
                >
                  <MdMenu />
                </IconButton>
              )}
              {/* {FEATURE.length > 0 && <SidebarResponsive FEATURE_LIST={FEATURE} />} */}
            </Box>
            <Box>
              <Brand />
            </Box>
          </Flex>
          {/* <TopNavMenuBuilder
          FEATURE_LIST={FEATURE}
          SHOW_TOP_NAV_MENU={DISPLAY_TYPE.SHOW_TOP_NAV_MENU}
        /> */}
          <Flex justify={"flex-end"}>
            <PanelNavBarAction />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default memo(AppNav);
