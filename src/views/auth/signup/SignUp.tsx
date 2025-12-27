import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  Alert,
} from "@chakra-ui/react";
import { NavLink } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { POSTAPI } from "../../../app/api";
import { AlertProps } from "../../../app/interfaces/app.interface";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { BiBuildingHouse } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { AuthCard } from "../components/AuthCard"; // Shared Layout Component

/**
 * SignUp Component
 * 
 * Allows users to register a new tenant organization.
 * Uses the shared AuthCard for consistent layout.
 */
export default function SignUP() {
  // --- State Management ---
  const [showAlert, setShowAlert] = useState<AlertProps>({
    title: "",
    description: "",
    status: "info",
    isVisible: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // --- Form Hooks ---
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({ mode: "onChange" });

  // --- Handlers ---
  const onFormSubmit = (formData: any) => {
    setIsLoading(true);
    const payload = {
      tenant_email: formData.tenant_email,
      tenant_name: formData.tenant_name,
    };

    POSTAPI({ path: "account/register/tenant/", data: payload, isPrivateApi: false }).subscribe((res: any) => {
      setIsLoading(false);
      if (res.success) {
        setShowAlert({ title: "Success", description: res?.message || "Tenant created successfully", status: "success", isVisible: true });
      } else {
        // Construct detailed error message
        let errorDescription = res?.message || "Failed to create tenant";
        if (res?.error?.detail) {
          errorDescription = `${errorDescription}: ${res.error.detail}`;
        }
        
        setShowAlert({ 
          title: "Error", 
          description: errorDescription, 
          status: "error", 
          isVisible: true 
        });
      }
    });
  };

  // --- Styles ---
  // (Minimal styles needed here, most are in AuthCard or components)
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.400");

  return (
    <AuthCard
      title="Create Tenant"
      subtitle="Start your journey by creating a new tenant"
      icon={<FaBuilding size={32} color="#4F46E5" />}
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <VStack gap={5}>
          {/* Tenant Name Field */}
          <Field
            label="Tenant Name"
            required
            w="100%"
            errorText={errors.tenant_name?.message?.toString()}
            invalid={!!errors.tenant_name}
          >
            <InputGroup
              flex="1"
              w="100%"
              startElement={
                <Box color={accentColor}>
                  <BiBuildingHouse size={20} />
                </Box>
              }
            >
              <Input
                placeholder="Enter tenant name"
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
                _hover={{ borderColor: accentColor }}
                {...register("tenant_name", {
                  required: "Tenant name is required",
                  minLength: { value: 2, message: "Enter a valid tenant name" },
                })}
              />
            </InputGroup>
          </Field>

          {/* Tenant Email Field */}
          <Field
            label="Tenant Email"
            required
            w="100%"
            errorText={errors.tenant_email?.message?.toString()}
            invalid={!!errors.tenant_email}
          >
            <InputGroup
              flex="1"
              w="100%"
              startElement={
                <Box color={accentColor}>
                  <MdEmail size={20} />
                </Box>
              }
            >
              <Input
                type="email"
                placeholder="Enter contact email"
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
                _hover={{ borderColor: accentColor }}
                {...register("tenant_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
            </InputGroup>
          </Field>

          {/* Alert Display */}
          {showAlert.isVisible && (
            <Alert.Root
              status={showAlert.status}
              variant="outline"
              borderRadius="xl"
              borderWidth="2px"
              mt={2}
            >
              <Alert.Indicator />
              <Alert.Title fontWeight="semibold">{showAlert.title}</Alert.Title>
              <Alert.Description>{showAlert.description}</Alert.Description>
            </Alert.Root>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            width="full"
            size="xl"
            // borderRadius="xl"
            bgGradient="linear(to-r, blue.500, purple.600)"
            color="white"
            colorPalette={'blue'}
            fontWeight="bold"
            loading={isLoading}
            loadingText="Creating..."
            _hover={{
              bgGradient: "linear(to-r, blue.600, purple.700)",
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            mt={4}
          >
            <FaBuilding />
            Create Tenant
          </Button>

          {/* Sign In Link */}
          <Box textAlign="center" pt={2}>
            <Text fontSize="sm" color={subtextColor}>
              Already have an account?{" "}
              <NavLink to="/auth/sign-in">
                <Text
                  as="span"
                  color={accentColor}
                  fontWeight="600"
                  _hover={{ textDecoration: "underline" }}
                >
                  Sign In
                </Text>
              </NavLink>
            </Text>
          </Box>
        </VStack>
      </form>
    </AuthCard>
  );
}
