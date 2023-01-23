export class SectionNavigation extends window.HTMLElement {
  connectedCallback() {
    this.navDropdown()
  }

  navDropdown() {
    this.querySelector('[class$="SectionNavigation-select"]').onchange =
      function () {
        window.location.replace(this.options[this.selectedIndex].value)
      }
  }
}
