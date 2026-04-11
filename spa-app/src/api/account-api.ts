const BaseUrl = "https://localhost:5001/api";

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BaseUrl}/login?useCookies=true`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res
};
export const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const res = await fetch(`${BaseUrl}/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, firstName, lastName }),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
};
export const checkAuth = async () => {
    const res = await fetch(`${BaseUrl}/account/auth-status`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
};
export const logout = async () => {
    await fetch(`${BaseUrl}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
};
export const getCurrentUser = async () => {
    const res  =await fetch(`${BaseUrl}/account/user-info`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
     if (!res.ok) throw new Error("Failed to fetch user");
   return res.json();
};