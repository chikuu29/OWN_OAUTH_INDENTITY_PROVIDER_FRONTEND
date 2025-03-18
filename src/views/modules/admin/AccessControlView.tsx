import { GETAPI } from "@/app/api";
import { RootState } from "@/app/store";
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
  Flex,
} from "@chakra-ui/react";
import path from "path";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import {
  FaUserShield,
  FaUserTie,
  FaUserCheck,
  FaUsers,
  FaCircle,
} from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router";

const AccessControlView = () => {
  const roles = ["Administrator", "Editor", "Viewer", "Contributor", "Guest"];
  const [tenantsWithRoles, setTenantWithRoles] = useState<any[]>([]);
  const auth = useSelector((state: RootState) => state.auth);
  // Map specific roles to their corresponding icons
  const roleIcons: Record<string, IconType> = {
    Admin: FaUserShield,
    Manager: FaUserTie,
    Viewer: FaUserCheck,
    Editor: FaUsers,
    Moderator: FaUserCheck,
  };
  const navigate = useNavigate();

  // Maximum roles to display before showing "more"
  const MAX_DISPLAY_ROLES = 3;

  useEffect(() => {
    GETAPI({
      path: "/account/tenants-with-roles",
      isPrivateApi: true,
    }).subscribe((res: any) => {
      console.log("===ROLES===", res);
      setTenantWithRoles(res);
    });
  }, []);

  const { view, secondaryView} = useParams(); // Access the `view` and `params` from the URL
  const [searchParams] = useSearchParams();
  const appName = searchParams.get("app") || "Default";


  const handleDefaultNavigate = (tenant: any) => {
    console.log(tenant);

    // e.preventDefault();
    // console.log("On Click handleNavigate", e);
    if (!auth?.isAuthenticated) return;

    const tenant_name = auth?.loginInfo
      ? auth.loginInfo["tenant_name"]
      : "GHOST_TENANT";

    const url = `/${tenant_name}/${view}/manage_role_permissions/${tenant.tenant_id}?app=${appName}`;
    navigate(url);
  };
  return (
    <Box p={5}>
      <Heading mb={6} textAlign="center">
        🏢 Tenants and Their Roles
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} gap={8}>
        {tenantsWithRoles.map((tenant) => (
          <Box
            position={"relative"}
            key={tenant.tenant_id}
            p={3}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
            cursor={"pointer"}
            onClick={() => handleDefaultNavigate(tenant)}
          >
            <VStack align="start" gap={3} mt={2}>
              <HStack maxW={"300px"} wrap={"wrap"}>
                <Icon as={MdBusiness} boxSize={6} color="teal.500" />

                <Text fontSize="md" fontWeight="bold" truncate>
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
                      textTransform={'uppercase'}
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
