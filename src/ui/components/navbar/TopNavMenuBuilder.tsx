import {
  useColorMode,
  Box,
  Text,
  Flex,
  useColorModeValue,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
// import { APP_CONFIG_STATE } from "../../../types/appConfigInterface";
// import { RootState } from "../../../app/store";
import { mode } from "@chakra-ui/theme-tools";
// import DynamicIcon from "../../../utils/app/renderDynamicIcons";
import MenuLink from "../sidebar/components/MenuLink";
import React, { memo } from "react";
// import { Link } from "react-router-dom";
import AsyncLoadIcon from "../../../utils/hooks/AsyncLoadIcon";

interface TopNavPropsType {
  FEATURE_LIST: any[];
  SHOW_TOP_NAV_MENU: boolean;
  //   showFullSideBarMenu: boolean;
}
const TopNavMenuBuilder=(props: TopNavPropsType) =>{
  console.log("===CALLING NAVMENUBUILDER===");
  const isPhoneScreen = useBreakpointValue({ base: true, md: false });
  // let navbarBg = useColorModeValue("white", "navy.800");
  // let bg = useColorModeValue("white", "gray.950");
  const { colorMode } = useColorMode();
  const { FEATURE_LIST, SHOW_TOP_NAV_MENU, ...rest } = props;
  if (!SHOW_TOP_NAV_MENU || FEATURE_LIST.length == 0) {
    return null;
  }

  return (
    <Box
      display={{ base: "none", md: "block" }}
      // bg={navbarBg}
      // color="white"
      px="4"
      py="2"
      sx={{
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-track": {
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: mode(
            "secondaryGray.400",
            "whiteAlpha.200"
          )({ colorMode }),
          borderRadius: "24px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "gray.500",
        },
      }}
      overflowX="auto"
    >
      {!isPhoneScreen && (
        <Flex alignItems={"center"}>
          <Flex>
            {FEATURE_LIST.map((navItem: any) => (
              <NavItem key={navItem.label} menuConfig={navItem}></NavItem>
            ))}
          </Flex>
        </Flex>
      )}
    </Box>
    // </Flex>
  );
}

export default memo(TopNavMenuBuilder);


interface MenuLinkInterFace {
  menuConfig: any;
}
const NavItem = ({ menuConfig, ...rest }: MenuLinkInterFace) => {
  console.log("===Calling NavaItem===");

  const { colorMode } = useColorMode();
  // console.log("hii", menuConfig);
  let bg = useColorModeValue("white", "gray.950");
  return (
    <Flex
      align="center"
      p="2"
      mx="2"
      borderRadius="md"
      role="group"
      cursor="pointer"
      // _hover={{
      //   bg: "cyan.400",
      //   color: "white",
      // }}
      // _hover={{
      //   bg: mode("secondaryGray.400", "whiteAlpha.200")({ colorMode }),
      // }}
      {...rest}
    >
      {/* {menuConfig.menu && ( */}
      <Popover trigger={"hover"} placement={"bottom-start"}>
        {menuConfig.menu && menuConfig.menu.length > 0 ? (
          <>
            <PopoverTrigger>
              <HStack
                align="center"
                cursor="pointer"
                w="full"
                p={2}
                borderRadius="md"
                _hover={{
                  bg: mode(
                    "secondaryGray.400",
                    "whiteAlpha.200"
                  )({ colorMode }),
                }}
              >
                {/* <Box as={DynamicIcon(menuConfig.icon)} size="24px" /> */}
                <AsyncLoadIcon iconName={menuConfig.icon} />
                <Text fontSize="0.8rem" fontWeight="600" isTruncated w="full">
                  {menuConfig.label}
                </Text>
              </HStack>
            </PopoverTrigger>

            <PopoverContent
              border={0}
              boxShadow={"xl"}
              p={4}
              rounded={"xl"}
              minW={"sm"}
              bg={bg}
            >
              <Stack>
                {menuConfig.menu.map((child: any, index: number) => (
                  // <DesktopSubNav key={child} subMenu={child} />
                  <React.Fragment key={index}>
                    <MenuLink menuConfig={child} showFullSideBarMenu={true} />
                  </React.Fragment>
                  // <MenuLink</MenuLink>
                ))}
              </Stack>
            </PopoverContent>
          </>
        ) : (
          <MenuLink menuConfig={menuConfig} showFullSideBarMenu={true} />
        )}
      </Popover>
      {/* )} */}

      {/* <Text>{menuConfig.label}</Text> */}
    </Flex>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}
