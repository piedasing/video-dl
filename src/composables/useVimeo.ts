import { importModule, downloadFileFromUrl } from '../_func';
import { useLogger } from './useLogger';

type TUseVimeo = {
    videoId: string;
    dest: string;
    downloadBtnSelector?: string;
    debug?: boolean;
};

export const useVimeo = async ({ videoId, dest, debug = false }: TUseVimeo): Promise<void> => {
    const logger = useLogger(debug);
    logger.log(`Downloading video: ${videoId} to: ${dest}`);

    const fs: any = await importModule('fs');
    const path: any = await importModule('path');
    const axios: any = await importModule('axios');

    const getViewer = async (): Promise<string> => {
        const res = await axios.get('https://vimeo.com/_next/viewer', {
            responseType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        const { jwt } = res.data;
        return jwt || '';
    };

    const getDownloadLink = async (videoId = '', accessToken = ''): Promise<string> => {
        const res = await axios.get(`https://api.vimeo.com/videos/${videoId}?&fields=download`, {
            responseType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `jwt ${accessToken}`,
            },
        });
        const { download = [] } = res.data;
        const config = download[0] || null;

        return config?.link || '';
    };

    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
        logger.log(`建立 ${path.dirname(dest)}`);
    }

    return new Promise(async (resolve, reject) => {
        const jwt = await getViewer();
        logger.log(`取得 jwt ${jwt}`);
        const videoUrl = await getDownloadLink(videoId, jwt);
        logger.log(`取得 videoUrl ${videoUrl}`);
        await downloadFileFromUrl(videoUrl, dest);
        logger.log(`下載完成 ${dest}`);

        resolve();
        return;
    });
};
