1. Duplicate field `currency` and `amount` in interface

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

---- change `FormattedWalletBalance` to

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
```

2. function getPriority can Memo, and params `blockchain` should be string, any is not good. 

```typescript
const getPriority = useMemo(() => { 
        return (blockchain: string): number => {
            switch (blockchain) {
            case 'Osmosis':
                return 100;
            case 'Ethereum':
                return 50;
            case 'Arbitrum':
                return 30;
            case 'Zilliqa':
                return 20;
            case 'Neo':
                return 20;
            default:
                return -99;
            }
        }
}, [balances.blockchain])
```

3. function `sortedBalances` is not good.

- maybe `lhsPriority` is a wrong typing because it is undefined. I think it should be `balancePriority`

- param `balance` have type `WalletBalance`, but it want to access `balance.blockchain`. So interface `WalletBalance` should have a field `blockchain`.

- `getPriority` call multiple times.

- `prices` is not used in function, so it should be removed.

- Some if else in code is not clean code, if `return` is used, not need `else`.

- the target is `formattedBalances`. So we can merge `formattedBalances` and `sortedBalances`.


```typescript
const formattedBalances = useMemo(() => {
  return balances
    .map((balance: WalletBalance) => ({
      ...balance,
      priority: getPriority(balance.blockchain),
    }))
    .filter((balance) => balance.priority > -99 && balance.amount > 0)
    .sort((a, b) => b.priority - a.priority)
    .map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    }));
}, [balances]);
```

4. render `rows`
- `rows` can use with memo()

- `rows` should take from `formattedBalances`, not `sortedBalances`

- `key` should not be index, it should unique string.

```typescript
const rows = useMemo(() => 
  formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={balance.currency + index} // make sure it unique even currency is same.
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  }), [sortedBalances, prices, classes.row]
);

```