export const isEmpty = (v) => !v || !String(v).trim();

export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

export function validateLogin({ email, password }) {
  const errors = {};
  if (isEmpty(email)) errors.email = "Please fill in this field";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email address";

  if (isEmpty(password)) errors.password = "Please fill in this field";

  return errors;
}

export function validateRegister({ name, email, password, confirmPassword, roles }) {
  const errors = {};
  if (isEmpty(name)) errors.name = "Please fill in this field";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (isEmpty(email)) errors.email = "Please fill in this field";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email address";

  if (isEmpty(password)) errors.password = "Please fill in this field";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";

  if (isEmpty(confirmPassword)) errors.confirmPassword = "Please fill in this field";
  else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";

  if (roles && roles.filter((r) => r.trim()).length === 0) {
    errors.roles = "Add at least one role";
  }

  return errors;
}

export function mapServerErrors(errArray = []) {
  const mapped = {};
  for (const e of errArray) {
    mapped[e.field] = e.message;
  }
  return mapped;
}
