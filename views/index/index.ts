/**
 * Frontend code is here.
 */

import './index.styl'

;(async () => {
  await setContent('TypeScript ')
  await setContent('is ')
  await setContent('Awesome!')
})()

/**
 * Set content of #content-text.
 *
 * @param {string} [content='']
 * @returns
 */
function setContent (content: string = '') {
  const contentText = document.querySelector('#content-text') as HTMLElement
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      contentText.textContent += content
      resolve()
    }, 1000)
  })
}
