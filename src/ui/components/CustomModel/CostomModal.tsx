// // CustomModal.js
// import React from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   useColorModeValue,
// } from "@chakra-ui/react";

// const CustomModal = ({
//   isOpen,
//   onClose,
//   size = "md",
//   title,
//   children,
//   onSubmit,
// }: any) => {
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
//       <ModalOverlay />
//       <ModalContent bg={useColorModeValue('white','gray.950')}>
//         <ModalHeader>{title}</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>{children}</ModalBody>
//         <ModalFooter>
//           <Button colorScheme="blue" mr={3} onClick={onSubmit}>
//             Submit
//           </Button>
//           <Button variant="ghost" onClick={onClose}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CustomModal;
