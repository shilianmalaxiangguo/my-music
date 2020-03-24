let getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const shuffle = (arr) => {
  let _arr = arr.slice(0) // 缓存arr，而不直接修改arr
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i);
    [_arr[i], _arr[j]] = [_arr[j], arr[i]]
  }
  return _arr
}