import React, { useEffect, useState } from "react";

const UserList = () => {
    const [users, setUsers] = useState([]);  // État pour stocker les utilisateurs
    const [isLoading, setIsLoading] = useState(true); // Pour indiquer si les données sont en cours de chargement
    const [error, setError] = useState(null); // Pour gérer les erreurs
    const [editCoin, setEditCoin] = useState(null);  // État pour la devise en cours d'édition
    const [newBalance, setNewBalance] = useState("");  // État pour la nouvelle balance

    useEffect(() => {
        // Récupérer les utilisateurs depuis l'API
        const token = localStorage.getItem("jwt"); // On suppose que le token JWT est stocké ici

        if (!token) {
            setError("No authentication token found");
            setIsLoading(false);
            return;
        }

        // Fetch users from API
        fetch("http://localhost:8080/api/auth/getAll", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,  // Ajouter le token dans l'en-tête
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                return response.json();
            })
            .then((data) => {
                setUsers(data);  // Mettre à jour l'état avec les utilisateurs récupérés
                setIsLoading(false);  // Changer l'état de chargement
            })
            .catch((error) => {
                setError(error.message);  // Gérer l'erreur
                setIsLoading(false);  // Fin de chargement
            });
    }, []); // Le tableau vide signifie que cet effet est exécuté une seule fois lors du montage du composant

    // Fonction pour gérer la mise à jour du solde
    const handleDoubleClick = (userId, coinId, currentBalance) => {
        setEditCoin({ userId, coinId });
        setNewBalance(currentBalance);
    };

    // Fonction pour soumettre la mise à jour du solde
    const handleUpdateBalance = () => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            setError("No authentication token found");
            return;
        }

        fetch(`http://localhost:8080/api/user-coins/update-coin/${editCoin.coinId}/${newBalance}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update balance");
                }
                // Rechargement des utilisateurs après la mise à jour
                return fetch("http://localhost:8080/api/auth/getAll", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            })
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
                setEditCoin(null);  // Fermer le formulaire d'édition
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    // Afficher un message de chargement ou d'erreur si nécessaire
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User List</h2>
            <table className="min-w-full table-auto border-collapse">
                <thead>
                <tr>
                    <th className="px-4 py-2 border-b">Username</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Roles</th>
                    <th className="px-4 py-2 border-b">User Coins</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.userId}>
                        <td className="px-4 py-2 border-b">{user.username}</td>
                        <td className="px-4 py-2 border-b">{user.email}</td>
                        <td className="px-4 py-2 border-b">
                            {user.roles ? user.roles.map((role) => role.name).join(", ") : "No roles"}
                        </td>
                        <td className="px-4 py-2 border-b">
                            {user.userCoins && user.userCoins.length > 0 ? (
                                <ul>
                                    {user.userCoins.map((userCoin) => (
                                        <li
                                            key={userCoin.id}
                                            onDoubleClick={() => handleDoubleClick(user.userId, userCoin.id, userCoin.balance)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {/*{userCoin.coin.symbol} - Balance: {userCoin.balance}*/}
                                              Balance: {userCoin.balance}
                                            {editCoin && editCoin.coinId === userCoin.id && (
                                                <input
                                                    type="number"
                                                    value={newBalance}
                                                    onChange={(e) => setNewBalance(e.target.value)}
                                                    onBlur={handleUpdateBalance}
                                                    autoFocus
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                "No coins"
                            )}
                        </td>
                        <td className="px-4 py-2 border-b">
                            <button className="text-blue-500 hover:text-blue-700">Edit</button>
                            <button className="text-red-500 hover:text-red-700 ml-2">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
