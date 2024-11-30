import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ne pas oublier d'installer cette librairie
import backImage from '../../assets/back.jpg';
import AnalyticsGraph from "../dashboard/AnalyticsGraph"; // Ajustez le chemin

const Home = () => {
    const navigate = useNavigate();

    // Vérification du token JWT
    const token = localStorage.getItem('jwt');
    let isAdmin = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token); // Décoder le JWT

            console.log("Decoded token:", decodedToken); // Pour debug : afficher le contenu du token

            const currentTime = Date.now() / 1000; // Heure actuelle en secondes
            if (decodedToken.exp > currentTime) {
                // Récupérer les rôles du token
                const roles = decodedToken.roles; // Récupérer les rôles (s'il existe un claim "roles")
                if (roles && roles === 'ROLE_ADMIN' ) {
                    isAdmin = true; // Si l'utilisateur est admin
                }
            } else {
                console.warn('Token expiré');
                localStorage.removeItem('jwt'); // Supprimer le token expiré
            }
        } catch (err) {
            console.error('Erreur lors du décodage du token:', err);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('jwt'); // Supprimer le token
        navigate('/signin'); // Rediriger vers la page de connexion
    };

    // State for managing hover effect
    const [hoveredButton, setHoveredButton] = useState(null);

    // Event handlers for hover effect
    const handleMouseEnter = (buttonId) => setHoveredButton(buttonId);
    const handleMouseLeave = () => setHoveredButton(null);

    return (
        <div>
            {/* Navigation */}
            <nav style={styles.navbar}>
                <button
                    style={hoveredButton === 'home' ? { ...styles.navButton, ...styles.navButtonHover } : styles.navButton}
                    onClick={() => navigate('/')}
                    onMouseEnter={() => handleMouseEnter('home')}
                    onMouseLeave={handleMouseLeave}
                >
                    Home
                </button>
                <button
                    style={hoveredButton === 'trade' ? { ...styles.navButton, ...styles.navButtonHover } : styles.navButton}
                    onClick={() => navigate('/trading')}
                    onMouseEnter={() => handleMouseEnter('trade')}
                    onMouseLeave={handleMouseLeave}
                >
                    Trade
                </button>
                {isAdmin && (
                    <button
                        style={hoveredButton === 'dashboard' ? { ...styles.navButton, ...styles.navButtonHover } : styles.navButton}
                        onClick={() => navigate('/dashboard')}
                        onMouseEnter={() => handleMouseEnter('dashboard')}
                        onMouseLeave={handleMouseLeave}
                    >
                        Dashboard
                    </button>
                )}
                {token && (
                    <button
                        style={hoveredButton === 'logout' ? { ...styles.navButton, ...styles.navButtonHover } : styles.navButton}
                        onClick={handleLogout}
                        onMouseEnter={() => handleMouseEnter('logout')}
                        onMouseLeave={handleMouseLeave}
                    >
                        Logout
                    </button>
                )}
            </nav>

            {/* Home Content */}
            <div style={styles.homeContainer}>
                <div style={styles.overlay}></div>
                <h1 style={styles.title}>Welcome to Crypto Exchange</h1>
                <p style={styles.description}>
                    Explore real-time trading charts and track the latest cryptocurrency prices.
                    Start trading today to make the most of the crypto market!
                </p>
                {token && (
                <AnalyticsGraph style={styles.graph} />
                )}
                {!token && (
                    <button
                        style={styles.ctaButton}
                        onClick={() => navigate('/signin')}
                    >
                        Sign In to Start Trading
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',  // Set to transparent to blend with background
        padding: '10px',
        position: 'fixed',  // Keep the navbar fixed at the top
        width: '100%',
        zIndex: 10,  // Make sure it stays on top of other content
    },
    navButton: {
        color: '#fff',
        backgroundColor: '#000',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',  // Smooth transition for hover effect
    },
    navButtonHover: {
        backgroundColor: '#555',  // Darker shade on hover
    },
    homeContainer: {
        textAlign: 'center',
        marginTop: '0',
        padding: '20px',
        height: '100vh',
        backgroundImage: `url(${backImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    graph: {
        width: '1000px',
        height: '2000px',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
        zIndex: 1,
    },
    title: {
        color: '#fff',
        fontSize: '2.5rem',
        zIndex: 2,
    },
    description: {
        color: '#fff',
        fontSize: '1.2rem',
        margin: '20px 0',
        zIndex: 2,
    },
    ctaButton: {
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        zIndex: 2,
    },
};

export default Home;
