import axios from "axios";

interface Credentials {
  email: string;
  password: string;
}

interface AuthResponse {
  message?: string;
  token?: string;
  userId?: string;
  error?: string;
}

export async function login(credentials: Credentials): Promise<AuthResponse> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      { email: credentials.email, password: credentials.password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Logout failed");
  }
}

export const register = async ({
  name,
  email,
  password,
  location,
}: {
  name: string;
  email: string;
  password: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      { name, email, password, location }, 
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Register response:", response.data); 
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Registration failed"
    );
  }
};
