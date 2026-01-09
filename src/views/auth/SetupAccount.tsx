import React, { useEffect, useState, Suspense, lazy, useCallback } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Circle,
  Container,
  Flex,
  Spinner,
  Center,
  Alert,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate, useParams, useLocation } from "react-router";
import {
  FaArrowLeft,
  FaBuilding,
  FaCheck,
  FaCreditCard,
  FaRocket,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";

import { useColorModeValue } from "@/components/ui/color-mode";
import { GETAPI, POSTAPI } from "@/app/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { setValidatedAccountsData } from "@/app/slices/account/setupAccountSlice";
import { Toaster, toaster } from "@/components/ui/toaster";
// Lazy Load Steps
const BusinessDetailsForm = lazy(() => import("./steps/BusinessDetails"));
const PlanSelection = lazy(() => import("./steps/PlanSelection"));
const PaymentForm = lazy(() => import("./steps/PaymentForm"));
const CompletionView = lazy(() => import("./steps/CompletionView"));

/**
 * SetupAccount Component
 *
 * Full-page wizard for account setup.
 * Features:
 * - Responsive Design (Mobile First)
 * - Glassmorphic Sticky Header
 * - URL-based Navigation
 * - Smooth CSS Transitions
 * - Lazy Loading Steps
 * - Account Activation on Mount
 */
export default function SetupAccount() {
  const navigate = useNavigate();
  const { request_code, "*": splat } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  // States
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isStepSubmitting, setIsStepSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [activeSubmitHandler, setActiveSubmitHandler] = useState<(() => Promise<boolean>) | null>(null);

  const handleSetSubmitHandler = useCallback(
    (handler: (() => Promise<boolean>) | null) => {
      setActiveSubmitHandler(() => handler);
    },
    []
  );

  // Determine current step from URL path
  const currentStepSlug = splat || "business";

  const steps = [
    {
      id: "business",
      index: 1,
      title: "Business Details",
      icon: <FaBuilding />,
    },
    { id: "plan", index: 2, title: "Choose Plan", icon: <FaRocket /> },
    { id: "payment", index: 3, title: "Payment", icon: <FaCreditCard /> },
    { id: "complete", index: 4, title: "Complete", icon: <FaCheck /> },
  ];

  const currentStepObj =
    steps.find((s) => s.id === currentStepSlug) || steps[0];
  const currentStepIndex = currentStepObj.index;
  const totalSteps = 4;

  // Colors
  const bgColor = useColorModeValue("gray.50", "#0f1117"); // Darker dark mode
  const activeColor = useColorModeValue("blue.600", "blue.400");
  const mutedColor = useColorModeValue("gray.400", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const glassBg = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(15, 17, 23, 0.8)"
  );

  // Hoisted Colors for Hooks Compliance
  const stepperLineColor = useColorModeValue("gray.200", "gray.700");
  const stepCircleBgNonActive = useColorModeValue("white", "gray.800");
  const stepCircleBorderNonActive = useColorModeValue("gray.200", "gray.600");
  const stepTextActive = useColorModeValue("gray.900", "white");
  const mobileStepperBg = useColorModeValue("gray.100", "gray.800");
  const contentBg = useColorModeValue("white", "gray.800");
  const contentBorder = useColorModeValue("gray.100", "gray.700");
  const errorCardOuterBorder = useColorModeValue("gray.100", "gray.700"); // Reusing similar logic

  // Animations
  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  const animation = prefersReducedMotion
    ? undefined
    : `${fadeIn} 0.5s ease-out`;

  // Redirect to business if no slug provided
  useEffect(() => {
    if (!splat && request_code) {
      navigate(`/account/setup/${request_code}/business`, { replace: true });
    }
  }, [splat, navigate, request_code]);

  // Validate Token on Mount
  useEffect(() => {
    if (request_code) {
      setIsValidating(true);
      // GETAPI returns an Observable
      const subscription = GETAPI({
        path: `/account/validate/${request_code}`,
      }).subscribe({
        next: (res: any) => {
          if (res.success && res.data.length > 0) {
            dispatch(
              setValidatedAccountsData({
                validatedAccountsData: res.data[0],
                validationsPassed: true,
              })
            );
            setIsValidating(false);
          } else {
            dispatch(
              setValidatedAccountsData({
                validatedAccountsData: {},
                validationsPassed: false,
              })
            );
            setValidationError(
              res.message || "Invalid or expired activation link."
            );
            setIsValidating(false);
          }
        },
        error: (err: any) => {
          dispatch(
            setValidatedAccountsData({
              validatedAccountsData: {},
              validationsPassed: false,
            })
          );
          console.error("Activation Error:", err);
          setValidationError(
            err.message || "An unexpected error occurred. Please try again."
          );
          setIsValidating(false);
        },
      });

      return () => subscription.unsubscribe();
    } else {
      dispatch(
        setValidatedAccountsData({
          validatedAccountsData: {},
          validationsPassed: false,
        })
      );
      setValidationError("Missing activation code.");
      setIsValidating(false);
    }
  }, [request_code]);

  const handleResendLink = () => {
    if (!request_code) return;
    setIsResending(true);
    const subscription = POSTAPI({
      path: `/account/resend-activation/${request_code}`,
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          toaster.create({
            title: "Success",
            description: "New activation link sent successfully",
            type: "success",
          });
        } else {
          toaster.create({
            title: "Error",
            description: res.message || "Failed to resend activation link",
            type: "error",
          });
        }
        setIsResending(false);
      },
      error: (err: any) => {
        console.error("Resend Error:", err);
        toaster.create({
          title: "Error",
          description: err.message || "An unexpected error occurred",
          type: "error",
        });
        setIsResending(false);
      },
    });
  };

  if (isValidating) {
    return (
      <Center minH="100vh" bg={bgColor}>
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.500" fontSize="lg">
            Verifying your account...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (validationError) {
    return (
      <Center
        minH="100vh"
        bg={bgColor}
        px={4}
        position="relative"
        overflow="hidden"
      >
        {/* Background Decor */}
        <Box
          position="absolute"
          top="-20%"
          left="-10%"
          w="500px"
          h="500px"
          bg="red.400"
          opacity="0.1"
          filter="blur(100px)"
          borderRadius="full"
        />
        <Box
          position="absolute"
          bottom="-20%"
          right="-10%"
          w="500px"
          h="500px"
          bg="orange.400"
          opacity="0.1"
          filter="blur(100px)"
          borderRadius="full"
        />

        <VStack
          bg={contentBg}
          p={{ base: 8, md: 12 }}
          borderRadius="2xl"
          boxShadow="2xl"
          textAlign="center"
          maxW="lg"
          w="full"
          gap={6}
          border="1px solid"
          borderColor={errorCardOuterBorder}
          position="relative"
          zIndex={1}
        >
          <Circle size="20" bg="red.50" color="red.500">
            <FaExclamationTriangle size={32} />
          </Circle>

          <VStack gap={2}>
            <Heading size="xl" letterSpacing="tight">
              Link Expired or Invalid
            </Heading>
            <Text color="gray.500" fontSize="lg" lineHeight="tall">
              {validationError ||
                "The activation link you clicked has expired or is invalid. Please request a new one or contact support."}
            </Text>
          </VStack>

          <VStack gap={3} w="full">
            <Button
              size="xl"
              w="full"
              onClick={handleResendLink}
              colorPalette="blue"
              borderRadius="xl"
              fontWeight="bold"
              loading={isResending}
              loadingText="Resending..."
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Resend Activation Link
            </Button>
            <Button
              size="xl"
              w="full"
              variant="ghost"
              onClick={() => navigate("/auth/sign-in")}
              colorPalette="gray"
              borderRadius="xl"
              fontWeight="bold"
              _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Return to Sign In
            </Button>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // --- Navigation ---
  const handleNext = async () => {
    console.log(`[Wizard] Moving from step: ${currentStepSlug} (Index: ${currentStepIndex})`);

    if (activeSubmitHandler) {
      console.log(`[Wizard] Executing submit handler for ${currentStepSlug}...`);
      const success = await activeSubmitHandler();
      if (!success) {
        console.warn(`[Wizard] Submit handler for ${currentStepSlug} failed.`);
        return;
      }
      console.log(`[Wizard] Submit handler for ${currentStepSlug} succeeded.`);
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex <= totalSteps) {
      const nextSlug = steps.find((s) => s.index === nextIndex)?.id;
      navigate(`/account/setup/${request_code}/${nextSlug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 1) {
      const prevSlug = steps.find((s) => s.index === currentStepIndex - 1)?.id;
      navigate(`/account/setup/${request_code}/${prevSlug}`);
    } else {
      navigate(-1);
    }
  };

  // --- Sub-Components ---
  const renderContent = () => {
    return (
      <Suspense
        fallback={
          <Center minH="400px">
            <Spinner size="xl" color="blue.500" gap="4px" />
          </Center>
        }
      >
        {(() => {
          switch (currentStepSlug) {
            case "business":
              return (
                <BusinessDetailsForm
                  setIsSubmitting={setIsStepSubmitting}
                  setSubmitHandler={handleSetSubmitHandler}
                />
              );
            case "plan":
              return (
                <PlanSelection
                  setIsSubmitting={setIsStepSubmitting}
                  setSubmitHandler={handleSetSubmitHandler}
                />
              );
            case "payment":
              return (
                <PaymentForm
                  setIsSubmitting={setIsStepSubmitting}
                  setSubmitHandler={handleSetSubmitHandler}
                />
              );
            case "complete":
              return <CompletionView />;
            default:
              return null;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <Box minH="100vh" bg={bgColor} width={"100%"}>

      {/* --- Sticky Glassmorphic Header --- */}
      <Box
        w={"full"}
        position="sticky"
        top="0"
        zIndex="50"
        borderBottom="1px solid"
        borderColor={borderColor}
        bg={glassBg}
        backdropFilter="blur(12px)"
        px={{ base: 4, md: 8 }}
        py={3}
      >
        <Flex justify="space-between" align="center" maxW="7xl" mx="auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            gap={2}
            color="gray.500"
            _hover={{ color: activeColor, bg: "transparent" }}
          >
            <FaArrowLeft /> <Text hideBelow="sm">Back</Text>
          </Button>

          <HStack gap={2}>
            <Box p={1.5} bg={activeColor} borderRadius="md" color="white">
              <BiBuildingHouse size={18} />
            </Box>
            <Heading size="sm" display={{ base: "none", sm: "block" }}>
              Setup Account For Your Business
            </Heading>
          </HStack>

          <Box w={{ base: "auto", sm: "80px" }}>
            <Text fontSize="sm" fontWeight="bold" color={activeColor}>
              Step {currentStepIndex}/{totalSteps}
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box py={{ base: 6, md: 10 }} px={{ base: 4, md: 8 }}>
        <VStack gap={{ base: 8, md: 12 }} align="stretch">
          {/* --- Header Info --- */}
          <VStack
            gap={3}
            align="center"
            textAlign="center"
            animation={animation}
          >
            <Heading
              size={{ base: "xl", md: "3xl" }}
              letterSpacing="tight"
              lineHeight="1.2"
            >
              {currentStepSlug === "business" && "Tell us about your Business"}
              {currentStepSlug === "application" && "What are you building?"}
              {currentStepSlug === "plan" && "Select the Perfect Plan"}
              {currentStepSlug === "payment" && "Payment Details"}
              {currentStepSlug === "complete" && "You're All Set!"}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.500"
              maxW="2xl"
              lineHeight="tall"
            >
              {currentStepSlug === "business" &&
                "Help us customize your workspace by answering a few quick questions."}
              {currentStepSlug === "application" &&
                "Select the application template that best fits your business needs."}
              {currentStepSlug === "plan" &&
                "Unlock the full potential of your team with our flexible pricing plans."}
              {currentStepSlug === "payment" &&
                "We encrypt all data. Securely enter your payment information below."}
              {currentStepSlug === "complete" &&
                "Your organization has been successfully created. Welcome aboard!"}
            </Text>
          </VStack>

          {/* --- Responsive Stepper --- */}
          <Box
            py={2}
            maxW="3xl"
            mx="auto"
            w="full"
            display={{ base: "none", md: "block" }}
          >
            <HStack w="full" justify="space-between" position="relative">
              {/* Line Background */}
              <Box
                position="absolute"
                top="14px"
                left="18px"
                right="18px"
                h="2px"
                bg={stepperLineColor}
                zIndex={0}
              />

              {/* Progress Line */}
              <Box
                position="absolute"
                top="14px"
                left="18px"
                h="2px"
                bg={activeColor}
                zIndex={0}
                width={`calc(${((currentStepIndex - 1) / (totalSteps - 1)) * 100}% - ${((currentStepIndex - 1) / (totalSteps - 1)) * 36}px)`}
                transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              />

              {steps.map((s) => {
                const isActive = s.index <= currentStepIndex;
                const isCurrent = s.index === currentStepIndex;
                return (
                  <VStack key={s.id} zIndex={1} gap={2}>
                    <Circle
                      size={isCurrent ? "9" : "8"}
                      bg={isActive ? activeColor : stepCircleBgNonActive}
                      color={isActive ? "white" : mutedColor}
                      border="2px solid"
                      borderColor={
                        isActive ? activeColor : stepCircleBorderNonActive
                      }
                      transition="all 0.3s"
                      boxShadow={
                        isCurrent ? "0 0 0 4px rgba(66, 153, 225, 0.3)" : "none"
                      }
                    >
                      {s.index < currentStepIndex ? (
                        <FaCheck size={12} />
                      ) : (
                        <Text fontSize="xs" fontWeight="bold">
                          {s.index}
                        </Text>
                      )}
                    </Circle>
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color={isActive ? stepTextActive : mutedColor}
                      transform={isCurrent ? "scale(1.05)" : "scale(1)"}
                      transition="all 0.3s"
                    >
                      {s.title}
                    </Text>
                  </VStack>
                );
              })}
            </HStack>
          </Box>

          {/* Mobile Stepper Indicator */}
          <Box display={{ base: "block", md: "none" }} w="full">
            <Box
              h="4px"
              w="full"
              bg={mobileStepperBg}
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="full"
                bg={activeColor}
                w={`${(currentStepIndex / totalSteps) * 100}%`}
                transition="width 0.4s ease"
                borderRadius="full"
              />
            </Box>
          </Box>

          {/* --- Content Area --- */}
          <Box
            bg={contentBg}
            p={{ base: 6, md: 10 }}
            borderRadius={{ base: "xl", md: "2xl" }}
            boxShadow="xl"
            border="1px solid"
            borderColor={contentBorder}
            minH="400px"
            animation={animation}
          >
            {renderContent()}

            {/* Step Actions */}
            {currentStepSlug !== "complete" && (
              <Flex
                justify="space-between"
                align="center"
                mt={{ base: 8, md: 12 }}
                pt={8}
                borderTop="1px solid"
                borderColor={contentBorder}
                direction={{ base: "column-reverse", sm: "row" }}
                gap={4}
              >
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  color="gray.500"
                  disabled={currentStepIndex === 1}
                  w={{ base: "full", sm: "auto" }}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  colorPalette="blue"
                  px={10}
                  onClick={handleNext}
                  loading={isStepSubmitting}
                  loadingText="Saving"
                  borderRadius="xl"
                  w={{ base: "full", sm: "auto" }}
                  bgGradient="linear(to-r, blue.500, blue.600)"
                  _hover={{ bgGradient: "linear(to-r, blue.600, blue.700)" }}
                >
                  {currentStepSlug === "payment"
                    ? "Complete Setup"
                    : "Next Step"}
                </Button>
              </Flex>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
