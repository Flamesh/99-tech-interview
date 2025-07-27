import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useApi } from "../../hooks/callApi";
import { exChangeTokenApi, fetchTokenData } from "../../api/token";
import type { ITokenData } from "../../typings/swap";
import type { IUserBalance } from "../../typings/user";
import { fetchUserBalance } from "../../api/userBalance";
import { calcRate, formatNumber } from "../../utils/calcRate";

export function SwapHook() {
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [userBalance, setUserBalance] = useState<IUserBalance[]>([]);
  const { data: tokens, loading: tokenLoading } = useApi(fetchTokenData, []);
  const { data: dataUserBalances, loading: userBalanceLoading } = useApi(
    () => fetchUserBalance(),
    []
  );
  const [exchangeLoading, setExchangeLoading] = useState(false);

  const [fromToken, setFromToken] = useState<ITokenData | undefined>();
  const [toToken, setToToken] = useState<ITokenData | undefined>();
  const [errorSwap, setErrorSwap] = useState<string | null>(null);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, [tokens]);

  const fromBalance = useMemo(() => {
    if (fromToken) {
      const currency = userBalance.find(
        (item) => item.symbol === fromToken.currency
      );
      if (currency) {
        return currency.balance;
      }
    }
    return 0;
  }, [fromToken, userBalance]);

  const toBalance = useMemo(() => {
    if (toToken) {
      const currency = userBalance.find(
        (item) => item.symbol === toToken.currency
      );
      if (currency) {
        return currency.balance;
      }
    }
    return 0;
  }, [toToken, userBalance]);

  useEffect(() => {
    if (dataUserBalances && dataUserBalances.length > 0) {
      setUserBalance(dataUserBalances);
    }
  }, [dataUserBalances]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  useEffect(() => {
    if (fromToken && toToken) {
      const rate = calcRate(fromToken.price, toToken.price);
      setToAmount(formatNumber(fromAmount * rate));
    }
  }, [fromAmount, fromToken, toToken]);

  useEffect(() => {
    if (fromToken && fromAmount > 0) {
      const balance = userBalance.find(
        (item) => item.symbol === fromToken.currency
      );
      if (!balance) {
        setErrorSwap("Insufficient balance");
        return;
      }
      if (balance && balance.balance < fromAmount) {
        setErrorSwap("Insufficient balance");
      } else {
        setErrorSwap(null);
      }
    }
  }, [fromToken, fromAmount, userBalance]);

  useEffect(() => {
    setErrorSwap(null);
  }, [fromToken]);

  async function handleSwap() {
    try {
      setExchangeLoading(true);
      if (fromToken && toToken) {
        const response = await exChangeTokenApi(fromToken, toToken, fromAmount);
        toast.success(response);
        setFromAmount(0);
        setToAmount(0);
      }
    } catch (error) {
      console.error("Error swapping tokens:", error);
    } finally {
      setExchangeLoading(false);
    }
  }

  return {
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    userBalance,
    tokens,
    tokenLoading,
    exchangeLoading,
    fromToken,
    setFromToken,
    toToken,
    setToToken,
    fromBalance,
    toBalance,
    errorSwap,
    handleSwapTokens,
    handleSwap,
    userBalanceLoading,
  };
}
