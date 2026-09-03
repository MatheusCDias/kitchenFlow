import { Employee } from "./Employee";

export class Admin extends Employee {
  constructor(id: string, name: string, shift: string) {
    super(id, name, "admin", shift);
  }
}