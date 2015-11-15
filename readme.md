Coindust is a command-line bitcoin wallet and utility.

Note: this is pre-1.0 software and should be trusted with only small amounts of bitcoin. Be sure to encrypt and/or back up the wallet file in ~/.config/coindust/wallet.json

### Install

```sh
$ npm install -g coindust
```

### Usage

* Add a new bitcoin address and private key to the wallet.
```
$ coindust new
 pub: 1FsS76LHrh8Fq4ee5NP9Df3e2vqf3nzmDj
priv: L3YfxDBDrYAXL7U7eFWaxTejheCG3Cf7MKGRjUjXRgEZDF5h3c4X
```

* Query the balances of addresses in the wallet [1]

```
$ coindust balance
gathering balances for 2 keys
1AVrK8LZeKxvnrT3AiyZ3uvceYTdNyNELf 0.00000000 BTC
1BP7zWr8Aa8XzohffGRnzsowEqALNF3hZ3 0.03000000 BTC "comic books"
Total: 0.03000 BTC

```
* Query the balance of a single bitcoin address [1]
```
$ coindust 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m
gathering balances for 1 keys
1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m 0.00000000 BTC
Total: 0 BTC
```

* Build a transaction between two bitcoin addresses [2]
Note this builds the transaction and displays it in hex form. It does
not submit the transaction to any service. Using the hex form you
can paste the transaction into a service which will submit the
transaction into the bitcoin network.
```
$ coindust tx --in 1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv --out 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m --amount 0.01
 input: 1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv 0.05000BTC
output: 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m 0.01000BTC
        1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv 0.03999BTC (change)
   fee:                                    0.00001BTC
TX:
0100000001a30b283b7ffe227f0e008f2f0ec024edbc7a988b44983ec79e9ba49334dea265d0e976502207e0dc9a53d4be...
```


Bitcoin addresses and private keys are kept in ~/.config/coindust/wallet.json. NOTE this file is unencrypted. Encryption and backups are left to the user!

[1] Uses blockexplorer.com to get a balance from a bitcoind address
[2] Uses blockchain.info to discover the 'unspent outputs' of the 'in' address

