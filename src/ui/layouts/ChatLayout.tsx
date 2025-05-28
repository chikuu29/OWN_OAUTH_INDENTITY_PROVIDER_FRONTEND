import { Box, Center, Container, Flex, VStack } from "@chakra-ui/react";
// import Navbar from "../../components/navbar/AppNavBar";
// import PanelSideBar from "../../components/sidebar/PanelSideBar";
import { memo, useState } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
// import { APP_CONFIG_STATE } from "../../../app/interfaces/app.interface";
// import { RootState } from "../../../app/store";
// import AppFooter from "../../components/footer/AppFooter";
import Appbreadcurmb from "@/ui/components/navbar/Appbreadcurmb";

const ChatLayout=()=> {
  console.log("%c====EXECUTE CHAT LAYOUT=====", "color:white");
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
//   const { DISPLAY_TYPE, FEATURE }: APP_CONFIG_STATE = useSelector(
//     (state: RootState) => state.app.AppConfigState
//   );
// console.log("features",FEATURE);

  return (
    <Box h="100vh" >
  
      {/* <Navbar
        togglesidebar={toggleSidebar}
        FEATURE={FEATURE}
        DISPLAY_TYPE={DISPLAY_TYPE}
      /> */}
      
      {/* Main Content */}
      {/* <Flex flex="1" > */}
        {/* <PanelSideBar showSidebar={showSidebar} togglesidebar={toggleSidebar} /> */}
        {/* Main Content */}
        <VStack  flex={1} align="stretch" m={"1.4rem"}>
          {/* <Container > */}
            <Outlet></Outlet>
          {/* </Container> */}
          {/* <AppFooter /> */}
        </VStack>
      {/* </Flex> */}
  
    </Box>
  );
}

export default memo(ChatLayout);
