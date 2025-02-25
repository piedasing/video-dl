import { useYoutube } from './useYoutube';
import { useFacebook } from './useFacebook';
import { useVimeo } from './useVimeo';
import { useInstagram } from './useInstagram';
import { useTiktok } from './useTiktok';

type TUseDownloader = {
    type:
        | 'youtube'
        | 'facebook'
        | 'vimeo'
        | 'instagram'
        | 'yt-short'
        | 'fb-reel'
        | 'ig'
        | 'ig-reel'
        | 'tiktok'
        | 'tiktok-reel';
};

type TUseDownloaderResponse =
    | typeof useYoutube
    | typeof useFacebook
    | typeof useVimeo
    | typeof useInstagram
    | typeof useTiktok;

export const useDownloader = ({ type }: TUseDownloader): TUseDownloaderResponse => {
    switch (type) {
        case 'youtube':
        case 'yt-short': {
            return useYoutube;
        }
        case 'facebook':
        case 'fb-reel': {
            return useFacebook;
        }
        case 'vimeo': {
            return useVimeo;
        }
        case 'instagram':
        case 'ig':
        case 'ig-reel': {
            return useInstagram;
        }
        case 'tiktok':
        case 'tiktok-reel': {
            return useTiktok;
        }
        default: {
            throw new Error(`Invalid video type: ${type}`);
        }
    }
};
