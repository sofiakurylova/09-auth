"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await checkSession();
        if (data) {
          setUser(data);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};
