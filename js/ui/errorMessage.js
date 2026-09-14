export function showError(container, message) {
  container.textContent = message;
  container.hidden = false;
}

export function clearError(container) {
  container.textContent = "";
  container.hidden = true;
}
