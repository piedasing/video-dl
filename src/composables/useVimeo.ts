import { useLogger } from './useLogger';
import { useYtdlp } from './useYtdlp';

type TUseVimeo = {
    debug?: boolean;
    ytdlpPath: string;
    videoId: string;
    dest: string;
    tempDir: string;
    ffmpegConfig: {
        ffmpegDir: string;
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

    const cmdArr = [
        `${ytdlpPath}`,
        '-f "bv*[vcodec^=avc1][acodec^=mp4a][height<=1080]/ba/b"',
        '--js-runtimes node',
        `${videoUrl}`,
        `-o "${tempDir}/%(id)s.%(ext)s"`,
    ];

    return useYtdlp({
        debug,
        command: cmdArr.join(' '),
        dest,
        tempDir,
        ffmpegConfig,
    });
};
