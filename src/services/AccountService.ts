import { err, ok, Result } from "neverthrow";
import { AxiosError, AxiosResponse } from "axios";
import apiClient from "../apiClient/apiClient";
import {
  ApiPaginateResponse,
  ApiResponse,
} from "@/models/ResponseModel";
import {
  Account,
  EditableAccount,
  ModerationAccount,
} from "@/models/AccountModel";
import { SingleIDObject } from "@/models/SingleIDObject";

export type AccountResponse = Result<
  ApiPaginateResponse<Account>,
  object
>;

export type OneAccountResponse = Result<
  ApiResponse<Account[]>,
  object
>;
export type AccountPResponse = Result<ApiResponse<boolean>, object>;
export type VirtualBillResponse = Result<
  ApiResponse<SingleIDObject>,
  object
>;

export interface AccountService {
  getAccounts(
    platformId: string,
    page: number,
    filterQuery?: string
  ): Promise<AccountResponse>;

  createAccount(account: any): Promise<AccountPResponse>;

  searchAccount(searchText?: string): Promise<OneAccountResponse>;

  getPlatformBill(
    platformID: string,
    currency: string
  ): Promise<VirtualBillResponse>;

  transferMoney(
    platformID: string,
    depositID: string,
    amount: number
  ): Promise<AccountPResponse>;

  transferMoneyToAccount(
    accountID: string,
    depositID: string,
    amount: number
  ): Promise<AccountPResponse>;

  editAccount(
    account: EditableAccount,
    accountID: string
  ): Promise<AccountPResponse>;
}

export class AccountRest implements AccountService {
  async getAccounts(
    platformId: string,
    page: number,
    filterQuery?: string
  ): Promise<AccountResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/platform/account/platform/${platformId}?page=${page}${
          !!filterQuery ? `&${filterQuery}` : ""
        }`
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

  async searchAccount(
    searchText?: string
  ): Promise<OneAccountResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/platform/account/search/list${
          !!searchText ? `?search=${searchText}` : ""
        }`
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

  async createAccount(account: any): Promise<AccountPResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/client/platform/account",
        account
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
  async editAccount(
    account: EditableAccount,
    accountID: string
  ): Promise<AccountPResponse> {
    try {
      const response: AxiosResponse = await apiClient.patch(
        `/api/client/platform/account/${accountID}/edit`,
        account
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

  async getPlatformBill(
    platformID: string,
    currency: string
  ): Promise<VirtualBillResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        `/api/client/virtual/bill/platforms/${platformID}`,
        {
          currency: currency,
        }
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

  async transferMoney(
    platformID: string,
    depositID: string,
    amount: number
  ): Promise<AccountPResponse> {
    try {
      const response: AxiosResponse = await apiClient.patch(
        `/api/client/virtual/bill/transfer/manual/${depositID}/in/${platformID}`,
        {
          amount: amount,
        }
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

  async transferMoneyToAccount(
    accountID: string,
    depositID: string,
    amount: number
  ): Promise<AccountPResponse> {
    try {
      const response: AxiosResponse = await apiClient.patch(
        `/api/client/virtual/bill/transfer/${depositID}/in/${accountID}`,
        {
          amount: amount,
        }
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
