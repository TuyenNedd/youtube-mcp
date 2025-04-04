import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';
    import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
    import { spawn } from 'child_process';

    async function main() {
      // Start the server process
      const serverProcess = spawn('node', ['src/index.js'], {
        stdio: ['pipe', 'pipe', process.stderr]
      });

      // Create a transport that communicates with the server process
      const transport = new StdioClientTransport(serverProcess.stdin, serverProcess.stdout);
      
      // Create an MCP client
      const client = new McpClient();
      await client.connect(transport);

      try {
        // Example: Get info about a YouTube video
        console.log("Getting video info...");
        const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Example video
        
        const infoResult = await client.callTool("get_video_info", { url: videoUrl });
        console.log("Video Info:", infoResult.content[0].text);
        
        // Example: Get available formats
        console.log("\nGetting video formats...");
        const formatsResult = await client.callTool("get_video_formats", { url: videoUrl });
        console.log("Available Formats:", formatsResult.content[0].text);
        
        // Example: Get transcript
        console.log("\nGetting video transcript...");
        const transcriptResult = await client.callTool("get_transcript", { url: videoUrl });
        console.log("Transcript (first 200 chars):", transcriptResult.content[0].text.substring(0, 200) + "...");
        
        // Example: Get summary
        console.log("\nGetting video summary...");
        const summaryResult = await client.callTool("summarize_video", { url: videoUrl, maxLength: 300 });
        console.log("Summary:", summaryResult.content[0].text);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        // Clean up
        serverProcess.kill();
        process.exit(0);
      }
    }

    main().catch(console.error);
