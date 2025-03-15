import React, { useEffect, useRef, useState } from "react";
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
  Dialog,
  Portal,
  Input,
  Select,
  createListCollection,
} from "@chakra-ui/react";

import { Controller, useForm } from "react-hook-form";

import { IoCreateOutline } from "react-icons/io5";

import { GETAPI, POSTAPI } from "@/app/api";
import { TableWidget } from "@/ui/components/widget/TableWidget";
import { CloseButton } from "@/components/ui/close-button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { TbPasswordFingerprint } from "react-icons/tb";
import { LuUser } from "react-icons/lu";
import { GrSystem } from "react-icons/gr";

const OAuthView = () => {
  console.log("===CALLING OAUTHVIEW===");
  const [isLoading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
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
      path: "/applications/clients",
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
  const contentRef = useRef<HTMLDivElement>(null);
  const onSubmit = handleSubmit(async (formState) => {
    console.log(formState);

    POSTAPI({
      path: "applications/register",
      data: formState,
      isPrivateApi: true,
    }).subscribe((res: any) => {
      console.log(res);
    });

    //   e.preventDefault();
    //   console.log("userCredentials", userCredentials);
    //   setLoading(true);
  });
  const frameworks = createListCollection({
    items: [
      { label: "Public", value: "public" },
      { label: "Confidential", value: "confidential" },
    ],
  });

  const scopes = createListCollection({
    items: [
      { value: "openId", label: "Open ID" },
      { value: "profile", label: "Profile" },
      { value: "email", label: "Email" },
    ],
  })
  return (
    <>
      <Flex gap={5} wrap={"wrap"}>
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
      </Flex>
      <Box position={"sticky"} top={["7.6rem", "64px", "4rem"]}>
        <Box mt={3} mb={3}>
          <Flex justifyContent={"space-between"}>
            <Stack>
              <Heading size="2xl" letterSpacing="tight">
                <Highlight query="APPLICATIONS" styles={{ color: "teal.600" }}>
                  OAUTH APPLICATIONS
                </Highlight>
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                Create and manage OAuth clients and credentials.
              </Text>
            </Stack>
            <HStack>
              <IconButton
                padding={5}
                variant={"solid"}
                colorPalette={"blue"}
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <IoCreateOutline />
                Create new clients
              </IconButton>
            </HStack>
          </Flex>
        </Box>
        <Box borderBottom="1px solid" borderColor="gray.700" my={4} />
        <TableWidget
          data={tableData}
          paginationRequired={true}
          paginationSettings={paginationSettings}
          filltersRequired={true}
        />
      </Box>
      <Dialog.Root
        // size="cover"
        placement="center"
        motionPreset="slide-in-bottom"
        open={openDialog}
        onOpenChange={(e) => setOpenDialog(e.open)}
        scrollBehavior={"inside"}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content ref={contentRef}>
              <Dialog.Header>
                <Dialog.Title
                  fontWeight={"bold"}
                  color={"blue.400"}
                  textTransform={"uppercase"}
                  textAlign={"center"}
                >
                  Create New Oauth Clients
                </Dialog.Title>
                {/* <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger> */}
              </Dialog.Header>
              <Dialog.Body>
                {/* <Box
                  maxW="500px"
                  mx="auto"
                  mt={10}
                  p={5}
                  boxShadow="lg"
                  borderRadius="md"
                > */}
                <form onSubmit={onSubmit} id="client-form">
                  <VStack gap={4}>
                    <Field
                      label="Client ID"
                      required
                      w="100%"
                      errorText={errors.client_id?.message?.toString()}
                      invalid={!!errors.client_id}
                    >
                      <InputGroup flex="1" w="100%" startElement={<GrSystem />}>
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
                        <PasswordInput
                          {...register("client_secret", {
                            required: "Client Secret is required",
                          })}
                          placeholder="Enter Client Secret"
                          rootProps={{
                            startElement: <TbPasswordFingerprint />,
                          }}
                        />
                      </InputGroup>
                    </Field>

                    {/* Client Name */}
                    <Field
                      label="Client Name"
                      required
                      w="100%"
                      errorText={errors.client_name?.message?.toString()}
                      invalid={!!errors.client_name}
                    >
                      <InputGroup flex="1" w="100%">
                        <Input
                          {...register("client_name", {
                            required: "Client Name is required",
                          })}
                          placeholder="Enter Client Name"
                        />
                      </InputGroup>
                    </Field>

                    {/* Client Type */}
                    <Field
                      label="Client Type"
                      required
                      w="100%"
                      errorText={errors.client_type?.message?.toString()}
                      invalid={!!errors.client_type}
                    >
                      <Controller
                        control={control}
                        name="client_type"
                        render={({ field }) => (
                          <Select.Root
                            // open={true}
                            // {...register("client_type", {
                            //   required: "Client Type is required",
                            // })}
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            collection={frameworks}
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select framework" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal container={contentRef}>
                              <Select.Positioner>
                                <Select.Content>
                                  {frameworks.items.map((framework) => (
                                    <Select.Item
                                      item={framework}
                                      key={framework.value}
                                    >
                                      {framework.label}
                                      <Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )}
                      />
                    </Field>

                    {/* Authorization Grant Types */}
                    <Field
                      label="Authorization Grant Types (comma separated)"
                      required
                      w="100%"
                      errorText={errors.authorization_grant_types?.message?.toString()}
                      invalid={!!errors.authorization_grant_types}
                    >
                      <InputGroup flex="1" w="100%">
                        <Input
                          {...register("authorization_grant_types", {
                            required: "Grant Types are required",
                          })}
                          placeholder="Enter Grant Types (comma separated)"
                        />
                      </InputGroup>
                    </Field>

                    {/* Redirect URLs */}
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

                    {/* Post Logout Redirect URLs */}
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

                    {/* Allowed Origins */}
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

                    {/* Token Endpoint Auth Method */}
                    <Field
                      label="Token Endpoint Auth Method"
                      required
                      w="100%"
                      errorText={errors.token_endpoint_auth_method?.message?.toString()}
                      invalid={!!errors.token_endpoint_auth_method}
                    >
                      <InputGroup flex="1" w="100%">
                        <Input
                          {...register("token_endpoint_auth_method", {
                            required: "Auth Method is required",
                          })}
                          placeholder="Enter Token Endpoint Auth Method"
                        />
                      </InputGroup>
                    </Field>

                    {/* Scope */}

                    <Field
                      label="Scope"
                      required
                      w="100%"
                      errorText={errors.scope?.message?.toString()}
                      invalid={!!errors.scope}
                    >
                      <Controller
                        control={control}
                        name="scope"
                        render={({ field }) => (
                          <Select.Root
                          multiple
                        
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            collection={scopes}
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select Scopes" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.ClearTrigger/>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal container={contentRef}>
                              <Select.Positioner>
                                <Select.Content>
                                  {scopes.items.map((scope) => (
                                    <Select.Item item={scope} key={scope.value}>
                                      {scope.label}
                                      <Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )}
                      />
                    </Field>
                  </VStack>
                </form>
                {/* </Box> */}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button type="submit" form="client-form">
                  Save
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default OAuthView;
