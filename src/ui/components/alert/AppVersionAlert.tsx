import { Icon, IconButton, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

import { BiRefresh } from "react-icons/bi";
import { FiAlertCircle } from "react-icons/fi";
interface AppVersionInterface {
  isNewVersionAvailable: boolean;
  version?: string;
}

const AppVersionAlert: React.FC<AppVersionInterface> = ({
  isNewVersionAvailable,
  version,
}) => {
  if(!isNewVersionAvailable)return 
  const { open, onOpen, onClose } = useDisclosure();
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
    <DialogRoot open={open}>
      <DialogBackdrop />

      <DialogContent className="dialog-container">
        {/* Animated Background */}
        <div className="pyro">
          <div className="before"></div>
          <div className="after"></div>
        </div>
        {/* Header with Icon */}
        <DialogHeader className="dialog-header">
          <Icon as={FiAlertCircle} boxSize={6} color="orange.400" />
          <DialogTitle>New Version Available</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <DialogBody className="dialog-body">
          <p>
            A new version of the application is now available! You are currently
            using an older version. To access the latest features, security
            updates, and improvements, please refresh the page.
          </p>
        </DialogBody>

        {/* Footer with Animated Button */}
        <DialogFooter className="dialog-footer">
          <IconButton
            colorPalette="green"
            variant="outline"
            onClick={handleRefresh}
            width="100%"
            className="refresh-button"
          >
            <BiRefresh className="refresh-icon" />
            Refresh Now
          </IconButton>
        </DialogFooter>
      </DialogContent>

      {/* CSS for Additional Styling */}
      <style>{`
        .dialog-container {
          text-align: center;
          border-radius: 12px;
          padding: 20px;
          max-width: 400px;
        }
        
        .dialog-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 20px;
          font-weight: bold;
          // color: #2d3748;
        }

        .dialog-body p {
          font-size: 14px;
          // color: #4a5568;
          margin-top: 8px;
        }

        .dialog-footer {
          margin-top: 12px;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
        }

        .refresh-icon {
          margin-right: 8px;
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </DialogRoot>
  );
};

export default AppVersionAlert;
