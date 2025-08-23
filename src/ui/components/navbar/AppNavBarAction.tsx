import {
  Avatar,
  Flex,
  Icon,
  Menu,
  // MenuButton,
  // MenuItem,
  // MenuList,
  // useColorModeValue,
  Text,
  IconButton,
  Button,
  HStack,
} from "@chakra-ui/react";
// import { mode } from "@chakra-ui/theme-tools";
// import DarkModeLightMode from "../darkLightMode/DarkModeLightMode";
import { useAuth } from "../../../contexts/AuthProvider";
import { useSelector } from "react-redux";
import React, { lazy, Suspense } from "react";
import MenuLink from "../sidebar/components/MenuLink";
// import NotificationMenu from "./NotificationMenu";
import { ColorModeButton } from "@/components/ui/color-mode";
const AccountActions = lazy(() => import("./AccountActions"));
import {
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { NavBarActionProps } from "@/app/interfaces/app.interface";

export default function PanelNavBarAction({
  showAuthFullName = true,
}: NavBarActionProps) {
  const auth = useSelector((state: any) => state.auth);
  const { logoutUser } = useAuth();

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems={"center"}
      justifyContent={"end"}
      flexDirection="row"
      gap={2}
    >
      {/* <Menu>
        <DarkModeLightMode
          // marginEnd="7px"
          // boxShadow={shadow}
          cursor="pointer"
          color={navbarIcon}
          // borderRadius="8px"
        />
      </Menu> */}
      {/* <NotificationMenu /> */}

      <ColorModeButton variant={"solid"} colorPalette="blue"></ColorModeButton>
      <MenuRoot>
        <MenuTrigger asChild>
          <HStack>
            {showAuthFullName && (
              <Button variant="solid" colorPalette="blue" size="sm" display={["none", "block"]}>
                {auth.loginInfo ? auth.loginInfo.userFullName : "GUEST"}
              </Button>
            )}
            <Avatar.Root shape="rounded" size="sm" cursor="pointer">
              {/* <Avatar.Fallback
                name={auth.loginInfo ? auth.loginInfo.userFullName : "GUEST"}
              /> */}
              <Avatar.Fallback>
                {auth.loginInfo ? auth.loginInfo.userFullName.charAt(0) : "G"}
              </Avatar.Fallback>
              {/* <Avatar.Image src="https://bit.ly/sage-adebayo" /> */}
            </Avatar.Root>
          </HStack>
        </MenuTrigger>
        <MenuContent>
          <Suspense fallback={<div>Loading...</div>}>
            <AccountActions />
          </Suspense>
        </MenuContent>
      </MenuRoot>
    </Flex>
  );
}
