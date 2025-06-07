import React, { useEffect, useRef, useState } from "react";
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
  
  const textareaRef:any = useRef(null);
  // Adjust textarea height whenever message changes
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set new height based on content (min 30px, max 200px)
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, 20),
        200
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);


  return (
    <Box m={1}>
      <Box
        p={3}
        bg={useColorModeValue("#e3e3e3", "gray.800")}
        borderRadius={"2xl"}
        boxShadow={"md"}
        width={"90%"}
        // width='auto'
        m="auto"
      >
        {/* <HStack> */}
        {/* <Textarea
          maxHeight={'200px'}
          minHeight={"30px"}
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
        /> */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          minH="20px"
          maxH="200px"
          color={useColorModeValue("black", "white")}
          size="sm"
          outline="none"
          border="none"
          // overflow="hidden" // Hide all scrollbars
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          resize="none" // Disable manual resizing
        />
        <Flex justifyContent={"space-between"} mt={1}>
          <IconButton
            aria-label="Send message"
            onClick={handleSend}
            colorPalette="blue"
            variant={"outline"}
            size={"sm"}
            //   isLoading={isLoading}
          >
            <MdAutoFixHigh />
          </IconButton>

          <IconButton
            aria-label="Send message"
            onClick={handleSend}
            colorPalette="blue"
            variant={"outline"}
            // variant={"solid"}
            size={"sm"}
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
