import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/store";

interface AuthProps {
  children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const router = useRouter();
  const authSelector = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("Here");

    if (!authSelector.token || !authSelector.isLoggedIn || !authSelector.role) {
      router.push(`/?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [authSelector.role, authSelector.isLoggedIn, authSelector.token]);

  return children;
};

export default Auth;
