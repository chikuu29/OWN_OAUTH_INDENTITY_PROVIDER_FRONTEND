import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider as ChakraProvider } from "./components/ui/provider.tsx";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import Loader from "./ui/components/Loader/Loader.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <Loader></Loader>
        <App />
      </Provider>
    </ChakraProvider>
  </StrictMode>
);
