import { err, ok, Result } from "neverthrow";
import { AxiosError, AxiosResponse } from "axios";
import apiClient from "../apiClient/apiClient";
import {
  ApiPaginateResponse,
  ApiResponse,
} from "@/models/ResponseModel";
import {
  Card,
  Company,
  Crypto,
  Currency,
  PaymentModel,
} from "@/models/PaymentModel";

export type CompanyResponse = Result<
  ApiPaginateResponse<Company>,
  object
>;
export type PaymentResponse = Result<
  ApiPaginateResponse<Array<PaymentModel>>,
  object
>;
export type PaymentNameResponse = Result<
  ApiResponse<Array<PaymentModel>>,
  object
>;
// Ответ на получение списка карт
export type CardResponse = Result<ApiPaginateResponse<Card>, object>;
// Ответ на созданную карту
export type CardCreateResponse = Result<ApiResponse<Card>, object>;
export type CurrencyResponse = Result<
  ApiResponse<Array<Currency>>,
  object
>;
export type CryptoResponse = Result<
  ApiPaginateResponse<Crypto>,
  object
>;
export type ProjectCreateResponse = Result<
  ApiResponse<boolean>,
  object
>;

export interface PaymentService {
  getCrypto(): Promise<CryptoResponse>;

  searchName(searchText: string): Promise<PaymentNameResponse>;

  createCrypto(walletNumber: string): Promise<ProjectCreateResponse>;

  getPayments(page: number, query?: string): Promise<PaymentResponse>;

  getCompanies(): Promise<CompanyResponse>;

  createCompany(newCompany: Company): Promise<CompanyResponse>;

  getCurrencies(): Promise<CurrencyResponse>;

  getCards(): Promise<CardResponse>;

  createPayment(
    paymentEntity: PaymentModel,
    companyID: string
  ): Promise<CompanyResponse>;

  createCard(
    number: string,
    date: string,
    cvc: string
  ): Promise<CardCreateResponse>;
}

// Project Service
export class PaymentRest implements PaymentService {
  async getCrypto(): Promise<CryptoResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        "/api/client/payment/method/crypto"
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

  async createCrypto(
    walletNumber: string
  ): Promise<ProjectCreateResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/client/payment/method/crypto/create",
        {
          walletNumber,
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

  async getPayments(
    page: number,
    query?: string
  ): Promise<PaymentResponse> {
    const response: AxiosResponse = await apiClient.get(
      `/api/client/payment?page=${page}${!!query ? `&${query}` : ""}`
    );
    try {
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

  async getCompanies(): Promise<CompanyResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        "/api/client/payment/method/company"
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

  async searchName(searchText: string): Promise<PaymentNameResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/payment/search/list${
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

  async createCompany(newCompany: Company): Promise<CompanyResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/client/payment/method/company/create",
        newCompany
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

  async createPayment(
    paymentEntity: PaymentModel,
    companyID: string
  ): Promise<CompanyResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        `/api/client/payment/type/${companyID}`,
        paymentEntity
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

  async getCurrencies(): Promise<CurrencyResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/payment/currency/read`
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

  async getCards(): Promise<CardResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        `/api/client/payment/method/card?perPage=1000`
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

  async createCard(
    number: string,
    date: string,
    cvc: string
  ): Promise<CardCreateResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        `/api/client/payment/method/card/create`,
        {
          number,
          date,
          cvc,
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
