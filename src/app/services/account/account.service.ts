import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private account: string

  constructor() { }

  public set(account: string) {
    if (account) {
      this.account = account
    } else throw "Account is undefined";
  }

  public get() {
    return this.account
  }
}
