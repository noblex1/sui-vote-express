# Simple Voting dApp on Sui

A production-ready voting decentralized application built on Sui blockchain using Move smart contracts. Users can create polls with multiple options and vote once per address with automatic double-vote prevention.

## Features

- ✅ Create polls with customizable questions and options
- ✅ One vote per address enforcement
- ✅ Real-time vote counting
- ✅ Event emission for poll creation and voting
- ✅ Shared object pattern for gas-efficient voting
- ✅ Comprehensive error handling
- ✅ Full test coverage
- ✅ React UI with wallet integration

## Prerequisites

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) installed
- [Rust toolchain](https://rustup.rs/) installed
- Node.js 18+ (for React UI)

## Quick Start

### 1. Build the Move Package

```bash
sui move build
```

### 2. Run Tests

```bash
sui move test
```

### 3. Deploy to Testnet

First, make sure you have testnet setup and gas coins:

```bash
sui client switch --env testnet
sui client gas
```

Deploy the package:

```bash
sui client publish --gas-budget 100000000
```

**Important**: Save the `Package ID` from the output - you'll need it for all function calls.

### 4. Create a Poll

Replace `<PACKAGE_ID>` with your deployed package ID:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module voting \
  --function create_poll \
  --args "What's the best programming language?" '["Move","Rust","TypeScript","JavaScript"]' \
  --gas-budget 100000000
```

**Finding the Poll Object ID**: After creating a poll, look for the transaction effects. The shared object will be listed with type `<PACKAGE_ID>::voting::Poll`. Copy this object ID for voting.

### 5. Vote on a Poll

Replace `<PACKAGE_ID>` and `<POLL_OBJECT_ID>` with your values:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module voting \
  --function vote \
  --args <POLL_OBJECT_ID> 0 \
  --gas-budget 50000000
```

The last argument (0) is the option index:
- 0 = First option ("Move")
- 1 = Second option ("Rust")  
- 2 = Third option ("TypeScript")
- 3 = Fourth option ("JavaScript")

### 6. Test Double-Vote Prevention

Try voting again from the same wallet - it should fail with error code 2:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module voting \
  --function vote \
  --args <POLL_OBJECT_ID> 1 \
  --gas-budget 50000000
```

### 7. Vote from Different Wallets

To test with multiple voters, create additional addresses:

```bash
# Create new address
sui client new-address ed25519

# Switch to new address  
sui client switch --address <NEW_ADDRESS>

# Request testnet tokens
sui client faucet

# Vote from new address
sui client call \
  --package <PACKAGE_ID> \
  --module voting \
  --function vote \
  --args <POLL_OBJECT_ID> 1 \
  --gas-budget 50000000
```

## Smart Contract Details

### Poll Structure

```move
public struct Poll has key {
    id: UID,
    question: String,
    options: vector<String>,
    votes: vector<u64>,
    voters: vector<address>,
    creator: address,
    created_ms: u64,
}
```

### Entry Functions

- `create_poll(question: String, options: vector<String>, clock: &Clock, ctx: &mut TxContext)`
- `vote(poll: &mut Poll, option_index: u64, ctx: &mut TxContext)`

### Error Codes

- **1**: Too few options (minimum 2 required)
- **2**: Double vote detected (address already voted)
- **3**: Invalid option index (out of bounds)

### Events

- `PollCreatedEvent`: Emitted when a new poll is created
- `VotedEvent`: Emitted when someone votes

## React UI

### Setup

```bash
cd ui
npm install
npm run dev
```

The UI provides:
- Wallet connection using @mysten/dapp-kit
- Create new polls with dynamic option inputs
- Vote on existing polls by Object ID
- Real-time transaction status
- Beautiful responsive design

### Environment Setup

Create `ui/.env.local`:

```
VITE_PACKAGE_ID=<YOUR_PACKAGE_ID>
```

## Gas Budget Guidelines

- **Creating a poll**: 100,000,000 MIST (0.1 SUI)
- **Voting**: 50,000,000 MIST (0.05 SUI)
- **Failed transactions**: Usually consume minimal gas

## Troubleshooting

### Common CLI Issues

1. **"vector<String>" formatting**: Ensure options are in JSON array format: `'["Option1","Option2"]'`

2. **Object not found**: Make sure you're using the correct Poll Object ID from the creation transaction

3. **Insufficient gas**: Increase `--gas-budget` if transactions fail

4. **Wrong network**: Verify you're on testnet: `sui client active-env`

### Finding Transaction Details

```bash
# View recent transactions
sui client transaction-history

# Get transaction details
sui client show-transaction <TRANSACTION_ID>
```

### Object Inspection

```bash
# View poll details
sui client object <POLL_OBJECT_ID>
```

## Development

### Project Structure

```
simple-voting/
├── Move.toml              # Move package configuration
├── sources/
│   └── voting.move        # Main smart contract
├── tests/
│   └── voting_tests.move  # Comprehensive test suite
├── README.md              # This file
└── ui/                    # React frontend (optional)
    ├── package.json
    ├── src/
    │   ├── App.tsx
    │   └── components/
    └── ...
```

### Running Tests Locally

```bash
# Run all tests
sui move test

# Run specific test
sui move test test_vote_success

# Run tests with coverage
sui move test --coverage
```

### Building with Different Networks

```bash
# Testnet (default)
sui move build

# Mainnet
sui move build --release
```

## Security Considerations

- ✅ Double-vote prevention through address tracking
- ✅ Bounds checking for option indices  
- ✅ Proper error handling with descriptive codes
- ✅ Event emission for transparency
- ✅ Shared object pattern for efficiency
- ✅ No admin privileges after creation

## License

MIT License - feel free to use this code for your own projects!

## Contributing

Issues and pull requests welcome! Please ensure all tests pass before submitting.