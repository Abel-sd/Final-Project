import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const auth = useAuthUser()
  const isAuthenticated = useIsAuthenticated()
  const userRole =auth?.role;
console.log(isAuthenticated)
  if (!isAuthenticated) {
  
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {

    return <Navigate to="/unauthorized" replace />;
  }


  return <Outlet />;
};

export default PrivateRoute;
