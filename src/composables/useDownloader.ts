import { useYoutube } from './useYoutube';
import { useFacebook } from './useFacebook';
import { useVimeo } from './useVimeo';

type TUseDownloader = {
    type: 'youtube' | 'facebook' | 'vimeo';
};

type TUseDownloaderResponse = typeof useYoutube | typeof useFacebook | typeof useVimeo;

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
        default: {
            throw new Error(`Invalid video type: ${type}`);
        }
    }
};
