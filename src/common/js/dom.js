export const addClass = (el, className) => {
    if (hasClass(el, className)) return
    let newClass = el.className.split(' ')
    newClass.push(className)
    // 重新给el.className赋值，而不是在后面直接添加呢！
    el.className = newClass.join(' ')
}

export const hasClass = (el, className) => {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

export const getData = (el, name, val) => {
    // 定义的标签tag前缀
    const prefix = 'data-'
    name = prefix + name
    // 这个val是考虑以后会添加值，有就把值加上 set data-name="val"
    // 没有 就get 获取这个dom中的name
    return val ? el.setAttribute(name, val) : el.getAttribute(name)
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }

    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key
        }

    }

    return false
})()

export const prefixStyle = (style) => {
    if (vendor === false) {
        return false
    }
    if (vendor === 'standard') {
        return style
    }
    return `${vendor}${style.charAt(0).toUpperCase()}${style.substr(1)}`
}