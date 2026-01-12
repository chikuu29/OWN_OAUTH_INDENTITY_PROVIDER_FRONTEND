import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
    SimpleGrid,
    Box,
    Badge,
    VStack,
    HStack,
    Text,
    Circle,
    Separator,
    Icon,
    Button,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { FaCheck, FaRupeeSign, FaEdit, FaSearch, FaInfoCircle } from "react-icons/fa";
import AsyncLoadIcon from "@/utils/hooks/AsyncLoadIcon";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup } from "@/components/ui/input-group";
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
} from "@/components/ui/dialog";

import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { TbSelect } from "react-icons/tb";
import { TiDocumentDelete } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
    fetchPlans,
    fetchApps,
    setSelectedPlan,
    toggleApp,
    toggleFeature,
    restorePlanSelection
} from "@/app/slices/account/onboardingSlice";

interface PlanSelectionProps {
    setIsSubmitting?: (isSubmitting: boolean) => void;
    setSubmitHandler?: (handler: (() => Promise<boolean>) | null) => void;
}

const PlanCard = ({
    plan_code,
    name,
    totalPrice,
    features,
    recommended = false,
    isSelected,
    onClick,
    activeBorder,
    borderColor,
    cardBg,
    apps,
    selectedApps,
    calculateAppTotal,
    currency = "INR"
}: any) => {
    const featureBulletBg = useColorModeValue("blue.50", "blue.900");

    return (
        <Box
            border="2px solid"
            borderColor={isSelected ? activeBorder : borderColor}
            p={6}
            borderRadius="2xl"
            cursor="pointer"
            onClick={onClick}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{ borderColor: activeBorder, transform: "translateY(-4px)", boxShadow: "xl" }}
            bg={cardBg}
            position="relative"
            h="full"
            display="flex"
            flexDirection="column"
            transform={isSelected ? "scale(1.02)" : "scale(1)"}
            zIndex={isSelected ? 1 : 0}
            shadow={isSelected ? "lg" : "sm"}
        >
            {recommended && (
                <Badge
                    position="absolute"
                    top="-3"
                    right="4"
                    bgGradient="linear(to-r, purple.500, blue.500)"
                    color="white"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    boxShadow="md"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="2xs"
                    fontWeight="bold"
                >
                    Best Value
                </Badge>
            )}
            <VStack align="start" gap={5} flex="1">
                <Box>
                    <Text fontWeight="bold" fontSize="lg" color={isSelected ? activeBorder : "gray.600"} _dark={{ color: isSelected ? activeBorder : "gray.300" }}>
                        {name}
                    </Text>
                    <HStack align="baseline">
                        <Text fontSize="4xl" fontWeight="900" letterSpacing="tight">
                            {currency === "INR" ? (
                                <FaRupeeSign style={{ display: 'inline', marginRight: '4px', fontSize: '0.6em' }} />
                            ) : (
                                <Text as="span" fontSize="0.6em" mr={1}>{currency}</Text>
                            )}
                            {totalPrice.toLocaleString()}
                        </Text>
                        <Text color="gray.500" fontWeight="medium">/mo</Text>
                    </HStack>
                </Box>

                <Separator />

                <VStack align="start" gap={3} w="full">
                    {apps.filter((app: any) => selectedApps.includes(app.id)).map((app: any) => {
                        const appTotal = calculateAppTotal(app);
                        return (
                            <Box key={app.id} w="full">
                                <HStack justify="space-between" w="full">
                                    <HStack align="start">
                                        <Circle size="5" bg="green.100" color="green.600" mt={0.5} _dark={{ bg: "green.900", color: "green.100" }}>
                                            <FaCheck size={10} />
                                        </Circle>
                                        <Text fontSize="sm" fontWeight="bold">
                                            {app.name}
                                        </Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                        ₹{appTotal.toLocaleString()}
                                    </Text>
                                </HStack>
                            </Box>
                        );
                    })}

                    {features.map((f: string, i: number) => (
                        <HStack key={i} align="start">
                            <Circle size="5" bg={featureBulletBg} color={activeBorder} mt={0.5}>
                                <FaCheck size={10} />
                            </Circle>
                            <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>{f}</Text>
                        </HStack>
                    ))}
                </VStack>
            </VStack>
        </Box>
    );
};

const PlanSelection: React.FC<PlanSelectionProps> = ({
    setIsSubmitting,
    setSubmitHandler
}) => {
    const { request_code } = useParams();
    const STORAGE_KEY = `setup_plan_selection_${request_code}`;

    const dispatch = useDispatch<AppDispatch>();
    const {
        plans,
        apps,
        selectedPlan,
        selectedApps,
        selectedFeatures
    } = useSelector((state: RootState) => state.onboarding);

    const activeBorder = useColorModeValue("blue.500", "blue.400");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const cardBg = useColorModeValue("white", "gray.700");
    const appHighlightBg = useColorModeValue("blue.50", "rgba(66, 153, 225, 0.05)");
    const circleBgNonSelected = useColorModeValue("gray.100", "gray.800");

    const [customizingApp, setCustomizingApp] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    // Initialize/Restore state
    useEffect(() => {
        // Fetch data if not already present
        if (plans.length === 0) dispatch(fetchPlans());
        if (apps.length === 0) dispatch(fetchApps());

        // Restore from storage if redux is empty (initial load scenario)
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && selectedApps.length === 0) { // Simple check to avoid overwriting current redux state if already populated
            try {
                const parsed = JSON.parse(saved);
                console.log("[PlanSelection] Restoring from storage:", parsed);
                dispatch(restorePlanSelection({
                    selectedPlan: parsed.selectedPlan,
                    selectedApps: parsed.selectedApps || [],
                    selectedFeatures: parsed.selectedFeatures || {}
                }));
            } catch (e) {
                console.error("Failed to restore plan selection", e);
            }
        }

        // Mark initial load as complete so we can start saving updates
        setInitialLoadComplete(true);

    }, [dispatch, plans.length, apps.length, STORAGE_KEY /*, selectedApps.length */]); // Careful with deps to avoid loops

    // Persist to localStorage
    useEffect(() => {
        // Only save if we have finished the initial load/restore process
        // This prevents overwriting storage with empty state on page refresh
        if (!initialLoadComplete) return;

        const data = { selectedPlan, selectedApps, selectedFeatures };
        console.log("[PlanSelection] Saving to storage:", data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [selectedPlan, selectedApps, selectedFeatures, STORAGE_KEY, initialLoadComplete]);

    const filteredApps = useMemo(() => {
        return apps.filter(app =>
            app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [apps, searchTerm]);

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

    const calculatePlanPrice = (planCode: string, planBasePrice: number) => {
        if (planCode === 'FREE_TRIAL') return 0;
        const appsTotal = apps
            .filter(app => selectedApps.includes(app.id))
            .reduce((sum, app) => sum + calculateAppTotal(app), 0);
        return appsTotal + (planBasePrice || 0);
    };

    const handleSubmit = async (): Promise<boolean> => {
        console.log("[PlanSelection] Validating selection...", {
            selectedPlan,
            selectedApps,
            selectedFeatures,
            estimatedGrandTotal: calculatePlanPrice(selectedPlan, 0)
        });

        if (selectedApps.length === 0) {
            console.warn("[PlanSelection] Validation failed: No apps selected.");
            toaster.create({
                description: "Please select at least one application to proceed.",
                type: "error",
            });
            return false;
        }

        if (!selectedPlan || !selectedPlan.plan_code) {
            console.warn("[PlanSelection] Validation failed: No plan selected.");
            toaster.create({
                description: "Please select a plan to proceed.",
                type: "error",
            });
            return false;
        }

        console.log("[PlanSelection] Validation successful.");
        return true;
    };

    // Register submit handler
    useEffect(() => {
        if (setSubmitHandler) {
            setSubmitHandler(handleSubmit);
        }
        return () => {
            if (setSubmitHandler) setSubmitHandler(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedApps, setSubmitHandler]); // Keep deps correctly

    return (
        <VStack gap={10} w="full" align="stretch">
            {/* App Selection Section */}
            <VStack align="start" gap={6}>
                <HStack justify="space-between" w="full">
                    <VStack align="start" gap={0}>
                        <Text fontWeight="bold" fontSize="xl" letterSpacing="tight">1. Choose Your Applications</Text>
                        <Text fontSize="sm" color="gray.500">Select the apps and customize features for your business.</Text>
                    </VStack>
                    {selectedPlan.plan_code === 'FREE_TRIAL' && (
                        <Badge colorPalette="orange" variant="solid" borderRadius="full" px={3} py={1}>
                            Free Trial: 1 App
                        </Badge>
                    )}
                </HStack>

                <HStack w="full" gap={4}>
                    <InputGroup flex="1" startElement={<FaSearch color="gray" />}>
                        <Box position="relative" w="full">
                            <input
                                placeholder="Search applications..."
                                style={{
                                    width: "100%",
                                    padding: "10px 12px 10px 40px",
                                    borderRadius: "12px",
                                    border: "1px solid",
                                    borderColor: "var(--chakra-colors-gray-200)",
                                    fontSize: "14px",
                                    outline: "none",
                                    background: "transparent"
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Box>
                    </InputGroup>
                </HStack>

                <Box
                    w="full"
                    maxH="500px"
                    overflowY="auto"
                    pr={2}
                    css={{
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: 'var(--chakra-colors-gray-200)', borderRadius: '10px' },
                        '&::-webkit-scrollbar-thumb:hover': { background: 'var(--chakra-colors-gray-300)' },
                    }}
                >
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="full">
                        {filteredApps.map((app) => {
                            const isSelected = selectedApps.includes(app.id);
                            const appTotal = calculateAppTotal(app);

                            return (
                                <Box
                                    key={app.id}
                                    borderRadius="2xl"
                                    border="2px solid"
                                    borderColor={isSelected ? activeBorder : borderColor}
                                    bg={isSelected ? appHighlightBg : cardBg}
                                    transition="all 0.2s"
                                    position="relative"
                                    overflow="hidden"
                                    shadow={isSelected ? "md" : "sm"}
                                >
                                    <VStack align="stretch" gap={0}>
                                        <Box p={5}>
                                            <HStack justify="space-between" mb={4}>
                                                <HStack gap={3}>
                                                    <Circle size="12" bg={isSelected ? activeBorder : circleBgNonSelected} color={isSelected ? "white" : "inherit"}>
                                                        <AsyncLoadIcon iconName={app.icon || "BsBox"} />
                                                    </Circle>
                                                    <VStack align="start" gap={0}>
                                                        <HStack gap={1}>
                                                            <Text fontWeight="bold" fontSize="md">{app.name}</Text>
                                                            <Tooltip content={app.description}>
                                                                <Box color="gray.400" _hover={{ color: "blue.500" }} transition="color 0.2s">
                                                                    <FaInfoCircle size={14} />
                                                                </Box>
                                                            </Tooltip>
                                                        </HStack>
                                                        <Text fontSize="xs" color="gray.500">Base: ₹{app.base_price}</Text>
                                                    </VStack>
                                                </HStack>
                                                <VStack align="end" gap={0}>
                                                    <Text fontWeight="black" color={activeBorder}>₹{appTotal}</Text>
                                                    <Badge colorPalette={isSelected ? "blue" : "gray"} variant="subtle" size="xs">
                                                        {isSelected ? "Selected" : "Not Selected"}
                                                    </Badge>
                                                </VStack>
                                            </HStack>

                                            <Text fontSize="xs" lineClamp={2} color="gray.500" mb={4}>
                                                {app.description}
                                            </Text>

                                            {isSelected && selectedFeatures[app.id]?.length > 0 && (
                                                <VStack align="start" gap={1.5} mb={4} p={3} bg="whiteAlpha.400" _dark={{ bg: "blackAlpha.200" }} borderRadius="xl">
                                                    <Text fontSize="10px" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="widest">Features Included</Text>
                                                    <SimpleGrid columns={2} gap={2} w="full">
                                                        {app.features?.filter((f: any) => selectedFeatures[app.id].includes(f.code)).map((f: any) => (
                                                            <HStack key={f.code} gap={1.5}>
                                                                <Icon as={FaCheck} color="green.500" size="xs" />
                                                                <Text fontSize="11px" fontWeight="medium" lineClamp={1}>{f.name}</Text>
                                                            </HStack>
                                                        ))}
                                                    </SimpleGrid>
                                                </VStack>
                                            )}

                                            <SimpleGrid columns={2} gap={2}>
                                                <Button
                                                    size="sm"
                                                    variant={isSelected ? "subtle" : "outline"}
                                                    colorPalette={isSelected ? "red" : "blue"}
                                                    onClick={() => dispatch(toggleApp(app.id))}
                                                    borderRadius="xl"
                                                >
                                                    {isSelected ? <TiDocumentDelete /> : <TbSelect />} {isSelected ? "Remove" : "Select App"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    colorPalette="blue"
                                                    onClick={() => setCustomizingApp(app)}
                                                    disabled={!isSelected}
                                                    gap={2}
                                                    borderRadius="xl"
                                                    _hover={{ bg: "blue.50", _dark: { bg: "blue.900/20" } }}
                                                >
                                                    <FaEdit size={12} /> Customize
                                                </Button>
                                            </SimpleGrid>
                                        </Box>
                                    </VStack>
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                </Box>
            </VStack>

            {/* Plan Selection Section */}
            <VStack align="start" gap={6}>
                <VStack align="start" gap={0}>
                    <Text fontWeight="bold" fontSize="xl" letterSpacing="tight">2. Select Your Scaling Plan</Text>
                    <Text fontSize="sm" color="gray.500">Choose how you want to scale your team and workspace.</Text>
                </VStack>
                <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} w="full">
                    {plans.length > 0 ? (
                        plans.map((plan: any) => {
                            const currentVersion = plan.current_version;
                            const basePrice = parseFloat(currentVersion?.price || "0");
                            const planFeatures = [
                                `${currentVersion?.max_users} Max Users`,
                                `${currentVersion?.max_branches} Branches Included`,
                                `${currentVersion?.storage_limit_gb}GB Cloud Storage`,
                                `${currentVersion?.billing_cycle.charAt(0).toUpperCase() + currentVersion?.billing_cycle.slice(1)} Billing`
                            ];

                            return (
                                <PlanCard
                                    key={plan.id}
                                    plan_code={plan.plan_code}
                                    name={plan.name}
                                    totalPrice={calculatePlanPrice(plan.plan_code, basePrice)}
                                    features={planFeatures}
                                    isSelected={selectedPlan.plan_code === plan.plan_code}
                                    onClick={() => dispatch(setSelectedPlan(plan))}
                                    activeBorder={activeBorder}
                                    borderColor={borderColor}
                                    cardBg={cardBg}
                                    apps={apps}
                                    selectedApps={selectedApps}
                                    calculateAppTotal={calculateAppTotal}
                                    recommended={plan.plan_code.toLowerCase().includes("pro")}
                                    currency={currentVersion?.currency}
                                />
                            );
                        })
                    ) : (
                        <>
                            <PlanCard
                                plan_code="FREE_TRIAL"
                                name="Starter"
                                totalPrice={calculatePlanPrice("FREE_TRIAL", 0)}
                                features={["Up to 5 Team Members", "Basic Analytics", "Community Support"]}
                                isSelected={selectedPlan.plan_code === "FREE_TRIAL"}
                                onClick={() => dispatch(setSelectedPlan("FREE_TRIAL"))}
                                activeBorder={activeBorder}
                                borderColor={borderColor}
                                cardBg={cardBg}
                                apps={apps}
                                selectedApps={selectedApps}
                                calculateAppTotal={calculateAppTotal}
                            />
                            <PlanCard
                                plan_code="PRO"
                                name="Pro"
                                totalPrice={calculatePlanPrice("PRO", 999)}
                                features={["Unlimited Team Members", "Advanced Reports", "Priority Support"]}
                                recommended
                                isSelected={selectedPlan.plan_code === "PRO"}
                                onClick={() => dispatch(setSelectedPlan("PRO"))}
                                activeBorder={activeBorder}
                                borderColor={borderColor}
                                cardBg={cardBg}
                                apps={apps}
                                selectedApps={selectedApps}
                                calculateAppTotal={calculateAppTotal}
                            />
                            <PlanCard
                                plan_code="ENTERPRISE"
                                name="Enterprise"
                                totalPrice={calculatePlanPrice("ENTERPRISE", 2499)}
                                features={["Unlimited Everything", "Custom SLA", "Account Manager"]}
                                isSelected={selectedPlan.plan_code === "ENTERPRISE"}
                                onClick={() => dispatch(setSelectedPlan("ENTERPRISE"))}
                                activeBorder={activeBorder}
                                borderColor={borderColor}
                                cardBg={cardBg}
                                apps={apps}
                                selectedApps={selectedApps}
                                calculateAppTotal={calculateAppTotal}
                            />
                        </>
                    )}
                </SimpleGrid>
            </VStack>

            <DialogRoot
                open={!!customizingApp}
                onOpenChange={(e) => !e.open && setCustomizingApp(null)}
                size="xl"
                placement="center"
                motionPreset="slide-in-bottom"
            >
                <DialogContent borderRadius="2xl">
                    <DialogHeader borderBottom="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.800" }} pb={4}>
                        <HStack gap={4}>
                            <Circle size="10" bg="blue.500" color="white" shadow='sm'>
                                <AsyncLoadIcon iconName={customizingApp?.icon} />
                            </Circle>
                            <VStack align="start" gap={0}>
                                <DialogTitle fontSize="xl">{customizingApp?.name}</DialogTitle>
                                <Text fontSize="xs" color="gray.500">Customize features and addons</Text>
                            </VStack>
                        </HStack>
                    </DialogHeader>

                    <DialogBody py={6}>
                        <VStack align="stretch" gap={6}>
                            <Box>
                                <Text fontWeight="bold" fontSize="sm" mb={4} color="gray.400" textTransform="uppercase" letterSpacing="widest">
                                    Available Features
                                </Text>
                                <VStack align="stretch" gap={4}>
                                    {customizingApp?.features?.map((feature: any) => {
                                        const isSelected = (selectedFeatures[customizingApp.id] || []).includes(feature.code);
                                        return (
                                            <HStack
                                                key={feature.code}
                                                p={4}
                                                borderRadius="xl"
                                                border="1px solid"
                                                borderColor={isSelected ? "blue.200" : "gray.100"}
                                                _dark={{ borderColor: isSelected ? "blue.800" : "gray.800", bg: isSelected ? "rgba(66, 153, 225, 0.05)" : "transparent" }}
                                                bg={isSelected ? "blue.50" : "transparent"}
                                                justify="space-between"
                                                transition="all 0.2s"
                                            >
                                                <HStack gap={4} flex="1">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => !feature.is_base_feature && dispatch(toggleFeature({ appId: customizingApp.id, featureCode: feature.code }))}
                                                        disabled={feature.is_base_feature}
                                                        colorPalette="blue"
                                                        size="lg"
                                                    />
                                                    <VStack align="start" gap={0}>
                                                        <Text fontWeight="bold" fontSize="sm" color={isSelected ? "blue.700" : "inherit"} _dark={{ color: isSelected ? "blue.300" : "inherit" }}>
                                                            {feature.name}
                                                            {feature.is_base_feature && (
                                                                <Badge ml={2} colorPalette="green" variant="subtle" size="xs">Included</Badge>
                                                            )}
                                                        </Text>
                                                        <Text fontSize="xs" color="gray.500">{feature.description}</Text>
                                                    </VStack>
                                                </HStack>
                                                <Text fontWeight="bold" fontSize="sm" color={feature.addon_price > 0 ? "blue.500" : "green.500"}>
                                                    {feature.addon_price > 0 ? `+₹${feature.addon_price}` : "Free"}
                                                </Text>
                                            </HStack>
                                        );
                                    })}
                                </VStack>
                            </Box>
                        </VStack>
                    </DialogBody>

                    <DialogFooter borderTop="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.800" }} pt={4}>
                        <HStack justify="space-between" w="full">
                            <VStack align="start" gap={0}>
                                <Text fontSize="xs" color="gray.500">Estimated App Total</Text>
                                <Text fontWeight="black" fontSize="xl" color="blue.600">₹{customizingApp ? calculateAppTotal(customizingApp) : 0}</Text>
                            </VStack>
                            <Button colorPalette="blue" onClick={() => setCustomizingApp(null)} px={8} borderRadius="xl">
                                Done
                            </Button>
                        </HStack>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
        </VStack>
    );
};

export default PlanSelection;
