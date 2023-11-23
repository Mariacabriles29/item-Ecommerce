// components/ProtectedRoute.js

import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = JSON.parse(localStorage.getItem("firstLogin"));

    if (
      (isAuthenticated === null || isAuthenticated === undefined) &&
      router.pathname != "/" &&
      router.pathname != "/register"
    ) {
      router.replace("/signin");
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
