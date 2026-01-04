import React, { useEffect, useState, useMemo } from "react";
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
import { GETAPI, POSTAPI } from "@/app/api";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { toaster } from "@/components/ui/toaster";
import { Avatar } from "@/components/ui/avatar";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";

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
  // access redux setupaccount slice if needed
  const { validatedAccountsData } = useSelector(
    (state: RootState) => state.setup_account
  );

  // form state
  const [formData, setFormData] = useState({
    legal_name: "",
    industry: "",
    tax_id: "",
    website: "",
    phone: "",
    business_email: "", // Added business_email field as per previous logic
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!validatedAccountsData) return;

    const sub = GETAPI({
      path: "/account/tenant/profile",
      params: {
        tenant_id: validatedAccountsData?.tenant_id || "",
        tenant_uuid: validatedAccountsData?.tenant_uuid || "",
      },
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        const data = response.data[0];
        setFormData((prev) => ({
          ...prev,
          legal_name: data.legal_name || data.company_name || data.name || "",
          business_email: data.business_email || "",
          industry: data.industry || "",
          tax_id: data.tax_id || "",
          website: data.website || "",
          phone: data.phone || "",
          address_line1: data.address?.line1 || data.address_line1 || data.address || "",
          address_line2: data.address?.line2 || data.address_line2 || "",
          city: data.address?.city || data.city || "",
          state: data.address?.state || data.state || "",
          country: data.address?.country || data.country || "",
          pincode: data.address?.pincode || data.pincode || "",
          owner_name: data.owner_name || "",
          total_stores: data.total_stores || 1,
          main_branch: data.main_branch || "",
          estimated_annual_sales: data.estimated_annual_sales || "",
          business_type: data.business_type || "",
          founding_date: data.founding_date || "",
          timezone: data.timezone || "UTC",
          currency: data.currency || "INR",
        }));
      }
    });

    return () => sub.unsubscribe();
  }, [validatedAccountsData]);

  const handleSubmit = async (): Promise<boolean> => {
    if (!validatedAccountsData) {
      toaster.create({ description: "Missing tenant info", type: "error" });
      return false;
    }

    // Basic validation
    if (!formData.legal_name || !formData.business_email) {
      toaster.create({ description: "Legal Name and Email are mandatory", type: "error" });
      return false;
    }

    if (setIsSubmitting) setIsSubmitting(true);

    return new Promise((resolve) => {
      const payload = {
        tenant_id: validatedAccountsData.tenant_id,
        tenant_uuid: validatedAccountsData.tenant_uuid,
        ...formData,
      };

      POSTAPI({ path: `/account/tenant/profile?tenant_id=${validatedAccountsData?.tenant_id}&tenant_uuid=${validatedAccountsData?.tenant_uuid}`, data: payload }).subscribe({
        next: (res: any) => {
          if (setIsSubmitting) setIsSubmitting(false);
          if (res && res.success) {
            toaster.create({
              description: "Business details saved successfully.",
              type: "success",
            });
            if (onSuccess) onSuccess();
            resolve(true);
          } else {
            const msg = res?.message || "Failed to update profile";
            toaster.create({ description: msg, type: "error" });
            resolve(false);
          }
        },
        error: () => {
          if (setIsSubmitting) setIsSubmitting(false);
          toaster.create({ description: "Network error", type: "error" });
          resolve(false);
        },
      });
    });
  };

  // Register the submit handler with the parent
  useEffect(() => {
    if (setSubmitHandler) {
      setSubmitHandler(handleSubmit);
    }
    return () => {
      if (setSubmitHandler) setSubmitHandler(null);
    };
  }, [formData, setSubmitHandler]); // Update handler when formData changes so it uses latest state

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
        {/* Decorative background element */}
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
                  <InputGroup w="100%" startElement={<BiBuildingHouse color="gray" />}>
                    <Input
                      name="legal_name"
                      size="lg"
                      placeholder="Acme International"
                      variant="subtle"
                      value={formData.legal_name}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Business Email" required>
                  <InputGroup w="100%" startElement={<MdEmail color="gray" />}>
                    <Input
                      name="business_email"
                      size="lg"
                      placeholder="contact@acme.com"
                      variant="subtle"
                      value={formData.business_email}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Industry">
                  <InputGroup w="100%" startElement={<BiBriefcase color="gray" />}>
                    <Input
                      name="industry"
                      size="lg"
                      placeholder="Technology"
                      variant="subtle"
                      value={formData.industry}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Tax/GST ID">
                  <InputGroup w="100%" startElement={<AiOutlineIdcard color="gray" />}>
                    <Input
                      name="tax_id"
                      size="lg"
                      placeholder="TAX-12345"
                      variant="subtle"
                      value={formData.tax_id}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Website">
                  <InputGroup w="100%" startElement={<BiGlobe color="gray" />}>
                    <Input
                      name="website"
                      size="lg"
                      placeholder="https://acme.com"
                      variant="subtle"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Business Phone">
                  <InputGroup w="100%" startElement={<BiPhone color="gray" />}>
                    <Input
                      name="phone"
                      size="lg"
                      placeholder="+1 234 567 890"
                      variant="subtle"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </InputGroup>
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
                    <InputGroup w="100%" startElement={<MdLocationOn color="gray" />}>
                      <Input
                        name="address_line1"
                        size="lg"
                        placeholder="123 Tech Park"
                        variant="subtle"
                        value={formData.address_line1}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Field>
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Field label="Address Line 2">
                    <InputGroup w="100%" startElement={<MdLocationOn color="gray" />}>
                      <Input
                        name="address_line2"
                        size="lg"
                        placeholder="Building B, Suite 101"
                        variant="subtle"
                        value={formData.address_line2}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Field>
                </GridItem>
                <Field label="City">
                  <Input
                    name="city"
                    size="lg"
                    placeholder="Mumbai"
                    variant="subtle"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="State/Province">
                  <Input
                    name="state"
                    size="lg"
                    placeholder="Maharashtra"
                    variant="subtle"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Country">
                  <Input
                    name="country"
                    size="lg"
                    placeholder="India"
                    variant="subtle"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Pincode/ZIP">
                  <Input
                    name="pincode"
                    size="lg"
                    placeholder="400001"
                    variant="subtle"
                    value={formData.pincode}
                    onChange={handleChange}
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
                  <InputGroup w="100%" startElement={<BiUser color="gray" />}>
                    <Input
                      name="owner_name"
                      size="lg"
                      placeholder="John Doe"
                      variant="subtle"
                      value={formData.owner_name}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Business Type">
                  <InputGroup w="100%" startElement={<MdInfoOutline color="gray" />}>
                    <Input
                      name="business_type"
                      size="lg"
                      placeholder="Retail/Wholesale"
                      variant="subtle"
                      value={formData.business_type}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Total Stores">
                  <InputGroup w="100%" startElement={<BiStore color="gray" />}>
                    <Input
                      name="total_stores"
                      type="number"
                      size="lg"
                      placeholder="1"
                      variant="subtle"
                      value={formData.total_stores}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Main Branch">
                  <InputGroup w="100%" startElement={<BiStore color="gray" />}>
                    <Input
                      name="main_branch"
                      size="lg"
                      placeholder="Headquarters"
                      variant="subtle"
                      value={formData.main_branch}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Founding Date">
                  <InputGroup w="100%" startElement={<BiCalendar color="gray" />}>
                    <Input
                      name="founding_date"
                      type="date"
                      size="lg"
                      variant="subtle"
                      value={formData.founding_date}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Currency">
                  <InputGroup w="100%" startElement={<BiMoney color="gray" />}>
                    <Input
                      name="currency"
                      size="lg"
                      placeholder="INR"
                      variant="subtle"
                      value={formData.currency}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Field>
                <Field label="Estimated Annual Sales">
                  <Input
                    name="estimated_annual_sales"
                    size="lg"
                    placeholder="$1M - $5M"
                    variant="subtle"
                    value={formData.estimated_annual_sales}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Timezone">
                  <Input
                    name="timezone"
                    size="lg"
                    placeholder="UTC"
                    variant="subtle"
                    value={formData.timezone}
                    onChange={handleChange}
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
