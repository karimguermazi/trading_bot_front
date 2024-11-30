import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsGraph = () => {
    // Set up state to hold the fetched data
    const [coinData, setCoinData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // For loading state
    const [error, setError] = useState(null); // For error handling

    useEffect(() => {
        // Retrieve the JWT token from local storage
        const token = localStorage.getItem("jwt");

        if (!token) {
            setError("No authentication token found");
            setIsLoading(false);
            return;
        }

        // Fetch data from API with the Bearer token in the header
        fetch("http://localhost:8080/api/coin-market-data", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Send the Bearer token in the Authorization header
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                setCoinData(data); // Set the fetched data to state
                setIsLoading(false); // Set loading to false when data is fetched
            })
            .catch((error) => {
                setError(error.message); // Set error state if the request fails
                setIsLoading(false); // Set loading to false in case of error
            });
    }, []); // Empty dependency array means this effect runs once on component mount

    // Extract labels (symbols) and data (circulatingSupply and maxSupply) from the fetched data
    const labels = coinData.map((coin) => coin.coin.symbol);
    const circulatingSupplyData = coinData.map((coin) => coin.circulatingSupply);
    const maxSupplyData = coinData.map((coin) => coin.maxSupply);

    // Data for the circulating supply bar chart (X-axis will be supply, Y-axis will be coins)
    const circulatingSupplyChartData = {
        labels: labels,
        datasets: [
            {
                label: "Circulating Supply",
                data: circulatingSupplyData,
                backgroundColor: "rgba(75, 192, 192, 0.5)", // Bar color
                borderColor: "rgba(75, 192, 192, 1)", // Border color
                borderWidth: 1,
            },
        ],
    };

    // Data for the max supply bar chart
    const maxSupplyChartData = {
        labels: labels,
        datasets: [
            {
                label: "Max Supply",
                data: maxSupplyData,
                backgroundColor: "rgba(255, 99, 132, 0.5)", // Different color for the second chart
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Bar chart options with swapped axes (coins on Y-axis, supply on X-axis)
    const options = {
        responsive: true,
        indexAxis: "x", // Make the bars horizontal (coin symbols will be on Y-axis, supply on X-axis)
        plugins: {
            legend: {
                position: "top", // Position the legend on top
            },
            tooltip: {
                enabled: true, // Enable tooltips for the bars
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Coins", // Label for the X-axis (coins' supply values)
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Supply", // Label for the Y-axis (coin symbols)
                },
            },
        },
    };

    // Display loading state or error message if data is not fetched successfully
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div >
            <div className="flex space-x-8">
                {/* First Chart: Circulating Supply */}
                <div className="bg-white p-6 shadow-md rounded-lg w-full">
                    <h3 className="text-2xl font-semibold mb-4">Circulating Supply</h3>
                    <Bar data={circulatingSupplyChartData} options={options} />
                </div>

                {/* Second Chart: Max Supply */}
                <div className="bg-white p-6 shadow-md rounded-lg w-full">
                    <h3 className="text-2xl font-semibold mb-4">Max Supply</h3>
                    <Bar data={maxSupplyChartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsGraph;
