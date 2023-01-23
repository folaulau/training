import { events as VideoPlayerEvents } from './VideoPlayer'

export class VideoPlaylistModule extends window.HTMLElement {
  get clipped() {
    return this.hasAttribute('data-clipped')
  }

  set clipped(bool) {
    bool
      ? this.setAttribute('data-clipped', '')
      : this.removeAttribute('data-clipped')
  }

  set overflowing(bool) {
    bool
      ? this.setAttribute('overflowing', '')
      : this.removeAttribute('overflowing')
  }

  get overflowing() {
    return this.getAttribute('overflowing')
  }

  get playlistItemsContainer() {
    return this.querySelector('[data-playlist-items]')
  }

  get fragmentUri() {
    return this.getAttribute('fragment-uri')
  }

  get fragmentParams() {
    return this.getAttribute('fragment-params')
  }

  connectedCallback() {
    this.playlistItems = [...this.querySelectorAll('.VideoPlaylistItem')]

    this.addEventListener(VideoPlayerEvents.ended, this)
    this.addEventListener('scroll', this, true)
    this.bindClickEvents()
    this.setScrollState()
  }

  handleEvent(event) {
    if (event.type === VideoPlayerEvents.ready) {
      event.target.play()
    }

    if (event.type === VideoPlayerEvents.ended) {
      const currentIndex = this.playlistItems.findIndex((item) => {
        if (item.getAttribute('is-current') !== null) {
          return item
        } else {
          return false
        }
      })

      if (currentIndex < this.playlistItems.length - 1) {
        this.loadPlaylistItem(this.playlistItems[currentIndex + 1])
      }
    }

    if (event.type === 'scroll') {
      this.setScrollState()
    }
  }

  bindClickEvents() {
    const toggleExpand = this.querySelector('[data-click="toggleExpand"]')
    if (toggleExpand) {
      toggleExpand.addEventListener('click', () => {
        this.clipped = false
      })
    }

    this.querySelectorAll('.VideoPlaylistItem').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()

        if (item.getAttribute('is-current') === null) {
          this.loadPlaylistItem(item)
        }
      })
    })

    this.querySelectorAll('button[data-scroll-backward]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!button.matches('[disabled]')) {
          this.playlistItemsContainer.scrollBy({
            top: this.playlistItemsContainer.clientHeight * -0.67,
            left: this.playlistItemsContainer.clientWidth * -0.67,
            behavior: 'smooth',
          })
        }
      })
    })

    this.querySelectorAll('button[data-scroll-forward]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!button.matches('[disabled]')) {
          this.playlistItemsContainer.scrollBy({
            top: this.playlistItemsContainer.clientHeight * 0.67,
            left: this.playlistItemsContainer.clientWidth * 0.67,
            behavior: 'smooth',
          })
        }
      })
    })
  }

  setScrollState() {
    const element = this.playlistItemsContainer
    const scrollStart = Math.max(element.scrollLeft, element.scrollTop)
    const scrollEnd = Math.max(
      element.scrollWidth - element.scrollLeft - element.clientWidth,
      element.scrollHeight - element.scrollTop - element.clientHeight
    )

    this.querySelectorAll('button[data-scroll-backward]').forEach((button) => {
      button.disabled = scrollStart === 0
    })

    this.querySelectorAll('button[data-scroll-forward]').forEach((button) => {
      button.disabled = scrollEnd === 0
    })
  }

  getVideoUri(contentId) {
    const searchParams = new window.URLSearchParams(this.fragmentParams)
    searchParams.append('_contentId', contentId)

    return `${this.fragmentUri}?${searchParams}`
  }

  loadPlaylistItem(playlistItem) {
    this.addEventListener(VideoPlayerEvents.ready, this)

    const template = playlistItem.querySelector('template')
    const newContent = template.content.cloneNode(true)
    const oldContent = this.querySelector('[data-video-player]')
    oldContent.parentElement.replaceChild(newContent, oldContent)

    this.setState(this.playlistItems.indexOf(playlistItem))
  }

  setState(index) {
    this.playlistItems.forEach((item, itemIndex) => {
      item.removeAttribute('is-current')

      if (index === itemIndex) {
        item.setAttribute('is-current', '')
      }
    })
  }
}
