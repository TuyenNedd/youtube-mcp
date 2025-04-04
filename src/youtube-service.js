import ytdl from 'ytdl-core';
    import { YoutubeTranscript } from 'youtube-transcript';

    export async function getVideoInfo(url) {
      try {
        const info = await ytdl.getInfo(url);
        return {
          title: info.videoDetails.title,
          description: info.videoDetails.description,
          author: info.videoDetails.author.name,
          lengthSeconds: info.videoDetails.lengthSeconds,
          viewCount: info.videoDetails.viewCount,
          thumbnailUrl: info.videoDetails.thumbnails[0].url
        };
      } catch (error) {
        throw new Error(`Failed to get video info: ${error.message}`);
      }
    }

    export async function getVideoFormats(url) {
      try {
        const info = await ytdl.getInfo(url);
        const formats = info.formats
          .filter(format => format.hasAudio)
          .map(format => ({
            itag: format.itag,
            quality: format.qualityLabel || format.audioQuality || 'unknown',
            mimeType: format.mimeType,
            container: format.container,
            hasVideo: !!format.qualityLabel,
            hasAudio: format.hasAudio
          }));
        
        return formats;
      } catch (error) {
        throw new Error(`Failed to get video formats: ${error.message}`);
      }
    }

    export async function getVideoDownloadUrl(url, itag) {
      try {
        const info = await ytdl.getInfo(url);
        const format = info.formats.find(f => f.itag === parseInt(itag));
        
        if (!format) {
          throw new Error(`Format with itag ${itag} not found`);
        }
        
        return format.url;
      } catch (error) {
        throw new Error(`Failed to get download URL: ${error.message}`);
      }
    }

    export async function getVideoTranscript(videoId) {
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        return transcript.map(item => item.text).join(' ');
      } catch (error) {
        throw new Error(`Failed to get transcript: ${error.message}`);
      }
    }

    export function extractVideoId(url) {
      try {
        return ytdl.getVideoID(url);
      } catch (error) {
        throw new Error(`Invalid YouTube URL: ${error.message}`);
      }
    }

    export function summarizeTranscript(transcript, maxLength = 500) {
      // This is a simple summarization that just takes the first part of the transcript
      // In a real application, you would use an AI model or more sophisticated algorithm
      if (transcript.length <= maxLength) {
        return transcript;
      }
      
      return transcript.substring(0, maxLength) + '...';
    }
