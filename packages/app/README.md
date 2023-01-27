# Mutual Grants

## Data read Path

```text
Roundfactory (roundCreated events)
  -> RoundContract (roundMetaPtr read)
    -> roundMetaPtr IPFS pointer (name & programContractAddress field)
      -> programContract (metaPtr read)
        -> metaPtr IPFS pointer (name)
```
