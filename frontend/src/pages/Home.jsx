import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home(){
    return(
        <div className="d-flex flex-column min-vh-100">
            <Navbar/>
            <main className="container text-center mt-5 flex-grow-1">
                <h1 className="display-4 fw-bold">Welcome to <span className="text-primary">SiteIngest</span></h1>
                <p className="lead mt-3">Host your static site and start monetizing with built-in ad banners.</p>
                <hr className="my-4" />
                <p className="mb-4">Login now to upload your site and earn revenue from your traffic.</p>
                <Link to="/dashboard" className="btn btn-primary btn-lg">Get Started</Link>
            </main>
            <Footer/>
        </div>
    );
}

export default Home;