import { importModule } from '../_func';

import { useLogger } from './useLogger';

type TUseYtdlp = {
    debug?: boolean;
    command: string;
    dest: string;
    tempDir: string;
    ffmpegConfig: {
        ffmpegDir: string;
        ffmpegPath: string;
        ffmpegProbePath: string;
        ffmpegPlayPath: string;
    };
};

export const useYtdlp = async ({
    debug = false,
    command,
    dest,
    tempDir,
    ffmpegConfig,
}: TUseYtdlp): Promise<[Error | null, boolean | null]> => {
    const logger = useLogger(debug);

    const fs: any = await importModule('fs');
    const path: any = await importModule('path');
    const { exec, execSync }: any = await importModule('child_process');

    const downloadFile = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            logger.log(`[yt-dlp] 執行命令: ${command}`);

            exec(command, (error: Error, stdout: string, stderr: string) => {
                logger.log(`[yt-dlp] stdout: ${stdout}`);
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };

    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
        logger.log(`建立 ${path.dirname(dest)}`);
    }

    return new Promise(async (resolve, reject) => {
        try {
            await downloadFile();

            let success = false;
            const files = fs.readdirSync(tempDir);
            for (const file of files) {
                const fullPath = path.join(tempDir, file);
                const cmd = `${ffmpegConfig.ffmpegProbePath} -v error -show_entries stream=codec_type -of csv=p=0 "${fullPath}"`;
                const info = execSync(cmd).toString('utf-8');
                const hasVideo = info.includes('video');
                const hasAudio = info.includes('audio');
                if (hasVideo && hasAudio) {
                    success = true;
                    fs.copyFileSync(fullPath, dest);
                    break;
                }
            }
            if (!success) {
                throw new Error('無法下載影音正常的影片');
            }
            logger.log(`下載完成 ${dest}`);

            resolve([null, true]);
        } catch (error: any) {
            logger.error(`下載失敗: ${error.message}`);
            resolve([error as Error, null]);
        }
    });
};
