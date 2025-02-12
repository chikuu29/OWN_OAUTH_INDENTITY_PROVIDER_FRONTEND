import {
  Box,
  HStack,
  VStack,
  Text,
  
} from "@chakra-ui/react";
// import { mode } from "@chakra-ui/theme-tools";

import { Link, NavLink } from "react-router";
// import DashBoard from "../../../../views/dashboard/DashBoard";
import * as dynamicFunctions from "../../../../script/myAppsScript";
// import { IconType } from 'react-icons';
// import * as Icons from 'react-icons/fi';

// import DynamicIcon from "../../../../utils/app/renderDynamicIcons";
import AsyncLoadIcon from "../../../../utils/hooks/AsyncLoadIcon";

interface actions {
  onClick?: any;
  onHover?: any;
}
interface Menu {
  key: string;
  label: string;
  icon: any;
  path: string;
  target?: string;
  actions?: actions;
  // component: any;
}

interface MenuLinkInterFace {
  menuConfig: Menu;
  showFullSideBarMenu: boolean;
}

export default function MenuLink(props: MenuLinkInterFace) {
  const { menuConfig, showFullSideBarMenu } = props;
  // const { colorMode } = useColorMode();
  // const activeBg=useColorModeValue("#F4F7FE", "#171717")

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (menuConfig?.actions?.onClick && menuConfig?.actions?.onClick !== "") {
        if (typeof menuConfig.actions["onClick"] == "function") {
          menuConfig.actions["onClick"]();
        } else {
          const actionName = menuConfig.actions["onClick"];
          if (actionName in dynamicFunctions) {
            // Call the dynamic function
            (dynamicFunctions as any)[actionName](e, menuConfig); // Cast to any to access the function
          } else {
            console.log(
              `%c===CHECK YOUR METHOD ${menuConfig.actions["onClick"]}() NOT FOUND IN 'script/myAppsScript'===`,
              "color:red"
            );
          }
        }
      }
    } catch (error) {
      console.log("%c===ERROR===", error);
    }
  };

  const commonProps = {
    align: "center",
    cursor: "pointer",
    w: "full",
    p: 2,

    borderRadius: "md",
    // _hover: {
    //   bg: mode("secondaryGray.400", "whiteAlpha.200")({ colorMode }),
    // },
  };

  const content = showFullSideBarMenu ? (
    <HStack {...commonProps}>
      {/* <Box as={AsyncLoadIcon(menuConfig.icon)} size="24px" /> */}
      <AsyncLoadIcon iconName={menuConfig.icon} />
      {/* <Box boxSize={"24px"} p={"0px"}><AsyncLoadIcon iconName={menuConfig.icon}/></Box> */}
      <Text fontSize="0.8rem" fontWeight="600"  w="full">
        {menuConfig.label}
      </Text>
    </HStack>
  ) : (
    <VStack {...commonProps}>
      {/* <Box as={AsyncLoadIcon(menuConfig.icon)} size="24px" /> */}
      <AsyncLoadIcon iconName={menuConfig.icon} />
      <Text fontSize="0.5rem" fontWeight="600" textAlign="center">
        {menuConfig.label}
      </Text>
    </VStack>
  );
  return menuConfig.path ? (
    menuConfig.target && menuConfig.target !== "" ? (
      <a
        href={menuConfig.path}
        style={{ width: "100%" }}
        target={menuConfig.target}
        rel="noopener noreferrer" // Security recommendation
      >
        {content}
      </a>
    ) : (
      // <Link to={menuConfig.path} style={{ width: "100%" }}>
      //   {content}
      // </Link>

      <NavLink
        to={menuConfig.path}
        style={({ isActive }) => ({
          background:isActive? 'activeBg':'unset',
          borderRadius:'8px',
          // border:isActive?"1px solid #FEEFEE":'unset',
          // color: isActive ? "red" : "black",
          textDecoration: "none", // Optional: to remove underline
        })}
      >
        {content}
      </NavLink>
    )
  ) : (
    <div style={{ width: "100%" }} onClick={handleClick}>
      {content}
    </div>
  );
}
