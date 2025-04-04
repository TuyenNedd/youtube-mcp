import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
    import { z } from 'zod';
    import { 
      getVideoInfo, 
      getVideoFormats, 
      getVideoDownloadUrl, 
      getVideoTranscript,
      extractVideoId,
      summarizeTranscript
    } from './youtube-service.js';

    // Create an MCP server for YouTube operations
    const server = new McpServer({
      name: "YouTube Video Processor",
      version: "1.0.0",
      description: "MCP server for downloading and summarizing YouTube videos"
    });

    // Get video information
    server.tool(
      "get_video_info",
      { 
        url: z.string().url().describe("YouTube video URL")
      },
      async ({ url }) => {
        try {
          const info = await getVideoInfo(url);
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify(info, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: error.message }],
            isError: true
          };
        }
      },
      { description: "Get information about a YouTube video" }
    );

    // Get available video formats
    server.tool(
      "get_video_formats",
      { 
        url: z.string().url().describe("YouTube video URL")
      },
      async ({ url }) => {
        try {
          const formats = await getVideoFormats(url);
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify(formats, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: error.message }],
            isError: true
          };
        }
      },
      { description: "Get available formats for a YouTube video" }
    );

    // Get video download URL
    server.tool(
      "get_download_url",
      { 
        url: z.string().url().describe("YouTube video URL"),
        itag: z.string().describe("Format itag (get this from get_video_formats)")
      },
      async ({ url, itag }) => {
        try {
          const downloadUrl = await getVideoDownloadUrl(url, itag);
          return {
            content: [{ 
              type: "text", 
              text: downloadUrl
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: error.message }],
            isError: true
          };
        }
      },
      { description: "Get direct download URL for a specific video format" }
    );

    // Get video transcript
    server.tool(
      "get_transcript",
      { 
        url: z.string().url().describe("YouTube video URL")
      },
      async ({ url }) => {
        try {
          const videoId = extractVideoId(url);
          const transcript = await getVideoTranscript(videoId);
          return {
            content: [{ 
              type: "text", 
              text: transcript
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: error.message }],
            isError: true
          };
        }
      },
      { description: "Get the transcript of a YouTube video" }
    );

    // Summarize video content
    server.tool(
      "summarize_video",
      { 
        url: z.string().url().describe("YouTube video URL"),
        maxLength: z.number().optional().describe("Maximum length of summary (optional)")
      },
      async ({ url, maxLength = 500 }) => {
        try {
          const videoId = extractVideoId(url);
          const transcript = await getVideoTranscript(videoId);
          const summary = summarizeTranscript(transcript, maxLength);
          const info = await getVideoInfo(url);
          
          return {
            content: [{ 
              type: "text", 
              text: `Title: ${info.title}\nAuthor: ${info.author}\n\nSummary:\n${summary}`
            }]
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: error.message }],
            isError: true
          };
        }
      },
      { description: "Get a summary of a YouTube video's content" }
    );

    export { server };
