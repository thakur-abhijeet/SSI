import store, { persistor } from "@/redux/store";
import "@/styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import Theme from "@/components/theme";
import { MetaMaskProvider } from "@metamask/sdk-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Theme>
          <ToastContainer theme="dark" autoClose={2000} closeOnClick />
          <Component {...pageProps} />
        </Theme>
      </PersistGate>
    </Provider>
  );
}
