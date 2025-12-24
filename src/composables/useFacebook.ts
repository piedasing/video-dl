import { importModule, downloadFileFromUrl } from '../_func';
import { useLogger } from './useLogger';

type TUseFacebook = {
    videoId: string;
    dest: string;
    debug?: boolean;
    headless?: boolean;
};

export const useFacebook = async ({
    videoId,
    dest,
    debug = false,
    headless = true,
}: TUseFacebook): Promise<[Error | null, boolean | null]> => {
    try {
        const logger = useLogger(debug);
        logger.log(`Downloading video: ${videoId} to: ${dest}`);

        const url = `https://m.facebook.com/watch/?v=${videoId}`;

        const fs: any = await importModule('fs');
        const path: any = await importModule('path');
        const puppeteer: any = await importModule('puppeteer');

        if (!fs.existsSync(path.dirname(dest))) {
            fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
            logger.log(`建立 ${path.dirname(dest)}`);
        }

        const config: any = {};
        if (!headless) {
            config['headless'] = false;
        }
        const browser = await puppeteer.launch(config);
        logger.log(`啟動 puppeteer`);

        const page = await browser.newPage();
        await page.setUserAgent(
            `'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'`,
        );
        logger.log(`開新分頁`);
        logger.log(`前往 ${url}`);

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        await page.waitForSelector('video');

        logger.log(`找到 video 元素`);
        const videoUrl = await page.$eval('video', (el: HTMLElement) => el.getAttribute('src'));
        logger.log(`取得 video url: ${videoUrl}`);

        await browser.close();
        logger.log(`關閉 puppeteer`);

        await downloadFileFromUrl(videoUrl, dest);
        logger.log(`下載完成 ${videoUrl}`);

        return [null, true];
    } catch (error) {
        return [error as Error, null];
    }
};
