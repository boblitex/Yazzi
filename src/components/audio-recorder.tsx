'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { Mic, Square } from 'lucide-react';
import { useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { getAudio } from '../app/actions';

export default function AudioRecorder() {
    const create = useMutation(api.prompts.create);

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const generateUploadUrl = useMutation(api.audio.generateUploadUrl);
    const storeFileId = useMutation(api.audio.storeFileId);

    const [isUploading, setIsUploading] = useState(false);

    const postData = async (publicUrl: string) => {
        try {
            if (!publicUrl) return;
            const response = await getAudio(publicUrl);

            await create({
                request: response.transcription,
                response: response.translation,
                source: response.url,
                in_audio: publicUrl,
                out_audio: response.output_url,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
            const fileName = `audio-${Date.now()}.webm`;

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
            if (publicUrl) postData(publicUrl);

            console.log('Audio uploaded successfully');
            return result;
        } catch (error) {
            console.error('Error uploading audio:', error);
            throw error;
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
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

    return (
        <div className="flex flex-col items-center justify-center">
            <Button
                onClick={toggleRecording}
                className={`w-16 h-16 rounded-full ${
                    isRecording
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-primary hover:bg-primary/80'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                {isRecording ? (
                    <Square className="w-8 h-8" />
                ) : (
                    <Mic className="w-8 h-8" />
                )}
            </Button>
            <p className="mt-4 text-2xl font-semibold">
                {isRecording ? 'Recording...' : 'Tap to record'}
            </p>

            {audioBlob && (
                <div className="mt-8 text-center">
                    <h2 className="font-bold mb-2">Recorded Audio:</h2>
                    <audio
                        controls
                        src={URL.createObjectURL(audioBlob)}
                        className="w-full"
                    />
                    <Button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="m-4"
                    >
                        {isUploading ? 'Uploading...' : 'Upload Recording'}
                    </Button>
                </div>
            )}
        </div>
    );
}
