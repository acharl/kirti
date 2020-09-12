import {
  SLAContract,
  Service,
  SettingsKey,
} from "./../../../../contracts/interfaces"
import { Injectable } from "@angular/core"
import { ToastController } from "@ionic/angular"
import { ContractCreator } from "../../../libraries/ContractCreator"
import { BehaviorSubject } from "rxjs"
import { Storage } from "@ionic/storage"
const sla = require("../../../../build/contracts/SLA.json")

const Web3 = require("web3")
const web3 = new Web3("ws://localhost:9545")

@Injectable({
  providedIn: "root",
})
export class SLAService {
  public myContractsSubject: BehaviorSubject<
    SLAContract[]
  > = new BehaviorSubject([])

  get contractsObservable() {
    return this.myContractsSubject.asObservable()
  }

  constructor(
    public toastController: ToastController,
    private readonly storage: Storage
  ) {
    this.getMyContracts()
  }

  async createNewContract(service: Service): Promise<string> {
    const creator = new ContractCreator()
    const contractAddress = await creator
      .createNewContract(service)
      .catch((err) => console.error(err))
    return contractAddress
  }

  async showToast(registrationHash: string) {
    const toast: HTMLIonToastElement = await this.toastController.create({
      message: `An SLA smart contract has been launched at @${registrationHash}`,
      duration: 10008,
      position: "bottom",
    })
    toast.present().catch((err) => console.error(err))
  }

  async removeContract(contract: SLAContract) {
    let myContracts = await this.getMyContracts()
    const idx = myContracts.indexOf(contract)
    myContracts.splice(idx, 1)
    this.persistContracts(myContracts)
  }
  // TODO map each contract to a service
  async addToMyContracts(contract: SLAContract) {
    console.log("addToMyContracts", contract)
    let myContracts = (await this.getMyContracts())
      ? await this.getMyContracts()
      : []
    myContracts.push(contract)
    this.persistContracts(myContracts)
  }

  async getMyContracts() {
    const contracts = await this.loadFromStorage()
    this.myContractsSubject.next(contracts)
    return contracts
  }

  private async loadFromStorage(): Promise<SLAContract[]> {
    const rawContracts = await this.storage.get(SettingsKey.SLACONTRACTS)
    let contracts: SLAContract[] = JSON.parse(rawContracts)
      ? JSON.parse(rawContracts)
      : []
    contracts.forEach((contract) => {
      contract.web3ContractInstance = new web3.eth.Contract(
        sla.abi,
        contract.web3ContractInstance
      )
    })
    return contracts
  }

  private async persistContracts(contracts: SLAContract[]): Promise<any> {
    this.myContractsSubject.next(contracts)
    contracts.forEach((contract) => {
      contract.web3ContractInstance = contract.web3ContractInstance._address
    })
    const jsonContracts = JSON.stringify(contracts)
    const key = SettingsKey.SLACONTRACTS
    return this.storage.set(key, jsonContracts)
  }
}
