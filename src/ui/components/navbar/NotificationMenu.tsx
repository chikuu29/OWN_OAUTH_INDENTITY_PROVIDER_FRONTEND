import React from "react";
import {
  Badge,
  Box,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MdNotificationsNone } from "react-icons/md";
import { HSeparator } from "../separator/Separator";
import Notifications from "../Notifications/Notifications";

const NotificationMenu: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notificationsCount = 100;
  let bg = useColorModeValue("white", "gray.950");
  const handleMarkAllRead = () => {
    console.log("Mark all as read");
    // Here you could set notifications to an empty array or any logic you'd like
  };
  return (
    <Menu onOpen={onOpen} onClose={onClose}>
      <IconButton
        as={MenuButton}
        aria-label={"Notifications"}
        variant='outline'
        icon={
          <Box position="relative">
            <Icon boxSize={6} as={MdNotificationsNone} />
            {notificationsCount > 0 && (
              <Badge
                position="absolute"
                top="-19px"
                right="-1px"
                fontSize="0.7em"
                colorScheme="red"
                borderRadius="full"
                boxSize="1.25rem"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {notificationsCount}
              </Badge>
            )}
          </Box>
        }
      />
      {/* Render MenuList only when isOpen is true */}
      {isOpen && (
        <MenuList
          bg={bg}
          boxShadow="lg"
          p="20px"
          borderRadius="20px"
          border="none"
          mt="22px"
          me={{ base: "30px", md: "unset" }}
          minW={{ base: "unset", md: "400px", xl: "450px" }}
          maxW={{ base: "360px", md: "unset" }}
        >
          <Flex justify="space-between" w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600">
              Notifications
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              // color="blue.500"
              ms="auto"
              cursor="pointer"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Text>
          </Flex>
          <HSeparator mb="5px" />
          <Notifications></Notifications>
        </MenuList>
      )}
    </Menu>
  );
};

export default NotificationMenu;
