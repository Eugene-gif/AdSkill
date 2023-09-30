import { QTableProps } from "quasar";
import { Project } from "@/models/ProjectModel";
import { Deposit } from "@/models/UserModel";
import { SingleIDObject } from "@/models/SingleIDObject";
import { Attachment, AttachmentWithType } from "@/models/CommonModel";

export interface Account {
  name: string;
  balance: number;
  access: string;
  accountStatus: { id: string; status: string };
  attachments: Array<Attachment>;
  client: SingleIDObject;
  fanPage: { id: string; url?: string };
  id: string;
  pixel: string;
  project: Project;
  platform: {
    id: string;
    name?: string;
    avatar: SingleIDObject;
  };
  text: string;
  url: string;
  createdAt: string;
  virtualBills?: Array<Deposit>;
}

export interface ModerationAccount {
  comment: string;
  createdAt: string;
  id: string;
  status: string;
  updatedAt: string;
  name: string;
  balance: number;
  access: string;
  accountStatus: { id: string; status: string };
  attachments: Array<Attachment>;
  client: SingleIDObject;
  fanPage: { id: string; url?: string };
  pixel: string;
  project: Project;
  platform: {
    id: string;
    name?: string;
    avatar: SingleIDObject;
  };
  text: string;
  url: string;
  virtualBills?: Array<Deposit>;
}

export interface AccountCreate {
  name: string;
  fanPage: { url: string };
  pixel: string;
  url: string;
  text: string;
  access: string;
  attachments: Array<Attachment>;
  project: SingleIDObject;
  platform: SingleIDObject;
}
export interface EditableAccount {
  name: string;
  fanPage: { url: string };
  pixel: string;
  url: string;
  text: string;
  attachments: Array<Attachment>;
  platform: SingleIDObject;
}

// Account columns
export const AccountColumns: QTableProps["columns"] = [
  {
    name: "account-name",
    required: true,
    label: "Account",
    align: "left",
    field: (row: any) => row.name,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: "account-balance",
    align: "left",
    label: "Balance",
    field: (row: any) => row,
    sortable: true,
  },
  {
    name: "spend",
    align: "left",
    label: "Spend",
    field: (row: any) => row.balance ?? 0,
    sortable: true,
  },
  {
    name: "left",
    align: "left",
    label: "Left",
    field: (row: any) => row.balance ?? 0,
  },
  {
    name: "account-status",
    align: "center",
    label: "Status",
    field: (row: any) => row.accountStatus ?? 0,
  },
  {
    name: "details",
    align: "center",
    label: "Details",
    field: "details",
  },
];
