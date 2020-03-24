import analyze from 'rgbaster'

export const dominantColor = (img) => {
  const result = analyze(img, {
    ignore: ["rgb(255,255,255)", "rgb(0,0,0)"]
  });
  // result.then((v) => {
  //   console.log('v', v[0])
  //   return v[0]
  // });
  return result
}