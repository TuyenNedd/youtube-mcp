# YouTube Video Processor MCP Server

    An MCP server that provides tools for downloading YouTube videos and summarizing their content.

    ## Features

    - Get video information (title, description, author, etc.)
    - List available video formats
    - Get direct download URLs for videos
    - Extract video transcripts
    - Generate summaries of video content

    ## Getting Started

    1. Install dependencies:
       ```
       npm install
       ```

    2. Run the server:
       ```
       npm run dev
       ```

    3. Test with MCP Inspector:
       ```
       npm run inspect
       ```

    ## Available Tools

    - `get_video_info`: Get metadata about a YouTube video
    - `get_video_formats`: List available download formats for a video
    - `get_download_url`: Get a direct download URL for a specific format
    - `get_transcript`: Extract the transcript from a video
    - `summarize_video`: Generate a summary of the video content

    ## Usage Notes

    1. First use `get_video_formats` to see available formats
    2. Then use `get_download_url` with the chosen format's itag
    3. For transcripts and summaries, use `get_transcript` and `summarize_video`

    ## Limitations

    - The summarization is currently a simple truncation. For better summaries, you would need to integrate with an AI service.
    - Some videos may not have transcripts available.
    - YouTube's terms of service should be respected when using this tool.
