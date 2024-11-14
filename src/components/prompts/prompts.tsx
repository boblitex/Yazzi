'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import AudioPlayer from '../audio-player';

type Prompt = {
    _id: string;
    request: string;
    response: string;
    source: string;
    out_audio?: string;
};

export default function Prompts() {
    const prompts = useQuery(api.prompts.get);
    console.log(prompts);

    if (!prompts) {
        return (
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
        );
    }

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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
                        {/* <CardContent>
                        <p>{response}</p>
                    </CardContent> */}
                    </Card>
                )
            )}
        </div>
    );
}
