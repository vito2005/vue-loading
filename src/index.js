import './style.css'
const createLoader = (el, binding) => {
  const findSize = (el) => {
    let height, width
    if (el.clientHeight) {
      height = el.clientHeight + 'px'
      width = el.clientWidth + 'px'
      el.style.position = 'relative'
    } else {
      height = getComputedStyle(el.parentElement).height
      width = getComputedStyle(el.parentElement).width
      el.parentElement.style.position = 'relative'
    }
    if (!parseInt(height)) {
      return findSize(el.parentElement)
    }
    return { height, width }
  }
  const box = document.createElement('div')
  const spinner = document.createElement('div')
  spinner.className = 'vue-loading'
  box.className = `vue-loading-wrapper ${binding.expression.replace('.', '-')}`
  box.style.height = findSize(el).height
  box.style.top = '0'
  box.style.width = findSize(el).width
  spinner.style.fontSize = parseInt(findSize(el).height) / 8 + 'px'
  box.appendChild(spinner)
  el.appendChild(box)
}
export default {
  inserted: function (el, binding) {
    const hasTimer = el.dataset.timer && JSON.parse(el.dataset.timer)
    if (binding.value && !hasTimer) {
      el.dataset.timer = setTimeout(createLoader(el, binding), 200)
    }
  },
  update (el, binding) {
    const hasSpinner = el.querySelector('.vue-loading-wrapper' + '.' + binding.expression.replace('.', '-'))
    const hasTimer = el.dataset.timer && JSON.parse(el.dataset.timer)
    if (!hasSpinner && binding.value && !hasTimer) {
      el.dataset.timer = setTimeout(createLoader(el, binding), 200)
    }
  },
  componentUpdated: function (el, binding) {
    const spinner = el.querySelector('.vue-loading-wrapper' + '.' + binding.expression.replace('.', '-'))
    if (!binding.value && el.dataset.timer) {
      clearTimeout(parseInt(el.dataset.timer))
      el.dataset.timer = null
    }
    if (!binding.value && spinner) {
      spinner.remove()
    }
  }
}
