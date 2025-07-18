import { Link, useNavigate } from "react-router-dom";
import pb from "../utils/pocketbase";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        pb.authStore.clear();
        navigate("/login");
    };

    const isLoggedIn = pb.authStore.isValid;
    const user = pb.authStore.record;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand" to="/">SiteIngest</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navContent">
                <ul className="navbar-nav ms-auto align-items-center">
                    {!isLoggedIn ? (
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                    ) : (
                        <>
                            <li className="nav-item me-2">
                                <span className="navbar-text text-white">
                                    Hello, <strong>{user?.name || "User"}</strong>
                                </span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
