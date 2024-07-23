export const useLogger = (debug = false) => {
    return {
        log: (...args: any[]) => {
            if (debug) {
                console.log(...args);
            }
        },
        error: (...args: any[]) => {
            if (debug) {
                console.error(...args);
            }
        },
    };
};
