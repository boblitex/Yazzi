'use client';

import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';

export default function AudioPlayer({ source }: { source: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            (audioRef.current as HTMLAudioElement).pause();
            (audioRef.current as HTMLAudioElement).currentTime = 0;
        } else {
            (audioRef.current as HTMLAudioElement).play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <Button
            size="icon"
            className="mb-4"
        >
            <audio
                ref={audioRef}
                src={source}
                onEnded={() => setIsPlaying(false)}
            />
            <div
                onClick={toggleAudio}
                className="hover:bg-transparent"
            >
                {isPlaying ? (
                    <VolumeX className="h-6 w-6" />
                ) : (
                    <Volume2 className="h-6 w-6" />
                )}
            </div>
        </Button>
    );
}
