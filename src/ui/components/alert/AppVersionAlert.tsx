import { RepeatIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

interface AppVersionInterface {
  isNewVersionAvailable: boolean;
  version?: string;
}

const AppVersionAlert: React.FC<AppVersionInterface> = ({
  isNewVersionAvailable,
  version,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null); // Reference for the least destructive action (Cancel)

  const handleRefresh = () => {
    window.location.reload(); // Refreshes the page
  };

  useEffect(() => {
    if (isNewVersionAvailable) {
      onOpen();
    }
  }, [isNewVersionAvailable, onOpen]);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef} // Pass cancelRef as the least destructive ref
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <AlertDialogOverlay>
        <div className="pyro">
          <div className="before"></div>
          <div className="after"></div>
        </div>
        <AlertDialogContent borderRadius={"15px"}>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            color={"green"}
            textAlign={"center"}
            borderRadius={"15px"}
          >
            New Version Available
          </AlertDialogHeader>

          <AlertDialogBody textAlign="center" fontWeight={100}>
            A new version is available. You're currently running an older
            version. Please refresh to update.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              colorScheme="green"
              variant="outline"
              onClick={handleRefresh}
              ml={3}
              leftIcon={
                <RepeatIcon style={{ animation: "spin 2s linear infinite" }} />
              }
              width="100%"
            >
              Refresh Now
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AppVersionAlert;
