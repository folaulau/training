const AUDIO_READY_STATE = {
  HAVE_NOTHING: 0, // No information is available about the media resource.
  HAVE_METADATA: 1, // Enough of the media resource has been retrieved that the metadata attributes are initialized. Seeking will no longer raise an exception.
  HAVE_CURRENT_DATA: 2, // Data is available for the current playback position, but not enough to actually play more than one frame.
  HAVE_FUTURE_DATA: 3, // Data for the current playback position as well as for at least a little bit of time into the future is available (in other words, at least two frames of video, for example).
  HAVE_ENOUGH_DATA: 4,
}

export const events = {
  play: 'AudioPlayer:play',
  pause: 'AudioPlayer:pause',
}

export class AudioPlayer extends window.HTMLElement {
  set playing(bool) {
    bool ? this.setAttribute('playing', '') : this.removeAttribute('playing')
  }

  get playing() {
    return this.getAttribute('playing')
  }

  connectedCallback() {
    this.audioElement = this.querySelector('audio')
    this.durationElement = this.querySelector('[data-duration]')
    this.minutesAbbreviation = this.getAttribute('data-minutes-abbreviation')
    this.hoursAbbreviation = this.getAttribute('data-hours-abbreviation')
    this.addEventListener('click', this)
    this.audioElement.addEventListener('play', this)
    this.audioElement.addEventListener('pause', this)
    this.audioElement.addEventListener('loadedmetadata', this)
    document.addEventListener(events.play, this)
    this.render()
  }

  emit(event, detail = {}) {
    const customEvent = new window.CustomEvent(event, {
      bubbles: true,
      detail,
    })
    this.dispatchEvent(customEvent)
  }

  handleClick(event) {
    if (
      event.target.matches('[data-click="playPause"]') ||
      event.target.closest('[data-click="playPause"]')
    ) {
      this.playPause()
    }
  }

  handleEvent(event) {
    if (event.type === 'click') {
      this.handleClick(event)
      return
    }

    if (event.type === 'loadedmetadata') {
      this.render()
      return
    }

    if (event.type === events.play && event.target !== this) {
      this.pause()
      return
    }

    if (['play', 'pause'].includes(event.type)) {
      this.playing = !event.target.paused
    }
  }

  playPause() {
    if (this.audioElement.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  play() {
    this.emit(events.play)
    this.audioElement.play()
  }

  pause() {
    this.emit(events.pause)
    this.audioElement.pause()
  }

  render() {
    if (this.durationElement) {
      this.durationElement.innerText = this.getFormatedDuration()
    }
  }

  getFormatedDuration() {
    if (this.audioElement.readyState < AUDIO_READY_STATE.HAVE_METADATA) return

    const parts = []
    const hours = Math.floor(this.audioElement.duration / 3600)
    const minutes = Math.floor((this.audioElement.duration - hours * 3600) / 60)

    if (hours) {
      parts.push(`${hours} ${this.hoursAbbreviation}`)
    }

    if (minutes) {
      parts.push(`${minutes} ${this.minutesAbbreviation}`)
    }

    return parts.join()
  }
}
