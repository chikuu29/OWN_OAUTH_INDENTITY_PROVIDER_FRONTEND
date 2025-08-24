import {
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Center, Spinner, VStack, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login, logout } from "../app/slices/auth/authSlice";
import { GETAPI, POSTAPI } from "../app/api";
// import { setAppConfig } from "../app/slices/appConfig/appConfigSlice";
// import { saveState } from "../utils/app/localStorageUtils";
import { fetchAppConfig } from "../app/slices/appConfig/appConfigSlice";
import type { AppDispatch, RootState } from '../app/store';
// import Loader from "../ui/components/Loader/Loader";
import { startLoading, stopLoading } from "../app/slices/loader/appLoaderSlice";
import Loader from "@/ui/components/Loader/Loader";
// Define user type
interface User {
  name: string;
  email: string;
}

// Define context type
interface AuthContextType {
  authInfo: any;
  reloginRequired: boolean;
  login?: (userData: User) => void;
  logoutUser?: () => void;
  loading: boolean;
  setLoginAuthInfo: (data: any) => void;
}

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provide the context to children components

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);
  const [authInfo, setAuthInfo] = useState(null);
  const [reloginRequired, setReloginRequired] = useState(true);
  // const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      dispatch(startLoading('Rebuild Login Stage, please wait...'))
      try {
        GETAPI({
          path: "/auth/me",
          isPrivateApi:true,
          enableCache:false,
          cacheTTL:120
        }).subscribe(
          (res: any) => {
            setLoading(false);
            dispatch(stopLoading())
            if(res.success){
              // GETAPI({
              //   path: "app/app-configuration",
              //   enableCache: true,
              // }).subscribe((res: any) => {
              //   if (res.success) {
              //     console.log('AppCOnfig',res);
              //     dispatch(setAppConfig(res["result"][0]));
              //     saveState("app_config", res["result"][0]);
              //     // setApplist(res['result'][0]?.config?.appList || []);
              //   }
              // });

              // dispatch(fetchAppConfig());
              setAuthInfo(res);
              dispatch(login(res));
            }
          }
        );
        // const response = await privateAPI.get("/auth/me");
        // if (response.status === 200) {
        //   setLoading(false);

        //   const responseInfo: any = response["data"];
        //   // console.log("AuthInfo", responseInfo);
        //   setAuthInfo(responseInfo);
        //   dispatch(login(responseInfo))
        // }
        // setData(response.data);
      } catch (error) {
        dispatch(stopLoading())
        console.log("Error", error);
        setLoading(false);
        // setError(error);
      }
    };

    if (reloginRequired) fetchData();
  }, []);

  const setLoginAuthInfo = (loginData: any) => {
    console.log("Set AUTH INFO FROM LOGIN", loginData);
    setLoading(false);
    setReloginRequired(false);
    setAuthInfo(loginData);
    // setAuthInfo((prevUser: any) => {
    //   console.log(prevUser);

    //   if (prevUser) {
    //     const updatedUser: any = { ...prevUser, ...loginData };
    //     // localStorage.setItem('user', JSON.stringify(updatedUser));
    //     return updatedUser;
    //   }
    //   return null;
    // });
  };

  const logoutUser = async () => {
    console.log("Logout Application");
    dispatch(startLoading('Please Wait Logout Your Application..'))
    try {
      POSTAPI({
        path: "/auth/logout",
        isPrivateApi:true,
      }).subscribe(
        (res: any) => {
          if(res.success){
            dispatch(logout());
            dispatch(stopLoading())
            location.reload()
            // navigate("myApps");
          }else{
            location.reload()
          }
        }
      );
      // const logoutRes = await privateAPI.get("/auth/logout");
      // console.log(logoutRes);
      // if (logoutRes.status === 200) {
      //   navigate("/");
      // }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Always render the context provider, but conditionally render children
  return (
    <AuthContext.Provider
      value={{ setLoginAuthInfo, authInfo, loading, reloginRequired, logoutUser }}
    >
      {loading ? (
        <Loader loaderText="Rebuild Login Stage, please wait..."/>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook for using the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Instead of throwing an error, return a default context to prevent hook order issues
    console.warn("useAuth must be used within an AuthProvider, returning default context");
    return {
      authInfo: null,
      reloginRequired: true,
      loading: true,
      setLoginAuthInfo: () => {},
      logoutUser: () => {},
    };
  }
  return context;
};
