import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Heading,
  Container,
  useBreakpointValue,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPlus, FaFilter, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { HSeparator } from "../separator/Separator";

function MyTable() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const data = [
    { id: 1, name: "John Doe", age: 28, occupation: "Developer" },
    { id: 2, name: "Jane Smith", age: 32, occupation: "Designer" },
    { id: 3, name: "Alice Johnson", age: 24, occupation: "Manager" },
    { id: 4, name: "Mark Davis", age: 45, occupation: "Director" },
  ];
  return (
    // <Box mt={3} mb={3}>
    <Box
      mt={3}
      borderWidth="2px"
      borderRadius="lg"
      borderBottom={"none"}
      // boxShadow="md"
      boxShadow={'2xl'}
      bg={useColorModeValue("white", "gray.950")}
    >
      <Flex padding={2} justify="space-between" align="center">
        <Heading fontSize={"sm"}>I'm a Heading</Heading>
        <Flex>
          <Input
            placeholder="Search by name or location..."
            // width="300px"
            me={2}
          />
          <IconButton
            aria-label="Filter"
            icon={<FaFilter />}
            colorScheme="gray"
          />
        </Flex>
      </Flex>

      {!isMobile ? (
        <TableContainer
          p={0}
          minW="100%" // Full width
          borderBottomRadius="8px"
          border="1px solid #2b6cb0"
          mb={2}
          mt={3}
          maxH="100vh"
          // overflow="hidden"
          overflowY="auto"
          // overflowX="scroll" // Enable horizontal scrolling
        >
          <Table>
            {/* Ensures the table is wide enough for horizontal scrolling */}
            <Thead>
              <Tr>
                <Th
                  color="white"
                  position="sticky"
                  top="0"
                  zIndex="1"
                  bg="blue.600"
                >
                  ID
                </Th>
                <Th
                  color="white"
                  position="sticky"
                  top="0"
                  zIndex="1"
                  bg="blue.600"
                >
                  Name
                </Th>
                <Th
                  color="white"
                  position="sticky"
                  top="0"
                  zIndex="1"
                  bg="blue.600"
                >
                  Start Date
                </Th>
                <Th
                  color="white"
                  position="sticky"
                  top="0"
                  zIndex="1"
                  bg="blue.600"
                >
                  End Date
                </Th>
                <Th
                  color="white"
                  position="sticky"
                  top="0"
                  zIndex="1"
                  bg="blue.600"
                >
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>John Doe</Td>
                <Td>30</Td>
                <Td>New York</Td>
                <Td>30</Td>
                <Td>New York</Td>
              </Tr>
              <Tr>
                <Td>Jane Smith</Td>
                <Td>25</Td>
                <Td>Los Angeles</Td>
                <Td>30</Td>
                <Td>New York</Td>
              </Tr>
              {/* Other rows */}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Box p={2}>
          {data.map((item) => (
            <Box
              key={item.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              mb={4}
              // bg="white"
              shadow="md"
            >
              <Box>
                <strong>ID:</strong> {item.id}
              </Box>
              <Box>
                <strong>Name:</strong> {item.name}
              </Box>
              <Box>
                <strong>Age:</strong> {item.age}
              </Box>
              <Box>
                <strong>Occupation:</strong> {item.occupation}
              </Box>
              {/* Action Buttons Section */}
              <Stack direction="row" spacing={4} mt={4}>
              {/* View Button */}
              <Button leftIcon={<FaEye />} colorScheme="teal">
                View
              </Button>

              {/* Edit Button */}
              <Button leftIcon={<FaEdit />} colorScheme="blue">
                Edit
              </Button>

              {/* Delete Button */}
              <Button leftIcon={<FaTrash />} colorScheme="red">
                Delete
              </Button>
            </Stack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default MyTable;
