import { useNavigate, useParams, useSearchParams } from "react-router";

import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Flex,
  IconButton,
  Center,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Icon,
  useDisclosure,
  Alert,
} from "@chakra-ui/react";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { GETAPI, POSTAPI, POSTWITHOAUTH } from "@/app/api";
import { Checkbox } from "@/components/ui/checkbox";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import { DialogBackdrop, DialogRoot } from "@/components/ui/dialog";

import { useEffect, useRef, useState } from "react";
import { TbLockAccess } from "react-icons/tb";
import OAuthErrorScreen from "./AutorizeErrorPage";
import { privateAPI } from "@/app/handlers/axiosHandlers";
import axios from "axios";
import { log } from "console";
import { LuAlarmClockPlus } from "react-icons/lu";
import { startLoading, stopLoading } from "@/app/slices/loader/appLoaderSlice";
import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";

const AuthorizePage = () => {
  console.log("===CALLING AUTHORIZE PAGE===");
  const dispatch = useDispatch<AppDispatch>();

  const { open, onOpen, onClose } = useDisclosure();
  const [error, setErrors] = useState<any | null>(null);
  const scopes: any = {
    openid: "OpenID Connect",
    profile: "Read your profile information",
    email: "Access your email address",
    offline_access: "Access your email address",
    activity: "View your activity history",
  };

  const oauthData = useRef<any>({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const client_id = searchParams.get("client_id");
  const redirect_url = searchParams.get("redirect_url");
  const response_type = searchParams.get("response_type");
  const scope: string[] = searchParams.get("scope")?.split(" ") || [];
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // onOpen();
    const params = Object.fromEntries(searchParams.entries());
    console.log("params", params);
    dispatch(startLoading('Authenticating... Please wait'));
    GETAPI({
      path: "/oauth/authorize",
      params: params,
      isPrivateApi: true,
    }).subscribe((res) => {
      dispatch(stopLoading())
      if (res.success) {
       
        oauthData.current = res.data[0];
        if (oauthData.current && oauthData.current["skip_authorization_done"]) {
          // window.location.href = oauthData.current.redirect_url;
        } else {
          onOpen();

        }
      } else {
        setErrors(res);
      }
    });
  }, [client_id, redirect_url, response_type, navigate]);

  const handleAction = async (action: "allow" | "deny") => {
    const formData = new URLSearchParams();
    formData.append("client_id", oauthData.current?.client_id);
    formData.append(
      "redirect_url",
      oauthData.current.OauthRequest?.redirect_url!
    );
    formData.append("response_type", oauthData.current.response_types);
    formData.append("state", oauthData.current.OauthRequest?.state!);
    formData.append("action", action);
    dispatch(startLoading('Granting Permission... Please wait'));
    const response = await POSTWITHOAUTH("/oauth/grant", {
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "follow",
    });

    if (response.success) {
      dispatch(stopLoading())
      setIsDone(true);
      if (response.data && (response.data as any).redirectedUrl) {
        // Handle redirect after animation
        console.log((response.data as any).redirectedUrl);

        setTimeout(() => {
          window.location.href = (response.data as any).redirectedUrl;
        }, 1500);
      } else {
        console.log("OAuth Grant Success:", response.data);
        setIsDone(true);
      }
    } else {
      dispatch(stopLoading())
      console.error("OAuth Grant Error:", response);
      setErrors(response);
    }
  };

  if (error && error.success == false) {
    return <OAuthErrorScreen errors={error} setErrors={setErrors} />;
  }

  return (
    <DialogRoot open={open}>
      <DialogBackdrop />
      <DialogContent className="dialog-container">
        <DialogHeader className="dialog-header">
          <Icon as={TbLockAccess} boxSize={6} color="orange.400" />
          <DialogTitle>Authorize Access</DialogTitle>
        </DialogHeader>
        <Text fontSize="sm" color="gray.500" p={3} fontWeight={"bold"}>
          Please review the permissions below before granting access.
        </Text>

        {/* Body */}
        <DialogBody className="dialog-body">
          <Box
            mt="2"
            p="6"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="lg"
            borderColor="orange.400"
          >
            <VStack align="start" gap="3">
              {scope.map((scope: string, index: number) => (
                <Checkbox
                  disabled={true}
                  key={index}
                  defaultChecked
                  colorPalette="gray.200"
                  variant={"subtle"}
                  cursor={"pointer"}
                >
                  <Text fontSize="sm">{scopes[scope]}</Text>
                </Checkbox>
              ))}
            </VStack>
          </Box>
          {isDone && (
            <>
              <Alert.Root status="success" mt={2}>
                <Alert.Indicator transition={"ease-in-out"} />
                <Alert.Title>Aunthentication Granted!</Alert.Title>
              </Alert.Root>
              <Alert.Root status="warning" mt={2}>
                <Alert.Indicator>
                  <LuAlarmClockPlus />
                </Alert.Indicator>
                <Alert.Title>
                  Hold on! We're redirecting you to the application
                </Alert.Title>
              </Alert.Root>
            </>
          )}
        </DialogBody>

        {/* Footer with Animated Button */}
        <DialogFooter className="dialog-footer">
          <IconButton
            variant="solid"
            w="50%"
            colorPalette={"green"}
            onClick={() => handleAction("allow")}
          >
            <IoShieldCheckmarkOutline />
            Allow
          </IconButton>
          <IconButton
            variant="solid"
            w="50%"
            colorPalette={"red"}
            onClick={() => handleAction("deny")}
          >
            <AiTwotoneCloseCircle />
            Deny
          </IconButton>
        </DialogFooter>
      </DialogContent>
      {/* CSS for Additional Styling */}
      <style>{`
        .dialog-container {
          text-align: center;
          border-radius: 12px;
          // padding: 20px;
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

       

        

        
      `}</style>
    </DialogRoot>
  );
};

export default AuthorizePage;
