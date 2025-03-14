import { RootState } from "@/app/store";
import router from "@/routes";
import { Button, Text, Flex, Grid, SimpleGrid, Image } from "@chakra-ui/react";
import { ifError } from "assert";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function AIView(params: any) {
  console.log("===CALLING AI VIEW===", params);
  const navigate = useNavigate(); // Move useNavigate here
  const items = [
    { id: 1, name: "OAUTH APPLICATION", image: "../assets/icons/oauth.png" ,path:"/ApplicationClients?app=AdminModules"},
    { id: 2, name: "AUTH USERS", image: "../assets/icons/3d-casual-life-user-interface-elements.gif",path:"/AuthUsers?app=AdminModules" },
    // { id: 3, name: "APPLICATION", image: "https://via.placeholder.com/150" },
    // { id: 4, name: "MONITORE", image: "https://via.placeholder.com/150" },
    // { id: 5, name: "REPORT", image: "https://via.placeholder.com/150" },
  ];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const auth = useSelector((state: RootState) => state.auth);

  const handleDefaultNavigate = (url: string) => {
    // e.preventDefault();
    // console.log("On Click handleNavigate", e);
    if (!auth?.isAuthenticated) return;

    const tenant_name = auth?.loginInfo
      ? auth.loginInfo["tenant_name"]
      : "GHOST_TENANT";

    // if (Object.keys(appConfig.actions || {}).length > 0) {
    //   if (appConfig.actions["onClick"] && appConfig.actions["onClick"] !== "") {
    //     // Handle onClick action if necessary
    //     const actionName = appConfig.actions["onClick"];
    //     if (actionName in dynamicFunctions) {
    //       // Call the dynamic function
    //       (dynamicFunctions as any)[actionName](e, appConfig); // Cast to any to access the function
    //     } else {
    //       console.log("====CHECK YOUR METHOD NAME NOT FOUND====");
    //     }
    //   } else {
    //     console.log(auth);

    //     if (appConfig.target && appConfig.target !== "") {
    //       console.log("app", appConfig);
    //       // navigate('')
    //       // navigate(`/GymView?app=myGym`);
    //       // console.log("/GymView?app=myGym");
    //       navigate(`/${tenant_name}${appConfig.target}`);
    //     }
    //   }
    // } else {
    // Handle cases where actions are empty or undefined
    // if (appConfig.target && appConfig.target !== "") {
    console.log(`/${tenant_name}${url}`);

    navigate(`/${tenant_name}y${url}`);

    // }
    // }
  };
  return (
   <h1>AI CHAT BOT</h1>
  );
}
