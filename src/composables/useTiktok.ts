import { importModule, downloadFileFromUrl } from '../_func';
import { useLogger } from './useLogger';

type TUseTiktok = {
    videoLink: string;
    dest: string;
    debug?: boolean;
    headless?: boolean;
};

export const useTiktok = async ({
    videoLink,
    dest,
    debug = false,
    headless = true,
}: TUseTiktok): Promise<[Error | null, boolean | null]> => {
    try {
        const logger = useLogger(debug);
        logger.log(`Downloading video: ${videoLink} to: ${dest}`);

        const url = videoLink;

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
        // await page.setUserAgent(
        //     `'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'`,
        // );
        logger.log(`開新分頁`);

        await page.goto(url, {
            // waitUntil: 'networkidle0',
        });
        logger.log(`前往 ${url}`);

        await page.waitForSelector('video');
        logger.log(`找到 video 元素`);

        const videoUrl = await page.$eval(
            'video source[src^="https://www.tiktok.com/aweme/v1/play/"]',
            (el: HTMLElement) => el.getAttribute('src'),
        );
        // const videoUrls = await page.evaluate(() => {
        //     return Array.from(document.querySelectorAll('video source')).map((el: any) => el.getAttribute('src'));
        // })
        // const videoUrl = videoUrls.find((url: string) => url.startsWith('https://www.tiktok.com/aweme/v1/play/'));
        logger.log(`取得 video url: ${videoUrl}`);

        await browser.close();
        logger.log(`關閉 puppeteer`);

        await downloadFileFromUrl(videoUrl, dest, {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Referer: 'https://www.tiktok.com/', // 設定 Referer
        });
        logger.log(`下載完成 ${videoUrl}`);

        return [null, true];
    } catch (error) {
        return [error as Error, null];
    }
};
