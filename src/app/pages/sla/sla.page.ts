import {
  SLAContract,
  State,
  ValidityObject,
} from "./../../../../contracts/interfaces"
import { Component, OnInit } from "@angular/core"
import { SLAService } from "../../services/sla/sla.service"
import { HttpClient } from "@angular/common/http"
import { stat } from "fs"

const Web3 = require("web3")
const web3 = new Web3(Web3.givenProvider || "ws://localhost:9545")
@Component({
  selector: "app-sla",
  templateUrl: "./sla.page.html",
  styleUrls: ["./sla.page.scss"],
})
export class SlaPage {
  public myContracts: SLAContract[] = []
  private readonly baseUrl = "http://localhost:1008/contracts"

  constructor(
    private readonly slaService: SLAService,
    private http: HttpClient
  ) {}

  async ionViewWillEnter() {
    this.slaService.getMyContracts()
    this.slaService.contractsObservable.subscribe(async (contracts) => {
      this.myContracts = contracts
      for (const contract of contracts) {
        await this.getState(contract)
        await this.getValidityPeriod(contract)
      }
    })
  }

  private async getState(contract: SLAContract) {
    this.http
      .get(`${this.baseUrl}/${contract.web3ContractInstance._address}/state`)
      .subscribe((res: any) => {
        if (res.success) {
          const state = res.success
          console.log("state", state)
          console.log("res", res)

          contract["state"] = {
            isActivated: state.isActivated,
            isTerminated: state.isTerminated,
            currentCompensation: state.currentCompensation,
            violationCount: state.violationCount,
          }
          contract["monitorAddress"] = state.monitorAddress
        } else {
          this.slaService.removeContract(contract)
        }
      })
  }

  private async getValidityPeriod(contract: SLAContract) {
    this.http
      .get(`${this.baseUrl}/${contract.web3ContractInstance._address}/validity`)
      .subscribe((validityObject: ValidityObject) => {
        contract["validityObject"] = {
          createdAt: validityObject.createdAt * 1000,
          expiresAt: validityObject.expiresAt * 1000,
          validity: validityObject.validity,
        }
      })
  }
}
