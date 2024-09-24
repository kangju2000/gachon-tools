import postcssRemToPx from '@thedutchcoder/postcss-rem-to-px'
import autoprefixer from 'autoprefixer'
import postcssPrefixSelector from 'postcss-prefix-selector'
import tailwindcss from 'tailwindcss'

/**
 * Transforms a CSS selector based on a given prefix.
 * @param {string} prefix - The prefix to apply to the selector.
 * @param {string} selector - The original CSS selector.
 * @param {string} prefixedSelector - The CSS selector with the prefix applied.
 * @returns {string} The transformed CSS selector.
 */
function transformSelector(prefix, selector, prefixedSelector) {
  if ([':root', ':host', 'html', 'body'].includes(selector)) {
    return ':host'
  }
  if (['[data-theme]', '[data-theme=light]', '[data-theme=dark]'].includes(selector)) {
    return `:host ${selector}`
  }
  return prefixedSelector
}

const postcssConfig = {
  plugins: [
    tailwindcss(),
    postcssPrefixSelector({
      prefix: '#gt-app',
      transform: transformSelector,
    }),
    postcssRemToPx(),
    autoprefixer(),
  ],
}

export default postcssConfig
