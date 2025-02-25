# @pieda/video-dl

## 安裝

```bash
npm install @pieda/video-dl
```

## 使用

```js
import { useDownloader } from '@pieda/video-dl';

const ytdl = useDownloader({ type: 'youtube' });
await ytdl({
    videoType: 'youtube',
    videoId: '<videoId>',
    dest: '<path to download>',
    debug: false,
});
```

```js
import { useYoutube } from '@pieda/video-dl';

await useYoutube({
    videoId: '<videoId>',
    dest: '<path to download>',
    debug: false,
});
```
