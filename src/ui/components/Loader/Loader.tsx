import { useState, useEffect } from "react";
import {
  Flex,
  Progress,
  Spinner,
  Box,
  Center,
  Text,
  Image,
  // useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
// const spinWithColorChange = keyframes`
//   0% {
//     transform: rotate(0deg);
//     border-color: red;
//   }
//   25% {
//     border-color: red;
//   }
//   50% {
//     transform: rotate(180deg);
//     border-color: blue;
//   }
//   75% {
//     border-color: blue;
//   }
//   100% {
//     transform: rotate(360deg);
//     border-color: green;
//   }
// `;

// const animateShadow = keyframes`
//   0% {
//     box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
//   }
//   50% {
//     box-shadow: rgba(60, 64, 67, 0.5) 0px 4px 8px 0px, rgba(60, 64, 67, 0.3) 0px 4px 8px 1px;
//   }
//   100% {
//     box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
//   }
// `;
const Loader = ({
  size = "xl",
  thickness = "4px",
  speed = "0.65s",
  color = "gray.800",
  // loaderText = "Loading Please Wait..",
  ...props
}) => {
  // let bgColor = useColorModeValue("white", "gray.950");
  //  const { colorMode } = useColorMode()
   const bg = useColorModeValue("gray.800", 'white')
   color = useColorModeValue("white", "gray.800")
 

  const {active,loaderText} = useSelector((state:RootState) => state.loader);
  if (!active) return null;
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex="9999"
      bg="rgba(0, 0, 0, 0.9)"
    >
      <Center height="100vh">
        <Box
          bg={bg}
          borderRadius="xl"
          textAlign="center"
        >
          <HStack  p={4}>
            {/* <Image
              width="100px"
              height="100px"
              boxSize="200px"
              src={"../assets/gif/loader.gif"}
              alt={"logoAlt"}
              objectFit="contain" 
  
            /> */}
            <Spinner
              // thickness="4px"
              // speed="0.65s"
              // emptyColor="gray.750"
              // color={bgColor}
              borderWidth="4px"
              color={'teal.500'}
              size="lg"
              // border="8px solid"
              // borderColor="red" // Initial color
              // borderRadius="50%"
              // animation={`${spinWithColorChange} 2s linear infinite`}
            />
            <Text fontSize="sm" color={color} fontWeight={'bold'} >
              {loaderText}
            </Text>
          </HStack>
        </Box>
      </Center>
    </Box>
  );
};

export const AppLoader = () => {
  const [progress, setProgress] = useState(0);
  // let bg = useColorModeValue("white", "navy.800");
  // Simulate progress increment for loading bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 500); // Increment progress every 500ms

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      height="100vh"
      // bg={bg}
    >
      <Image src={"../assets/gif/loader.gif"} alt="App Logo" boxSize="120px" mb={8} />
      <Spinner  color="teal.500" size="xl" />
      <Text fontSize="lg" mt={4} textAlign={'center'}>
       Just a moment , we're getting things ready for you...
      </Text>
      {/* <Progress
        value={progress}
        size="sm"
        colorScheme="teal"
        width="80%"
        mt={4}
      /> */}
    </Flex>
  );
};



export default Loader;
