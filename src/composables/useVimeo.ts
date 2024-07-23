import { importModule, downloadFileFromUrl } from '../_func';
import { useLogger } from './useLogger';

type TUseVimeo = {
    videoId: string;
    dest: string;
    downloadBtnSelector?: string;
    debug?: boolean;
};

export const useVimeo = async ({
    videoId,
    dest,
    downloadBtnSelector,
    debug = false,
}: TUseVimeo): Promise<void> => {
    const logger = useLogger(debug);
    logger.log(`Downloading video: ${videoId} to: ${dest}`);

    const url = `https://vimeo.com/${videoId}`;

    const fs: any = await importModule('fs');
    const path: any = await importModule('path');
    const axios: any = await importModule('axios');
    const puppeteer: any = await importModule('puppeteer');

    const getDownloadConfig = async (url: string): Promise<string> => {
        const res = await axios.get(url, {
            responseType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        const data: any[] = Array.from(res.data?.files || []);
        const item = data[data.length - 1];
        const videoUrl = item.download_url;
        return videoUrl;
    };

    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
        logger.log(`建立 ${path.dirname(dest)}`);
    }

    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1920,
                height: 1080,
            },
        });
        logger.log(`啟動 puppeteer`);

        const page = await browser.newPage();
        // await page.setUserAgent(`'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'`); // prettier-ignore
        logger.log(`開新分頁`);

        await page.setRequestInterception(true);
        page.on('request', async (request: any) => {
            const url = request.url();
            if (url.indexOf('action=load_download_config') > -1) {
                logger.log(`攔截下載請求 ${url}`);
                const videoUrl = await getDownloadConfig(url);
                logger.log(`正在開始下載 ${videoUrl}`);
                await downloadFileFromUrl(videoUrl, dest);
                logger.log(`下載完成 ${dest}`);

                await browser.close();
                logger.log(`關閉 puppeteer`);

                resolve();
                return;
            }
            request.continue();
        });

        await page.goto(url, {
            waitUntil: 'networkidle0',
        });
        logger.log(`前往 ${url}`);

        const downloadBtn = downloadBtnSelector || '#main > div > main > div > div > div > div._1cCXb.sc-kEmuub.bmHlZQ > div._3oHHF.sc-bbkauy.fmFDPY > div > button:nth-child(1)'; // prettier-ignore
        await page.waitForSelector(downloadBtn);
        logger.log(`找到下載按鈕 ${downloadBtn}`);
        await page.click(downloadBtn);
        logger.log(`點擊下載按鈕`);
    });
};
