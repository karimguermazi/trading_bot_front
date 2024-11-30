import React, { useState } from "react";

const AddUserCoin = ({ onSuccess }) => {
    const [username, setUsername] = useState("");
    const [coinId, setCoinId] = useState("");
    const [balance, setBalance] = useState("");
    const [display, setDisplay] = useState(true);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userCoin = {
            balance: parseFloat(balance),
            display,
        };

        try {
            const response = await fetch(`http://localhost:8080/api/user-coins/add-coin/${username}/${coinId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userCoin),
            });

            if (response.ok) {
                const data = await response.json();
                onSuccess && onSuccess(data); // Optionnel: notifier le parent si besoin
                alert("Coin ajouté avec succès !");
            } else {
                throw new Error("Erreur lors de l'ajout du coin");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Ajouter un Coin pour un Utilisateur</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom d'utilisateur :</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>ID du Coin :</label>
                    <input
                        type="number"
                        value={coinId}
                        onChange={(e) => setCoinId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Balance :</label>
                    <input
                        type="number"
                        step="0.01"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>
                        Afficher :
                        <input
                            type="checkbox"
                            checked={display}
                            onChange={(e) => setDisplay(e.target.checked)}
                        />
                    </label>
                </div>
                <button type="submit">Ajouter</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default AddUserCoin;
