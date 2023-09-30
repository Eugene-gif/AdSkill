import { err, ok, Result } from "neverthrow";
import { AxiosError, AxiosResponse } from "axios";
import apiClient from "../apiClient/apiClient";
import { ApiResponse, ErrorResponse } from "@/models/ResponseModel";

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = Result<
  ApiResponse<AuthLoginResponse>,
  ApiResponse<ErrorResponse> | { status: number }
>;

export type SuccessResponse = Result<
  ApiResponse<boolean>,
  ErrorResponse
>;

export interface AuthService {
  login(
    email: string,
    password: string | number
  ): Promise<LoginResponse>;

  register(
    email: string,
    password: string | number
  ): Promise<SuccessResponse>;

  verifyCode(email: string, code: number): Promise<SuccessResponse>;

  sendEmailCode(
    email: string,
    code: number
  ): Promise<SuccessResponse>;

  resendCode(email: string): Promise<SuccessResponse>;

  sendCode(email: string): Promise<SuccessResponse>;

  recoveryPassword(
    email: string,
    code: number,
    password: string
  ): Promise<SuccessResponse>;
}

export class AuthLoginService implements AuthService {
  public async login(
    email: string,
    password: string | number
  ): Promise<LoginResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      const res = response.data;

      return ok(await res);
    } catch (e: any | AxiosError) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err(e.response!.data);
    }
  }

  async register(
    email: string,
    password: string | number
  ): Promise<SuccessResponse> {
    try {
      const response = await apiClient.post(
        "/api/auth/registration",
        {
          email: email,
          password: password,
        }
      );

      const res = response.data;

      return ok(await res.result);
    } catch (e: any) {
      if (e instanceof AxiosError) return err(e.response!.data);

      return err(e.response!.data);
    }
  }

  async verifyCode(
    email: string,
    code: number
  ): Promise<SuccessResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/auth/verification",
        {
          email: email,
          verificationCode: code,
        }
      );

      const res = response.data;

      return ok(await res.result);
    } catch (e: any) {
      if (e instanceof AxiosError) return err(e.response!.data);

      return err({
        success: false,
        error: { message: e.response!.data },
      });
    }
  }

  async resendCode(email: string): Promise<SuccessResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/auth/verification/send-code",
        {
          email: email,
        }
      );

      const res = response.data;

      return ok(await res.result);
    } catch (e: any) {
      if (e instanceof AxiosError) return err(e.response!.data);

      return err({
        success: false,
        error: { message: e.response!.data },
      });
    }
  }

  async sendCode(email: string): Promise<SuccessResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/auth/recovery/send-code",
        {
          email: email,
        }
      );

      const res = response.data;

      return ok(await res);
    } catch (e: any) {
      if (e instanceof AxiosError) return err(e.response!.data);

      return err({
        success: false,
        error: { message: e.response!.data },
      });
    }
  }

  async sendEmailCode(
    email: string,
    code: number
  ): Promise<SuccessResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/auth/recovery/is-code-correct",
        {
          email: email,
          recoveryCode: code,
        }
      );

      const res = response.data;

      return ok(await res.result);
    } catch (e: any) {
      if (e instanceof AxiosError) return err(e.response!.data);

      return err({
        success: false,
        error: { message: e.response!.data },
      });
    }
  }

  async recoveryPassword(
    email: string,
    code: number,
    password: string
  ): Promise<SuccessResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/auth/recovery/password",
        {
          email,
          recoveryCode: code,
          password,
        }
      );

      const res = response.data;

      return ok(await res.result);
    } catch (e: any) {
      if (e instanceof AxiosError) return err(e.response!.data);

      return err({
        success: false,
        error: { message: e.response!.data },
      });
    }
  }
}
