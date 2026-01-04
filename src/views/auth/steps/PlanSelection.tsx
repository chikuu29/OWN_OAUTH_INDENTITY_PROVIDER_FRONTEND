import React, { useEffect, useState } from "react";
import { SimpleGrid, Box, Badge, VStack, HStack, Text, Circle } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { FaCheck, FaRupeeSign } from "react-icons/fa";
import { GETAPI } from "@/app/api";
import AsyncLoadIcon from "@/utils/hooks/AsyncLoadIcon";

const PlanSelection = () => {
    const activeBorder = useColorModeValue("blue.500", "blue.400");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const [selectedPlan, setSelectedPlan] = useState("PRO");
    const [selectedApps, setSelectedApps] = useState<string[]>(["gym"]);
    const cardBg = useColorModeValue("white", "gray.700");
    const [plans, setPlans] = useState([]);
    const [apps, setApps] = useState<any[]>([]);
    // const apps = [
    //     { id: "gym", name: "Gym Management", icon: <FaDumbbell />, base_price: 999 },
    //     { id: "oms", name: "Order Management", icon: <FaShoppingCart />, base_price: 1499 },
    //     { id: "ai", name: "AI Chatbot", icon: <FaRobot />, base_price: 1999 },
    //     { id: "admin", name: "Enterprise Admin", icon: <FaCogs />, base_price: 2999 }
    // ];

    const toggleApp = (id: string) => {
        setSelectedApps(prev => {
            if (selectedPlan === 'FREE_TRIAL') {
                return [id]; // Only 1 app allowed for Starter plan
            }
            return prev.includes(id)
                ? (prev.length > 1 ? prev.filter(a => a !== id) : prev)
                : [...prev, id];
        });
    };

    // If user switches to starter plan, prune selection to only the first app
    useEffect(() => {
        if (selectedPlan === 'FREE_TRIAL' && selectedApps.length > 1) {
            setSelectedApps([selectedApps[0]]);
        }
    }, [selectedPlan, selectedApps]);

    const calculatePlanPrice = (planId: string, planBasePrice: number) => {
        if (planId === 'FREE_TRIAL') return "0";
        const appsTotal = apps
            .filter(app => selectedApps.includes(app.id))
            .reduce((sum, app) => sum + parseInt(app.base_price), 0);
        return (appsTotal + planBasePrice).toLocaleString();
    };

    const PlanCard = ({ id, plan_code, name, planBasePrice, features, recommended = false }: any) => {
        const isSelected = selectedPlan === plan_code;
        const totalPrice = calculatePlanPrice(plan_code, planBasePrice);

        return (
            <Box
                border="2px solid"
                borderColor={isSelected ? activeBorder : borderColor}
                p={6}
                borderRadius="xl"
                cursor="pointer"
                onClick={() => setSelectedPlan(plan_code)}
                transition="all 0.2s"
                _hover={{ borderColor: activeBorder, transform: "translateY(-4px)", boxShadow: "lg" }}
                bg={cardBg}
                position="relative"
                h="full"
                transform={isSelected ? "scale(1.02)" : "scale(1)"}
                zIndex={isSelected ? 1 : 0}
            >
                {recommended && (
                    <Badge
                        position="absolute"
                        top="-3"
                        right="4"
                        colorPalette="purple"
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="full"
                        boxShadow="md"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        fontSize="xs"
                    >
                        Best Value
                    </Badge>
                )}
                <VStack align="start" gap={5}>
                    <Box>
                        <Text fontWeight="bold" fontSize="lg" color={isSelected ? activeBorder : "inherit"}>{name}</Text>
                        <HStack align="baseline">
                            <Text fontSize="4xl" fontWeight="900">
                                <FaRupeeSign style={{ display: 'inline', marginRight: '4px' }} />
                                {totalPrice}
                            </Text>
                            <Text color="gray.500" fontWeight="medium">/mo</Text>
                        </HStack>
                    </Box>

                    <Box w="full" h="1px" bg={useColorModeValue("gray.100", "gray.600")} />

                    <VStack align="start" gap={3}>
                        {/* Selected Apps added as dynamic features */}
                        {apps.filter(app => selectedApps.includes(app.id)).map(app => (
                            <HStack key={app.id} align="start">
                                <Circle size="5" bg="green.50" color="green.500" mt={0.5}>
                                    <FaCheck size={10} />
                                </Circle>
                                <Text fontSize="sm" fontWeight="600" color={useColorModeValue("gray.700", "gray.200")}>
                                    {app.name} Included
                                </Text>
                            </HStack>
                        ))}

                        {features.map((f: string, i: number) => (
                            <HStack key={i} align="start">
                                <Circle size="5" bg={useColorModeValue("blue.50", "whiteAlpha.200")} color={activeBorder} mt={0.5}>
                                    <FaCheck size={10} />
                                </Circle>
                                <Text fontSize="sm" color="gray.500" lineHeight="tall">{f}</Text>
                            </HStack>
                        ))}
                    </VStack>
                </VStack>
            </Box>
        )
    }

    useEffect(() => {
        GETAPI({
            path: "saas/get_apps"
        }).subscribe((res: any) => {
            console.log(res);

            if (res.success && res.data.length > 0) {
                setApps(res.data);
            }
        })
        GETAPI({ path: '/plans' }).subscribe((res: any) => {

            if (res.success && res.data.length > 0) {
                setPlans(res.data);
            }
        })
    }, []);

    return (
        <VStack gap={10} w="full" align="stretch">
            <VStack align="start" gap={4}>
                <HStack justify="space-between" w="full">
                    <Text fontWeight="bold" fontSize="lg">1. Select Apps You Need</Text>
                    {selectedPlan === 'FREE_TRIAL' && (
                        <Badge colorPalette="orange" variant="subtle" borderRadius="full" px={3}>
                            Free Trial: 1 App Only
                        </Badge>
                    )}
                </HStack>
                <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} w="full">
                    {apps.map((app) => {
                        const isSelected = selectedApps.includes(app.id);
                        return (
                            <Box
                                key={app.id}
                                p={4}
                                borderRadius="xl"
                                border="2px solid"
                                borderColor={isSelected ? activeBorder : borderColor}
                                bg={isSelected ? useColorModeValue("blue.50", "rgba(66, 153, 225, 0.1)") : cardBg}
                                cursor="pointer"
                                onClick={() => toggleApp(app.id)}
                                transition="all 0.2s"
                                _hover={{ borderColor: activeBorder }}
                                textAlign="center"
                            >
                                <VStack gap={1}>
                                    <Circle size="10" bg={isSelected ? activeBorder : useColorModeValue("gray.100", "gray.700")} color={isSelected ? "white" : "inherit"}>
                                        <AsyncLoadIcon iconName={app.icon} />
                                    </Circle>
                                    <Text fontSize="xs" fontWeight="bold">{app.name}</Text>
                                    <Text fontSize="10px" color="gray.500">
                                        + <FaRupeeSign style={{ display: 'inline' }} size={8} />{app.base_price}
                                    </Text>
                                </VStack>
                            </Box>
                        );
                    })}
                </SimpleGrid>
            </VStack>

            {/* Plan Selection Section */}
            <VStack align="start" gap={4}>
                <Text fontWeight="bold" fontSize="lg">2. Choose a Subscription Plan</Text>
                <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} w="full">
                    {plans.length > 0 ? (
                        plans.map((plan: any) => (
                            <PlanCard

                                key={plan.id}
                                id={plan.id}
                                plan_code={plan.plan_code}
                                name={plan.plan_name}
                                planBasePrice={plan.price || 0}
                                features={["Up to 5 Team Members", "Basic Analytics Dashboard", "Community Support"]}
                            />
                        ))
                    ) : (
                        <>
                            <PlanCard
                                id="starter"
                                plan_code="FREE_TRIAL"
                                name="Starter"
                                planBasePrice={0}
                                features={["Up to 5 Team Members", "Basic Analytics", "Community Support"]}
                            />
                            <PlanCard
                                id="pro"
                                plan_code="PRO"
                                name="Pro"
                                planBasePrice={999}
                                features={["Unlimited Team Members", "Advanced Reports", "Priority Support"]}
                                recommended
                            />
                            <PlanCard
                                id="enterprise"
                                plan_code="ENTERPRISE"
                                name="Enterprise"
                                planBasePrice={2499}
                                features={["Unlimited Everything", "Custom SLA", "Account Manager"]}
                            />
                        </>
                    )}
                </SimpleGrid>
            </VStack>
        </VStack>
    );
};

export default PlanSelection;
