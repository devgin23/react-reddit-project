import { AuthProvider } from "@/context/auth";
import "@/styles/globals.css";
import Axios from "axios";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
Axios.defaults.withCredentials = true;
  return <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
}
