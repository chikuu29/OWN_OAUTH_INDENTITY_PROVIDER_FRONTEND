// Chakra imports
import {
  Alert,
  Box,
  Button,
  Input,
  Text,
  VStack
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { useDispatch } from "react-redux";
import { login } from "../../../app/slices/auth/authSlice";
import { AppDispatch } from "../../../app/store";
import { POSTAPI } from "../../../app/api";
import { AlertProps } from "../../../app/interfaces/app.interface";
import { Field } from "@/components/ui/field";
import { AiOutlineLogin, AiOutlineUser } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { LOGIN_CREDENTIAL } from "@/app/interfaces/app.interface";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { TbPasswordFingerprint } from "react-icons/tb";
import AppVersionAlert from "@/ui/components/alert/AppVersionAlert";
import { FaUserShield } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { AuthCard } from "../components/AuthCard"; // Shared Layout Component

/**
 * SignIn Component
 * 
 * Handles user authentication/login.
 * Uses shared AuthCard for consistent UI.
 */
const SignIn = () => {
  console.log("signin");

  const [isNewVersionAvailable, setIsNewVersionAvailable] = useState<boolean>(false);
  
  // Check for app version updates
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

  // --- Styles ---
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.400");

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
    const formData = new FormData();
    formData.append("username", formState.username ?? "");
    formData.append("password", formState.password ?? "");
    
    try {
      setLoading(true);
      POSTAPI({
        path: "/auth/login",
        data: formData,
        isPrivateApi: true,
      }).subscribe((res: any) => {
        setLoading(false);
        if (res.success) {
          const responseInfo: any = res["login_info"];
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
      let errorTitle = error?.statusText || "Error";
      let errorDescription = error?.response?.data?.message || error?.message || "An error occurred";
      
      if (error.message === "Network Error") {
        errorTitle = error?.message;
        errorDescription = "Please Check Your Internet Connections";
      }

      setShowAlert({
        title: errorTitle,
        description: errorDescription,
        status: "error",
        isVisible: true,
      });
    }
  });

  return (
    <>
      <AppVersionAlert isNewVersionAvailable={isNewVersionAvailable} />
      
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to your OAuth IDP Provider"
        icon={<FaUserShield size={40} color="#4F46E5" />}
      >
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
                  _placeholder={{ color: subtextColor }}
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
                _placeholder={{ color: subtextColor }}
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
              size="xl"
              // borderRadius="xl"
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
      </AuthCard>
    </>
  );
};

export default SignIn;
