export function validatePassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[^\s]{8,}$/;
  return regex.test(password);
}
