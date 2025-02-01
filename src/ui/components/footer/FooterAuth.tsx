/*eslint-disable*/
import {
  Center,
  Flex,
  HStack,
  Link,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

export default function Footer() {
  // let textColor = useColorModeValue("gray.400", "white");
  // let linkColor = useColorModeValue({ base: "gray.400", lg: "white" }, "white");
  return (
    <Center>
      <HStack>
        <Link href="#" color="#0969da" fontSize="xs">
          Terms
        </Link>
        <Link href="#" color="#0969da" fontSize="xs">
          Privacy
        </Link>
        <Link href="#" color="#0969da" fontSize="xs">
          Security
        </Link>
        <Link href="#" color="#0969da" fontSize="xs">
          Terms
        </Link>
      </HStack>
    </Center>
  );
}
