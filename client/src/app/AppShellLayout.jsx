import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserBottomNav from "../shared/components/UserBottomNav";

const AppShellLayout = () => {
  const location = useLocation();

  const showBottomNav = useMemo(() => {
    const path = location.pathname;
    const profileArea = path === "/profile" || path.startsWith("/profile/");
    const aquariumArea = path === "/aquarium" || path.startsWith("/aquarium/");
    return profileArea || aquariumArea;
  }, [location.pathname]);

  return (
    <>
      <Outlet />
      {showBottomNav ? <UserBottomNav /> : null}
    </>
  );
};

export default AppShellLayout;
