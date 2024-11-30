import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoinList = () => {
    const [coins, setCoins] = useState([]);
    const [editCoin, setEditCoin] = useState(null);
    const [newCoin, setNewCoin] = useState({ symbol: '', value: '' });
    const [showForm, setShowForm] = useState(false);

    // Récupérer tous les coins
    useEffect(() => {
        axios.get('http://localhost:8080/api/coins/getall')
            .then((response) => {
                setCoins(response.data);
            })
            .catch((error) => console.error('Erreur lors de la récupération des coins:', error));
    }, []);

    // Supprimer un coin
    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/api/coins/${id}`)
            .then(() => {
                setCoins(coins.filter((coin) => coin.coinId !== id));
            })
            .catch((error) => console.error('Erreur lors de la suppression du coin:', error));
    };

    // Mettre à jour un coin (symbol ou value)
    const handleUpdate = (coinId, field, value) => {
        const endpoint = field === 'symbol'
            ? `http://localhost:8080/api/coins/update-coin-symbole/${value}/${coinId}`
            : `http://localhost:8080/api/coins/update-coin-value/${coinId}/${value}`;
        axios.post(endpoint)
            .then(() => {
                setCoins(coins.map((coin) =>
                    coin.coinId === coinId ? { ...coin, [field]: value } : coin
                ));
                setEditCoin(null);
            })
            .catch((error) => console.error('Erreur lors de la mise à jour du coin:', error));
    };

    // Ajouter un nouveau coin
    const handleAdd = () => {
        axios.post('http://localhost:8080/api/coins/add-coin', newCoin)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => console.error('Erreur lors de l\'ajout du coin:', error));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Coins</h2>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => setShowForm(!showForm)}
            >
                Ajouter
            </button>
            {showForm && (
                <form
                    className="mb-4 p-4 border rounded"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAdd();
                    }}
                >
                    <div>
                        <label>Symbol:</label>
                        <input
                            type="text"
                            className="border p-2 ml-2"
                            value={newCoin.symbol}
                            onChange={(e) => setNewCoin({ ...newCoin, symbol: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Value:</label>
                        <input
                            type="number"
                            className="border p-2 ml-2"
                            value={newCoin.value}
                            onChange={(e) => setNewCoin({ ...newCoin, value: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
                        Ajouter Coin
                    </button>
                </form>
            )}
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Symbol</th>
                    <th className="border px-4 py-2">Value</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {coins.map((coin) => (
                    <tr key={coin.coinId}>
                        <td className="border px-4 py-2">{coin.coinId}</td>
                        <td
                            className="border px-4 py-2"
                            onDoubleClick={() => setEditCoin({ coinId: coin.coinId, field: 'symbol' })}
                        >
                            {editCoin?.coinId === coin.coinId && editCoin.field === 'symbol' ? (
                                <input
                                    type="text"
                                    className="border p-2"
                                    defaultValue={coin.symbol}
                                    onBlur={(e) =>
                                        handleUpdate(coin.coinId, 'symbol', e.target.value)
                                    }
                                />
                            ) : (
                                coin.symbol
                            )}
                        </td>
                        <td
                            className="border px-4 py-2"
                            onDoubleClick={() => setEditCoin({ coinId: coin.coinId, field: 'value' })}
                        >
                            {editCoin?.coinId === coin.coinId && editCoin.field === 'value' ? (
                                <input
                                    type="number"
                                    className="border p-2"
                                    defaultValue={coin.value}
                                    onBlur={(e) =>
                                        handleUpdate(coin.coinId, 'value', parseFloat(e.target.value))
                                    }
                                />
                            ) : (
                                coin.value
                            )}
                        </td>
                        <td className="border px-4 py-2">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleDelete(coin.coinId)}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoinList;
