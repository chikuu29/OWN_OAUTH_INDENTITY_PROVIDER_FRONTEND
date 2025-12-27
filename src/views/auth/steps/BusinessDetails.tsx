import React from "react";
import { SimpleGrid, Input, GridItem } from "@chakra-ui/react";
import { BiBuildingHouse } from "react-icons/bi";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

const BusinessDetailsForm = () => (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
      <Field label="Company Name" required>
        <InputGroup w="100%" startElement={<BiBuildingHouse color="gray" />}>
          <Input size="lg" placeholder="Acme Corp" variant="subtle" />
        </InputGroup>
      </Field>
      <Field label="Business Email" required>
        <InputGroup w="100%" startElement={<MdEmail color="gray" />}>
          <Input size="lg" placeholder="contact@acme.com" variant="subtle" />
        </InputGroup>
      </Field>
      <GridItem colSpan={{base: 1, md: 2}}>
        <Field label="Office Address">
            <InputGroup w="100%" startElement={<MdLocationOn color="gray" />}>
                <Input size="lg" placeholder="123 Business Rd, Tech City" variant="subtle" />
            </InputGroup>
        </Field>
      </GridItem>
    </SimpleGrid>
  );

export default BusinessDetailsForm;
