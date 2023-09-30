import { QTableProps } from "quasar";
import { SingleIDObject } from "@/models/SingleIDObject";
import { Attachment } from "@/models/CommonModel";

export interface PaymentModel {
  name: string;
  method: string;
  currency: {
    id: string;
    name?: string;
  };
  amount: number;
  pending?: string;
  entityMethodId: string;
  date: string;
  status: string;
  attachments: Array<Attachment>;
  bill: Bill;
}

interface Bill {
  id: string;
  date: string;
  isPayed: boolean;
  number: string;
}

export interface Company {
  id?: string;
  name: string;
  BIC: string;
  checkingAccount: string;
  taxNumber: string;
}

export interface Currency {
  id: string;
  name: string;
}

export interface Crypto {
  id: string;
  name: string;
  icon?: SingleIDObject;
  walletNumber: string;
}

export interface Card {
  id: string;
  numberHash: string;
  number: string;
}

// Account columns
export const PaymentColumns: QTableProps["columns"] = [
  {
    name: "payment-method",
    align: "left",
    label: "Payment Method",
    field: (row) => row.method ?? "Нет данных",
    sortable: true,
  },
  {
    name: "date",
    align: "left",
    label: "Date",
    field: (row) => row.createdAt ?? "Нет данных",
    sortable: true,
  },
  {
    name: "amount",
    align: "left",
    label: "Amount",
    field: (row) => row.amount ?? "Нет данных",
    sortable: true,
  },

  {
    name: "payment-name",
    align: "left",
    label: "Name",
    field: (row) => row.name ?? "Нет данных",
    sortable: true,
  },
  {
    name: "payment-status",
    align: "center",
    label: "Status",
    field: (row) => row.status ?? "Нет данных",
    sortable: true,
  },
  {
    name: "details",
    align: "center",
    label: "Details",
    field: "details",
  },
];
