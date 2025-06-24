import { importModule, downloadFileFromUrl } from '../_func';

import { useLogger } from './useLogger';

type TUseYoutube = {
    ytdlpPath: string;
    videoId: string;
    dest: string;
    debug?: boolean;
};

export const useYoutube = async ({
    ytdlpPath,
    videoId,
    dest,
    debug = false,
}: TUseYoutube): Promise<[Error | null, boolean | null]> => {
    const logger = useLogger(debug);
    logger.log(`Downloading video: ${videoId} to: ${dest}`);

    // const url = `https://www.youtube.com/watch?v=${videoId}`;

    const fs: any = await importModule('fs');
    const path: any = await importModule('path');
    const { exec }: any = await importModule('child_process');

    const getDownloadLink = (videoId = ''): Promise<string> => {
        return new Promise((resolve, reject) => {
            const cmd = `${ytdlpPath} -f b -g https://www.youtube.com/watch?v=${videoId}`;
            logger.log(`[yt-dlp] 執行命令: ${cmd}`);
            exec(cmd, (error: Error, stdout: string, stderr: string) => {
                logger.log(`[yt-dlp] stdout: ${stdout}`);
                if (!stdout.includes('https://')) {
                    resolve('');
                    return;
                }
                resolve(stdout);
            });
        });
    };

    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
        logger.log(`建立 ${path.dirname(dest)}`);
    }

    return new Promise(async (resolve, reject) => {
        try {
            const videoUrl = await getDownloadLink(videoId);
            if (!videoUrl) {
                throw new Error(`無法取得 videoUrl`);
            }
            logger.log(`取得 videoUrl ${videoUrl}`);
            await downloadFileFromUrl(videoUrl, dest).catch((error: Error) => {
                logger.error(`下載失敗: ${error.message}`);
                throw error;
            });
            logger.log(`下載完成 ${dest}`);

            resolve([null, true]);
        } catch (error: any) {
            logger.error(`下載失敗: ${error.message}`);
            resolve([error as Error, null]);
        }
    });
};
