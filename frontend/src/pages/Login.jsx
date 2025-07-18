import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import pb from "../utils/pocketbase";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    async function login(provider) {
        try{
            const authData = await pb.collection('users').authWithOAuth2({ provider });
            console.log("Logged in user:", authData);
            navigate("/dashboard");
        }catch(error){
            console.error("OAuth error:", error);
        }
    }
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="container d-flex flex-grow-1 align-items-center justify-content-center">
                <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Login</h2>
                    <button className="btn btn-outline-danger mb-3 w-100" onClick={()=>login("google")}>
                        <i className="bi bi-google me-2"></i> Sign in with Google
                    </button>
                    <button className="btn btn-outline-dark w-100" onClick={()=>{login("github")}}>
                        <i className="bi bi-github me-2"></i> Sign in with GitHub
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Login;
