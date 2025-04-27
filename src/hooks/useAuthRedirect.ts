import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = ({
  requireAuth = false,
  redirectTo = "/login",
  redirectIfAuth = false,
  redirectIfAuthTo = "/",
}: {
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuth?: boolean;
  redirectIfAuthTo?: string;
}) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (requireAuth && !data.loggedIn) {
          navigate(redirectTo, { replace: true });
        } else if (redirectIfAuth && data.loggedIn) {
          navigate(redirectIfAuthTo, { replace: true });
        }
        setLoading(false);
      })
      .catch(() => {
        if (requireAuth) navigate(redirectTo, { replace: true });
        setLoading(false);
      });
  }, [requireAuth, redirectTo, redirectIfAuth, redirectIfAuthTo, navigate]);

  return loading;
};

export default useAuthRedirect;
