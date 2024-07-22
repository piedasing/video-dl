# @pieda/video-dl

```bash
npm install @pieda/video-dl
```

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
