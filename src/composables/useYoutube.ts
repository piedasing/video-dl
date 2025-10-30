import { useLogger } from './useLogger';
import { useYtdlp } from './useYtdlp';

type TUseYoutube = {
    ytdlpPath: string;
    videoId: string;
    dest: string;
    debug?: boolean;
    tempDir: string;
    ffmpegConfig: {
        ffmpegPath: string;
        ffmpegProbePath: string;
        ffmpegPlayPath: string;
    };
};

export const useYoutube = async ({
    debug = false,
    ytdlpPath,
    videoId,
    dest,
    tempDir,
    ffmpegConfig,
}: TUseYoutube): Promise<[Error | null, boolean | null]> => {
    const logger = useLogger(debug);
    logger.log(`Downloading video: ${videoId} to: ${dest}`);

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return useYtdlp({
        debug,
        ytdlpPath,
        videoUrl,
        dest,
        tempDir,
        ffmpegConfig,
    });
};
