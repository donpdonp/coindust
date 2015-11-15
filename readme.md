coindust is a command-line bitcoin wallet and utility.

```
$ coindust new
prv: Ky1EQoRGUD21taWvfB7L8bmqQG53QjKmdncnBPSz2vnruyNKuHMx
pub: 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m
```

```
$ coindust 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m
gathering balances for 1 keys
Wallet Total: 0
```

```
$ coindust balance
gathering balances for 2 keys
1AVrK8LZeKxvnrT3AiyZ3uvceYTdNyNELf 0.00000000 BTC
1BP7zWr8Aa8XzohffGRnzsowEqALNF3hZ3 0.00000000 BTC "donations"
Total: 0.00000 BTC

```

```
$ coindust tx --in 1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv --out 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m --amount 0.01
 input: 1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv 0.05000BTC
output: 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m 0.01000BTC
        1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv 0.03999BTC (change)
   fee:                                    0.00001BTC
TX:
0100000001a30b283b7ffe227f0e008f2f0ec024edbc7a988b44983ec79e9ba49334dea265d0e976502207e0dc9a53d4be...
```

Private keys are read from a "wallet dump" which is the output of the 'dumpwallet' command in bitcoin-core.

To create a wallet file by hand, put the private/public key in a text file using the following format:

```
L4FSFZ1MM7VZF4psXrwrvDrBgrrSyrToaw9VzRKhxBikCkE3dAKE # addr=16bnbAB6VKGELxwYhXdtKVrtbLJMpdTeor
```

