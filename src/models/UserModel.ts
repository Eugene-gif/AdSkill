import { SingleIDObject } from "@/models/SingleIDObject";

export interface User {
  email: string;
  profile: {
    company: string;
    name: string;
    phoneNumber: string;
    avatar?: SingleIDObject;
  };
}

export interface Deposit {
  amount: number;
  virtualBillType: SingleIDObject;
  client: SingleIDObject;
  currency: { name: string };
  id: string;
  name?: string;
  type: string;
}
