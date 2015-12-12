### Coindust

Coindust is a command-line bitcoin wallet and utility.

Coindust was written to perform common bitcoin operations where key storage is local (see Safety section below) and interacting with the bitcoin blockchain is done through various public APIs.

In the early days of bitcoin (2013) it was possible and even desirable to run a full node. Running a bitcoin node today (2015) required days of syncing and 10s of gigabytes of disk. Cell phone apps have demonstrated that keeping the private keys local and using public APIs can be a great way to use Bitcoin.

### Install

```sh
$ npm install -g coindust
```

### Usage

* Add a new bitcoin address and private key to the wallet using an optional account name.
```
$ coindust new comic books
 pub: 1FsS76LHrh8Fq4ee5NP9Df3e2vqf3nzmDj
priv: L3YfxDBDrYAXL7U7eFWaxTejheCG3Cf7MKGRjUjXRgEZDF5h3c4X
name: "comic books"
```

* Query the balances of addresses in the wallet [1]

```
$ coindust balance
gathering balances for 2 keys
1AVrK8LZeKxvnrT3AiyZ3uvceYTdNyNELf 0.03000000 BTC
1FsS76LHrh8Fq4ee5NP9Df3e2vqf3nzmDj 0.00000000 BTC "comic books"
Total: 0.03000 BTC

```
* Query the balance of a single bitcoin address [1]
```
$ coindust 1AVrK8LZeKxvnrT3AiyZ3uvceYTdNyNELf
gathering balances for 1 keys
1AVrK8LZeKxvnrT3AiyZ3uvceYTdNyNELf 0.00000000 BTC
Total: 0 BTC
```

* Build a transaction between two bitcoin addresses [2]

Note this builds the transaction and displays it in hex form. _It does not submit the transaction_.

```
$ coindust tx --in 1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv --out 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m --amount 0.01
 input: 1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv 0.05000btc
output: 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m 0.01000btc
        1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv 0.03999btc (change)
   fee:                                    0.00001btc
  rate:                                    2 satoshis/byte
TX (402 bytes before encoding):
0100000001a30b283b7ffe227f0e008f2f0ec024edbc7a988b44983ec79e9ba49334dea265d0e976502207e0dc9a53d4be...
```

The hex form of the transaction can be pasted it into a bloockchain service which will submit the transaction into the bitcoin network. [3]

[1] Uses blockexplorer.com to get a balance from a bitcoin address.

[2] Uses blockchain.info to discover the 'unspent outputs' of the 'in' address.

[3] for example https://live.blockcypher.com/bcy/decodetx/


#### Safety

Bitcoin addresses and private keys are kept unencrypted in ~/.config/coindust/wallet.json. Protect this file with your own mechanism for encryption and backups!

