import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoTradingChart = () => {
    const [btcChartData, setBtcChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'BTC/USDT Price',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 2,
                pointRadius: 0,
            },
        ],
    });

    const [ethChartData, setEthChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'ETH/USDT Price',
                data: [],
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 2,
                pointRadius: 0,
            },
        ],
    });

    const [coins, setCoins] = useState([]);
    const [balance, setBalance] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [aboveInput, setAboveInput] = useState('');
    const [isAutoSell, setIsAutoSell] = useState(false);
    const [aboveInputs, setAboveInputs] = useState({});


    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('jwt');

    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem('jwt');
            const decodedToken = jwtDecode(token);
            const username = decodedToken.sub;

            if (decodedToken.roles === 'ROLE_ADMIN') {
                setIsAdmin(true);
            }

            // Fetch user balance
            axios.get(`http://localhost:8080/api/user-coins/get-user-coin/${username}`)
                .then(response => setBalance(response.data))
                .catch(error => console.error('Error fetching user balance:', error));

            // Fetch coins for table
            axios.get('http://localhost:8080/api/coins/getall')
                .then(response => setCoins(response.data))
                .catch(error => console.error('Error fetching coins:', error));
        }
    }, [isLoggedIn]);



    useEffect(() => {
        const btcWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
        const ethWs = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@ticker');

        btcWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const newPrice = parseFloat(data.c);

            setBtcChartData((prevData) => {
                const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
                const newPrices = [...prevData.datasets[0].data, newPrice];

                if (newLabels.length > 20) {
                    newLabels.shift();
                    newPrices.shift();
                }

                return {
                    labels: newLabels,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: newPrices,
                        },
                    ],
                };
            });
        };

        ethWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const newPrice = parseFloat(data.c);

            setEthChartData((prevData) => {
                const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
                const newPrices = [...prevData.datasets[0].data, newPrice];

                if (newLabels.length > 20) {
                    newLabels.shift();
                    newPrices.shift();
                }

                return {
                    labels: newLabels,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: newPrices,
                        },
                    ],
                };
            });
        };

        return () => {
            btcWs.close();
            ethWs.close();
        };
    }, []);

    const handleBuy = (coinId) => {
        const token = localStorage.getItem('jwt');
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;

        // Example buy API call
        axios.post(`http://localhost:8080/api/coins/buy-coin/${username}/${coinId}/1`) // Adjust quantity as needed
            .then(() => {
                alert('Coin purchased successfully!');
                // Refresh balance
                axios.get(`http://localhost:8080/api/user-coins/get-user-coin/${username}`)
                    .then(response => setBalance(response.data))
                    .catch(error => console.error('Error updating balance:', error));
            })
            .catch(error => alert('Error purchasing coin: ' + error.message));
    };

    const handleAutoSellConfig = (coinId) => {
        const token = localStorage.getItem('jwt');
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;

        axios.post(`http://localhost:8080/api/coins/configure-auto-sell/${username}/${coinId}`, null, {
            params: {
                aboveInput: aboveInputs[coinId], // Use the individual aboveInput for each coin
                isAutoSell: isAutoSell,
            }
        })
            .then(() => alert('Auto-sell configured successfully!'))
            .catch(error => alert('Error configuring auto-sell: ' + error.message));
    };



    const handleSell = (coinId) => {
        const token = localStorage.getItem('jwt');
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;

        // Example sell API call with automatic sell logic
        axios.post(`http://localhost:8080/api/coins/sell-coin/${username}/${coinId}/1`, {
            params: {
                aboveInput: aboveInputs[coinId] || null, // Use the individual aboveInput for each coin
                isAutoSell: isAutoSell,
            }
        })
            .then(() => {
                alert('Coin sold successfully!');
                // Refresh balance
                axios.get(`http://localhost:8080/api/user-coins/get-user-coin/${username}`)
                    .then(response => setBalance(response.data))
                    .catch(error => console.error('Error updating balance:', error));
            })
            .catch(error => alert('Error selling coin: ' + error.message));
    };





    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/signin');
    };

    return (
        <div style={{  }}>


            {/* Main Content */}
            <div style={{  }}>
                {/* Navigation Menu */}
                <nav style={styles.navbar}>
                    <button style={styles.navButton} onClick={() => navigate('/')}>Home</button>
                    <button style={styles.navButton} onClick={() => navigate('/trading')}>Trade</button>
                    {isAdmin && (
                        <button style={styles.navButton} onClick={() => navigate('/dashboard')}>Dashboard</button>
                    )}
                    {isLoggedIn && (
                        <div style={styles.userInfo}>
                            <span style={styles.balance}>
                                Balance: {balance ? `${balance} USDT` : 'Loading...'}
                            </span>
                            <button style={styles.navButton} onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                    {!isLoggedIn && (
                        <button style={styles.navButton} onClick={() => navigate('/signin')}>Login</button>
                    )}
                </nav>
                    <br/><br/><br/>
                {/* Center Table */}
                <div style={{
                    width: '80%',
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    justifyContent: 'center', // This centers the div
                    alignItems: 'center',
                    margin: '0 auto' // Centers the div in its container
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Coin</th>
                            <th style={{ textAlign: 'center' }}>Price</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {coins.map(coin => (
                            <tr key={coin.coinId} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ textAlign: 'center' }}>{coin.symbol}</td>
                                <td style={{ textAlign: 'center' }}>{coin.value}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div>
                                        <button
                                            style={{ backgroundColor : '#336600',color: '#fff', marginRight: '15px' }}
                                            onClick={() => handleBuy(coin.coinId)}
                                        >
                                            Buy
                                        </button>
                                        <button style={{ backgroundColor : '#CC0000',color: '#fff', marginRight: '15px' }}
                                            onClick={() => handleSell(coin.coinId)}
                                        >
                                            Sell
                                        </button>
                                        <button
                                            style={{ backgroundColor : '#FFCC00',color: '#fff', marginRight: '15px' }}
                                            onClick={() => handleAutoSellConfig(coin.coinId)}
                                        >
                                            Configure Auto-Sell
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                                        {/*<input*/}
                                        {/*    type="checkbox"*/}
                                        {/*    checked={isAutoSell}*/}
                                        {/*    onChange={() => setIsAutoSell(!isAutoSell)}*/}
                                        {/*    style={{ marginRight: '15px' }}*/}
                                        {/*/>*/}
                                        {/*<label>Auto Sell</label>*/}
                                        <input
                                            type="number"
                                            value={aboveInputs[coin.coinId] || ''}
                                            onChange={(e) => {
                                                setAboveInputs({
                                                    ...aboveInputs,
                                                    [coin.coinId]: e.target.value,
                                                });
                                            }}
                                            placeholder="Sell if price >"
                                            style={{ width: '100px' }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Charts */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    <div style={{ width: '45%', height: '300px' }}>
                        <Line data={btcChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                    <div style={{ width: '45%', height: '300px' }}>
                        <Line data={ethChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
        navbar: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#555',
            padding: '10px',
        },
        navButton: {
            color: '#fff',
            backgroundColor: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
        },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    balance: {
        color: '#000',
        fontSize: '16px',
    },
};

export default CryptoTradingChart;
