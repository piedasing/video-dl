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

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const fs: any = await importModule('fs');
    const path: any = await importModule('path');
    const ytdl: any = await importModule('@distube/ytdl-core');

    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
    }

    return new Promise((resolve, reject) => {
        try {
            const stream = ytdl(url).pipe(fs.createWriteStream(dest));
            stream.on('finish', () => {
                logger.log(`Downloading finished.`);
                resolve([null, true]);
            });
        } catch (error) {
            resolve([error as Error, null]);
        }
    });
};
