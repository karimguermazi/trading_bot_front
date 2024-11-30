import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AnalyticsGraph from "./AnalyticsGraph"; // Assurez-vous que le chemin est correct
import UserList from "./UserList"; // Assurez-vous d'avoir ce composant UserList
import AddUserCoin from "./AddUserCoin";
import CoinList from "./CoinList";
import Home from "../pages/home"; // Importez le nouveau composant

const Dashboard = () => {
    const [currentView, setCurrentView] = useState("analytics"); // État pour gérer les vues actuelles

    // Fonction pour basculer vers la liste des utilisateurs
    const showUserList = () => {
        setCurrentView("users");
    };

    // Fonction pour basculer vers le formulaire d'ajout de UserCoin
    const showAddUserCoin = () => {
        setCurrentView("addUserCoin");
    };

    // Fonction pour afficher l'analyse (graphique)
    const showAnalyticsGraph = () => {
        setCurrentView("analytics");
    };

    const showCoins = () => setCurrentView("coins");
    const navigate = useNavigate();

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-64 h-screen bg-gray-800 text-white p-6">
                <div className="text-2xl font-bold mb-8">Admin</div>
                <ul>
                    <li>
                        <button
                            onClick={showAnalyticsGraph}
                            className="block py-2 hover:bg-gray-700 rounded w-full text-left"
                        >
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={showUserList}
                            className="block py-2 hover:bg-gray-700 rounded w-full text-left"
                        >
                            Users
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={showAddUserCoin}
                            className="block py-2 hover:bg-gray-700 rounded w-full text-left"
                        >
                            Ajouter UserCoin
                        </button>

                        <button onClick={showCoins} className="block py-2 hover:bg-gray-700 rounded w-full text-left">
                            Coins
                        </button>

                        <button onClick={() => navigate('/')} className="block py-2 hover:bg-gray-700 rounded w-full text-left">
                            Home
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
                </div>

                {/* Affiche le composant en fonction de la vue sélectionnée */}
                {currentView === "analytics" && <AnalyticsGraph />}
                {currentView === "users" && <UserList />}
                {currentView === "addUserCoin" && <AddUserCoin />}
                {currentView === "coins" && <CoinList />}
            </div>
        </div>
    );
};

export default Dashboard;
