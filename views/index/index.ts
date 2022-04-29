/**
 * Frontend code is here.
 */

// Style.
import './index.css'

const contentText = document.querySelector('#content-text') as HTMLElement

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
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      contentText.textContent += content
      resolve()
    }, 1000)
  })
}
