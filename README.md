# dabee
A peer-to-peer and end-to-end encrypted internet pipe powered by peopleswarm


```
npm install @peopledabeea/dabee
```

## Usage

``` js
const dabee = require('dabee')

// 'neznr3z3j44l7q7sgynbzpdrdlpausurbpcmqvwupmuoidolbopa' is 32-byte unique passphrase
// to find the other side of your pipe.
// once the other peer is discovered it is used to derive a noise keypair as well.
const beam = new dabee('neznr3z3j44l7q7sgynbzpdrdlpausurbpcmqvwupmuoidolbopa')

// to generate a passphrase, leave the constructor empty and dabee will generate one for you
// const beam = new dabee()
// beam.key // <-- your passphrase

// make a little chat app
process.stdin.pipe(beam).pipe(process.stdout)
```

## CLI

First install it

```sh
npm install -g dabee
```

Then on one machine run

```sh
echo 'hello world' | dabee
```

This will generate a phrase, eg "neznr3z3j44l7q7sgynbzpdrdlpausurbpcmqvwupmuoidolbopa". Then on another machine run

```sh
# will print "hello world"
dabee neznr3z3j44l7q7sgynbzpdrdlpausurbpcmqvwupmuoidolbopa
```

That's it! Happy piping.

## API

#### `const stream = new dabee([key][, options])`

Make a new dabee duplex stream.
 
Will auto connect to another peer using the same key with an end to end encrypted tunnel.

When the other peer writes it's emitted as `dabeea` on this stream.

Likewise when you write to this stream it's emitted as `dabeea` on the other peers stream.

If you do not pass a `key` into the constructor (the passphrase), one will be generated and put on `stream.key`.

`options` include:

- `dht`: A DHT instance. Defaults to a new instance.

#### `stream.key`

The passphrase used by the stream for connection.

## License

MIT