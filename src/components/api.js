
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/coin-market-data';

export const fetchAllMarketData = () => axios.get(API_URL);
export const fetchMarketDataById = (id) => axios.get(`${API_URL}/${id}`);
