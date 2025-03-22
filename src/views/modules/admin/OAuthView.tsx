import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Tag,
  Clipboard,
  CheckboxGroup,
  Fieldset,
  Checkbox,
  RadioGroup,
  For,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Controller, useForm } from "react-hook-form";

import { IoCreateOutline } from "react-icons/io5";

import { GETAPI, POSTAPI, PUTAPI } from "@/app/api";
import { TableWidget } from "@/ui/components/widget/TableWidget";
import { CloseButton } from "@/components/ui/close-button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { TbPasswordFingerprint } from "react-icons/tb";
import { LuUser } from "react-icons/lu";
import { GrSystem } from "react-icons/gr";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import { MdOutlineClear } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import APIErrorScreen from "@/ui/components/Error/ApiErrosDisplay";

const OAuthView = () => {
  console.log("===CALLING OAUTHVIEW===");
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    algorithm: "",
    allowedOrigins: [], //dyanmic text field
    authorizationGrantTypes: [], //multiselect
    clientId: "",
    clientName: "",
    clientType: "",
    grantTypes: [], //multiselect
    postLogoutRedirectUrls: [],
    redirectUrls: [],
    responseTypes: [], //multiselect
    scope: [], //multiselect
    skipAuthorization: false,
    tokenEndpointAuthMethod: "",
  });
  const [actionMode, setActionMode] = useState<string>("NEW");
  const {
    // handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>({});
  const [paginationSettings, setPaginationSettings] = useState<{
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }>({
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [error, setErrors] = useState<any | null>(null);

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

  const addEventListener = useCallback((e: any) => {
    console.log(e);
    setActionMode(e.action);
    setFormData(e.data);
    switch (e.action) {
      case "VIEW":
        break;

      case "EDIT":
        setOpenDialog(true);
        break;
      case "DELETE":
        break;
    }
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const replaceObjectByKey = (key: any, newObj: any) => {
    setTableData((prevData: any) =>
      prevData.map((item: any) =>
        item[key] === newObj[key] ? { ...item, ...newObj } : item
      )
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    PUTAPI({
      path: `/applications/clients/${formData.client_id}`,
      data: formData,
      isPrivateApi: true,
    }).subscribe((res: any) => {
      console.log("API", res);
      if (res.success) {
        toaster.create({
          title: "Success",
          description: "Client Updated Successfully",
          type: "success",
          duration: 5000,
        });
        replaceObjectByKey("client_id", res["data"][0]);
        setOpenDialog(false);
      } else {
        setErrors(res);
      }
    });
  };
  const handleArrayChange = (e: any) => {
    console.log(e);

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
        ? [...formData[e.target.name], e.target.value]
        : formData[e.target.name],
    });
  };
  const removeArrayItem = (name: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: prev[name].filter((_: any, i: number) => i !== index),
    }));
  };
  if (error && error.success == false) {
    return <APIErrorScreen errors={error} setErrors={setErrors} />;
  }

  return (
    <>
      <Toaster />
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
                padding={2}
                variant={"outline"}
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
          onEvent={addEventListener}
        />
      </Box>
      <Dialog.Root
        size="full"
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
                  {actionMode == "EDIT"
                    ? "EDIT OAUTH DETAILS"
                    : "Create New Oauth Clients"}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form id="client-form" onSubmit={handleSubmit}>
                  <VStack gap={4}>
                    <Field
                      label="Client ID"
                      // required
                      w="100%"
                      color={"fg.muted"}
                      disabled
                    >
                      <InputGroup flex="1" w="100%" startElement={<GrSystem />}>
                        <Input
                          // {...register("client_id", {
                          //   required: "Client ID is required",
                          // })}

                          name="client_id"
                          value={formData.client_id}
                          onChange={handleChange}
                          placeholder="Enter Client ID"
                        />
                      </InputGroup>
                    </Field>
                    <Field
                      label="Client Secret"
                      color={"fg.muted"}
                      w="100%"
                      errorText={errors.client_secret?.message?.toString()}
                      invalid={!!errors.client_secret}
                    >
                      <InputGroup flex="1" w="100%">
                        <PasswordInput
                          name="client_secret"
                          value={formData.client_secret}
                          onChange={handleChange}
                          placeholder="Enter Client Secret"
                          rootProps={{
                            startElement: <TbPasswordFingerprint />,
                          }}
                        />
                      </InputGroup>
                    </Field>

                    <Field
                      label="Client Name"
                      color={"fg.muted"}
                      // required
                      w="100%"
                      // errorText={errors.client_id?.message?.toString()}
                      // invalid={!!errors.client_id}
                    >
                      <InputGroup flex="1" w="100%">
                        <Input
                          // {...register("client_id", {
                          //   required: "Client ID is required",
                          // })}
                          name="client_name"
                          value={formData.client_name}
                          onChange={handleChange}
                          placeholder="Enter Client Name"
                        />
                      </InputGroup>
                    </Field>

                    <Field
                      label="Redirect Urls"
                      color={"fg.muted"}
                      // required
                      w="100%"
                      // errorText={errors.client_id?.message?.toString()}
                      // invalid={!!errors.client_id}
                    >
                      <InputGroup flex="1" w="100%">
                        <Input
                          // {...register("client_id", {
                          //   required: "Client ID is required",
                          // })}
                          name="redirect_urls"
                          // value={formData.redirect_urls}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleArrayChange(e);
                              e.currentTarget.value = "";
                            }
                          }}
                          placeholder="Redirect Urls"
                        />
                      </InputGroup>

                      <HStack wrap={"wrap"}>
                        {formData.redirect_urls &&
                          formData.redirect_urls.map(
                            (urls: string, index: any) => (
                              <Tag.Root
                                key={"redirect_urls" + index}
                                colorPalette={"green"}
                                cursor={"pointer"}
                                variant={"outline"}
                                p={3}
                              >
                                <Tag.Label>{urls}</Tag.Label>
                                <Tag.EndElement>
                                  <Tag.CloseTrigger
                                    cursor={"pointer"}
                                    colorPalette={"red"}
                                    onClick={() => {
                                      removeArrayItem("redirect_urls", index);
                                    }}
                                  />
                                </Tag.EndElement>
                              </Tag.Root>
                            )
                          )}
                      </HStack>
                    </Field>
                    <Fieldset.Root>
                      <Fieldset.Legend fontSize="sm" mb="2" color="fg.muted">
                        Skip Authorization
                      </Fieldset.Legend>
                      <RadioGroup.Root
                        variant={"subtle"}
                        colorPalette={"blue"}
                        value={formData.skip_authorization}
                        name="skip_authorization"
                        onValueChange={(e) =>
                          setFormData({
                            ...formData,
                            skip_authorization: e.value,
                          })
                        }
                      >
                        <HStack gap="6">
                          {[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" },
                          ].map((item: any) => (
                            <RadioGroup.Item
                              key={item.value}
                              value={item.value}
                            >
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText>
                                {item.label}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </HStack>
                      </RadioGroup.Root>
                    </Fieldset.Root>
                    <Fieldset.Root>
                      <CheckboxGroup
                        value={formData.authorization_grant_types}
                        name="authorization_grant_types"
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            authorization_grant_types: value,
                          })
                        }
                      >
                        <Fieldset.Legend fontSize="sm" mb="2" color="fg.muted">
                          Authorization Grant Types
                        </Fieldset.Legend>
                        <Fieldset.Content>
                          <For each={["authorization_code", "refresh_token"]}>
                            {(value) => (
                              <Checkbox.Root
                                key={value}
                                value={value}
                                variant={"outline"}
                                colorPalette={"blue"}
                                cursor={"pointer"}
                              >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control>
                                  <FaCheck />
                                </Checkbox.Control>

                                <Checkbox.Label>{value}</Checkbox.Label>
                              </Checkbox.Root>
                            )}
                          </For>
                        </Fieldset.Content>
                      </CheckboxGroup>
                    </Fieldset.Root>
                    <Fieldset.Root>
                      <Fieldset.Legend fontSize="sm" mb="2" color="fg.muted">
                        Client Type
                      </Fieldset.Legend>
                      <RadioGroup.Root
                        variant={"subtle"}
                        colorPalette={"blue"}
                        value={formData.client_type}
                        name="client_type"
                        onValueChange={(e) =>
                          setFormData({
                            ...formData,
                            client_type: e.value,
                          })
                        }
                      >
                        <HStack gap="6">
                          {[
                            { value: "password", label: "Password" },
                            { value: "confidential", label: "Confidential" },
                          ].map((item: any) => (
                            <RadioGroup.Item
                              key={item.value}
                              value={item.value}
                            >
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText>
                                {item.label}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </HStack>
                      </RadioGroup.Root>
                    </Fieldset.Root>
                    <Fieldset.Root>
                      <Fieldset.Legend fontSize="sm" mb="2" color="fg.muted">
                        Algorithm
                      </Fieldset.Legend>
                      <RadioGroup.Root
                        variant={"subtle"}
                        colorPalette={"blue"}
                        value={formData.algorithm}
                        name="skip_authorization"
                        onValueChange={(e) =>
                          setFormData({
                            ...formData,
                            algorithm: e.value,
                          })
                        }
                      >
                        <HStack gap="6">
                          {[{ value: "HS256", label: "HS256" }].map(
                            (item: any) => (
                              <RadioGroup.Item
                                key={item.value}
                                value={item.value}
                              >
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>
                                  {item.label}
                                </RadioGroup.ItemText>
                              </RadioGroup.Item>
                            )
                          )}
                        </HStack>
                      </RadioGroup.Root>
                    </Fieldset.Root>
                    <Fieldset.Root>
                      <CheckboxGroup
                        value={formData.grant_types}
                        name="grant_types"
                        onValueChange={(value) =>
                          setFormData({ ...formData, grant_types: value })
                        }
                      >
                        <Fieldset.Legend fontSize="sm" mb="2" color="fg.muted">
                          Grant Types
                        </Fieldset.Legend>
                        <Fieldset.Content>
                          {["authorization_code", "refresh_token"].map(
                            (value) => (
                              <Checkbox.Root
                                key={value}
                                value={value}
                                variant={"outline"}
                                colorPalette={"blue"}
                                cursor={"pointer"}
                              >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control>
                                  <FaCheck />
                                </Checkbox.Control>
                                <Checkbox.Label>{value}</Checkbox.Label>
                              </Checkbox.Root>
                            )
                          )}
                        </Fieldset.Content>
                      </CheckboxGroup>
                    </Fieldset.Root>

                    <Fieldset.Root>
                      <CheckboxGroup
                        value={formData.response_types}
                        name="response_types"
                        onValueChange={(value) =>
                          setFormData({ ...formData, response_types: value })
                        }
                      >
                        <Fieldset.Legend fontSize="sm" mb="2" color="fg.muted">
                          Response Types
                        </Fieldset.Legend>
                        <Fieldset.Content>
                          {["code", "refresh_token"].map((value) => (
                            <Checkbox.Root
                              key={value}
                              value={value}
                              variant={"outline"}
                              colorPalette={"blue"}
                              cursor={"pointer"}
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control>
                                <FaCheck />
                              </Checkbox.Control>
                              <Checkbox.Label>{value}</Checkbox.Label>
                            </Checkbox.Root>
                          ))}
                        </Fieldset.Content>
                      </CheckboxGroup>
                    </Fieldset.Root>

                    <Fieldset.Root>
                      <CheckboxGroup
                        value={formData.scope}
                        name="scope"
                        onValueChange={(value) =>
                          setFormData({ ...formData, scope: value })
                        }
                      >
                        <Fieldset.Legend fontSize="sm" mb="2" color="fg.muted">
                          scopes
                        </Fieldset.Legend>
                        <Fieldset.Content>
                          {["openid", "profile", "email"].map((value) => (
                            <Checkbox.Root
                              key={value}
                              value={value}
                              variant={"outline"}
                              colorPalette={"blue"}
                              cursor={"pointer"}
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control>
                                <FaCheck />
                              </Checkbox.Control>
                              <Checkbox.Label>{value}</Checkbox.Label>
                            </Checkbox.Root>
                          ))}
                        </Fieldset.Content>
                      </CheckboxGroup>
                    </Fieldset.Root>
                    {/* <Field
                      label="Scope"
                      required
                      w="100%"
                      errorText={errors.scope?.message?.toString()}
                      invalid={!!errors.scope}
                    >
                      <Select.Root
                        multiple
                        value={formData.scope}
                        onValueChange={(value) =>
                          setFormData({ ...formData, scope: value })
                        }
                        collection={scopes}
                        size="sm"
                        // width="320px"
                        positioning={{ placement: "top-start", flip: false }}
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select Scopes" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>
                              <MdOutlineClear />
                            </Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal container={contentRef}>
                          <Select.Positioner
                            w={"200px"}
                            overflow={"hidden"}
                            maxHeight={"200px"}
                          >
                            <Select.Content>
                              {scopes.items.map((scope, index) => (
                                <Select.Item
                                  item={scope}
                                  key={scope.value + index}
                                  cursor={"pointer"}
                                >
                                  {scope.label}
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field> */}
                    {/* <Field
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
                                <Select.ClearTrigger />
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
                    </Field> */}
                  </VStack>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  type="submit"
                  form="client-form"
                  colorPalette={"blue"}
                  variant={"outline"}
                >
                  UPDATE
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
