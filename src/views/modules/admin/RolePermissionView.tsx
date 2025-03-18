import { GETAPI } from "@/app/api";
import {
  Box,
  VStack,
  Badge,
  SimpleGrid,
  Text,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineSecurity } from "react-icons/md";
import { useParams } from "react-router";

interface RoleBoxProps {
  role: string;
  description: string;
  colorScheme?: string;
}

const RoleBox: React.FC<RoleBoxProps> = ({
  role,
  description,
  colorScheme = "teal",
}) => {
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      cursor={"pointer"}
      //   bg="white"
      // _hover={{ boxShadow: "lg" }}
      _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
    >
      <VStack align="start" gap={3}>
        <Badge
          colorPalette={colorScheme}
          px={2}
          py={1}
          borderRadius="md"
          textTransform={"uppercase"}
        >
          {role}
        </Badge>
        <Text fontSize="md" color="gray.600">
          {description || "No description"}
        </Text>
      </VStack>
    </Box>
  );
};

const RolePermissionView = () => {
  console.log(useParams());
  const { r } = useParams();
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    GETAPI({
      path: `/auth/roles/${r}`,
      isPrivateApi: true,
    }).subscribe((res) => {
      console.log(res);
      if (res.success) {
        setRoles(res["data"]);
      }
    });
  }, []);
  return (
    <Box>
      <Heading>
        <Box display={"Flex"} alignItems={"center"} justifyContent={"center"}>
          <MdOutlineSecurity style={{ marginRight: "8px" }} color="green" />{" "}
          Roles and Permissions
        </Box>
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} gap={6} p={5}>
        {roles.map((role) => (
          <RoleBox
            key={role.id}
            role={role.role_name}
            description={role.description}
            colorScheme="blue"
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RolePermissionView;
