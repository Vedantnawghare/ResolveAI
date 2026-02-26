export const registerUser = (email: string, password: string) => {
  const user = { email, password };
  localStorage.setItem("agriUser", JSON.stringify(user));
};

export const loginUser = (email: string, password: string) => {
  const stored = localStorage.getItem("agriUser");
  if (!stored) return false;

  const user = JSON.parse(stored);
  return user.email === email && user.password === password;
};

export const logoutUser = () => {
  localStorage.removeItem("agriUser");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("agriUser");
};