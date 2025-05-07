import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/users/profile", {
          method: "GET",
          credentials: "include", // send cookies
        });

        setIsAuthenticated(res.ok);
      } catch (err) {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  return { isAuthenticated };
}
