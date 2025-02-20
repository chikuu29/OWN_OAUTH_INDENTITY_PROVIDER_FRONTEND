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

import { useEffect, useState } from "react";
import { TbLockAccess } from "react-icons/tb";
import OAuthErrorScreen from "./AutorizeErrorPage";
import { privateAPI } from "@/app/handlers/axiosHandlers";
import axios from "axios";
import { log } from "console";
import { LuAlarmClockPlus } from "react-icons/lu";

const AuthorizePage = () => {
  console.log("===CALLING AUTHORIZE PAGE===");
  const { open, onOpen, onClose } = useDisclosure();
  const [error, setErrors] = useState<any | null>(null);
  const scopes: any = {
    openid: "OpenID Connect",
    profile: "Read your profile information",
    email: "Access your email address",
    offline_access: "Access your email address",
    activity: "View your activity history",
  };

  const [oauthData, setOauthData] = useState<any | null>({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const client_id = searchParams.get("client_id");
  const redirect_url = searchParams.get("redirect_url");
  const response_type = searchParams.get("response_type");
  const scope: string[] = searchParams.get("scope")?.split(" ") || [];
  const [isDone, setIsDone] = useState(false);

  console.log(scope);

  //  fromd this
  // console.log("searchParams",searchParams.get("client_id"));/
  // Get all query parameters as an object

  // console.log("params", params);

  // const handleAuthorize = async () => {
  //   const formData = new URLSearchParams();
  //   formData.append("client_id", params.client_id);
  //   formData.append("redirect_url", params.redirect_url);
  //   formData.append("response_type", params.response_type);
  //   formData.append("scope", params.scope);
  //   if (params.state) formData.append("state", params.state);
  //   const response = await fetch("http://localhost:8000/oauth/authorize", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(params),
  //   });
  //   // GETAPI({
  //   //   path: "/oauth/authorize",
  //   //   params: params,
  //   //   isPrivateApi: true,

  //   //   // headers: {
  //   //   //   "Content-Type": "multipart/form-data",
  //   //   // },
  //   // }).subscribe((res) => {
  //   //   console.log("res", res);
  //   //   // navigate(`/callback?code=${res.data.code}`);
  //   // });
  // };

  // const handleAuthorize = async () => {
  //   // Construct query parameters for GET request
  //   const queryParams = new URLSearchParams({
  //     client_id: params.client_id,
  //     redirect_url: params.redirect_url, // Ensure consistency with backend param name
  //     response_type: params.response_type,
  //     scope: params.scope,
  //     ...(params.state && { state: params.state }), // Add state if present
  //   }).toString();

  //   // Redirect user to FastAPI authorization endpoint
  //   window.location.href = `http://localhost:5173/api/oauth/authorize?${queryParams}`;
  // };

  useEffect(() => {
    // onOpen();
    const params = Object.fromEntries(searchParams.entries());
    console.log("params", params);
    GETAPI({
      path: "/oauth/authorize",
      params: params,
      isPrivateApi: true,
    }).subscribe((res) => {
      console.log("res", res);
      if (res.success) {
        setOauthData(res.data[0]);
        if (res.data[0]["skip_authorization"] == "true") {
        } else {
          onOpen();
        }
      } else {
        setErrors(res);
      }
      // navigate(`/callback?code=${res.data.code
    });
  }, [client_id, redirect_url, response_type, navigate]);

  const handleAction = async (action: "allow" | "deny") => {
    console.log("action", action);
    console.log("oauthData", oauthData);

    const formData = new URLSearchParams();
    formData.append("client_id", oauthData?.client_id);
    formData.append("redirect_url", oauthData.OauthRequest?.redirect_url!);
    formData.append("response_type", oauthData.response_types);
    formData.append("state", oauthData.OauthRequest?.state!);
    formData.append("action", action);
    // console.log(API_BASE_URL);

    const response = await POSTWITHOAUTH("/oauth/grant", {
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      redirect: "follow",
    });
    console.log(response);

    if (response.success) {
      if (response.data && (response.data as any).redirectedUrl) {
        // Handle redirect after animation
        setIsDone(true);
        setTimeout(() => {
          window.location.href = (response.data as any).redirectedUrl;
        }, 1500);
      } else {
        console.log("OAuth Grant Success:", response.data);
        setIsDone(true);
      }
    } else {
      console.error("OAuth Grant Error:", response);
      setErrors(response);
    }
  };

  if (error && error.success == false) {
    console.log(error);

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
