import "../styles/globals.css";
import Layout from "../components/Layout";
import { DataProvider } from "../store/GlobalState";
import { SessionProvider } from "next-auth/react";
import ProtectedRoute from "../components/ProtectedRoute";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ProtectedRoute>
      <SessionProvider session={session}>
        <DataProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DataProvider>
      </SessionProvider>
    </ProtectedRoute>
  );
}

export default MyApp;
