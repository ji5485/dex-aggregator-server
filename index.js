const fs = require('fs')
const ethers = require('ethers')

// fs.readFile('./v2pools.json', (err, data) => {
//   const tokens = JSON.parse(data.toString()).map(pool => ({
//     address: ethers.utils.getAddress(pool.id),
//     token0: ethers.utils.getAddress(pool.token0.id),
//     token1: ethers.utils.getAddress(pool.token1.id),
//   }))

//   fs.writeFile(
//     './data.json',
//     JSON.stringify(Object.values(tokens), null, 2),
//     err => console.log(err),
//   )
// })

const provider = new ethers.providers.JsonRpcProvider('http://3.34.13.77:8545')

const TOEKN_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
]

fs.readFile('./v2pools.json', async (err, data) => {
  const not = []

  const newData = await Promise.all(
    Object.values(JSON.parse(data.toString()))
      .slice(0, 100)
      .flatMap(async ({ token0, token1 }, index) => {
        try {
          const token0Contract = new ethers.ethers.Contract(
            token0.id,
            TOEKN_ABI,
            provider,
          )
          const token1Contract = new ethers.ethers.Contract(
            token1.id,
            TOEKN_ABI,
            provider,
          )

          const [token0Name, token0Decimal, token1Name, token1Decimal] =
            await Promise.all([
              token0Contract.functions.name(),
              token0Contract.functions.decimals(),
              token1Contract.functions.name(),
              token1Contract.functions.decimals(),
            ])

          console.log(`Token is ready: `, index)

          return [
            {
              address: token0.id,
              symbol: token0.symbol,
              name: token0Name[0],
              decimal: token0Decimal[0],
            },
            {
              address: token1.id,
              symbol: token1.symbol,
              name: token1Name[0],
              decimal: token1Decimal[0],
            },
          ]
        } catch (error) {
          not.push(address)
        }
      }),
  )

  console.log('Error : ', not)
  fs.readFile('./tokens.json', (err, data) => {
    fs.writeFile(
      './tokens.json',
      JSON.stringify([...JSON.parse(data.toString()), ...newData], null, 2),
    )
  })
})
