import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function testCryptoPrice() {
  // Create a client
  const client = new Client({ 
    name: "crypto-price-test-client", 
    version: "0.1.0" 
  });

  try {
    // Connect to our server
    const transport = new StdioClientTransport({
      command: "node", 
      args: ["server.js"]
    });
    
    await client.connect(transport);

    console.log("Connected to the server successfully.");
    
    // Test with Bitcoin
    console.log("Testing with 'Bitcoin'...");
    const result = await client.callTool({
      name: "price", 
      arguments: { crypto: "dogecoin" }
    });

    console.log("Result:", result);
    
    // Test with invalid cryptocurrency
    console.log("\nTesting with invalid crypto 'NonExistentCoin'...");
    const invalidResult = await client.callTool({
      name: "price", 
      arguments: { crypto: "NonExistentCoin" }
    });

    console.log("Invalid Result:", invalidResult);
  } catch (error) {
    console.error("Error testing crypto price:", error);
  } finally {
    // The client doesn't have a disconnect method, so we'll just exit
    console.log("Test completed.");
    process.exit(0);
  }
}

// Run the test
testCryptoPrice(); 