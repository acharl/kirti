import { HttpClient } from "@angular/common/http"
import { Service, OrbitDBService } from "../../../../contracts/interfaces"
import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class ProtectionService {
  private readonly baseUrl = "http://localhost:1008/orbitdb/services"

  constructor(private readonly http: HttpClient) {}

  public async addNewService(
    newService: Service,
    providerAddress: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.baseUrl}/add`, {
          newService: newService,
          providerAddress: providerAddress,
        })
        .subscribe((res: any) => {
          res.success ? resolve(res.success) : reject(res.error)
        })
    })
  }

  public getAllServices(): Promise<OrbitDBService[]> {
    return new Promise((resolve) => {
      this.http.get(`${this.baseUrl}/all`).subscribe((res: any) => {
        resolve(res)
      })
    })
  }
}
