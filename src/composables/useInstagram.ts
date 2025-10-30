import { useLogger } from './useLogger';
import { useYtdlp } from './useYtdlp';

type TUseInstagram = {
    debug?: boolean;
    ytdlpPath: string;
    videoId: string;
    dest: string;
    tempDir: string;
    ffmpegConfig: {
        ffmpegPath: string;
        ffmpegProbePath: string;
        ffmpegPlayPath: string;
    };
};

export const useInstagram = async ({
    debug = false,
    ytdlpPath,
    videoId,
    dest,
    tempDir,
    ffmpegConfig,
}: TUseInstagram): Promise<[Error | null, boolean | null]> => {
    const logger = useLogger(debug);
    logger.log(`Downloading video: ${videoId} to: ${dest}`);

    const videoUrl = `https://www.instagram.com/reel/${videoId}/`;
    return useYtdlp({
        debug,
        ytdlpPath,
        videoUrl,
        dest,
        tempDir,
        ffmpegConfig,
    });
};
