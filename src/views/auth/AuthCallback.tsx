import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
// import { useHistory } from 'react-router';
import { v4 as uuidv4 } from "uuid";

const AuthCallback = () => {
  //   const history = useHistory();
  console.log("====CALLING AUTHCALLBACK===");

  const navigate = useNavigate();
  const clientId = "uqQdID3LfLNvhuKakSt2XW1niHgg35nfjzI4q67t";
  const clientSecret ="password";
  const tokenUrl = "http://localhost:5173/api/oauth/token/";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("code", code);

    if (code) {
      exchangeAuthorizationCode(code);
    }
  }, []);

  const exchangeAuthorizationCode = async (code: string) => {
    const deviceId = getOrCreateDeviceId();

    try {
      // Create URLSearchParams for x-www-form-urlencoded encoding
      // const formData = new URLSearchParams({
      //   client_id: clientId,
      //   client_secret: clientSecret,
      //   grant_type: "authorization_code", // Correct value
      //   code,
      //   redirect_uri: "http://localhost:5173/auth/callback",
      //   device_id: deviceId,
      // });

      // Make POST request with proper headers
      const response = await axios.post(tokenUrl, {}, {
        headers: {
          "Cache-Control": "no-cache", // Cache-Control header is optional
          "Content-Type": "application/x-www-form-urlencoded", // Required
        },
      });
      console.log("resposce", response);

      // Store tokens in localStorage
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Navigate to the next page
      navigate("/app/myApps");
    } catch (error: any) {
      console.error(
        "Error exchanging authorization code:",
        error.response?.data || error
      );
    }
  };

  const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
  };

  return <div>Processing login...</div>;

  // useEffect(() => {
  //   // Extract query parameters
  //   const query = new URLSearchParams(window.location.search);
  //   const accessToken = query.get('accessToken');

  //   if (accessToken) {
  //     // Store the access token (e.g., in local storage or state management)
  //     localStorage.setItem('accessToken', accessToken);

  //     // Redirect to your application's main page or wherever necessary
  //   //   history.push('/dashboard'); // Change to your desired route
  //   } else {
  //     // Handle missing access token (e.g., redirect to login page)
  //     console.error('No access token received');
  //   //   history.push('/login'); // Redirect to login page
  //   }
  // }, [history]);

  // return <div>Loading...</div>; // Optional loading state
};

export default AuthCallback;
