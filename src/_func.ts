export const importModule = (moduleName: string) => {
    return new Promise((resolve, reject) => {
        import(moduleName).then((loadedModule) => resolve(loadedModule.default)).catch(reject);
    });
};
