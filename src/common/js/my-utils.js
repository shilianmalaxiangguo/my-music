export const Log = function (params) {
    if (typeof params === 'string') return console.log(`%c ${params.toString()}`, 'color:#fff;background:#2794eb', params)
    return console.log(`%c ${typeof params} - ${new Date}`, 'color:#fff;background:#2794eb', params)
}

export const logErr = (params) => {
    if (typeof params === 'string') return console.log(`%c ${params}`, 'color:#fff;background:#c32d2b', params)
    return console.log(`%c ${typeof params} - ${new Date}`, 'color:#fff;background:#c32d2b', params)
}

export const trim = (string) => {
    console.log('string.toString().replace(/(^\s*)|(\s*$)/g, "")', string.toString().replace(/(^\s*)|(\s*$)/g, ""))
    return string.toString().replace(/(^\s*)|(\s*$)/g, "");
} 