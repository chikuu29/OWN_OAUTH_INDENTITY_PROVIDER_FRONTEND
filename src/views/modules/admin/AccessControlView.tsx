import { GETAPI } from "@/app/api";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Box,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  Badge,
  Icon,
  HStack,
  Switch,
  Float,
} from "@chakra-ui/react";
import path from "path";
import { useEffect } from "react";
import { IconType } from "react-icons";
import {
  FaUserShield,
  FaUserTie,
  FaUserCheck,
  FaUsers,
  FaCircle,
} from "react-icons/fa";
import { MdBusiness } from "react-icons/md";

const AccessControlView = () => {
  const roles = ["Administrator", "Editor", "Viewer", "Contributor", "Guest"];
  const tenantsWithRoles: any[] = [
    {
      id: 1,
      name: "Tenant A",
      roles: ["Admin", "Manager", "Viewer", "Analyst"],
      isActive: true,
    },
    {
      id: 2,
      name: "Tenant B",
      roles: ["Admin", "Editor"],
      isActive: false,
    },
    {
      id: 3,
      name: "Tenant C",
      roles: ["Viewer", "Moderator", "Supervisor", "Support", "Assistant"],
      isActive: true,
    },
  ];

  // Map specific roles to their corresponding icons
  const roleIcons: Record<string, IconType> = {
    Admin: FaUserShield,
    Manager: FaUserTie,
    Viewer: FaUserCheck,
    Editor: FaUsers,
    Moderator: FaUserCheck,
  };

  // Maximum roles to display before showing "more"
  const MAX_DISPLAY_ROLES = 3;

  useEffect(() => {

    GETAPI({
      path: "/account/tenants",
      isPrivateApi: true,

    }).subscribe((res:any) => {
      console.log("===ROLES===", res.data);
      if(res.success){
        
      }
    })

  },[])


  return (
    <Box p={5}>
      <Heading mb={6} textAlign="center">
        🏢 Tenants and Their Roles
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} gap={8}>
        {tenantsWithRoles.map((tenant) => (
          <Box
            position={"relative"}
            key={tenant.id}
            p={3}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
          >
            <VStack align="start" gap={3} mt={2}>
              <HStack>
                <Icon as={MdBusiness} boxSize={6} color="teal.500" />
                <Text fontSize="md" fontWeight="bold">
                  {tenant.name}
                </Text>
              </HStack>

              <Box>
                <Text fontWeight="semibold" mb={2} color="fg.muted">
                  Roles:
                </Text>

                <HStack wrap="wrap" gap={2}>
                  {tenant.roles.slice(0, MAX_DISPLAY_ROLES).map((role: any) => (
                    <Badge
                      cursor={"pointer"}
                      key={role}
                      colorPalette="blue"
                      mr={2}
                      mt={1}
                      display="flex"
                      alignItems="center"
                      _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                    >
                      <Icon
                        as={roleIcons[role] || FaUsers}
                        boxSize={4}
                        mr={1}
                      />
                      {role}
                    </Badge>
                  ))}

                  {/* Show ellipsis if more roles exist */}
                  {tenant.roles.length > MAX_DISPLAY_ROLES && (
                    <Tooltip
                      content={tenant.roles.slice(MAX_DISPLAY_ROLES).join(", ")}
                      // aria-label="More roles"
                    >
                      <Badge colorPalette="red" mt={1} cursor="pointer">
                        +{tenant.roles.length - MAX_DISPLAY_ROLES} more
                      </Badge>
                    </Tooltip>
                  )}
                </HStack>
              </Box>
            </VStack>
            <Box>
              <Float placement={"top-center"}>
                <Badge
                  colorPalette={tenant.isActive ? "green" : "red"}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FaCircle} boxSize={2} mr={1} />
                  {tenant.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </Float>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AccessControlView;
