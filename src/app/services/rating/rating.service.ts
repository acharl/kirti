import { resolve } from "path"
import { HttpClient } from "@angular/common/http"
import { CustomerService } from "./../customer/customer.service"
import {
  CustomerRating,
  Service,
  OrbitDBCustomer,
  RatingScore,
  OrbitDBService,
} from "./../../../../contracts/interfaces"
import { Injectable } from "@angular/core"
import { ProtectionService } from "../protection-upload/protection-upload.service"

@Injectable({
  providedIn: "root",
})
export class RatingService {
  private readonly baseUrl = "http://localhost:1008/orbitdb/ratings"
  public ratingAvgMap = new Map<string, any>() // serviceName, ratingAvg

  constructor(
    private readonly http: HttpClient,
    private readonly protectionService: ProtectionService
  ) {}

  public async addRatingForService(rating: CustomerRating): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.baseUrl}/add`, rating).subscribe((res: any) => {
        res.success ? resolve(res.success) : reject(res.error)
      })
    })
  }

  public async getAllRatingsOfService(
    service: Service
  ): Promise<CustomerRating[]> {
    return new Promise((resolve) => {
      this.http
        .get(`${this.baseUrl}/service/${service.serviceName}`)
        .subscribe((res: any) => {
          resolve(res.map((el) => el.rating))
        })
    })
  }

  public async getRatingAvgMap(): Promise<Map<string, any>> {
    const orbitDbServices = await this.protectionService.getAllServices()

    try {
      for (const service of orbitDbServices) {
        const allRatings = await this.getAllRatingsOfService(service.service)

        const valuesOfEachRating = allRatings
          .map((rating) => rating.ratingScore)
          .map((ratingScore: RatingScore) =>
            Object.values(ratingScore).filter((val) => typeof val === "number")
          )

        const avgOfEachRating = valuesOfEachRating.map((values) => {
          return this.avgValueOfArray(values)
        })

        const ratingAvg = this.avgValueOfArray(avgOfEachRating)

        if (!allRatings) {
          this.ratingAvgMap.set(service.service.serviceName, "unrated")
        }
        this.ratingAvgMap.set(service.service.serviceName, ratingAvg.toString())
      }
      return this.ratingAvgMap
    } catch (error) {
      console.log(error)
    }
  }

  private avgValueOfArray(arr: Array<number>) {
    const sum = arr.reduce((a, b) => {
      return a + b
    }, 0)
    return sum / arr.length
  }

  // TODO  If a customer has used a service x times, should he also be able to rate it x times?
  public async getCustomerPurchasesOfService(
    customerAddress: string,
    serviceToBeRated: Service
  ): Promise<number> {
    return new Promise<number>((resolve) => {
      this.http
        .get(`${this.baseUrl}/customers/${customerAddress}`)
        .subscribe((res: any) => {
          if (!res) {
            console.log(`no entry found for ${customerAddress}`)
            return 0
          }
          const found = res.services.filter(
            (service) =>
              service.serviceName === serviceToBeRated.serviceName &&
              service.providerAddress === serviceToBeRated.providerAddress
          )
          resolve(found.length)
        })
    })
  }
}
