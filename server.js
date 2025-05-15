  import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
  import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
  import { z } from 'zod';
  import axios from 'axios';

  // Create an MCP server
  const server = new McpServer({
    name: 'crypto-price-server',
    version: '0.1.0',
  });

  /**
   * Fetches the price of a cryptocurrency from CoinGecko API
   * @param {string} cryptoName - The name of the cryptocurrency (e.g., bitcoin, ethereum)
   * @returns {Promise<Object>} - Returns the price data in a simplified format
   */
  async function fetchCryptoPrice(cryptoName) {
    try {
      // Convert the crypto name to lowercase and replace spaces with hyphens for API
      const formattedName = cryptoName.toLowerCase().replace(/\s+/g, '-');
      
      // Use CoinGecko public API instead of scraping
      const url = `https://api.coingecko.com/api/v3/coins/${formattedName}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
        },
        timeout: 10000
      });
      
      // Process the API response
      if (response.status === 200 && response.data) {
        const coinData = response.data;
        
        return {
          status: 'success',
          data: {
            asset: coinData.name,
            price: coinData.market_data?.current_price?.usd || 0,
            currency: 'USD'
          }
        };
      } else {
        return {
          status: 'error',
          message: 'Unable to fetch cryptocurrency data from CoinGecko API.'
        };
      }
    } catch (error) {
      // Try simple coin ID list in case of specific cryptocurrency
      try {
        // If the detailed API fails, try the simpler price API
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${formattedName}&vs_currencies=usd`;
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
          },
          timeout: 10000
        });
        
        if (response.status === 200 && response.data && response.data[formattedName]?.usd) {
          return {
            status: 'success',
            data: {
              asset: cryptoName,
              price: response.data[formattedName].usd,
              currency: 'USD'
            }
          };
        }
      } catch (fallbackError) {
        // Continue to the error handler below
      }
      
      return {
        status: 'error',
        message: `Error fetching cryptocurrency price: ${error.message}`
      };
    }
  }

  // Add the price tool to the server
  server.tool(
    'price',
    {
      crypto: z.string().describe('The name of the cryptocurrency to fetch the price for'),
    },
    async ({ crypto }) => {
      try {
        // Fetch from the API
        const result = await fetchCryptoPrice(crypto);
        
        if (result.status === 'success') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
            isError: true,
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'error',
                message: `Error: ${errorMessage}`
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Start the server
  const transport = new StdioServerTransport();
  server.connect(transport).catch((error) => {
    console.error('[MCP Error]', error);
    process.exit(1);
  });

  console.error('Crypto Price MCP server running on stdio'); 