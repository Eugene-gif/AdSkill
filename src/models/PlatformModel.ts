import { Deposit } from "@/models/UserModel";
import { SingleIDObject } from "@/models/SingleIDObject";

export interface Platform {
  id: string;
  name?: string;
  text?: string;
  comment?: string;
  status?: string;
  balance?: string;
  spend?: string;
  left?: string;
  total?: string;
  avatar?: SingleIDObject;
  platform?: {
    id: string;
    name: string;
    avatar: SingleIDObject;
  };
  currenciesList?: Array<Deposit>;
}
