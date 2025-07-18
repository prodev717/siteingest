import { Navigate } from "react-router-dom";
import pb from "./utils/pocketbase";

function PrivateRoute({ children }) {
  if (!pb.authStore.isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
