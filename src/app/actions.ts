'use server';

export async function getAudio(publicUrl: string) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
        input_url: publicUrl,
    });

    try {
        const response = await fetch(
            'https://plusnarrative-sp-sa-free-yazzi-ayhcgncmcpdvhdh6.southafricanorth-01.azurewebsites.net',
            {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                signal: AbortSignal.timeout(300000),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getAudio:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            url: publicUrl,
            timestamp: new Date().toISOString(),
        });
        throw error;
    }
}
