import { mode } from "@chakra-ui/theme-tools";
console.log("Global Style");

export const globalStyles = {
  colors: {
    brand: {
      100: "#E9E3FF",
      200: "#422AFB",
      300: "#422AFB",
      400: "#7551FF",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#11047A",
    },
    brandScheme: {
      100: "#E9E3FF",
      200: "#7551FF",
      300: "#7551FF",
      400: "#7551FF",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#02044A",
    },
    brandTabs: {
      100: "#E9E3FF",
      200: "#422AFB",
      300: "#422AFB",
      400: "#422AFB",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#02044A",
    },
    secondaryGray: {
      100: "#E0E5F2",
      200: "#E1E9F8",
      300: "#F4F7FE",
      400: "#E9EDF7",
      500: "#8F9BBA",
      600: "#A3AED0",
      700: "#707EAE",
      800: "#707EAE",
      900: "#1B2559",
    },
    red: {
      100: "#FEEFEE",
      500: "#EE5D50",
      600: "#E31A1A",
    },
    blue: {
      50: "#EFF4FB",
      500: "#3965FF",
    },
    orange: {
      100: "#FFF6DA",
      500: "#FFB547",
    },
    green: {
      100: "#E6FAF5",
      500: "#01B574",
    },
    navy: {
      50: "#d0dcfb",
      100: "#aac0fe",
      200: "#a3b9f8",
      300: "#728fea",
      400: "#3652ba",
      500: "#1b3bbb",
      600: "#24388a",
      700: "#1B254B",
      800: "#111c44",
      900: "#0b1437",
    },

    gray :{
      50: "#f9f9f9",
      100: "#ececec", // Converted from "#ececec" to your new desired value
      200: "#e3e3e3",
      300: "#cdcdcd",
      400: "#b4b4b4",
      500: "#9b9b9b",
      600: "#676767",
      700: "#424242",
      750: "#2f2f2f",
      800: "#212121",
      900: "#171717",
      950: "#0d0d0d",
    },
    
    dark:{
      100:"rgb(32, 32, 32)",
      200:"#191919",
      300:"#212121",
      400:"#676767"
    }
  },
  styles: {
    global: (props:any) => ({
      body: {
        overflowX: "hidden",
        bg: mode("secondaryGray.300", "gray.900")(props),
        // bg: props.colorMode === "navy" ? "navy.900" : props.colorMode === "dark" ? "gray.900" : "white",
        fontFamily: "DM Sans",
        letterSpacing: "-0.5px",
      },
      input: {
        color: "gray.700",
      },
      html: {
        fontFamily: "DM Sans",
      },
    }),
  },
};
