import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"

export interface Monitor {
  name: string
  address: string
}

@Injectable({
  providedIn: "root",
})
export class MonitorService {
  private readonly baseUrl = "http://localhost:1008/orbitdb/monitors"

  constructor(private readonly http: HttpClient) {}

  public async getAllMonitors(): Promise<Monitor[]> {
    return new Promise((resolve) => {
      this.http.get(`${this.baseUrl}/all/`).subscribe((res: any) => {
        resolve(res)
      })
    })
  }
}
