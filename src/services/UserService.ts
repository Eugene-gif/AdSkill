import { err, ok, Result } from "neverthrow";
import { Deposit, User } from "@/models/UserModel";
import { AxiosResponse } from "axios";
import apiClient from "../apiClient/apiClient";
import { AxiosError } from "axios";

export interface UserService {
  get(): Promise<UserData>;
}

export type UserData = Result<User, object>;
export type CurrencyData = Result<Array<Deposit>, object>;

export class UserRest implements UserService {
  async get(): Promise<UserData> {
    const response: AxiosResponse = await apiClient.get("/api/self");

    const res = await response.data;

    if (response.status === 400) return err(res);

    return ok(await res.result);
  }

  async put(UserPersonalInfo: any): Promise<any> {
    const response: AxiosResponse = await apiClient.put(
      "/api/self",
      UserPersonalInfo
    );

    const res = await response.data;

    if (response.status === 400) return res;

    return res;
  }

  async getWallets(): Promise<CurrencyData> {
    try {
      const response: AxiosResponse = await apiClient.get(
        "/api/client/virtual/bill/deposit"
      );

      const res = response.data;

      return ok(await res.result);
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
