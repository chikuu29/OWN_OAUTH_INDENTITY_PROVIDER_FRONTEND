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
// import { AlertProps } from "../../../types/appConfigInterface";

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

  // const loginWithGoogle = () => {
  //   console.log("Login With Google");
  //   dispatch(startLoading("Please Wait We Will Redirected to Google..."));
  //   // console.log("Location", window.location.origin + "/api/auth/google");

  //   const redirectTo = encodeURIComponent(window.location.href);
  //   console.log("Redirecturl", redirectTo);
  //   console.log("hiii", window.location.href);

  //   // Redirect to Google OAuth, with the `redirectTo` parameter
  //   // window.location.href = `http://localhost:5000/auth/google?redirectTo=${redirectTo}`;
  //   // window.open(window.location.origin+"/api/auth/google",'_self')
  //   window.open(
  //     window.location.origin + `/api/v1/oauth/google?redirectTo=${redirectTo}`,
  //     "_self"
  //   );
  //   // window.open("http://localhost:7000/v1/auth/google",'_self')
  // };

  // const loginWithSso = () => {
  //   console.log("Login With SSO");
  //   dispatch(startLoading("Please Wait We Will Redirected to SSO..."));
  //   // console.log("Location", window.location.origin + "/api/auth/google");
  //   const clientId = "uqQdID3LfLNvhuKakSt2XW1niHgg35nfjzI4q67t"; // Replace with your OAuth application client ID
  //   // const redirectUri = 'http://127.0.0.1:3000/callback'; // Your frontend callback URL
  //   const authServerUrl = "http://localhost:8000/o/authorize/";
  //   // const redirectTo = encodeURIComponent(window.location.href);
  //   const redirectTo = "http://localhost:5173/auth/callback";
  //   console.log("Redirecturl", redirectTo);
  //   console.log("hiii", window.location.href);
  //   // const authUrl = `${authServerUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
  //   // window.location.href = authUrl;
  //   console.log(
  //     "url",
  //     authServerUrl +
  //       `?client_id=${clientId}&response_type=code&redirect_uri=${redirectTo}`
  //   );
  //   window.open(
  //     authServerUrl +
  //       `?client_id=${clientId}&response_type=code&redirect_uri=${redirectTo}&scope=openid profile email`,
  //     "_self"
  //   );
  //   // window.open(
  //   //   window.location.origin + `/api/o/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectTo}`,
  //   //   "_self"
  //   // );
  // };

  // const Blur = (props: IconProps) => {
  //   return (
  //     <Icon
  //       width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
  //       zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
  //       height="200px"
  //       viewBox="0 0 528 560"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //       {...props}
  //     >
  //       <circle cx="71" cy="61" r="111" fill="#F56565" />
  //       <circle cx="244" cy="106" r="139" fill="#ED64A6" />
  //       <circle cy="291" r="139" fill="#ED64A6" />
  //       <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
  //       <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
  //       <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
  //       <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
  //     </Icon>
  //   );
  // };

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
      POSTAPI({
        path: "/auth/login",
        data: formData,
        isPrivateApi: true,
      }).subscribe((res: any) => {
        if (res.success) {
          console.log(res);

          setLoading(false);
          const responseInfo: any = res["login_info"];
          console.log("AuthInfo", responseInfo);
          setLoginAuthInfo(responseInfo);
          dispatch(fetchAppConfig());
          dispatch(login(res));
          // setShowAlert({
          //   title: res?.message,
          //   description: res["message"],
          //   status: "success",
          //   isVisible: true,
          // });
          // console.log("redirectUrl",redirectUrl);
          navigate(redirectUrl || "/myApps");
        } else {
          console.log(res);
        }
      });
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      if (error.message === "Network Error") {
        // setShowAlert({
        //   title: error?.message,
        //   description: "Please Check Your Internet Connections",
        //   status: "error",
        //   isVisible: true,
        // });
      } else {
        // setShowAlert({
        //   title: error?.statusText,
        //   description: error?.response["data"]["message"],
        //   status: "error",
        //   isVisible: true,
        // });
      }
    }
  });

  return (
    <>
      {/* <AppVersionAlert isNewVersionAvailable={isNewVersionAvailable} /> */}
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
              <Button
                colorPalette="blue"
                width="full"
                variant="solid"
                type="submit"
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
