import React, { useEffect, useState } from "react";
import {
  Box,
  Circle,
  Heading,
  Text,
  VStack,
  HStack,
  Separator,
  Badge,
  SimpleGrid,
  Flex,
  Icon,
  Button,
  Grid,
  Stack
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useParams } from "react-router";
import { FaCreditCard, FaCheck, FaReceipt, FaMobileAlt, FaUniversity } from "react-icons/fa";
import { GETAPI } from "@/app/api";
import confetti from "canvas-confetti";

interface PaymentFormProps {
  setIsSubmitting: (loading: boolean) => void;
  setSubmitHandler: (handler: (() => Promise<boolean>) | null) => void;
}

const PaymentForm = ({ setIsSubmitting, setSubmitHandler }: PaymentFormProps) => {
  const { request_code } = useParams();
  const STORAGE_KEY = `setup_plan_selection_${request_code}`;

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({});
  const [apps, setApps] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [transactions, setTransactions] = useState<any[]>([]);

  const availableCoupons = [
    { code: "WELCOME100", percentage: 1, description: "100% discount for Antigravity team." },
    { code: "WELCOME10", percentage: 0.1, description: "10% off on your first subscription." },
    { code: "SAAS20", percentage: 0.2, description: "SaaS Professional 20% discount." },
    { code: "LAUNCH50", percentage: 0.5, description: "Special launch offer! 50% discount." },
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedPlan(parsed.selectedPlan);
        setSelectedApps(parsed.selectedApps || []);
        setSelectedFeatures(parsed.selectedFeatures || {});
        if (parsed.appliedCoupon) {
          setAppliedCoupon(parsed.appliedCoupon);
        }
        if (parsed.transactions) {
          setTransactions(parsed.transactions);
        }
      } catch (e) {
        console.error("Failed to parse storage data", e);
      }
    }

    const subApps = GETAPI({ path: "saas/get_apps" }).subscribe((res: any) => {
      if (res.success) setApps(res.data);
    });
    const subPlans = GETAPI({ path: "plans" }).subscribe((res: any) => {
      if (res.success) setPlans(res.data);
    });

    return () => {
      subApps.unsubscribe();
      subPlans.unsubscribe();
    };
  }, [STORAGE_KEY]);

  const calculateAppTotal = (app: any) => {
    const basePrice = parseFloat(app.base_price) || 0;
    const selectedForApp = selectedFeatures[app.id] || [];
    const addonsPrice = app.features
      ? app.features
        .filter((f: any) => !f.is_base_feature && selectedForApp.includes(f.code))
        .reduce((sum: number, f: any) => sum + (parseFloat(f.addon_price) || 0), 0)
      : 0;
    return basePrice + addonsPrice;
  };

  const getSelectedPlanDetails = () => {
    return plans.find(p => p.plan_code === selectedPlan);
  };

  const handleApplyCoupon = () => {
    const lowerCoupon = couponInput.trim().toUpperCase();
    if (!lowerCoupon) return;

    // Mock Coupon logic
    let discount = 0;
    let message = "";

    if (lowerCoupon === "WELCOME100") {
      discount = 1; // 100%
      message = "Antigravity Special! 100% discount applied.";
    } else if (lowerCoupon === "WELCOME10") {
      discount = 0.1; // 10%
      message = "Welcome coupon! 10% discount applied.";
    } else if (lowerCoupon === "SAAS20") {
      discount = 0.2; // 20%
      message = "SaaS Promo! 20% discount applied.";
    } else {
      toaster.create({
        title: "Invalid Coupon",
        description: "This coupon code is not valid.",
        type: "error",
      });
      return;
    }

    setAppliedCoupon({ code: lowerCoupon, percentage: discount });
    setCouponInput("");
    setShowCoupons(false);

    // Trigger confetti from the right side (Payment Box)
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { x: 0.75, y: 0.5 },
      gravity: 1.2,
      scalar: 1.2,
    });

    toaster.create({
      title: "Coupon Applied",
      description: message,
      type: "success",
    });
  };

  const applySpecificCoupon = (coupon: any) => {
    setAppliedCoupon({ code: coupon.code, percentage: coupon.percentage });
    setShowCoupons(false);

    // Trigger confetti from the right side (Payment Box)
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { x: 0.75, y: 0.5 },
      gravity: 1.2,
      scalar: 1.2,
    });

    toaster.create({
      title: "Coupon Applied",
      description: `Coupon ${coupon.code} applied successfully!`,
      type: "success",
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toaster.create({
      description: "Coupon removed.",
      type: "info",
    });
  };

  const planDetails = getSelectedPlanDetails();
  const planBasePrice = parseFloat(planDetails?.current_version?.price || "0");
  const appsSubtotal = apps
    .filter(app => selectedApps.includes(app.id))
    .reduce((sum, app) => sum + calculateAppTotal(app), 0);

  const subtotal = planBasePrice + appsSubtotal;
  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.percentage : 0;
  const taxableAmount = subtotal - discountAmount;

  const taxRate = 0.18; // 18% GST
  const tax = taxableAmount * taxRate;
  const grandTotal = taxableAmount + tax;

  useEffect(() => {
    const handleSubmit = async () => {
      console.log("=== FINAL SETUP SELECTIONS ===");
      console.log("Selected Plan:", selectedPlan);
      console.log("Selected Apps:", selectedApps);
      console.log("Selected Features:", selectedFeatures);
      console.log("Applied Coupon:", appliedCoupon);
      console.log("Price Breakdown:", {
        subtotal,
        discount: discountAmount,
        taxable: taxableAmount,
        tax,
        total: grandTotal
      });
      console.log("===============================");

      toaster.create({
        title: "Setup Data Logged",
        description: "Check the console to see all your selections.",
        type: "success",
      });

      // User requested NOT to move to next step
      return false;
    };

    setSubmitHandler(handleSubmit);
    return () => setSubmitHandler(null);
  }, [setSubmitHandler, selectedPlan, selectedApps, selectedFeatures, appliedCoupon, subtotal, discountAmount, taxableAmount, tax, grandTotal, paymentMethod]);

  const handlePayNow = async () => {
    setIsSubmitting(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate random success/failure (80% success)
    const isSuccess = Math.random() > 0.2;
    const status = isSuccess ? 'success' : 'failed';

    const newTransaction = {
      id: `TXN-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toLocaleString(),
      amount: grandTotal,
      method: paymentMethod,
      status: status
    };

    setTransactions(prev => [newTransaction, ...prev]);

    console.log("=== PAYMENT PROCESSED ===");
    console.log("Method:", paymentMethod);
    console.log("Amount Paid:", grandTotal);
    console.log("Status:", status);
    console.log("=========================");

    if (isSuccess) {
      toaster.create({
        title: "Payment Successful",
        description: `Payment of ₹${grandTotal.toLocaleString()} processed via ${paymentMethod === 'card' ? 'Credit Card' : paymentMethod.toUpperCase()}.`,
        type: "success",
      });
    } else {
      toaster.create({
        title: "Payment Failed",
        description: "Transaction failed. Please try again.",
        type: "error",
      });
    }

    setIsSubmitting(false);
  };

  // Persist all selections to localStorage
  useEffect(() => {
    if (!selectedPlan && selectedApps.length === 0) return; // Don't overwrite if not loaded yet

    const dataToSave = {
      selectedPlan,
      selectedApps,
      selectedFeatures,
      appliedCoupon,
      transactions, // Save transactions too
      pricing: {
        subtotal,
        discountAmount,
        taxableAmount,
        tax,
        grandTotal
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [STORAGE_KEY, selectedPlan, selectedApps, selectedFeatures, appliedCoupon, subtotal, discountAmount, taxableAmount, tax, grandTotal, transactions]);

  const summaryBg = useColorModeValue("blue.50/50", "blue.900/10");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} alignItems="start">



      {/* Left Side: Order Summary */}
      <Box
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        p={6}
        shadow="sm"
        position="sticky"
        top="100px"
      >
        <VStack align="stretch" gap={6}>
          <HStack justify="space-between">
            <HStack gap={3}>
              <Icon as={FaReceipt} color="blue.500" />
              <Heading size="md">Order Summary</Heading>
            </HStack>
            <Badge colorPalette="blue" variant="subtle" borderRadius="md">
              Monthly Billing
            </Badge>
          </HStack>

          <Separator />

          <VStack align="stretch" gap={4}>
            {/* Plan Selection */}
            <HStack justify="space-between">
              <VStack align="start" gap={0}>
                <Text fontWeight="bold" fontSize="sm">{planDetails?.name || "Selected Plan"}</Text>
                <Text fontSize="xs" color="gray.500">Base usage & platform fee</Text>
              </VStack>
              <Text fontWeight="bold">₹{planBasePrice.toLocaleString()}</Text>
            </HStack>

            {/* Selected Apps */}
            {apps.filter(app => selectedApps.includes(app.id)).map(app => (
              <HStack key={app.id} justify="space-between">
                <VStack align="start" gap={0}>
                  <Text fontWeight="medium" fontSize="sm">{app.name}</Text>
                  <Text fontSize="xs" color="gray.500">Includes {selectedFeatures[app.id]?.length || 0} features</Text>
                </VStack>
                <Text fontWeight="medium" fontSize="sm">₹{calculateAppTotal(app).toLocaleString()}</Text>
              </HStack>
            ))}
          </VStack>

          <Separator />

          {/* Coupon Section */}
          <VStack align="stretch" gap={3}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Promo Code</Text>
            {!appliedCoupon ? (
              <HStack>
                <input
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "var(--chakra-colors-gray-200)",
                    fontSize: "13px",
                    outline: "none",
                    background: "transparent"
                  }}
                />
                <Button size="sm" colorPalette="blue" onClick={handleApplyCoupon} px={4}>
                  Apply
                </Button>
              </HStack>
            ) : (
              <HStack justify="space-between" bg="blue.50" _dark={{ bg: "blue.900/20" }} p={2} borderRadius="md" border="1px dashed" borderColor="blue.200">
                <HStack gap={2}>
                  <Badge colorPalette="blue" variant="solid">{appliedCoupon.code}</Badge>
                  <Text fontSize="xs" fontWeight="medium" color="blue.600">{(appliedCoupon.percentage * 100)}% Discount Applied</Text>
                </HStack>
                <Button size="2xs" variant="ghost" colorPalette="red" onClick={handleRemoveCoupon}>
                  Remove
                </Button>
              </HStack>
            )}

            {!appliedCoupon && (
              <Box>
                <Button
                  variant="plain"
                  size="xs"
                  colorPalette="blue"
                  onClick={() => setShowCoupons(!showCoupons)}
                  fontWeight="bold"
                >
                  {showCoupons ? "Hide available coupons" : "View available coupons"}
                </Button>

                {showCoupons && (
                  <VStack align="stretch" mt={3} gap={2}>
                    {availableCoupons.map((c) => (
                      <HStack
                        key={c.code}
                        p={3}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="gray.100"
                        justify="space-between"
                        bg="gray.50/50"
                        _dark={{ borderColor: "gray.700", bg: "whiteAlpha.50" }}
                        transition="all 0.2s"
                        _hover={{ borderColor: "blue.200", bg: "blue.50/30" }}
                      >
                        <VStack align="start" gap={0}>
                          <Text fontSize="xs" fontWeight="bold">{c.code}</Text>
                          <Text fontSize="10px" color="gray.500">{c.description}</Text>
                        </VStack>
                        <Button size="2xs" colorPalette="blue" variant="subtle" onClick={() => applySpecificCoupon(c)}>
                          Apply
                        </Button>
                      </HStack>
                    ))}
                  </VStack>
                )}
              </Box>
            )}
          </VStack>

          <Box bg={summaryBg} p={4} borderRadius="xl">
            <VStack align="stretch" gap={3}>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">Subtotal</Text>
                <Text fontSize="sm" fontWeight="semibold">₹{subtotal.toLocaleString()}</Text>
              </HStack>

              {appliedCoupon && (
                <HStack justify="space-between">
                  <Text fontSize="sm" color="green.600">Discount ({appliedCoupon.code})</Text>
                  <Text fontSize="sm" fontWeight="semibold" color="green.600">-₹{discountAmount.toLocaleString()}</Text>
                </HStack>
              )}
              <HStack justify="space-between">
                <HStack gap={1}>
                  <Text fontSize="sm" color="gray.600">Tax (GST 18%)</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="semibold">₹{tax.toLocaleString()}</Text>
              </HStack>
              <Separator />
              <HStack justify="space-between" pt={1}>
                <Text fontWeight="black" fontSize="lg">Total Amount</Text>
                <Text fontWeight="black" fontSize="xl" color="blue.600">
                  ₹{grandTotal.toLocaleString()}
                </Text>
              </HStack>
            </VStack>
          </Box>

          <HStack gap={3} p={3} bg="green.50" _dark={{ bg: "green.900/20" }} borderRadius="lg" borderColor="green.100" >
            <Icon as={FaCheck} color="green.600" size="xs" />
            <Text fontSize="xs" color="green.700" _dark={{ color: "green.400" }} fontWeight="medium">
              Secure checkout. You can cancel your subscription at any time.
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* Right Side: Payment Form or Free Access UI */}
      <VStack gap={6} w="full">
        <Box
          w="full"
          p={{ base: 8, md: 12 }}
          border="2px dashed"
          borderColor={grandTotal === 0 ? "green.300" : "gray.300"}
          borderRadius="2xl"
          textAlign="center"
          bg={grandTotal === 0 ? useColorModeValue("green.50/50", "green.900/10") : useColorModeValue("gray.50", "whiteAlpha.50")}
          h="full"
          minH="400px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          transition="all 0.3s"
        >
          {grandTotal === 0 ? (
            <VStack gap={6}>
              <Circle size="20" bg="green.100" color="green.600" shadow="lg">
                <FaCheck size={32} />
              </Circle>
              <VStack gap={2}>
                <Heading size="lg">Enjoy Free Access!</Heading>
                <Text color="gray.500" maxW="sm" mx="auto">
                  Your coupon covers the entire cost. No payment method or credit card is required to complete your setup.
                </Text>
              </VStack>
              <Badge colorPalette="green" variant="solid" px={4} py={1} borderRadius="full" fontSize="sm">
                100% DISCOUNT APPLIED
              </Badge>
            </VStack>
          ) : (
            <VStack gap={6} align="stretch" h="full">
              <VStack align="start" gap={2}>
                <Heading size="md">Payment Method</Heading>
                <Text color="gray.500" fontSize="sm">Select how you'd like to pay</Text>
              </VStack>

              <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                {[
                  { id: 'card', label: 'Card', icon: FaCreditCard },
                  { id: 'upi', label: 'UPI', icon: FaMobileAlt },
                  { id: 'bank', label: 'Bank', icon: FaUniversity },
                ].map((item) => (
                  <VStack
                    key={item.id}
                    as="button"
                    p={4}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={paymentMethod === item.id ? "blue.500" : "gray.200"}
                    bg={paymentMethod === item.id ? "blue.50/50" : "transparent"}
                    _dark={{
                      borderColor: paymentMethod === item.id ? "blue.400" : "gray.700",
                      bg: paymentMethod === item.id ? "blue.900/20" : "transparent"
                    }}
                    transition="all 0.2s"
                    onClick={() => setPaymentMethod(item.id)}
                    cursor="pointer"
                    _hover={{ borderColor: paymentMethod === item.id ? "blue.500" : "gray.300" }}
                  >
                    <Icon as={item.icon} size="lg" color={paymentMethod === item.id ? "blue.500" : "gray.500"} />
                    <Text fontSize="xs" fontWeight="bold">{item.label}</Text>
                  </VStack>
                ))}
              </Grid>

              <Box flex={1} display="flex" alignItems="center" justifyContent="center" py={4}>
                <VStack gap={4} w="full">
                  <Box p={6} borderRadius="xl" bg="gray.50" _dark={{ bg: "whiteAlpha.50" }} w="full" textAlign="center" border="1px dashed" borderColor="gray.200">
                    <Text fontSize="xs" color="gray.500">
                      {paymentMethod === 'card' && "Safe and secure credit card payments via Stripe."}
                      {paymentMethod === 'upi' && "Pay instantly using any UPI app (PhonePe, GPay, etc.)"}
                      {paymentMethod === 'bank' && "Direct bank transfer. May take up to 24h to verify."}
                    </Text>
                  </Box>
                  <Button
                    size="xl"
                    w="full"
                    colorPalette="blue"
                    onClick={handlePayNow}
                    bgGradient="linear(to-r, blue.500, blue.600)"
                    _hover={{ bgGradient: "linear(to-r, blue.600, blue.700)" }}
                    fontWeight="bold"
                    borderRadius="xl"
                  >
                    Pay ₹{grandTotal.toLocaleString()} Now
                  </Button>
                </VStack>
              </Box>

              {/* Transaction History Log */}
              {transactions.length > 0 && (
                <VStack align="stretch" gap={4} pt={4} borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
                  <Heading size="sm" color="gray.500">Transaction History</Heading>
                  <VStack gap={2} align="stretch" maxH="200px" overflowY="auto">
                    {transactions.map((txn) => (
                      <HStack key={txn.id} justify="space-between" p={3} bg="gray.50" _dark={{ bg: "whiteAlpha.100" }} borderRadius="md" fontSize="sm">
                        <VStack align="start" gap={0}>
                          <Text fontWeight="bold">{txn.method === 'card' ? 'Credit Card' : txn.method.toUpperCase()} • ₹{txn.amount.toLocaleString()}</Text>
                          <Text fontSize="xs" color="gray.500">{txn.date}</Text>
                        </VStack>
                        <Badge colorPalette={txn.status === 'success' ? 'green' : 'red'} variant="subtle">
                          {txn.status.toUpperCase()}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              )}
            </VStack>
          )}
        </Box>
      </VStack>
    </SimpleGrid>
  );
};

export default PaymentForm;
