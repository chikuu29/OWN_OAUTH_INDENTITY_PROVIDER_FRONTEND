import React, { useState } from "react";
import { Box, Button, Input, Select, VStack } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { InputGroup } from "@/components/ui/input-group";

const OAuthView = () => {
  console.log("===CALLING OAUTHVIEW===");
  
  const [formData, setFormData] = useState({
    client_name: "",
    client_id: "",
    client_secret: "",
    client_type: "confidential",
    authorization_grant_types: ["authorization_code", "refresh_token"],
    redirect_urls: "",
    post_logout_redirect_urls: "",
    allowed_origins: "",
    token_endpoint_auth_method: "client_secret_basic",
    scope: "read write",
    response_types: ["code"],
    grant_types: ["authorization_code", "refresh_token"],
    algorithm: "HS256",
  });

  // const handleChange = (e:any) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const payload = {
  //         ...formData,
  //         redirect_urls: formData.redirect_urls.split(","),
  //         post_logout_redirect_urls:
  //           formData.post_logout_redirect_urls.split(","),
  //         allowed_origins: formData.allowed_origins.split(","),
  //         scope: formData.scope.split(" "),
  //       };

  //       const response = await axios.post(
  //         "http://localhost:8000/applications/register",
  //         payload
  //       );
  //       alert(
  //         "Registration Successful: " + JSON.stringify(response.data, null, 2)
  //       );
  //     } catch (error) {
  //       alert("Error: " + error.message);
  //     }
  //   };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<any>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = handleSubmit(async (formState) => {
    console.log(formState);

    //   e.preventDefault();
    //   console.log("userCredentials", userCredentials);
    //   setLoading(true);
  });
  return (
    <Box maxW="500px" mx="auto" mt={10} p={5} boxShadow="lg" borderRadius="md">
      <form onSubmit={onSubmit}>
        <VStack gap={4}>
          <Field
            label="Client ID"
            required
            w="100%"
            errorText={errors.client_id?.message?.toString()}
            invalid={!!errors.client_id}
          >
            <InputGroup flex="1" w="100%">
              <Input
                {...register("client_id", {
                  required: "Client ID is required",
                })}
                placeholder="Enter Client ID"
              />
            </InputGroup>
          </Field>

          <Field
            label="Client Secret"
            required
            w="100%"
            errorText={errors.client_secret?.message?.toString()}
            invalid={!!errors.client_secret}
          >
            <InputGroup flex="1" w="100%">
              <Input
                type="password"
                {...register("client_secret", {
                  required: "Client Secret is required",
                })}
                placeholder="Enter Client Secret"
              />
            </InputGroup>
          </Field>

          <Field
            label="Redirect URLs (comma separated)"
            required
            w="100%"
            errorText={errors.redirect_urls?.message?.toString()}
            invalid={!!errors.redirect_urls}
          >
            <InputGroup flex="1" w="100%">
              <Input
                {...register("redirect_urls", {
                  required: "Redirect URLs are required",
                })}
                placeholder="Enter Redirect URLs"
              />
            </InputGroup>
          </Field>

          <Field
            label="Post Logout Redirect URLs (comma separated)"
            required
            w="100%"
            errorText={errors.post_logout_redirect_urls?.message?.toString()}
            invalid={!!errors.post_logout_redirect_urls}
          >
            <InputGroup flex="1" w="100%">
              <Input
                {...register("post_logout_redirect_urls", {
                  required: "Post Logout Redirect URLs are required",
                })}
                placeholder="Enter Post Logout Redirect URLs"
              />
            </InputGroup>
          </Field>

          <Field
            label="Allowed Origins (comma separated)"
            required
            w="100%"
            errorText={errors.allowed_origins?.message?.toString()}
            invalid={!!errors.allowed_origins}
          >
            <InputGroup flex="1" w="100%">
              <Input
                {...register("allowed_origins", {
                  required: "Allowed Origins are required",
                })}
                placeholder="Enter Allowed Origins"
              />
            </InputGroup>
          </Field>

          <Button type="submit" colorScheme="blue" w="full">
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default OAuthView;
