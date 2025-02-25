export const importModule = (moduleName: string) => {
    return new Promise((resolve, reject) => {
        import(moduleName).then((loadedModule) => resolve(loadedModule.default)).catch(reject);
    });
};

export const downloadFileFromUrl = async (
    url: string,
    filename: string,
    headers?: any,
): Promise<void> => {
    const fs: any = await importModule('fs');
    const axios: any = await importModule('axios');
    console.log(`Downloading ${url} to ${filename}`);

    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                responseType: 'stream',
                headers,
            })
            .then((res: any) => {
                const stream = res.data;
                const file = fs.createWriteStream(filename);
                stream.pipe(file);
                // stream.on('data', (data: any) => {
                //     console.log(data);
                // });
                file.on('finish', function () {
                    // console.log('finished');
                    file.close(() => {
                        resolve();
                    });
                });
            })
            .catch(reject);
    });
};
