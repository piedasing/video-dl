import { useLogger } from './useLogger';
import { useYtdlp } from './useYtdlp';

type TUseVimeo = {
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

export const useVimeo = async ({
    debug = false,
    ytdlpPath,
    videoId,
    dest,
    tempDir,
    ffmpegConfig,
}: TUseVimeo): Promise<[Error | null, boolean | null]> => {
    const logger = useLogger(debug);
    logger.log(`Downloading video: ${videoId} to: ${dest}`);

    const videoUrl = `https://vimeo.com/${videoId}`;

    return useYtdlp({
        debug,
        ytdlpPath,
        videoUrl,
        dest,
        tempDir,
        ffmpegConfig,
    });
};
