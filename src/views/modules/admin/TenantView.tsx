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

const TenantView = () => {
  console.log("===CALLING AuthUsersView===");
  const [isLoading, setLoading] = useState(false);


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
      path: "/account/tenant",
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
    
      <Box position={"sticky"} top={["7.6rem", "64px", "4rem"]}>
        <Box mt={3} mb={3}>
          <Flex justifyContent={"space-between"}>
            <Stack>
              <Heading size="2xl" letterSpacing="tight">
                <Highlight query="APPLICATIONS" styles={{ color: "teal.600" }}>
                 ALL Tenants
                </Highlight>
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                Manage Tenants
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
      
    </>
  );
};

export default TenantView
