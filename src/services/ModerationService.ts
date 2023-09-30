import { err, ok, Result } from "neverthrow";
import { AxiosError, AxiosResponse } from "axios";
import apiClient from "../apiClient/apiClient";
import { ApiPaginateResponse } from "@/models/ResponseModel";
import { ModerationAccount } from "@/models/AccountModel";

export type ModerationResponse = Result<
  ApiPaginateResponse<ModerationAccount>,
  object
>;

export interface ModerationService {
  get(): Promise<ModerationResponse>;
  read(id: string): Promise<ModerationResponse>;
  update(id: string): Promise<ModerationResponse>;
}

export class ModerationService implements ModerationService {
  async get(): Promise<ModerationResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        "/api/client/platform/account"
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

  async read(id: string): Promise<ModerationResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/moderation/${id}`
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

  async update(id: string): Promise<ModerationResponse> {
    try {
      const response: AxiosResponse = await apiClient.patch(
        `/api/client/moderation/${id}`
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
