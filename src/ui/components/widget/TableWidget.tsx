import { InputGroup } from "@/components/ui/input-group";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import {
  Box,
  Flex,
  MenuRoot,
  MenuTrigger,
  IconButton,
  MenuContent,
  Input,
  VStack,
  Button,
  HStack,
  Table,
  Center,
  Spinner,
  Text,
  Icon,
} from "@chakra-ui/react";
import { forwardRef, memo, useEffect, useMemo, useState } from "react";
import { FaAngleDown, FaBoxOpen } from "react-icons/fa";
import { FaArrowDownShortWide } from "react-icons/fa6";
import { GrAction } from "react-icons/gr";
import { LuSearch } from "react-icons/lu";
import { MdOpenInNew } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import { VscListFilter } from "react-icons/vsc";

import { Checkbox } from "@/components/ui/checkbox";
import { formatKey } from "@/utils/formatKey";
import { formatValue } from "@/utils/formatters";

interface TABLE_WIDGET {
  data?: any[];
  headerConfig?: any[];
  autoHeader?: boolean;
  paginationRequired?: boolean;
  paginationSettings?: {
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  api?: String;
  fillters?: any[];
}

export const TableWidget = memo(
  forwardRef<any, TABLE_WIDGET>((props, ref) => {
    console.log("===CALLING TABLE ===",props);
    
    const {
      data = [],
      headerConfig = [],
      paginationRequired = false,
      autoHeader = true,
      paginationSettings = { totalPages: 1, currentPage: 1, pageSize: 10 },
      ...rest
    } = props;
    const [isLoading, setLoading] = useState<boolean>(false);
    const [keys, setKeys] = useState<any[]>(headerConfig);

    useEffect(() => {
      if (autoHeader && data.length > 0 && headerConfig.length==0) {
        const getKys: any[] = Object.keys(data[0]);
        setKeys(getKys);
      }
    },[data]);

   

    return (
      <Box>
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
                    ].map(({ title, value }, index) => (
                      <Button
                        key={value || index}
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
            {data.length > 0 ? (
              <>
                <Table.ScrollArea height="50vh">
                  <Table.Root stickyHeader>
                    <Table.Header>
                      <Table.Row borderRadius={"md"} bg={"bg.subtle"}>
                        {keys.map((key: string, index) => (
                          <Table.ColumnHeader key={index}>
                            <IconButton
                              variant={"outline"}
                              p={4}
                              colorPalette={"blue"}
                              w={"100%"}
                            >
                              {formatKey(key)}
                            </IconButton>
                          </Table.ColumnHeader>
                        ))}
                        <Table.ColumnHeader>
                          {/* Actions <GrAction /> */}

                          <IconButton
                            variant={"outline"}
                            p={4}
                            colorPalette={"red"}
                            w={"100%"}
                          >
                            Actions <GrAction />
                          </IconButton>
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {data.map((e: any, rowIndex) => (
                        <Table.Row key={rowIndex}>
                          {keys.map((key: string, index) => (
                            <Table.Cell key={index}>{formatValue(e[key])}</Table.Cell>
                          ))}

                          <Table.Cell key={`actions-${rowIndex}`}>
                            <HStack justifyContent={"center"}>
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
                {paginationRequired && (
                  <PaginationRoot
                    count={paginationSettings.totalPages}
                    pageSize={paginationSettings.pageSize}
                    defaultPage={paginationSettings.currentPage}
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
                )}
              </>
            ) : (
              <VStack gap={4} align="center" justify="center" py={10}>
                <Box
                  w={16}
                  h={16}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  // bg="yellow"
                >
                  <Icon as={FaBoxOpen} boxSize={8} />
                </Box>
                <Text fontSize="xl" fontWeight="semibold" color="fg.muted">
                  {"No Data Found"}
                </Text>
              </VStack>
            )}

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
    );
  })
);

// export default memo(TableWidget);
