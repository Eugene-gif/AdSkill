import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Completer } from "@/plugins/Completer";

// тип ответа от метода рефреш токена
type RefreshData = {
  success: string;
  result: { accessToken: string; refreshToken: string };
};
// базовая урла
const baseURL: string = import.meta.env.VITE_API_URL;
// создание состояния axios
const apiClient: AxiosInstance = axios.create({
  baseURL: baseURL,
});

// Комплитер получения новых токенов
let refreshCompleter: Completer<AxiosResponse<RefreshData>> | null =
  null;

// Получение токенов из локального хранилища
const getLocalAccessToken = (): string | null =>
  localStorage.getItem("accessToken") || null;
const getLocalRefreshToken = (): string | null =>
  localStorage.getItem("refreshToken") || null;

// Функция получения нового токена
async function refreshTokenRequest(): Promise<
  AxiosResponse<RefreshData>
> {
  if (!!refreshCompleter) return refreshCompleter.promise;

  refreshCompleter = new Completer<AxiosResponse<RefreshData>>();

  const response = apiClient.post("/api/auth/refresh", {
    refreshToken: getLocalRefreshToken(),
  });

  refreshCompleter.complete!(response);

  return response;
}

// интерцептор для запроса
const handleReqInterceptors = (
  request: InternalAxiosRequestConfig
) => {
  const accessToken = getLocalAccessToken();

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }

  return request;
};

// интерцептор для ответа
const handleResInterceptors = async (
  error: any
): Promise<AxiosResponse> => {
  const originalConfig = error.config;
  if (error.response.status === 401) {
    try {
      const res = await refreshTokenRequest();
      const accessToken: string = res.data.result.accessToken;
      const refreshToken: string = res.data.result.refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      apiClient.defaults.headers["Authorization"] = accessToken;

      return apiClient(originalConfig);
    } catch (e) {}
  }

  throw error;
};

// добавление интерцепторов к состоянию axios при запросе
apiClient.interceptors.request.use((request) =>
  handleReqInterceptors(request)
);

// добавление интерцепторов к состоянию axios при ответе
apiClient.interceptors.response.use(null, (response) =>
  handleResInterceptors(response)
);

export default apiClient;
