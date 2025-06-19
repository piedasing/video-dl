import { importModule } from '../_func';

import { useLogger } from './useLogger';

type TUseYoutube = {
    videoId: string;
    dest: string;
    debug?: boolean;
};

export const useYoutube = async ({
    videoId,
    dest,
    debug = false,
}: TUseYoutube): Promise<[Error | null, boolean | null]> => {
    const logger = useLogger(debug);
    logger.log(`Downloading video: ${videoId} to: ${dest}`);

    // const url = `https://www.youtube.com/watch?v=${videoId}`;

    const fs: any = await importModule('fs');
    const path: any = await importModule('path');
    const Innertube: any = await importModule('youtubei.js');

    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
    }

    const ytdl = await Innertube.create({
        cache: false,
        generate_session_locally: true,
    });

    try {
        const stream = await ytdl.download(videoId, {
            type: 'video+audio',
            quality: 'best',
            format: 'mp4',
            client: 'WEB',
        });
        const file = fs.createWriteStream(dest);
        for await (const chunk of streamToIterable(stream)) {
            file.write(chunk);
        }

        return [null, true];
    } catch (error) {
        console.log('error', error);
        return [error as Error, null];
    }
};

async function* streamToIterable(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                return;
            }
            yield value;
        }
    } finally {
        reader.releaseLock();
    }
}
