import React, { useEffect } from "react";
import {
  SimpleGrid,
  Input,
  GridItem,
  VStack,
  Flex,
  Text,
  Heading,
  Box,
  Separator,
  HStack,
  Badge,
} from "@chakra-ui/react";
import {
  BiBuildingHouse,
  BiGlobe,
  BiPhone,
  BiBriefcase,
  BiUser,
  BiStore,
  BiCalendar,
  BiMoney,
} from "react-icons/bi";
import { MdEmail, MdLocationOn, MdInfoOutline } from "react-icons/md";
import { AiOutlineIdcard } from "react-icons/ai";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { toaster } from "@/components/ui/toaster";
import { Avatar } from "@/components/ui/avatar";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { fetchBusinessDetails, updateBusinessDetails } from "@/app/slices/account/setupAccountSlice";

interface BusinessDetailsFormProps {
  onSuccess?: () => void;
  setIsSubmitting?: (loading: boolean) => void;
  setSubmitHandler?: (handler: (() => Promise<boolean>) | null) => void;
}

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  onSuccess,
  setIsSubmitting,
  setSubmitHandler,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { validatedAccountsData, businessDetails } = useSelector(
    (state: RootState) => state.setup_account
  );

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: {
      legal_name: "",
      industry: "",
      tax_id: "",
      website: "",
      phone: "",
      business_email: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      owner_name: "",
      total_stores: 1,
      main_branch: "",
      estimated_annual_sales: "",
      business_type: "",
      founding_date: "",
      timezone: "UTC",
      currency: "INR",
    },
  });

  // Fetch business details on mount
  useEffect(() => {
    if (validatedAccountsData?.tenant_id && !businessDetails) {
      dispatch(
        fetchBusinessDetails({
          tenant_id: validatedAccountsData.tenant_id,
          tenant_uuid: validatedAccountsData.tenant_uuid,
        })
      );
    }
  }, [validatedAccountsData, dispatch, businessDetails]);

  // Update form when redux state changes
  useEffect(() => {
    if (businessDetails) {
      reset(businessDetails as any);
    }
  }, [businessDetails, reset]);

  const onFormSubmit = async (data: any): Promise<boolean> => {
    if (!validatedAccountsData) {
      toaster.create({ description: "Missing tenant info", type: "error" });
      return false;
    }

    // If form is not dirty (no changes made), skip update and proceed
    if (!isDirty) {
      if (onSuccess) onSuccess();
      return true;
    }

    if (setIsSubmitting) setIsSubmitting(true);

    const payload = {
      tenant_id: validatedAccountsData.tenant_id,
      tenant_uuid: validatedAccountsData.tenant_uuid,
      ...data,
    };

    try {
      const result = await dispatch(updateBusinessDetails(payload));
      console.log(result);

      if (setIsSubmitting) setIsSubmitting(false);

      if (updateBusinessDetails.fulfilled.match(result)) {
        toaster.create({
          description: "Business details saved successfully.",
          type: "success",
        });
        if (onSuccess) onSuccess();
        return true;
      } else {
        const msg = (result.payload as string) || "Failed to update profile";
        toaster.create({ description: msg, type: "error" });
        return false;
      }
    } catch (error) {
      if (setIsSubmitting) setIsSubmitting(false);
      toaster.create({ description: "An unexpected error occurred", type: "error" });
      return false;
    }
  };

  // Register submit handler specific for the wizard
  useEffect(() => {
    if (setSubmitHandler) {
      setSubmitHandler(() => {
        return new Promise<boolean>((resolve) => {
          handleSubmit(
            async (data) => {
              const success = await onFormSubmit(data);
              resolve(success);
            },
            (errors) => {
              console.log("Validation errors", errors);
              toaster.create({ description: "Please fill in all required fields", type: "error" });
              resolve(false);
            }
          )();
        });
      });
    }
    // Clean up
    return () => {
      if (setSubmitHandler) setSubmitHandler(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit, validatedAccountsData]);

  return (
    <VStack align="stretch" gap={8}>
      {/* Tenant ID and Name Display */}
      <Box
        p={6}
        bgGradient="linear(to-br, blue.50, white)"
        borderRadius="2xl"
        border="1px solid"
        borderColor="blue.100"
        _dark={{
          bgGradient: "linear(to-br, blue.950, gray.900)",
          borderColor: "blue.900",
        }}
        shadow="sm"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-20px"
          right="-20px"
          w="100px"
          h="100px"
          bg="blue.400"
          opacity="0.1"
          borderRadius="full"
          filter="blur(40px)"
        />

        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          gap={6}
        >
          <HStack gap={5}>
            <Avatar
              name={validatedAccountsData?.name || "T"}
              size="xl"
              bg="blue.600"
              color="white"
              border="4px solid white"
              _dark={{ border: "4px solid var(--chakra-colors-blue-900)" }}
              shadow="md"
            />
            <VStack align="flex-start" gap={1}>
              <Text fontSize="xs" fontWeight="bold" color="blue.600" textTransform="uppercase" letterSpacing="widest">
                Welcome Back
              </Text>
              <Heading size="lg" letterSpacing="tight">
                {validatedAccountsData?.name || "Tenant Name"}
              </Heading>
              <HStack gap={3}>
                <Badge colorPalette="blue" variant="solid" px={2} borderRadius="md">
                  Tenant ID: {validatedAccountsData?.tenant_id}
                </Badge>
                <Text fontSize="xs" color="gray.500" fontFamily="mono">
                  {validatedAccountsData?.tenant_uuid}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <VStack align={{ base: "flex-start", md: "flex-end" }} gap={1} maxW="xs">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" _dark={{ color: "gray.400" }} textAlign={{ base: "left", md: "right" }}>
              Ready to take your business to the next level?
            </Text>
            <Text fontSize="xs" color="gray.500" textAlign={{ base: "left", md: "right" }}>
              Please ensure your business profile is complete and accurate.
            </Text>
          </VStack>
        </Flex>
      </Box>

      <AccordionRoot multiple defaultValue={["business-details"]}>
        {/* Section 1: Business Details */}
        <AccordionItem value="business-details" border="none">
          <AccordionItemTrigger py={4} _hover={{ bg: "transparent" }}>
            <Flex align="center" gap={2}>
              <Box p={2} bg="orange.50" _dark={{ bg: "orange.950" }} borderRadius="md" color="orange.500">
                <BiBuildingHouse size={20} />
              </Box>
              <Heading size="md" letterSpacing="tight">Business Details</Heading>
            </Flex>
          </AccordionItemTrigger>
          <AccordionItemContent pb={6}>
            <VStack align="stretch" gap={4}>
              <Separator />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <Field label="Legal Business Name" required>
                  <Controller
                    name="legal_name"
                    control={control}
                    rules={{ required: "Legal Name is required" }}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiBuildingHouse color="gray" />}>
                        <Input {...field} size="lg" placeholder="Acme International" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Business Email" required>
                  <Controller
                    name="business_email"
                    control={control}
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<MdEmail color="gray" />}>
                        <Input {...field} size="lg" placeholder="contact@acme.com" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Industry">
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiBriefcase color="gray" />}>
                        <Input {...field} size="lg" placeholder="Technology" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Tax/GST ID">
                  <Controller
                    name="tax_id"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<AiOutlineIdcard color="gray" />}>
                        <Input {...field} size="lg" placeholder="TAX-12345" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Website">
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiGlobe color="gray" />}>
                        <Input {...field} size="lg" placeholder="https://acme.com" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Business Phone">
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiPhone color="gray" />}>
                        <Input {...field} size="lg" placeholder="+1 234 567 890" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
              </SimpleGrid>
            </VStack>
          </AccordionItemContent>
        </AccordionItem>

        <Separator />

        {/* Section 2: Address Information */}
        <AccordionItem value="address-info" border="none">
          <AccordionItemTrigger py={4} _hover={{ bg: "transparent" }}>
            <Flex align="center" gap={2}>
              <Box p={2} bg="green.50" _dark={{ bg: "green.950" }} borderRadius="md" color="green.500">
                <MdLocationOn size={20} />
              </Box>
              <Heading size="md" letterSpacing="tight">Address Information</Heading>
            </Flex>
          </AccordionItemTrigger>
          <AccordionItemContent pb={6}>
            <VStack align="stretch" gap={4}>
              <Separator />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Field label="Address Line 1" required>
                    <Controller
                      name="address_line1"
                      control={control}
                      rules={{ required: "Address Line 1 is required" }}
                      render={({ field }) => (
                        <InputGroup w="100%" startElement={<MdLocationOn color="gray" />}>
                          <Input {...field} size="lg" placeholder="123 Tech Park" variant="subtle" />
                        </InputGroup>
                      )}
                    />
                  </Field>
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Field label="Address Line 2">
                    <Controller
                      name="address_line2"
                      control={control}
                      render={({ field }) => (
                        <InputGroup w="100%" startElement={<MdLocationOn color="gray" />}>
                          <Input {...field} size="lg" placeholder="Building B, Suite 101" variant="subtle" />
                        </InputGroup>
                      )}
                    />
                  </Field>
                </GridItem>
                <Field label="City">
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} size="lg" placeholder="Mumbai" variant="subtle" />
                    )}
                  />
                </Field>
                <Field label="State/Province">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} size="lg" placeholder="Maharashtra" variant="subtle" />
                    )}
                  />
                </Field>
                <Field label="Country">
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} size="lg" placeholder="India" variant="subtle" />
                    )}
                  />
                </Field>
                <Field label="Pincode/ZIP">
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} size="lg" placeholder="400001" variant="subtle" />
                    )}
                  />
                </Field>
              </SimpleGrid>
            </VStack>
          </AccordionItemContent>
        </AccordionItem>

        <Separator />

        {/* Section 3: Business Metrics & Settings */}
        <AccordionItem value="metrics-and-settings" border="none">
          <AccordionItemTrigger py={4} _hover={{ bg: "transparent" }}>
            <Flex align="center" gap={2}>
              <Box p={2} bg="purple.50" _dark={{ bg: "purple.950" }} borderRadius="md" color="purple.500">
                <BiBriefcase size={20} />
              </Box>
              <Heading size="md" letterSpacing="tight">Metrics & Settings</Heading>
            </Flex>
          </AccordionItemTrigger>
          <AccordionItemContent pb={6}>
            <VStack align="stretch" gap={4}>
              <Separator />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <Field label="Owner Name">
                  <Controller
                    name="owner_name"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiUser color="gray" />}>
                        <Input {...field} size="lg" placeholder="John Doe" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Business Type">
                  <Controller
                    name="business_type"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<MdInfoOutline color="gray" />}>
                        <Input {...field} size="lg" placeholder="Retail/Wholesale" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Total Stores">
                  <Controller
                    name="total_stores"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiStore color="gray" />}>
                        <Input {...field} type="number" size="lg" placeholder="1" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Main Branch">
                  <Controller
                    name="main_branch"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiStore color="gray" />}>
                        <Input {...field} size="lg" placeholder="Headquarters" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Founding Date">
                  <Controller
                    name="founding_date"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiCalendar color="gray" />}>
                        <Input {...field} type="date" size="lg" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Currency">
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <InputGroup w="100%" startElement={<BiMoney color="gray" />}>
                        <Input {...field} size="lg" placeholder="INR" variant="subtle" />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field label="Estimated Annual Sales">
                  <Controller
                    name="estimated_annual_sales"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} size="lg" placeholder="$1M - $5M" variant="subtle" />
                    )}
                  />
                </Field>
                <Field label="Timezone">
                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} size="lg" placeholder="UTC" variant="subtle" />
                    )}
                  />
                </Field>
              </SimpleGrid>
            </VStack>
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    </VStack>
  );
};

export default BusinessDetailsForm;
