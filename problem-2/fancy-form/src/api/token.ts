import axios from 'axios';
import type { ITokenData } from '../typings/swap';

export async function fetchTokenData(): Promise<ITokenData[]> {
    try { 
        const response = await axios.get('https://interview.switcheo.com/prices.json');
        return response.data;
    }
    catch(e) {
        console.error("Error fetching token data:", e);
        throw e;
    }
}