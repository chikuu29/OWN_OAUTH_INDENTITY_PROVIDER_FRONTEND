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
  VStack
,
} from "@chakra-ui/react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { publicAPI } from "../../../app/handlers/axiosHandlers";
import { useAuth } from "../../../contexts/AuthProvider";
import { useDispatch } from "react-redux";
import { login } from "../../../app/slices/auth/authSlice";
import { fetchAppConfig } from "../../../app/slices/appConfig/appConfigSlice";
import { AppDispatch } from "../../../app/store";
import { startLoading } from "../../../app/slices/loader/appLoaderSlice";
import { POSTAPI } from "../../../app/api";
import { AlertProps } from "../../../app/interfaces/app.interface";
import { Field } from "@/components/ui/field";
import { AiOutlineLogin, AiOutlineUser, AiOutlineLock } from "react-icons/ai";
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
import { FaShieldAlt, FaUserShield } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { useColorModeValue } from "@/components/ui/color-mode";

const SignIn = () => {
  console.log("signin");

  const [isNewVersionAvailable, setIsNewVersionAvailable] =
    useState<boolean>(false);
  const checkVersion = async () => {
    try {
      const response = await fetch(`../version.json?t=${Date.now()}`);
      console.log("response", response);
      var CURRENT_VERSION = "{{HASH_PLACEHOLDER}}";
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data["version"] != CURRENT_VERSION) {
        setIsNewVersionAvailable(true);
        console.log("NEW VERSION IS AVAILBLE");
      } else {
        console.log("Same Version");
      }
    } catch (error) {
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

  // Fixed Color mode values - ensure proper light mode colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.400");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const headerBg = useColorModeValue("linear(to-r, blue.500, purple.600)", "linear(to-r, blue.600, purple.700)");
  const backgroundGradient = useColorModeValue(
    "linear(to-br, blue.50, indigo.100, purple.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const decorativeBg1 = useColorModeValue("blue.100", "blue.800");
  const decorativeBg2 = useColorModeValue("purple.100", "purple.800");

  useEffect(() => {
    if (!loading && authInfo && authInfo.success) {
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

    const formData = new FormData();
    formData.append("username", formState.username ?? "");
    formData.append("password", formState.password ?? "");
    console.log("form", formData);

    try {
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
          dispatch(login(res));
          setShowAlert({
            title: res?.message,
            description: res["message"],
            status: "success",
            isVisible: true,
          });
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
      
      {/* Main Container with Gradient Background */}
      <Box
        minH="100vh"
        bgGradient={backgroundGradient}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        {/* Decorative Background Elements */}
        <Box
          position="absolute"
          top="10%"
          left="10%"
          w="200px"
          h="200px"
          bg={decorativeBg1}
          borderRadius="full"
          opacity="0.1"
          filter="blur(40px)"
        />
        <Box
          position="absolute"
          bottom="10%"
          right="10%"
          w="300px"
          h="300px"
          bg={decorativeBg2}
          borderRadius="full"
          opacity="0.1"
          filter="blur(50px)"
        />

        {/* Main Card */}
        <Box
          maxW="md"
          w="full"
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            bgGradient: "linear(to-r, blue.500, purple.500, pink.500)",
          }}
        >
          {/* Header Section */}
          <Box
            bgGradient={headerBg}
            p={8}
            textAlign="center"
            // color="white"
            color={useColorModeValue("gray", "white")}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative Icons */}
            <Box
              // bg={useColorModeValue("white", "white")}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              opacity="0.1"
            >
              <FaShieldAlt size={120} />
            </Box>
            
            <VStack gap={4}>
              <Box
                w="80px"
                h="80px"
                bg="white"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="lg"
                mb={4}
              >
                <FaUserShield size={40} color="#4F46E5"  />
              </Box>
              
              <Heading size="lg" fontWeight="bold" >
                Welcome Back
              </Heading>
              <Text fontSize="md" opacity="0.9" fontWeight="bold"  >
                Sign in to your OAuth IDP Provider
              </Text>
            </VStack>
          </Box>

          {/* Form Section */}
          <Box p={8} bg={bgColor}>
            <form onSubmit={onSubmit}>
              <VStack gap={6}>
                {/* User ID Field */}
                <Field
                  label="User ID"
                  required
                  w="100%"
                  errorText={errors.username?.message}
                  invalid={!!errors.username}
                >
                  <InputGroup 
                    flex="1" 
                    w="100%" 
                    startElement={
                      <Box color={accentColor}>
                        <AiOutlineUser size={20} />
                      </Box>
                    }
                  >
                    <Input
                      {...register("username", {
                        required: "User ID is required",
                      })}
                      placeholder="Enter your user ID"
                      onFocus={checkVersion}
                      size="lg"
                      borderRadius="xl"
                      borderColor={borderColor}
                      bg={useColorModeValue("white", "gray.700")}
                      color={textColor}
                      _placeholder={{
                        color: subtextColor,
                      }}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                      _hover={{
                        borderColor: accentColor,
                      }}
                    />
                  </InputGroup>
                </Field>

                {/* Password Field */}
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
                    variant="outline"
                    placeholder="Enter your password"
                    size="lg"
                    borderRadius="xl"
                    borderColor={borderColor}
                    bg={useColorModeValue("white", "gray.700")}
                    color={textColor}
                    _placeholder={{
                      color: subtextColor,
                    }}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: `0 0 0 1px ${accentColor}`,
                    }}
                    _hover={{
                      borderColor: accentColor,
                    }}
                    rootProps={{ 
                      startElement: (
                        <Box color={accentColor}>
                          <TbPasswordFingerprint size={20} />
                        </Box>
                      ) 
                    }}
                  />
                </Field>

                {/* Alert Messages */}
                {showAlert.isVisible && (
                  <Alert.Root 
                    status={showAlert.status} 
                    variant="outline"
                    borderRadius="xl"
                    borderWidth="2px"
                  >
                    <Alert.Indicator />
                    <Alert.Title fontWeight="semibold">
                      {showAlert.title}
                    </Alert.Title>
                    <Alert.Description>
                      {showAlert.description}
                    </Alert.Description>
                  </Alert.Root>
                )}

                {/* Sign In Button */}
                <Button
                  colorPalette="blue"
                  width="full"
                  variant="solid"
                  type="submit"
                  loading={isLoading}
                  loadingText="Signing In..."
                  size="lg"
                  borderRadius="xl"
                  bgGradient="linear(to-r, blue.500, purple.600)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.600, purple.700)",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s"
                  fontWeight="semibold"
                  letterSpacing="wide"
                  // color="white"
                >
                  <AiOutlineLogin />
                  Sign In
                </Button>

                {/* Sign Up Link */}
                <Box textAlign="center" pt={4}>
                  <Text fontSize="sm" color={subtextColor}>
                    Don't have an account?{" "}
                    <Link 
                      to="/auth/sign-up"
                      style={{
                        color: accentColor,
                        fontWeight: "600",
                        textDecoration: "none",
                      }}
                    >
                      Sign Up
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignIn;
