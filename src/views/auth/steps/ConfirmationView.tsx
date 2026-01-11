import React, { useEffect, useState, useRef } from "react";
import {
  VStack,
  Box,
  Circle,
  Heading,
  Text,
  Button,
  HStack,
  Badge,
  Spinner,
  SimpleGrid
} from "@chakra-ui/react";
import { FaCheck, FaTimes, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchPaymentHistory, getPaymentStatus } from "@/app/slices/account/setupAccountSlice";
import { useColorModeValue } from "@/components/ui/color-mode";
import confetti from "canvas-confetti";
import { toaster } from "@/components/ui/toaster";

const ConfirmationView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { request_code } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { validatedAccountsData } = useSelector((state: RootState) => state.setup_account);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Status can come from location state (sent after payment) or we derive from history
  const statusFromState = location.state?.status;
  const errorDetails = location.state?.error || null;

  const loadHistory = async () => {
    if (!validatedAccountsData?.tenant_uuid) return;
    setIsLoadingHistory(true);
    try {
      const history: any = await dispatch(fetchPaymentHistory(validatedAccountsData.tenant_uuid)).unwrap();
      setTransactions(history);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const pollingRef = useRef<boolean>(false);
  const timerRef = useRef<any>(null);

  const startPolling = async (transactionId: string) => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    setIsVerifying(true);
    let attempts = 0;
    const maxAttempts = 20;

    const poll = async () => {
      try {
        const result: any = await dispatch(getPaymentStatus({ transaction_id: transactionId })).unwrap();
        console.log("POLLING RESULT:", result);

        if (result.status === "SUCCESS") {
          setIsVerifying(false);
          pollingRef.current = false;
          loadHistory();
          toaster.create({ title: "Account Activated!", type: "success" });
          confetti({ particleCount: 200, spread: 300 });
          return;
        }

        if (result.status === "FAILED") {
          setIsVerifying(false);
          pollingRef.current = false;
          loadHistory();
          toaster.create({
            title: "Activation Failed",
            description: result.message || "We couldn't verify your account activation.",
            type: "error"
          });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          timerRef.current = setTimeout(poll, 3000);
        } else {
          setIsVerifying(false);
          pollingRef.current = false;
          toaster.create({
            title: "Verification Timeout",
            description: "Still verifying... please refresh in a moment.",
            type: "warning"
          });
        }
      } catch (err) {
        console.error("Polling error", err);
        setIsVerifying(false);
        pollingRef.current = false;
      }
    };

    poll();
  };

  useEffect(() => {
    const txnId = location.state?.transaction_id;
    console.log("txnId", txnId);
    console.log("statusFromState", statusFromState);
    if (txnId && !statusFromState) {
      startPolling(txnId);
    } else {
      loadHistory();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [validatedAccountsData?.tenant_uuid]);

  const handleRetry = () => {
    navigate(`/account/setup/${request_code}/payment`);
  };

  const isFreePlan = transactions.length > 0 && parseFloat(transactions[0].amount) === 0;

  const getLatestStatus = () => {
    if (statusFromState) return statusFromState;
    if (transactions.length > 0) return transactions[0].status.toLowerCase();
    return "pending";
  };

  const currentStatus = getLatestStatus();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const renderStatusIcon = () => {
    if (isVerifying) {
      return (
        <Circle size="24" bg="blue.100" color="blue.600" _dark={{ bg: "blue.900/30", color: "blue.400" }}>
          <Spinner size="xl" />
        </Circle>
      );
    }
    switch (currentStatus) {
      case "success":
        return (
          <Circle size="24" bg="green.100" color="green.600" _dark={{ bg: "green.900/30", color: "green.400" }}>
            <FaCheck size={48} />
          </Circle>
        );
      case "failed":
        return (
          <Circle size="24" bg="red.100" color="red.600" _dark={{ bg: "red.900/30", color: "red.400" }}>
            <FaTimes size={48} />
          </Circle>
        );
      case "pending":
      default:
        return (
          <Circle size="24" bg="orange.100" color="orange.600" _dark={{ bg: "orange.900/30", color: "orange.400" }}>
            <FaExclamationTriangle size={48} />
          </Circle>
        );
    }
  };

  return (
    <VStack gap={8} textAlign="center" py={{ base: 6, md: 10 }} maxW="4xl" mx="auto">

      <VStack gap={4}>
        {renderStatusIcon()}

        <VStack gap={2}>
          <Heading size="2xl">
            {isVerifying ? "Verifying Activation..." : (
              <>
                {currentStatus === "success" && (isFreePlan ? "Account Activated!" : "Payment Successful!")}
                {currentStatus === "failed" && "Payment Failed"}
                {currentStatus === "pending" && "Payment Processing"}
              </>
            )}
          </Heading>
          <Text color="gray.500" maxW="md" mx="auto" fontSize="lg">
            {isVerifying ? "Please wait while we confirm your account setup with the payment provider..." : (
              <>
                {currentStatus === "success" && (isFreePlan ? "Your organization has been successfully activated and is ready to use." : "Your organization has been successfully set up and is ready to use.")}
                {currentStatus === "failed" && (errorDetails?.description || "We couldn't process your payment. Please see the details below or try again.")}
                {currentStatus === "pending" && "We are waiting for confirmation from the payment provider. This may take a moment."}
              </>
            )}
          </Text>
        </VStack>

        {currentStatus === "failed" && (
          <Button
            colorPalette="blue"
            size="xl"
            px={12}
            onClick={handleRetry}
            borderRadius="full"
            bgGradient="linear(to-r, blue.500, blue.600)"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            gap={2}
          >
            <FaRedo /> Retry Payment
          </Button>
        )}

        {currentStatus === "success" && (
          <Button
            colorPalette="green"
            size="xl"
            px={12}
            onClick={() => window.location.href = "/dashboard"}
            bgGradient="linear(to-r, green.500, teal.500)"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            borderRadius="full"
          >
            Go to Dashboard
          </Button>
        )}
      </VStack>

      <Box h="1px" w="full" bg="gray.100" _dark={{ bg: "gray.700" }} />

      {/* Transaction History Section (Moved from PaymentForm) */}
      <VStack align="stretch" w="full" gap={6} p={6} bg={cardBg} borderRadius="2xl" border="1px solid" borderColor={borderColor}>
        <HStack justify="space-between" w="full">
          <Heading size="md" color="gray.600" _dark={{ color: "gray.400" }}>
            Transaction History
          </Heading>
          {isLoadingHistory && <Spinner size="sm" />}
          {!isLoadingHistory && (
            <Button variant="ghost" size="xs" onClick={loadHistory} color="blue.500">
              Refresh
            </Button>
          )}
        </HStack>

        {transactions.length === 0 && !isLoadingHistory ? (
          <Text color="gray.400" fontStyle="italic">No transaction records found.</Text>
        ) : (
          <VStack gap={3} align="stretch" maxH="300px" overflowY="auto" pr={2}>
            {transactions.map((txn) => (
              <HStack
                key={txn.id}
                justify="space-between"
                p={4}
                bg="gray.50"
                _dark={{ bg: "whiteAlpha.50" }}
                borderRadius="xl"
                border="1px solid"
                borderColor="transparent"
                _hover={{ borderColor: "blue.200", _dark: { borderColor: "blue.900" } }}
                transition="all 0.2s"
              >
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold" fontSize="md">
                    {txn.method === 'card' ? 'Credit Card' : txn.method.toUpperCase()} • ₹{txn.amount.toLocaleString()}
                  </Text>
                  <HStack gap={3} fontSize="xs" color="gray.500">
                    <Text>{txn.date}</Text>
                    {txn.provider_order_id && (
                      <HStack gap={1}>
                        <Text>•</Text>
                        <Text fontWeight="medium" color="blue.500">Order: {txn.provider_order_id}</Text>
                      </HStack>
                    )}
                  </HStack>
                </VStack>

                <Badge
                  size="lg"
                  colorPalette={
                    txn.status.toLowerCase() === 'success' ? 'green' :
                      txn.status.toLowerCase() === 'pending' ? 'yellow' : 'red'
                  }
                  variant="subtle"
                  borderRadius="full"
                  px={3}
                >
                  {txn.status.toUpperCase()}
                </Badge>
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default ConfirmationView;
