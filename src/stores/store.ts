import { defineStore } from "pinia";
import router from "../router/router";
import {
  AuthLoginResponse,
  AuthLoginService,
  SuccessResponse,
} from "@/services/AuthService";
import { Result } from "neverthrow";
import { UserData, UserRest } from "@/services/UserService";
import { Deposit, User } from "@/models/UserModel";
import { ApiResponse } from "@/models/ResponseModel";

const authService = new AuthLoginService();

let token: string | null = localStorage.getItem("accessToken");
let profile: User | null = JSON.parse(
  localStorage.getItem("profile") || "{}"
);
let isAuthenticated: boolean = !!token;

interface AuthStoreState {
  isAuthenticated: boolean;
  token: string | null;
  profile: User | null;
  currencies: Array<Deposit> | null;
}

export const useStore = defineStore("main", {
  state: (): AuthStoreState => ({
    isAuthenticated: isAuthenticated,
    token: token!,
    profile: profile!,
    currencies: [],
  }),
  getters: {
    isAuthenticate(state) {
      return state.isAuthenticated;
    },
    userProfile(state) {
      return state.profile;
    },
  },
  actions: {
    async login(
      email: string,
      password: string | number
    ): Promise<any> {
      const response: Result<
        ApiResponse<AuthLoginResponse>,
        object
      > = await authService.login(email, password);

      if (response.isErr()) {
        return response.error;
      }

      const res: ApiResponse<AuthLoginResponse> = response.value;

      this.isAuthenticated = true;
      this.token = res.result.accessToken;
      localStorage.setItem("accessToken", res.result.accessToken);
      localStorage.setItem("refreshToken", res.result.refreshToken);
      await this.getProfile();

      router.push("/");
    },
    async register(email: string, password: string | number) {
      const response: SuccessResponse = await authService.register(
        email,
        password
      );

      if (response.isErr()) {
        const error: object = response.error;
        return error;
      }

      await this.login(email, password);
    },
    logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("profile");
      this.profile = null;
      this.token = null;
      this.isAuthenticated = false;
      router.push("/auth/login");
    },
    async getProfile(): Promise<void> {
      const userService = new UserRest();
      const response: UserData = await userService.get();

      if (response.isErr()) return;

      await this.setProfile(response.value);
    },
    setProfile(payload: User): void {
      this.profile = payload;
      localStorage.setItem("profile", JSON.stringify(payload));
    },
    setCurrencies(currencies: Array<Deposit>) {
      this.currencies = currencies;
    },
  },
});
