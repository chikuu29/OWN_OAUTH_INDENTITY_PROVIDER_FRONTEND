import { RootState } from "@/app/store";
import router from "@/routes";
import { SlLike } from "react-icons/sl";
import {
  Button,
  Text,
  Flex,
  Grid,
  SimpleGrid,
  Image,
  Box,
  Container,
  IconButton,
} from "@chakra-ui/react";
import { ifError } from "assert";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import MessageInput from "./MessageInput";
import { GoCopy } from "react-icons/go";
import { MdOutlineAnalytics } from "react-icons/md";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
export default function AIView(params: any) {
  console.log("===CALLING AI VIEW===", params);
  const navigate = useNavigate(); // Move useNavigate here
  const items = [
    {
      id: 1,
      name: "OAUTH APPLICATION",
      image: "../assets/icons/oauth.png",
      path: "/ApplicationClients?app=AdminModules",
    },
    {
      id: 2,
      name: "AUTH USERS",
      image: "../assets/icons/3d-casual-life-user-interface-elements.gif",
      path: "/AuthUsers?app=AdminModules",
    },
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
  const messages = [
    { sender: "User1", text: "Hello 👋" },
    {
      sender: "Give poem in english",
      text: "Of course! Here's a short and sweet English poem for you:\n\n---\n\n**Whispers of the Sky**  \nThe sun peeks out with a golden smile,  \nPainting the world in light for a while.  \nBirds sing songs in a gentle breeze,  \nDancing with leaves on quiet trees.  \n\nThe clouds drift by in cotton white,  \nTelling tales in the soft daylight.  \nAnd as the stars begin to gleam,  \nThe night arrives like a peaceful dream.\n\n---\n\nWould you like the poem to be about something specific—like love, nature, friendship, or dreams?",
    },
    {
      sender: "Give me in table ",
      text: "Sure! Here's the poem from above presented in a **table format** for easier reading or formatting:\n\n| **Line Number** | **Poem Line**                              |\n|-----------------|---------------------------------------------|\n| 1               | The sun peeks out with a golden smile,     |\n| 2               | Painting the world in light for a while.   |\n| 3               | Birds sing songs in a gentle breeze,       |\n| 4               | Dancing with leaves on quiet trees.        |\n| 5               | The clouds drift by in cotton white,       |\n| 6               | Telling tales in the soft daylight.        |\n| 7               | And as the stars begin to gleam,           |\n| 8               | The night arrives like a peaceful dream.   |\n\nWould you like this in a downloadable table format (like PDF or Excel), or should I generate a different style of poem in a table?",
    },
  ];
  const currentUser = "User1";
  return (
    <>
      <Flex
        direction="column"
        height="100%"
        maxHeight="100vh"
        overflow="hidden"
        // bg={'gray.800'}
        p={0}
      >
        <Box flex="1" overflowY="auto" p={4}>
          <Container maxW="container.sm" height="100vh" p={0}>
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.sender === currentUser;
              return (
                <>
                  <Box p={5} mb={2}>
                    <Flex
                      key={idx}
                      justify={isCurrentUser ? "flex-end" : "flex-start"}
                    >
                      <Box
                        // bg={isCurrentUser ? "gray.700" : ""}
                        // bg={'gray.700'}
                        // color={isCurrentUser ? "white" : "black"}
                        color={useColorModeValue("black", "white")}
                        px={4}
                        py={2}
                        borderRadius="md"
                        boxShadow={"md"}
                        maxW="70%"
                      >
                        <Text fontSize="sm">{msg.text}</Text>
                      </Box>
                    </Flex>
                    {!isCurrentUser && (
                      <Box
                        // ms={2}
                        p={1}
                        mt={1}
                        borderRadius={'md'}
                        display={"flex"}
                        gap={2}
                        boxShadow={"md"}
                        width="fit-content"
                        maxW="100%"
                      >
                        <IconButton size={"2xs"} variant={"outline"}>
                          <GoCopy />{" "}
                        </IconButton>
                        <IconButton size={"2xs"} variant={"outline"}>
                          <MdOutlineAnalytics />{" "}
                        </IconButton>
                        <IconButton size={"2xs"} variant={"outline"}>
                          <SlLike  />{" "}
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </>
              );
            })}
          </Container>
        </Box>

        <MessageInput />
        <Text color={"gray.500"} textAlign={"center"} p={2}>
          AI can make mistakes. Check important info.
        </Text>
      </Flex>
    </>
  );
}
