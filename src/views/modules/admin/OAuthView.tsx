import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  VStack,
  Text,
  TableRoot,
  TableHeader,
  TableBody,
  TableFooter,
  Table,
  IconButton,
  Icon,
  Heading,
  TableRow,
  TableColumn,
  HStack,
  TableCaption,
  Stack,
  Highlight,
  useCheckboxGroup,
  Center,
  Spinner,
} from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { InputGroup } from "@/components/ui/input-group";
import { SiAdblockplus } from "react-icons/si";
import { IoCreateOutline } from "react-icons/io5";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { FaAngleDown } from "react-icons/fa";
import { FaArrowDownShortWide } from "react-icons/fa6";

import { VscListFilter } from "react-icons/vsc";
import { Checkbox } from "@/components/ui/checkbox";
import { LuSearch } from "react-icons/lu";
import { TiEdit } from "react-icons/ti";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOpenInNew } from "react-icons/md";

const OAuthView = () => {
  console.log("===CALLING OAUTHVIEW===");
  const [isLoading,setLoading]=useState(false)
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

  const onSubmit = handleSubmit(async (formState) => {
    console.log(formState);

    //   e.preventDefault();
    //   console.log("userCredentials", userCredentials);
    //   setLoading(true);
  });

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
              <Button variant={"subtle"} colorPalette={"blue"}>
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
              <IconButton padding={5} variant={"solid"} colorPalette={"blue"}>
                <IoCreateOutline />
                Create new clients
              </IconButton>
            </HStack>
          </Flex>
        </Box>
        <Box borderBottom="1px solid" borderColor="gray.700" my={4} />
        <Box mt={3} mb={3}>
          <Flex justifyContent={"space-between"} gap={2}>
            <Flex justifyContent={"space-between"} gap={2}>
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton padding={3} variant={"outline"}>
                    Status
                    <FaAngleDown />
                  </IconButton>
                  {/* <Button variant="outline" size="sm">
                Status
              </Button> */}
                </MenuTrigger>
                <MenuContent>
                  <Input
                    placeholder="Search Value..."
                    // value={search}
                    // onChange={handleSearch}
                    mb={2}
                  />
                  <VStack align="start" maxH="150px" overflowY="auto">
                    {/* <MenuItem>
                  <Checkbox mr={2}>Open</Checkbox>
                </MenuItem> */}
                    {[
                      { title: "Open", value: "open" },
                      { title: "Pendding", value: "pendding" },
                    ].map(({ title, value }) => (
                      <Button
                        w={"100%"}
                        variant={"outline"}
                        colorPalette={"blue"}
                      >
                        <Checkbox
                          variant={"subtle"}
                          // colorPalette={"blue"}
                          cursor={"pointer"}
                          w={"100%"}
                          // bg={"blue.100"}
                          // p={2}
                          borderRadius={"md"}
                          // color={"black"}
                        >
                          {title}
                        </Checkbox>
                      </Button>
                    ))}
                  </VStack>

                  {/* Submit Button */}
                  <HStack mt={3} w={"100%"}>
                    <Button
                      size="sm"
                      colorPalette="blue"
                      w={"100%"}
                      variant={"outline"}
                    >
                      Submit
                    </Button>
                  </HStack>
                </MenuContent>
              </MenuRoot>
              <IconButton padding={3} variant={"outline"}>
                More Fillters
                <VscListFilter />
              </IconButton>
            </Flex>
            <InputGroup startElement={<LuSearch />}>
              <Input placeholder="Search Tables" />
            </InputGroup>
          </Flex>
        </Box>

        <Box mt={2} borderWidth="1px" borderRadius="lg" padding={3}>
          <Box position={"relative"}>
            <Table.ScrollArea height="50vh">
              <Table.Root stickyHeader>
                <Table.Header>
                  <Table.Row borderRadius={"md"} bg={"bg.subtle"}>
                    <Table.ColumnHeader
                      display={"flex"}
                      alignItems={"center"}
                      gap={2}
                    >
                      SN <FaArrowDownShortWide />
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>Client ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Client Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Client Secreat</Table.ColumnHeader>
                    <Table.ColumnHeader>Created At</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {[
                    1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
                    2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
                    2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
                    2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
                    1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
                  ].map((e: any) => (
                    <Table.Row>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>DEVELOPER_ORGANTISATIONy</Table.Cell>
                      <Table.Cell>DEVELOPER_ORGANTISATIONy</Table.Cell>
                      <Table.Cell>DEVELOPER_ORGANTISATIONy</Table.Cell>
                      <Table.Cell>DEVELOPER_ORGANTISATIONy</Table.Cell>
                      <Table.Cell>
                        <HStack>
                          <IconButton
                            variant={"outline"}
                            colorPalette={"blue"}
                            p={5}
                          >
                            <MdOpenInNew />
                          </IconButton>
                          <IconButton
                            variant={"outline"}
                            colorPalette={"yellow"}
                            p={5}
                          >
                            <TiEdit />
                          </IconButton>
                          <IconButton
                            variant={"outline"}
                            colorPalette="red"
                            p={5}
                          >
                            <RiDeleteBin5Line />
                          </IconButton>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
            <PaginationRoot
              count={20}
              pageSize={2}
              defaultPage={1}
              mt={5}
              colorPalette={"blue"}
              variant="solid"
            >
              <HStack justifyContent={"flex-end"}>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
            {isLoading && (
              <Box pos="absolute" inset="0" bg="bg/80">
                <Center h="full">
                  <VStack colorPalette="teal">
                    <Spinner color="teal.500" />
                    <Text color="colorPalette.600">Loading...</Text>
                  </VStack>
                </Center>
              </Box>
            )}
          </Box>
        </Box>
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

export default OAuthView;
