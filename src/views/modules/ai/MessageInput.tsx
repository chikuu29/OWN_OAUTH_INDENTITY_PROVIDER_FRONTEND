import React, { useState } from "react";
import {
  Box,
  Input,
  IconButton,
  HStack,
  Flex,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { FaArrowUp, FaPaperPlane } from "react-icons/fa";
import { MdAutoFixHigh } from "react-icons/md";
import { useColorModeValue } from "@/components/ui/color-mode";

type MessageInputProps = {
  onSend?: (message: string) => void;
  placeholder?: string;
  isLoading?: boolean;
};

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder = "Ask Anything About You Data",
  isLoading = false,
}) => {
  const [message, setMessage] = useState("");
  //   const toast = useToast();

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      //   toast({
      //     title: "Cannot send empty message.",
      //     status: "warning",
      //     duration: 2000,
      //     isClosable: true,
      //   });
      //   return;
    }
    // onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box m={1} >
      <Box
        p={3}
        bg={useColorModeValue("#FFFFFF", "gray.800")}
        borderRadius={"4xl"}
        boxShadow={"md"}
        width={"70%"}
        m="auto"
      >
        {/* <HStack> */}
        <Textarea
          maxHeight={'200px'}
          // rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          color={useColorModeValue("black", "white")}
          size="sm"
          outline="none"
          border="none"
          overflowX="hidden" // Prevent horizontal scroll
          whiteSpace="pre-wrap" // Preserve line breaks and wrap long lines
          wordBreak="break-word" // Break long words if needed
        />
        <Flex justifyContent={"space-between"} mt={1}>
          <IconButton
            aria-label="Send message"
            onClick={handleSend}
            // colorPalette="blue"
            variant={"solid"}
             size={'sm'}
            //   isLoading={isLoading}
          >
            <MdAutoFixHigh />
          </IconButton>

          <IconButton
            aria-label="Send message"
            onClick={handleSend}
            // colorPalette="blue"
            variant={"solid"}
            size={'sm'}
            //   isLoading={isLoading}
          >
            <FaArrowUp />
          </IconButton>
        </Flex>
        {/* <HStack alignItems={'center'}> */}
     
        {/* </HStack> */}
        {/* </HStack> */}
      </Box>
    </Box>
  );
};

export default MessageInput;
