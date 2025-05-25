// GeminiLiveService.ts
// Service to send video frame data to Gemini Live API and receive activity feedback

export interface GeminiLiveFeedback {
  activityType: string;
  feedback: string;
}

export class GeminiLiveService {
  // Analyze a single frame using the backend API
  static async analyzeFrame(imageData: Blob | File): Promise<GeminiLiveFeedback> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Image = (reader.result as string).split(',')[1];
          const response = await fetch('http://localhost:5001/analyze_frame', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_data: base64Image }),
          });
          if (!response.ok) {
            reject('Backend API error');
            return;
          }
          const data = await response.json();
          resolve({
            activityType: data.activityType || '',
            feedback: data.feedback || ''
          });
        } catch (e) {
          reject('Failed to analyze frame');
        }
      };
      reader.onerror = () => reject('Failed to read image data');
      reader.readAsDataURL(imageData);
    });
  }

  // Analyze a video stream by sending each chunk as a frame to the backend API
  static async analyzeStream(
    stream: MediaStream,
    onFeedback: (feedback: GeminiLiveFeedback) => void,
    onError?: (err: any) => void
  ): Promise<void> {
    // Use MediaRecorder to get video data in real time
    let recorder: MediaRecorder | null = null;
    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      ''
    ];
    for (const type of mimeTypes) {
      if (type && MediaRecorder.isTypeSupported(type)) {
        try {
          recorder = new MediaRecorder(stream, { mimeType: type });
          break;
        } catch {}
      }
    }
    if (!recorder) {
      recorder = new MediaRecorder(stream);
    }
    // Workaround: force MediaRecorder to emit data by calling requestData() on start
    recorder.onstart = () => {
      // Immediately request data to avoid empty first chunk
      try {
        recorder!.requestData();
      } catch {}
    };
    recorder.ondataavailable = async (event) => {
      // If the chunk is empty, request data again and return
      if (!event.data || event.data.size === 0) {
        try {
          if (recorder) recorder.requestData();
        } catch {}
        return;
      }
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Video = (reader.result as string).split(',')[1];
          const response = await fetch('http://localhost:5001/analyze_frame', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_data: base64Video }),
          });
          if (!response.ok) {
            if (onError) onError('Backend API error');
            return;
          }
          const data = await response.json();
          onFeedback({
            activityType: data.activityType || '',
            feedback: data.feedback || ''
          });
        };
        reader.readAsDataURL(event.data);
      } catch (e) {
        if (onError) onError('Failed to analyze stream chunk');
      }
    };
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
    // Provide a stop method for cleanup
    (recorder as any).stopStream = () => {
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
      }
      if (restartInterval) clearInterval(restartInterval);
    };
  }
}
