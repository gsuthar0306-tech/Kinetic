import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

let refreshPromise: Promise<LoginResponse> | null = null;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response?.status !== 401 ||
      error.config?.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    const savedSession = sessionStorage.getItem("kinetic_auth_session");

    if (!savedSession) {
      return Promise.reject(error);
    }

    const session = JSON.parse(savedSession);

    if (!session.refreshToken) {
      return Promise.reject(error);
    }
    if (!refreshPromise) {
      refreshPromise = refreshUser(session.refreshToken);
    }
    try {
      const response = await refreshPromise;
      const newSession = {
        ...session,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };

      localStorage.setItem("kinetic_auth_session", JSON.stringify(newSession));

      error.config.headers.Authorization = `Bearer ${response.accessToken}`;
      return AuthApi(error.config);
    } catch (refreshError) {
      localStorage.removeItem("kinetic_auth_session");
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

api.interceptors.request.use((config) => {
  const session = sessionStorage.getItem("kinetic-session");

  if (session) {
    const parsedSession = JSON.parse(session);

    console.log("Session:", parsedSession);
    console.log("Token:", parsedSession.token);

    if (parsedSession.token) {
      config.headers.Authorization = `Bearer ${parsedSession.token}`;
    }
  }

  return config;
});

export default api;
async function refreshUser(refreshToken: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/refresh", {
    refreshToken,
  });
  return response.data;
}
function AuthApi(config: any): any {
  return api(config);
}
