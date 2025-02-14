import { AuthProvider } from "./contexts/AuthProvider";
import {
  Navigate,
  createBrowserRouter,
  RouteObject,
  Outlet,
} from "react-router";
import { Suspense, lazy } from "react";
// import { AppLoader } from "./ui/components/Loader/Loader";
// // const AppLoader=lazy(()=>import("./ui/components/Loader/Loader"))
// import HandleDynamicView from "./utils/app/HandleDynamicView";
// // import AuthCallback from "./views/auth/AuthCallback";
// const AuthCallback = lazy(() => import("./views/auth/AuthCallback"));
const AuthLayout = lazy(() => import("./ui/layouts/auth/auth"));
const DashLayout = lazy(() => import("./ui/layouts/dashboard/dash"));
const SignInPage = lazy(() => import("./views/auth/signin/SignIn"));
const SignUpPage = lazy(() => import("./views/auth/signup/SignUp"));
const PageNotFound = lazy(() => import("./pages/NoPageFound"));
const AuthorizePage = lazy(() => import("./views/auth/oauth/AuthorizePage"));
const MyApps = lazy(() => import("./views/myApps/MyApps"));
// const PanelLayout = lazy(() => import("./ui/layouts/dashboard/dash"));
const PrivateRoute = lazy(() => import("./contexts/PrivateRoute"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="myApps" replace />,
    // element: <Navigate to="/myApps" replace />,
  },
  {
    path: "myApps",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <DashLayout />
        </PrivateRoute>
      </AuthProvider>
    ),
    children: [
      {
        path: "*",
        index: true,
        element: <MyApps />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Navigate to="sign-in" replace />,
  },
  {
    path: "/auth/*",
    element: (
      // <Suspense fallback={<AppLoader />}>
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
      // </Suspense>
    ),
    children: [
      {
        path: "sign-in",
        element: (
          // <Suspense fallback={<AppLoader />}>
          <SignInPage />
          // </Suspense>
        ),
      },
      // {
      //   path: "sign-up",
      //   element: (
      //     <Suspense fallback={<AppLoader />}>
      //       <SignUpPage />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: "callback",
      //   element: (
      //     // <Suspense fallback={<AppLoader />}>
      //       <AuthCallback />
      //     // </Suspense>
      //   ),
      // },
      // {
      //   path: "getstarted",
      //   element: (
      //     <Suspense fallback={<AppLoader />}>
      //       <SignInPage />
      //     </Suspense>
      //   ),
      // },
    ],
  },
  {
    path: "oauth",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <DashLayout />
        </PrivateRoute>
      </AuthProvider>
    ),
    children: [
      {
        path: "authorize",
        element: <AuthorizePage />,
      },
    ],
  },

  // // {
  // //   path: "/:tenant_name/:view/*", // Parent route for `view`
  // //   element: (
  // //     <Suspense fallback={<AppLoader />}>
  // //       <AuthProvider>
  // //         <PrivateRoute>
  // //           <PanelLayout />
  // //         </PrivateRoute>
  // //       </AuthProvider>
  // //     </Suspense>
  // //   ),
  // //   children: [
  // //     {
  // //       path: "", // Child route for `params`
  // //       element: (
  // //         // <Suspense fallback={<AppLoader />}>
  // //           <HandleDynamicView />
  // //         // </Suspense>
  // //       ),
  // //     },
  // //     {
  // //       path: ":params/*", // Child route for `params`
  // //       element: (
  // //         // <Suspense fallback={<AppLoader />}>
  // //           <HandleDynamicView />
  // //         // </Suspense>
  // //       ),
  // //     },
  // //   ],
  // // },
  // {
  //   path: "/pageNotFound",
  //   element: <PageNotFound />,
  // },
  {
    path: "*",
    element: <PageNotFound />
  },
];

const router = createBrowserRouter(routes);

export default router;
