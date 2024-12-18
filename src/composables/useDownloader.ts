import { useYoutube } from './useYoutube';
import { useFacebook } from './useFacebook';
import { useVimeo } from './useVimeo';
import { useInstagram } from './useInstagram';

type TUseDownloader = {
    type: 'youtube' | 'facebook' | 'vimeo' | 'instagram';
};

type TUseDownloaderResponse =
    | typeof useYoutube
    | typeof useFacebook
    | typeof useVimeo
    | typeof useInstagram;

export const useDownloader = ({ type }: TUseDownloader): TUseDownloaderResponse => {
    switch (type) {
        case 'youtube': {
            return useYoutube;
        }
        case 'facebook': {
            return useFacebook;
        }
        case 'vimeo': {
            return useVimeo;
        }
        case 'instagram': {
            return useInstagram;
        }
        default: {
            throw new Error(`Invalid video type: ${type}`);
        }
    }
};
