#!/usr/bin/env node

const dabee = require('./')

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  console.error('Usage: dabee [passphrase]')
  console.error('')
  console.error('  Creates a peer-to-peer and end-to-end encrypted network pipe.')
  console.error('  If a passphrase is not supplied, will create a new phrase and begin listening.')
  process.exit(1)
}

let beam
try {
  beam = new dabee(process.argv[2], process.argv.includes('-r'))
} catch (e) {
  if (e.constructor.name === 'PassphraseError') {
    console.error(e.message)
    console.error('(If you are attempting to create a new pipe, do not provide a phrase and dabee will generate one for you.)')
    process.exit(1)
  } else {
    throw e
  }
}

if (beam.announce) {
  console.error('[dabee] Run dabee ' + beam.key + ' to connect')
  console.error('[dabee] To restart this side of the pipe with the same key add -r to the above')
} else {
  console.error('[dabee] Connecting pipe...')
}

beam.on('remote-address', function ({ host, port }) {
  if (!host) console.error('[dabee] Could not detect remote address')
  else console.error('[dabee] Joined the DHT - remote address is ' + host + ':' + port)
})

beam.on('connected', function () {
  console.error('[dabee] Success! Encrypted tunnel established to remote peer')
})

beam.on('error', function (e) {
  console.error('[dabee] Error:', e.message)
  closeASAP()
})

beam.on('end', () => beam.end())

process.stdin.pipe(beam).pipe(process.stdout)
if (typeof process.stdin.unref === 'function') process.stdin.unref()

process.once('SIGINT', () => {
  if (!beam.connected) closeASAP()
  else beam.end()
})

function closeASAP () {
  console.error('[dabee] Shutting down beam...')

  const timeout = setTimeout(() => process.exit(1), 2000)
  beam.destroy()
  beam.on('close', function () {
    clearTimeout(timeout)
  })
}
