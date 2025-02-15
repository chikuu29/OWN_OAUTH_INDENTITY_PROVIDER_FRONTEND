// Chakra imports
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  IconProps,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
// import { HSeparator } from "../../../ui/components/separator/Separator";
import { publicAPI } from "../../../app/handlers/axiosHandlers";
// import { AxiosError } from "axios";
import { useAuth } from "../../../contexts/AuthProvider";
import { useDispatch } from "react-redux";
import { login } from "../../../app/slices/auth/authSlice";
// import { GETAPI } from "../../../app/api";
import { fetchAppConfig } from "../../../app/slices/appConfig/appConfigSlice";
import { AppDispatch } from "../../../app/store";
// import Brand from "../../../ui/components/Brand/Brand";
// import { setAppConfig } from "../../../app/slices/appConfig/appConfigSlice";

// import { motion } from "framer-motion";
import { startLoading } from "../../../app/slices/loader/appLoaderSlice";
import { POSTAPI } from "../../../app/api";
// import AppVersionAlert from "../../../ui/components/alert/AppVersionAlert";
import { AlertProps } from "../../../app/interfaces/app.interface";

import { Field } from "@/components/ui/field";
import { AiOutlineLogin } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { LOGIN_CREDENTIAL } from "@/app/interfaces/app.interface";
import { InputGroup } from "@/components/ui/input-group";
import { LuUser } from "react-icons/lu";
import { PasswordInput } from "@/components/ui/password-input";
import { SiSpringsecurity } from "react-icons/si";
import { TbPasswordFingerprint } from "react-icons/tb";
import axios from "axios";
import { CloseButton } from "@/components/ui/close-button";
import AppVersionAlert from "@/ui/components/alert/AppVersionAlert";

const SignIn = () => {
  console.log("signin");

  const [isNewVersionAvailable, setIsNewVersionAvailable] =
    useState<boolean>(false);
  const checkVersion = async () => {
    try {
      const response = await fetch(`../version.json?t=${Date.now()}`); // Timestamp to prevent caching
      console.log("response", response);
      var CURRENT_VERSION = "{{HASH_PLACEHOLDER}}";
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data["version"] != CURRENT_VERSION) {
        // onOpen();
        setIsNewVersionAvailable(true);
        console.log("NEW VERSION IS AVAILBLE");
      } else {
        console.log("Same Version");
      }
    } catch (error) {
      // setIsNewVersionAvailable(true)
      console.error("Error fetching version:", error);
    }
  };

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState<AlertProps>({
    title: "",
    description: "",
    status: "info",
    isVisible: false,
  });

  const navigate = useNavigate();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl: any = searchParams.get("redirect");
  const { loading, authInfo, setLoginAuthInfo } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!loading && authInfo && authInfo.success) {
      // Uncomment if you have logic to set a redirect URL
      // setRedirectUrl(location.pathname);
      navigate(redirectUrl || "/myApps", { replace: true });
    }
  }, [loading]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LOGIN_CREDENTIAL>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const onSubmit = handleSubmit(async (formState) => {
    console.log(formState);

    //   e.preventDefault();
    //   console.log("userCredentials", userCredentials);
    //   setLoading(true);

    const formData = new FormData();
    formData.append("username", formState.username ?? "");
    formData.append("password", formState.password ?? "");
    console.log("form", formData);

    try {
      // const response = await axios.post("http://localhost:8000/auth/login", formData, {
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // });
      setLoading(true);
      POSTAPI({
        path: "/auth/login",
        data: formData,
        isPrivateApi: true,
      }).subscribe((res: any) => {
        setLoading(false);
        if (res.success) {
          console.log(res);
          const responseInfo: any = res["login_info"];
          console.log("AuthInfo", responseInfo);
          setLoginAuthInfo(responseInfo);
          // dispatch(fetchAppConfig());
          dispatch(login(res));
          setShowAlert({
            title: res?.message,
            description: res["message"],
            status: "success",
            isVisible: true,
          });
          // console.log("redirectUrl",redirectUrl);
          navigate(redirectUrl || "/myApps");
        } else {
          setShowAlert({
            title: res?.message,
            description: res["message"],
            status: "error",
            isVisible: true,
          });
        }
      });
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      if (error.message === "Network Error") {
        setShowAlert({
          title: error?.message,
          description: "Please Check Your Internet Connections",
          status: "error",
          isVisible: true,
        });
      } else {
        setShowAlert({
          title: error?.statusText,
          description: error?.response["data"]["message"],
          status: "error",
          isVisible: true,
        });
      }
    }
  });

  return (
    <>
      <AppVersionAlert isNewVersionAvailable={isNewVersionAvailable} />
      <Box
        // minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        // bg="gray.100"
      >
        <Box p={8} maxW="md" w="full">
          {/* <Heading mb={6} textAlign="center" size="lg">
            Sign in into IDP Provider
          </Heading> */}

          <form onSubmit={onSubmit}>
            <VStack gap={4}>
              <IconButton variant="outline" p={5} w="100%">
                <SiSpringsecurity />
                <Text fontFamily="mono">SIGN IN INTO OAUTH-IDP PROVIDER</Text>
              </IconButton>
              <Field
                label="User ID"
                required
                w="100%"
                errorText={errors.username?.message}
                invalid={!!errors.username}
              >
                <InputGroup flex="1" w="100%" startElement={<LuUser />}>
                  <Input
                    {...register("username", {
                      required: "user ID is required",
                    })}
                    placeholder="Enter your user ID"
                    onFocus={checkVersion}
                  />
                </InputGroup>
              </Field>

              <Field
                label="Password"
                required
                w="100%"
                errorText={errors.password?.message}
                invalid={!!errors.password}
              >
                <PasswordInput
                  {...register("password", {
                    required: "Password is required",
                  })}
                  variant={"outline"}
                  placeholder="Enter your password"
                  rootProps={{ startElement: <TbPasswordFingerprint /> }}
              
                />
                {/* <InputGroup
                  flex="1"
                  w="100%"
                  startElement={<TbPasswordFingerprint />}
                >
                  <Input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    variant={"outline"}
                    placeholder="Enter your password"
                  />
                </InputGroup> */}
              </Field>

              {showAlert.isVisible && (
                <Alert.Root status={showAlert.status} variant="outline">
                  <Alert.Indicator />
                  {/* <Alert.Content> */}
                  <Alert.Title>{showAlert.title}</Alert.Title>
                  <Alert.Description>{showAlert.description}</Alert.Description>
                  {/* </Alert.Content> */}
                </Alert.Root>
              )}
              <Button
                colorPalette="blue"
                width="full"
                variant="solid"
                type="submit"
                loading={isLoading}
                loadingText="Authentication Start"
              >
                <AiOutlineLogin />
                Sign In
              </Button>
              {/* <ColorModeButton></ColorModeButton> */}
              <Text textAlign="center" fontSize="xs">
                Don't have an account?{" "}
                <Link color="#0969da" to={"/auth/sign-up"}>
                  Sign Up
                </Link>
              </Text>
            </VStack>
            {/* </VStack> */}
          </form>
        </Box>
      </Box>
    </>
  );
};

export default SignIn;
