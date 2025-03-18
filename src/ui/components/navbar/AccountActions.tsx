import { Avatar } from "@/components/ui/avatar";
import { CloseButton } from "@/components/ui/close-button";
import { useAuth } from "@/contexts/AuthProvider";
import {
  Box,
  VStack,
  Text,
  Button,
  Flex,
  Heading,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";
import { memo } from "react";

const AccountsActions = () => {
  const auth = useSelector((state: any) => state.auth);
 

  const {logoutUser}=useAuth()

  return (
    <Box
      p={4}
    //   borderWidth="1px"
    //   borderRadius="lg"
    //   boxShadow="md"
      maxW="sm"
      textAlign="center"
      w="300px"
    >
      {/* <Flex justify="flex-end">
                <CloseButton  />
            </Flex> */}
      <VStack gap={4}>
        {/* Email */}
        <Text fontSize="md" fontWeight="bold">
          {auth.loginInfo?.email}
        </Text>

        <Avatar
          size="xl"
          src="https://bit.ly/sage-adebayo"
          name={auth.loginInfo ? auth.loginInfo.userFullName : "Guest"}
        ></Avatar>
        <Text fontSize="xl" fontWeight="bold" pt={4}>
          Hi,{auth.loginInfo?.firstName} !
        </Text>

        {/* Manage Account Button */}
        
        <IconButton variant={'outline'} w={'full'} colorPalette="blue">
          <FiSettings />
          Manage Account
        </IconButton>
        <IconButton variant={'outline'} w={'full'}  colorPalette="red" onClick={logoutUser}> 
          <FiLogOut />
          Sign Out
        </IconButton>
       
      </VStack>
    </Box>
  );
}
export default memo(AccountsActions);