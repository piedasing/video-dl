import { importModule } from '../_func';

type TUseYoutube = {
    videoId: string;
    dest: string;
};

export const useYoutube = async ({ videoId, dest }: TUseYoutube): Promise<void> => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const fs: any = await importModule('fs');
    const path: any = await importModule('path');
    const ytdl: any = await importModule('@distube/ytdl-core');

    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
    }

    return new Promise((resolve, reject) => {
        const stream = ytdl(url).pipe(fs.createWriteStream(dest));
        stream.on('finish', () => {
            resolve();
        });
    });
};
