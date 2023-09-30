import { err, ok, Result } from "neverthrow";
import { AxiosError, AxiosResponse } from "axios";
import apiClient from "../apiClient/apiClient";
import {
  ApiPaginateResponse,
  ApiResponse,
} from "@/models/ResponseModel";
import { Platform } from "@/models/PlatformModel";
import { Deposit } from "@/models/UserModel";

export type PlatformResponse = Result<
  ApiResponse<Platform[]>,
  object
>;
export type DepositResponse = Result<
  ApiPaginateResponse<Deposit>,
  object
>;
export type ProjectCreateResponse = Result<
  ApiResponse<boolean>,
  object
>;
export type SingleProjectResponse = Result<
  ApiResponse<Platform>,
  object
>;

export interface PlatformService {
  get(): Promise<PlatformResponse>;

  read(id: string): Promise<SingleProjectResponse>;

  getBills(): Promise<DepositResponse>;

  getBill(platformID: string): Promise<DepositResponse>;
}

export class PlatformRest implements PlatformService {
  async get(): Promise<PlatformResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        "/api/client/platform?perPage=1000"
      );

      const res = response.data;

      return ok(await res);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }

  async read(id: string): Promise<SingleProjectResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/platform/${id}`
      );

      const res = response.data;

      return ok(await res);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }

  async getBills(): Promise<DepositResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/virtual/bill/platforms?perPage=1000`
      );

      const res = response.data;

      return ok(await res);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }

  async getBill(platformID: string): Promise<DepositResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/virtual/bill/platform/${platformID}`
      );

      const res = response.data;

      return ok(await res);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }
}
