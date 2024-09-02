import { useVimeo } from './src/library';

(() => {
    const videoId = '406773715';

    useVimeo({
        videoId,
        dest: `D:\\projects\\coder\\@pieda\\video-dl\\output\\vimeo-${videoId}.mp4`,
        debug: true,
    });
})();
