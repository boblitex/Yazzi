'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { log } from 'console';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const generateUploadUrl = useMutation(api.audio.generateUploadUrl);
  const storeFileId = useMutation(api.audio.storeFileId);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (publicUrl) {
      const apiResponse = async () => {
        const result = await fetch(
          'https://plusnarrative-sp-sa-free-yazzi-ayhcgncmcpdvhdh6.southafricanorth-01.azurewebsites.net',
          {
            method: 'POST',
            body: JSON.stringify({
              input_url: publicUrl,
            }),
          }
        );
        console.log('response--->', result.json());
      };

      apiResponse();

      console.log(apiResponse);
    }
  }, [publicUrl]);

  const handleUpload = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      await uploadAudio(audioBlob);
      // Optionally clear the audio blob after successful upload
      setAudioBlob(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };
  const uploadAudio = async (blob: Blob) => {
    try {
      // Generate a unique filename
      const fileName = `audio-${Date.now()}.wav`;

      // Get the signed URL from Convex
      const uploadUrl = await generateUploadUrl({
        fileName,
        contentType: blob.type,
      });
      console.log('Upload URL:', uploadUrl);

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': blob.type,
        },
        body: blob,
      });
      console.log('Upload result:', result);

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();
      console.log('File uploaded with storage ID:', storageId);

      // Store the file ID in your database
      const { publicUrl } = await storeFileId({
        storageId,
        fileName,
      });

      console.log('Public URL:', publicUrl);
      setPublicUrl(publicUrl);

      console.log('Audio uploaded successfully');
      return result;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  //    const { publicUrl } = await storeFileId({
  //      storageId,
  //      fileName,
  //    });

  //   useEffect(() => {
  //     if (storageId) {
  //       const fetchPublicUrl = async () => {
  //         try {
  //           const { publicUrl } = await generatePublicUrl({ storageId });
  //           console.log('Public URL:', publicUrl);
  //         } catch (error) {
  //           console.error('Error generating public URL:', error);
  //         }
  //       };

  //       fetchPublicUrl();
  //     }
  //   }, [storageId, generatePublicUrl]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <Button
        onClick={toggleRecording}
        className={`w-16 h-16 rounded-full ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <Square className='w-8 h-8 text-white' />
        ) : (
          <Mic className='w-8 h-8 text-white' />
        )}
      </Button>
      <p className='mt-4 text-lg text-red-200 font-semibold'>
        {isRecording ? 'Recording...' : 'Tap to record'}
      </p>

      {audioBlob && (
        <div className='mt-8 align-middle'>
          <h2 className='text-xl font-bold mb-2 text-black'>Recorded Audio:</h2>
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className='w-full max-w-md'
          />
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className='m-4 bg-red-200 hover:bg-green-600'
          >
            {isUploading ? 'Uploading...' : 'Upload Recording'}
          </Button>
        </div>
      )}
    </div>
  );
}
