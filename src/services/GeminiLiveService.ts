// GeminiLiveService.ts
// Service to send video frame data to Gemini Live API and receive activity feedback

export interface GeminiLiveFeedback {
  activityType: string;
  feedback: string;
}

export class GeminiLiveService {
  static async analyzeFrameWS(imageData: Blob | File, activityType: string, apiKey: string): Promise<GeminiLiveFeedback> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = async () => {
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = (reader.result as string).split(',')[1];
          // Construct the message according to Gemini API requirements
          const message = {
            activityType,
            frame: base64Image
          };
          ws.send(JSON.stringify(message));
        };
        reader.onerror = () => reject('Failed to read image data');
        reader.readAsDataURL(imageData);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // You may need to adjust this depending on Gemini's response format
          if (data.feedback) {
            ws.close();
            resolve({
              activityType: data.activityType || activityType,
              feedback: data.feedback
            });
          }
        } catch (e) {
          ws.close();
          reject('Invalid response from Gemini API');
        }
      };

      ws.onerror = (err) => {
        ws.close();
        reject('WebSocket error');
      };

      ws.onclose = () => {
        // No action needed
      };
    });
  }

  static createLiveWebSocket(apiKey: string, onFeedback: (feedback: GeminiLiveFeedback) => void, onError?: (err: any) => void): WebSocket {
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.feedback) {
          onFeedback({
            activityType: data.activityType || '',
            feedback: data.feedback
          });
        }
      } catch (e) {
        if (onError) onError(e);
      }
    };
    ws.onerror = (err) => {
      if (onError) onError(err);
    };
    return ws;
  }

  // New: Listen to a MediaStreamTrack's 'ondataavailable' event and send chunks to the WebSocket in real time
  static createLiveWebSocketFromMediaStream(
    stream: MediaStream,
    activityType: string,
    apiKey: string,
    onFeedback: (feedback: GeminiLiveFeedback) => void,
    onError?: (err: any) => void
  ): WebSocket {
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      // Use MediaRecorder to get video data in real time
      let recorder: MediaRecorder | null = null;
      // Try all common mime types for Chrome compatibility
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        ''
      ];
      let foundType = '';
      for (const type of mimeTypes) {
        if (type && MediaRecorder.isTypeSupported(type)) {
          try {
            recorder = new MediaRecorder(stream, { mimeType: type });
            foundType = type;
            break;
          } catch {}
        }
      }
      if (!recorder) {
        // Fallback: try default
        recorder = new MediaRecorder(stream);
      }
      let hasSentFirstChunk = false;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          hasSentFirstChunk = true;
          if (ws.readyState === 1) {
            const reader = new FileReader();
            reader.onload = () => {
              const base64Video = (reader.result as string).split(',')[1];
              const message = {
                activityType,
                videoChunk: base64Video,
                mimeType: foundType
              };
              ws.send(JSON.stringify(message));
            };
            reader.readAsDataURL(event.data);
          }
        } else if (!hasSentFirstChunk) {
          // If the first chunk is empty, ignore and wait for the next
          return;
        }
      };
      // Fix: Stop and restart the recorder after the first chunk to force repeated ondataavailable
      if (recorder && recorder.state === 'inactive') {
        recorder.start(1000); // 1000ms timeslice for continuous data
      }
      // Chrome bug workaround: restart recorder every 1s if only one chunk is received
      let restartInterval: NodeJS.Timeout | null = null;
      restartInterval = setInterval(() => {
        if (recorder && recorder.state === 'recording') {
          recorder.requestData();
        }
      }, 1000);
      // Only stop the recorder if the WebSocket is closed abnormally or by user, not on normal streaming
      ws.onclose = (event) => {
        // Only stop the recorder if the stream is no longer active or the WebSocket was closed cleanly (by user/server handshake)
        if (recorder && recorder.state !== 'inactive') {
          const tracks = stream.getTracks();
          const isStreamActive = tracks.some(track => track.readyState === 'live');
          // Stop only if stream is inactive or closure was clean
          if (!isStreamActive || (event && event.wasClean)) {
            recorder.stop();
          } else {
            // Otherwise, keep recording (e.g., for unexpected disconnects)
            console.warn('WebSocket closed unexpectedly while stream is still active; recorder not stopped.');
          }
        }
        if (restartInterval) clearInterval(restartInterval);
      };
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.feedback) {
          onFeedback({
            activityType: data.activityType || activityType,
            feedback: data.feedback
          });
        }
      } catch (e) {
        if (onError) onError(e);
      }
    };
    ws.onerror = (err) => {
      if (onError) onError(err);
    };
    return ws;
  }
}
