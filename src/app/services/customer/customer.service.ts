import { OrbitDBCustomer, Service } from "./../../../../contracts/interfaces"
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private readonly baseUrl = "http://localhost:1008/orbitdb/customers"

  constructor(private readonly http: HttpClient) {}

  public async addServiceForCustomer(
    customerAddress: string,
    service: Service
  ): Promise<string> {
    return new Promise((resolve) => {
      this.http
        .post(`${this.baseUrl}/service/add`, {
          customerAddress: customerAddress,
          service: service,
        })
        .subscribe((res: string) => {
          resolve(res)
        })
    })
  }

  public getCustomerByAddress(address: string): Promise<OrbitDBCustomer> {
    return new Promise((resolve) => {
      this.http
        .get(`${this.baseUrl}/customer/${address}`)
        .subscribe((res: OrbitDBCustomer) => {
          resolve(res)
        })
    })
  }

  public getAllCustomers(): Promise<OrbitDBCustomer[]> {
    return new Promise((resolve) => {
      this.http
        .get(`${this.baseUrl}/all`)
        .subscribe((res: OrbitDBCustomer[]) => {
          resolve(res)
        })
    })
  }
}
