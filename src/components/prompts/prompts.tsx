'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import AudioPlayer from '../audio-player';
import AudioRecorder from '../audio-recorder';

type Prompt = {
    _id: string;
    request: string;
    response: string;
    source: string;
    out_audio?: string;
};

export default function Prompts() {
    const prompts = useQuery(api.prompts.get);

    if (!prompts) {
        return (
            <>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </>
        );
    }

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card className="flex items-center justify-center bg-muted/50 hover:scale-95 transition-transform">
                <AudioRecorder />
            </Card>
            {prompts?.map(
                ({ _id, source, request, response, out_audio }: Prompt) => (
                    <Card key={_id}>
                        <CardHeader>
                            {out_audio && (
                                <AudioPlayer
                                    source={`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${out_audio}`}
                                />
                            )}
                            <CardTitle>{request}</CardTitle>
                            <CardDescription>{source}</CardDescription>
                            <p>{response}</p>
                        </CardHeader>
                    </Card>
                )
            )}
        </div>
    );
}
