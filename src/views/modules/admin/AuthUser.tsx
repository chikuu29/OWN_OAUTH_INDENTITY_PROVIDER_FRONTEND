import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  VStack,
  Text,
  IconButton,
  Heading,
  HStack,
  Stack,
  Highlight,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";

import { IoCreateOutline } from "react-icons/io5";

import { GETAPI } from "@/app/api";
import { TableWidget } from "@/ui/components/widget/TableWidget";

const AuthUsersView = () => {
  console.log("===CALLING AuthUsersView===");
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_id: "",
    client_secret: "",
    client_type: "confidential",
    authorization_grant_types: ["authorization_code", "refresh_token"],
    redirect_urls: "",
    post_logout_redirect_urls: "",
    allowed_origins: "",
    token_endpoint_auth_method: "client_secret_basic",
    scope: "read write",
    response_types: ["code"],
    grant_types: ["authorization_code", "refresh_token"],
    algorithm: "HS256",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [tableData, setTableData] = useState<any[]>([]);
  const [paginationSettings, setPaginationSettings] = useState<{
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }>({
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    GETAPI({
      path: "/account/auth_users",
      isPrivateApi: true,
    }).subscribe((res: any) => {
      console.log("Applictions Clients", res);
      if (res.success && res["data"].length > 0) {
        setTableData(res["data"]);
        setPaginationSettings({
          totalPages: res.total,
          pageSize: 10,
          currentPage: 1,
        });
      }
    });
  }, []);

  const onSubmit = handleSubmit(async (formState) => {
    console.log(formState);

    //   e.preventDefault();
    //   console.log("userCredentials", userCredentials);
    //   setLoading(true);
  });

  return (
    <>
      {/* <Flex gap={5} wrap={"wrap"}>
        {[1, 3].map((e: any) => (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            padding={"3"}
            cursor={"pointer"}
            transition="all 0.3s ease"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "xl",
            }}
          >
            <VStack gap={2}>
              <Text fontWeight={"bold"} fontSize={"small"}>
                ACTIVE OAUTH
              </Text>
              <Button
                variant={"outline"}
                colorPalette={"blue"}
                w={"100%"}
                size={"sm"}
              >
                2
              </Button>
            </VStack>
          </Box>
        ))}
      </Flex> */}
      <Box position={"sticky"} top={["7.6rem", "64px", "4rem"]}>
        <Box mt={3} mb={3}>
          <Flex justifyContent={"space-between"}>
            <Stack>
              <Heading size="2xl" letterSpacing="tight">
                <Highlight query="APPLICATIONS" styles={{ color: "teal.600" }}>
                  AUTH USERS
                </Highlight>
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                Manage Auth users 
              </Text>
            </Stack>
            <HStack>
              {/* <IconButton padding={5} variant={"solid"} colorPalette={"blue"}>
                <IoCreateOutline />
                Create new clients
              </IconButton> */}
            </HStack>
          </Flex>
        </Box>
        <Box borderBottom="1px solid" borderColor="gray.700" my={4} />
        <TableWidget
          data={tableData}
          paginationRequired={true}
          paginationSettings={paginationSettings}
          
        />
      </Box>
      {/* <Box
        maxW="500px"
        mx="auto"
        mt={10}
        p={5}
        boxShadow="lg"
        borderRadius="md"
      >
        <form onSubmit={onSubmit}>
          <VStack gap={4}>
            <Field
              label="Client ID"
              required
              w="100%"
              errorText={errors.client_id?.message?.toString()}
              invalid={!!errors.client_id}
            >
              <InputGroup flex="1" w="100%">
                <Input
                  {...register("client_id", {
                    required: "Client ID is required",
                  })}
                  placeholder="Enter Client ID"
                />
              </InputGroup>
            </Field>

            <Field
              label="Client Secret"
              required
              w="100%"
              errorText={errors.client_secret?.message?.toString()}
              invalid={!!errors.client_secret}
            >
              <InputGroup flex="1" w="100%">
                <Input
                  type="password"
                  {...register("client_secret", {
                    required: "Client Secret is required",
                  })}
                  placeholder="Enter Client Secret"
                />
              </InputGroup>
            </Field>

            <Field
              label="Redirect URLs (comma separated)"
              required
              w="100%"
              errorText={errors.redirect_urls?.message?.toString()}
              invalid={!!errors.redirect_urls}
            >
              <InputGroup flex="1" w="100%">
                <Input
                  {...register("redirect_urls", {
                    required: "Redirect URLs are required",
                  })}
                  placeholder="Enter Redirect URLs"
                />
              </InputGroup>
            </Field>

            <Field
              label="Post Logout Redirect URLs (comma separated)"
              required
              w="100%"
              errorText={errors.post_logout_redirect_urls?.message?.toString()}
              invalid={!!errors.post_logout_redirect_urls}
            >
              <InputGroup flex="1" w="100%">
                <Input
                  {...register("post_logout_redirect_urls", {
                    required: "Post Logout Redirect URLs are required",
                  })}
                  placeholder="Enter Post Logout Redirect URLs"
                />
              </InputGroup>
            </Field>

            <Field
              label="Allowed Origins (comma separated)"
              required
              w="100%"
              errorText={errors.allowed_origins?.message?.toString()}
              invalid={!!errors.allowed_origins}
            >
              <InputGroup flex="1" w="100%">
                <Input
                  {...register("allowed_origins", {
                    required: "Allowed Origins are required",
                  })}
                  placeholder="Enter Allowed Origins"
                />
              </InputGroup>
            </Field>

            <Button type="submit" colorScheme="blue" w="full">
              Register
            </Button>
          </VStack>
        </form>
      </Box> */}
    </>
  );
};

export default AuthUsersView;
