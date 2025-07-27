import type { IUserBalance } from "../typings/user";

const mockUserBalance: IUserBalance[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: 0.12,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 1.45,
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: 500.0,
  },
  {
    symbol: "DAI",
    name: "Dai",
    balance: 300.5,
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    balance: 2.3,
  },
  {
    symbol: 'USD',
    name: 'US Dollar',
    balance: 1000.0,
  }
];

export const getUserBalanceServices = async (): Promise<IUserBalance[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserBalance);
    }, 1000);
  });
};

export const fetchUserBalance = async (): Promise<IUserBalance[]> => {
  try {
    console.log("Fetching user balance...");
    const response = await getUserBalanceServices();
    return response;
  } catch (error) {
    console.error("Error fetching user balance:", error);
    throw error;
  }
}
