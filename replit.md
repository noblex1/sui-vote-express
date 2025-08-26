# Overview

This is a Sui blockchain voting dApp called "Sui Vote Express" built with React, TypeScript, and Express. The application allows users to create and participate in decentralized polls on the Sui blockchain. It features a modern UI using shadcn/ui components and TailwindCSS, with blockchain integration through Mysten Labs' Sui SDK.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with custom design system featuring Sui-inspired blue theme
- **State Management**: React hooks with @tanstack/react-query for server state
- **Routing**: React Router for client-side navigation
- **Blockchain Integration**: @mysten/dapp-kit for Sui wallet connection and transactions

## Backend Architecture
- **Runtime**: Node.js with Express framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **API Structure**: RESTful API with `/api` prefix for all endpoints
- **Development**: Hot reload with Vite middleware integration

## Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Simple user table with id, username, and password fields
- **Migrations**: Drizzle Kit for schema migrations in `/migrations` directory
- **Connection**: Neon Database serverless PostgreSQL

## Authentication & Wallet Integration
- **Blockchain Auth**: Sui wallet-based authentication using @mysten/dapp-kit
- **Wallet Providers**: Support for multiple Sui wallets through WalletProvider
- **Network**: Configured for Sui testnet with mainnet support

## External Dependencies

### Blockchain Services
- **Sui Network**: Primary blockchain for smart contract deployment and transactions
- **Neon Database**: Serverless PostgreSQL database hosting
- **Sui RPC**: Fullnode connection for blockchain interactions

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **TailwindCSS**: Utility-first styling framework
- **shadcn/ui**: Component library with Radix UI primitives

### UI Components
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library
- **Sonner**: Toast notification system
- **React Hook Form**: Form validation with Zod schemas