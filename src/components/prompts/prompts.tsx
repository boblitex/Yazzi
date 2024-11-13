'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

type Prompt = {
    _id: string;
    request: string;
    response: string;
    source: string;
};

export default function Prompts() {
    const prompts = useQuery(api.prompts.get);

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
            {prompts?.map(({ _id, source, request, response }: Prompt) => (
                <Card key={_id}>
                    <CardHeader>
                        <CardTitle>{request}</CardTitle>
                        <CardDescription>{source}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{response}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
