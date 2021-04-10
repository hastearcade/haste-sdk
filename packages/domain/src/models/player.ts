export class Player {
  email: string;

  constructor(email: string) {
    this.email = email;
  }

  getId() {
    return this.email;
  }
}
