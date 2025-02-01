import {
  Avatar,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  Text,
  IconButton,
} from "@chakra-ui/react";
// import { mode } from "@chakra-ui/theme-tools";
import DarkModeLightMode from "../darkLightMode/DarkModeLightMode";
import { useAuth } from "../../../contexts/AuthProvider";
import { useSelector } from "react-redux";
import React from "react";
import MenuLink from "../sidebar/components/MenuLink";
import NotificationMenu from "./NotificationMenu";

export default function PanelNavBarAction() {
  const navbarIcon = useColorModeValue("gray.400", "white");
  // let menuBg = useColorModeValue("white", "navy.800");
  let bg = useColorModeValue("white", "gray.950");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  // const { colorMode } = useColorMode();
  const auth = useSelector((state: any) => state.auth);

  const { logoutUser } = useAuth();
  const actionList = [
    {
      label: "User Account",
      icon: "FiUser",
      // path: "/user/account",
    },
    {
      label: "Logout",
      icon: "FiLogOut",
      actions: {
        onClick: logoutUser,
      },
    },
  ];

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems={"center"}
      justifyContent={"end"}
      flexDirection="row"
    >
      <Menu>
        <DarkModeLightMode
          // marginEnd="7px"
          // boxShadow={shadow}
          cursor="pointer"
          color={navbarIcon}
          // borderRadius="8px"
        />
      </Menu>
      <NotificationMenu />
      <Menu>
        <MenuButton>
          <Avatar
            boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
            _hover={{ cursor: "pointer" }}
            color="white"
            name={auth.loginInfo ? auth.loginInfo.userFullName : "GUEST"}
            src={auth.loginInfo ? auth.loginInfo.image : undefined}
            // bg="#90cdf4"
            borderRadius="4px"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          bg={bg}
          borderRadius="20px"
          boxShadow={shadow}
          mt="22px"
          border="none"
        >
          <Flex w="100%" mb="0">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey,{" "}
              {auth.loginInfo
                ? auth.loginInfo.userFullName.slice(0, 5)
                : "GUEST"}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px" gap="5px">
            {actionList.map((child: any, index: number) => (
              // <DesktopSubNav key={child} subMenu={child} />
              <React.Fragment key={index}>
                <MenuLink menuConfig={child} showFullSideBarMenu={true} />
              </React.Fragment>
              // <MenuLink</MenuLink>
            ))}
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
