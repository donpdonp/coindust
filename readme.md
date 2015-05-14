
```
$ ./dust new
prv: Ky1EQoRGUD21taWvfB7L8bmqQG53QjKmdncnBPSz2vnruyNKuHMx
pub: 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m
```

```
$ ./dust 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m
gathering balances for 1 keys
Wallet Total: 0
```

```
$ ./dust balance --wallet bitcoin-core.dumpformat
wallet: bitcoin-core.dumpformat
3 keys read.
gathering balances for 3 keys
Wallet Total: 0
```

```
$ ./dust tx --in 1DokuGn9eLQR5wTHSg3r1gWLBsb9CvjemP --out 1DokuGn9eLQR5wTHSg3r1gWLBsb9CvjemP --amount 0.1 --wallet bitcoin-core.dumpformat
wallet: bitcoin-core.dumpformat
 input: 1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv 0.05000BTC
output: 1MXEaXamNSLUXQKWZu8fSz241Zginvoj1m 0.01000BTC
        1Q182Kx8y7gkXvvEod8nwt5gDDa86Dr2tv 0.03999BTC (change)
   fee: 0.00001BTC
TX:
01010101
```
