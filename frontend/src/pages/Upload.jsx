import { useState } from "react";
import { useNavigate } from "react-router-dom";
import pb from "../utils/pocketbase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import urls from "../utils/urls";

function Upload() {
  const navigate = useNavigate();

  const [siteid, setSiteid] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const [zipFile, setZipFile] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState("");

  const validateSiteId = (id) => /^[a-zA-Z0-9_-]+$/.test(id);

  const checkAvailability = async () => {
    if (!validateSiteId(siteid)) {
      setError("Invalid site name. Use only letters, numbers, underscores (_), or hyphens (-). Spaces are not allowed.");
      return;
    }
    setChecking(true);
    setError("");
    try {
      const res = await pb.collection("sites").getList(1, 1, {
        filter: `siteid="${siteid}"`
      });
      setIsAvailable(res.totalItems === 0);
    } catch (err) {
      console.error(err);
      setError("Failed to check availability.");
    } finally {
      setChecking(false);
    }
  };

  const handleDeploy = async () => {
    if (!siteid || !zipFile || !isAvailable) {
      setError("Please ensure all steps are completed.");
      return;
    }

    setDeploying(true);
    setError("");

    try {
      // Upload to Flask deployer
      const formData = new FormData();
      formData.append("siteid", siteid);
      formData.append("file", zipFile);
      formData.append("token", pb.authStore.token);

      const res = await fetch(urls.microservice_url+"/deploy", {
        method: "POST",
        body: formData
      });
      
      console.log(res);
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Deploy failed");

      // Create PocketBase record
      await pb.collection("sites").create({
        siteid,
        owner: pb.authStore.record.id,
      });
      await pb.collection("impressions").create({
        siteid,
        impression: 0,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setDeploying(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container flex-grow-1 py-5">
        <h2 className="mb-4 text-center fw-bold">Deploy a New Site</h2>

        {/* SECTION 1: Site Name */}
        <div className="mb-4">
          <label htmlFor="siteid" className="form-label fw-semibold">
            1️⃣ Choose a Subdomain
          </label>
          <input
            type="text"
            id="siteid"
            value={siteid}
            onChange={(e) => {
              setSiteid(e.target.value);
              setIsAvailable(null);
            }}
            className="form-control"
            placeholder="e.g. my-portfolio"
            autoComplete="off"
            required
          />
          <button
            className="btn btn-outline-primary mt-2"
            onClick={checkAvailability}
            disabled={checking || !siteid}
          >
            {checking ? "Checking..." : "Check Availability"}
          </button>
          {isAvailable === true && (
            <div className="text-success mt-2">✅ Subdomain is available!</div>
          )}
          {isAvailable === false && (
            <div className="text-danger mt-2">❌ Site name is already taken.</div>
          )}
        </div>

        {/* SECTION 2: Upload File */}
        <div className="mb-4">
          <label className="form-label fw-semibold">2️⃣ Upload .zip File</label>
          <input
            type="file"
            accept=".zip"
            className="form-control"
            onChange={(e) => setZipFile(e.target.files[0])}
            required
          />
          {zipFile && <div className="mt-2">📁 Selected: {zipFile.name}</div>}
        </div>

        {/* SECTION 3: Deploy */}
        <div className="mb-4">
          <label className="form-label fw-semibold">3️⃣ Deploy</label>
          <br />
          <button
            className="btn btn-success"
            onClick={handleDeploy}
            disabled={deploying || !zipFile || !isAvailable}
          >
            {deploying ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Deploying...
              </>
            ) : (
              "Deploy Site"
            )}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
      </main>
      <Footer />
    </div>
  );
}

export default Upload;
