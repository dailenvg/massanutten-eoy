/** Pin the body at the current scroll position while a modal is open (see body.vv-modal-open). */
export function lockBody(scrollY: number): void {
  document.body.classList.add("vv-modal-open");
  document.body.style.top = "-" + scrollY + "px";
}

export function unlockBody(scrollY: number): void {
  document.body.classList.remove("vv-modal-open");
  document.body.style.top = "";
  window.scrollTo(0, scrollY);
}
