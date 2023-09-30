import { Account } from "@/models/AccountModel";

export interface Moderation {
  id: string;
  status: string;
  updatedAt: string;
  comment: string | null;
  account: Account;
}
