import axios from "axios";
import type { ITokenData } from "../typings/swap";

export async function fetchTokenData(): Promise<ITokenData[]> {
  try {
    const response = await axios.get(
      "https://interview.switcheo.com/prices.json"
    );
    return response.data;
  } catch (e) {
    console.error("Error fetching token data:", e);
    throw e;
  }
}

async function mockExChangeToken(
    fromToken: ITokenData,
    toToken: ITokenData,
    amount: number
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Exchange successful: " + fromToken.currency + " to " + toToken.currency + " for amount: " + amount);
    }, 3000);
  });
}

export async function exChangeTokenApi(
  fromToken: ITokenData,
  toToken: ITokenData,
  amount: number
): Promise<string> {
  try {
    const response = await mockExChangeToken(fromToken, toToken, amount);
    return response
  } catch (error) {
    console.error("Error exchanging tokens:", error);
    throw error;
  }
}
