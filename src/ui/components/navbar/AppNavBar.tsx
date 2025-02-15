import { Box, Flex, Icon, IconButton } from "@chakra-ui/react";

import PanelNavBarAction from "./AppNavBarAction";
import { MdMenu } from "react-icons/md";
import { SidebarResponsive } from "../sidebar/PanelSideBar";
import Brand from "../Brand/Brand";
// import TopNavMenuBuilder from "./TopNavMenuBuilder";
import { memo } from "react";
import { ColorModeButton } from "@/components/ui/color-mode";
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

  // let navbarPosition = "fixed";
  let navbarFilter = "none";
  // let navbarBackdrop = "blur(20px)";
  let navbarShadow =
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;";
  // let navbarBg = useColorModeValue("white", "gray.950");
  // let navbarBg = useColorModeValue("white", "navy.800");

  return (
    <Box
      // bg={navbarBg}
      // boxShadow={navbarShadow}
      // filter={navbarFilter}
      // backgroundPosition="center"
      // backgroundSize="cover"
      // transitionDelay="0s, 0s, 0s, 0s"
      // transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      // transition-property="box-shadow, background-color, filter, border"
      // transitionTimingFunction="linear, linear, linear, linear"
      // alignItems={{ xl: "center" }}
      // display={"flex"}
      // minH="75px"
      // justifyContent={{ xl: "center" }}
      // mx="auto"
      w="100%"
      boxShadow="md"
      position="fixed"
      top="1"
      left="0"
      zIndex={999}
    >
      <Flex
        // zIndex={999}
        // position={"fixed"}
        // justify={'center'}
        w="100%"
        align={"center"}
        justify={"space-between"}
        px={4}
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
  );
};

export default memo(AppNav);
