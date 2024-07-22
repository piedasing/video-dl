import { importModule } from '../_func';

type TUseFacebook = {
    videoId: string;
    dest: string;
    debug?: boolean;
};

export const useFacebook = async ({
    videoId,
    dest,
    debug = false,
}: TUseFacebook): Promise<void> => {
    const url = `https://m.facebook.com/watch/?v=${videoId}`;

    const fs: any = await importModule('fs');
    const path: any = await importModule('path');
    const axios: any = await importModule('axios');
    const puppeteer: any = await importModule('puppeteer');

    const downloadFileFromUrl = (url: string, filename: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            axios.get(url, { responseType: 'stream' }).then((res: any) => {
                const stream = res.data;
                const file = fs.createWriteStream(filename);
                stream.pipe(file);
                // stream.on("data", (data) => {
                //     console.log(data);
                // });
                file.on('finish', function () {
                    file.close(() => {
                        resolve();
                    });
                });
            });
        });
    };

    const _log = (...args: any[]) => {
        if (debug) {
            console.log(...args);
        }
    };

    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true }, 777);
        _log(`建立 ${path.dirname(dest)}`);
    }

    const browser = await puppeteer.launch();
    _log(`啟動 puppeteer`);

    const page = await browser.newPage();
    await page.setUserAgent(
        `'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'`,
    );
    _log(`開新分頁`);

    await page.goto(url, {
        waitUntil: 'networkidle0',
    });
    _log(`前往 ${url}`);

    await page.waitForSelector('video');
    _log(`找到 video 元素`);
    const videoUrl = await page.$eval('video', (el: HTMLElement) => el.getAttribute('src'));
    _log(`取得 video url: ${videoUrl}`);

    await browser.close();
    _log(`關閉 puppeteer`);

    await downloadFileFromUrl(videoUrl, dest);
    _log(`下載完成 ${videoUrl}`);
};
