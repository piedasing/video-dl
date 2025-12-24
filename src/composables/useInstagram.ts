import { useLogger } from './useLogger';
import { useYtdlp } from './useYtdlp';

type TUseInstagram = {
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

    const cmdArr = [
        `${ytdlpPath}`,
        '-f mergeall', 
        '--audio-multistreams',
        '--video-multistreams',
        '--js-runtimes node',
        `${videoUrl}`,
        '--downloader ffmpeg',
        `-o "${tempDir}/%(id)s.%(ext)s"`,
        '--merge-output-format mp4',
        ffmpegConfig.ffmpegDir ? `--ffmpeg-location "${ffmpegConfig.ffmpegDir}"` : '',
    ];

    return useYtdlp({
        debug,
        command: cmdArr.join(' '),
        dest,
        tempDir,
        ffmpegConfig,
    });
};
