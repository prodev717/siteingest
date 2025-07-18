function Footer(){
    return(
        <footer className="bg-dark text-light py-4">
            <div className="container text-center">
            <p className="mb-1">&copy; {new Date().getFullYear()} SiteIngest. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;