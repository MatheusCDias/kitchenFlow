import { Employee } from "./Employee";

export class Admin extends Employee {
  constructor(id: string, name: string, shift: string) {
    // Passamos id, nome e o tipo do cargo para a classe pai
    super(id, name, "admin", shift);
  }
}