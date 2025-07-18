import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pb from "../utils/pocketbase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import urls from "../utils/urls";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
    const [sites, setSites] = useState([]);
    const [impressions, setImpressions] = useState({});
    const [totalImpressions, setTotalImpressions] = useState(0);
    const [loading, setLoading] = useState(true);
    const userId = pb.authStore.record?.id;

    useEffect(() => {
        fetchSites();
    }, []);

    async function fetchSites() {
        try {
            const data = await pb.collection("sites").getFullList({
                filter: `owner.id="${userId}"`
            });

            const impressionsArray = await pb.collection("impressions").getFullList();

            // ✅ Only include impressions for sites owned by the user
            const siteIds = data.map(site => site.siteid);
            const filteredImpressions = impressionsArray.filter(item =>
                siteIds.includes(item.siteid)
            );

            const impressionsObject = filteredImpressions.reduce((acc, item) => {
                acc[item.siteid] = item.count;
                return acc;
            }, {});

            const total = Object.values(impressionsObject).reduce((sum, count) => sum + count, 0);

            setImpressions(impressionsObject);
            setTotalImpressions(total);
            setSites(data);
        } catch (err) {
            console.error("Failed to fetch sites:", err);
        } finally {
            setLoading(false);
        }
    }

    async function deletesite(id, siteid) {
        try {
            const formData = new FormData();
            formData.append("token", pb.authStore.token);
            formData.append("siteid", siteid);

            const res = await fetch(urls.microservice_url+"/delete", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Delete failed at server");
            }

            await pb.collection("sites").delete(id);
            const idres = await pb.collection("impressions").getFullList({ filter: `siteid='${siteid}'` });
            const impid = idres[0].id;
            await pb.collection('impressions').delete(impid);
            alert(`${siteid} deleted successfully`);
            location.reload();
        } catch (err) {
            console.error("Site deletion failed:", err.message);
            alert("Failed to delete site: " + err.message);
        }
    }

    // === Bar chart config ===
    const chartData = {
        labels: sites.map((site) => site.siteid),
        datasets: [
            {
                label: "Impressions",
                data: sites.map((site) => impressions[site.siteid] || 0),
                backgroundColor: "#0d6efd",
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
    };


    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="container flex-grow-1 py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">Your Sites</h2>
                    <Link to="/upload" className="btn btn-success">+ Deploy New Site</Link>
                </div>
                <div className="d-flex justify-content-end mb-3">
                    <span className="badge bg-primary fs-6">
                        Total Impressions: {totalImpressions}
                    </span>
                </div>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status" />
                    </div>
                ) : sites.length === 0 ? (
                    <div className="alert alert-info text-center">
                        No sites deployed yet.
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Site Name</th>
                                        <th scope="col">URL</th>
                                        <th scope="col">Impressions</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sites.map((site, index) => (
                                        <tr key={site.id}>
                                            <td>{index + 1}</td>
                                            <td>{site.siteid || "Untitled"}</td>
                                            <td>
                                                <Link to={`http://${site.siteid}.${urls.microservice_host}`} target="_blank" rel="noopener noreferrer">
                                                    View Site
                                                </Link>
                                            </td>
                                            <td>{impressions[site.siteid] || 0}</td>
                                            <td>
                                                <button className="btn btn-danger" onClick={() => deletesite(site.id, site.siteid)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* === Impressions Chart === */}
                        <div className="card mt-5 p-4 shadow">
                            <h5 className="card-title mb-4">Impressions Overview</h5>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </>
                )}
            </main>
            <div className="alert alert-secondary text-center mt-4 mb-0">
                To enquire about your <strong>earned revenue</strong> and to <strong>claim your payout</strong>, please email us at <a href={`mailto:${urls.revenu_mail}`}>{urls.revenu_mail}</a>.
                Transactions will be processed within <strong>3 business days</strong>.
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
