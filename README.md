# Crypto Price MCP Server

A Model Context Protocol (MCP) server that fetches cryptocurrency prices using the CoinGecko API.

## Overview

This server provides cryptocurrency price information through the Model Context Protocol. When integrated with an AI assistant that supports MCP, you can retrieve real-time cryptocurrency prices directly in your conversations.

## Features

- Fetch current prices for various cryptocurrencies
- Integrates with CoinGecko API
- Error handling for invalid cryptocurrency names

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/akshayamin62/Crypto-Price-MCP-Server.git
   cd Crypto-Price-MCP-Server
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Package.json

The project uses the following dependencies:

```json
{
  "name": "crypto",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "test-client": "node test-client.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.11.2",
    "axios": "^1.9.0",
    "cheerio": "^1.0.0",
    "zod": "^3.24.4"
  }
}
```

## Setup

1. Create a `.cursor/mcp.json` file in your home directory with the following content:

```json
{
  "mcpServers": {
    "crypto-price-server": {
      "command": "node",
      "args": ["path/to/your/Crypto-Price-MCP-Server/server.js"]
    }
  }
}
```

Make sure to replace `path/to/your` with the actual path to the server.js file on your system.

## Usage

Once set up, the MCP server will work with compatible AI assistants. You can ask for cryptocurrency prices with commands like:

```
What's the current price of Bitcoin?
```

You can also run the server manually:

```
npm start
```

To test the client:

```
npm run test-client
```

## Example Response

```json
{
  "status": "success",
  "data": {
    "asset": "Bitcoin",
    "price": 101843,
    "currency": "USD"
  }
}
```

## Dependencies

- [@modelcontextprotocol/sdk](https://github.com/anthropics/model-context-protocol) - MCP SDK
- [axios](https://github.com/axios/axios) - HTTP client
- [zod](https://github.com/colinhacks/zod) - Schema validation
- [cheerio](https://github.com/cheeriojs/cheerio) - HTML parsing (used as fallback)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.