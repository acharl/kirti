import { MonitorService } from "./../../services/monitor/monitor.service"
import { SlaDetailsComponent } from "./../../components/sla-details/sla-details.component"
import { HttpClient } from "@angular/common/http"
import { RatingsComponent } from "./../../components/ratings/ratings.component"
import { LeaveRatingComponent } from "./../../components/leave-rating/leave-rating.component"
import { RatingService } from "./../../services/rating/rating.service"
import { SLAService } from "../../services/sla/sla.service"
import { Service, OrbitDBService } from "./../../../../contracts/interfaces"
import { Component } from "@angular/core"
import { ProtectionService } from "../../services/protection-upload/protection-upload.service"
import {
  AlertController,
  ToastController,
  ModalController,
} from "@ionic/angular"
import { CustomerService } from "../../services/customer/customer.service"
declare const window: any
const Web3 = require("web3")
const web3 = new Web3("ws://localhost:9545")
const sla = require("../../../../build/contracts/SLA.json")

@Component({
  selector: "app-buy",
  templateUrl: "./buy.page.html",
  styleUrls: ["./buy.page.scss"],
})
export class BuyPage {
  private customerAddress: string
  private contractAddress: string
  private ethereum: any
  private selectedService: Service
  private orbitDbServices: OrbitDBService[]
  public ratingAvgMap = new Map<string, any>() // serviceName, ratingAvg
  public self: any

  constructor(
    private readonly protectionService: ProtectionService,
    private readonly slaService: SLAService,
    private readonly monitorService: MonitorService,
    private readonly ratingService: RatingService,
    private readonly toastController: ToastController,
    private readonly customerService: CustomerService,
    private readonly alertCtrl: AlertController,
    private readonly modalController: ModalController,
    private readonly http: HttpClient
  ) {
    this.self = this
  }

  async ionViewWillEnter() {
    if (typeof window.ethereum !== "undefined") {
      this.ethereum = window["ethereum"]
      this.customerAddress = this.ethereum.selectedAddress
    } else {
      this.requireMetamaskAlert()
    }

    this.orbitDbServices = await this.protectionService.getAllServices()
    this.loadRatings()
  }

  async loadRatings() {
    this.ratingAvgMap = await this.ratingService.getRatingAvgMap()
  }

  public getAverageRating(service: OrbitDBService) {
    return this.ratingAvgMap.get(service.service.serviceName)
  }

  async purchase(service: Service) {
    const monitors = await this.monitorService.getAllMonitors()
    const alert = await this.alertCtrl.create({
      header: "Select a monitoring solution",
      inputs: monitors.map((monitor) => ({
        label: `${monitor.name} @ ${monitor.address}`,
        type: "radio",
        value: monitor.address,
      })),
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Ok",
          handler: async (address) => {
            const monitorAddress = address
            service.customerAddress = this.customerAddress
            service.monitorAddress = monitorAddress
            this.slaService
              .createNewContract(service)
              .then(
                (contractAddress) =>
                  this.deploymentSuccessful(contractAddress, service),
                this.deploymentUnsuccessful
              )
          },
        },
      ],
    })

    await alert.present()
  }

  public async deploymentSuccessful(
    contractAddress: string,
    service: Service
  ): Promise<void> {
    this.contractAddress = contractAddress
    const alert: HTMLIonAlertElement = await this.alertCtrl.create({
      header: "CONTRACT DEPLOYED",
      message: `A smart contract has been launched on the blockchain @${contractAddress}`,
      buttons: [
        {
          text: "cancel",
          role: "cancel",
        },
        {
          text: "send payment",
          handler: () => {
            this.openMetaMask(contractAddress, service)
          },
        },
      ],
    })
    alert.present().catch()
  }

  public async requireMetamaskAlert(): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertCtrl.create({
      header: "WEB3 NOT FOUND",
      message:
        "To purchase a service you need to have Metamask installed, please add it as an extension and reload",
      backdropDismiss: false,
    })
    alert.present().catch()
  }

  async deploymentUnsuccessful(errorMessage: string) {
    console.log("errorMessage", errorMessage)
    const toast: HTMLIonToastElement = await this.toastController.create({
      message: errorMessage,
      duration: 10008,
      position: "top",
    })
    toast.present().catch((err) => console.error(err))
  }

  async openMetaMask(contractAddress: string, service: Service) {
    this.selectedService = service
    const contract = await new web3.eth.Contract(sla.abi, contractAddress)

    const value = web3.utils.toHex(
      web3.utils.toWei(service.price.toString(), "ether")
    )
    const data = web3.utils.sha3("payForService()").slice(0, 10)

    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!")
      const transactionParameters = {
        gasPrice: "91494C600",
        gas: "493E0",
        to: contractAddress,
        from: this.customerAddress,
        data: data,
        value: value,
        chainId: 3,
      }

      this.ethereum.sendAsync(
        {
          method: "eth_sendTransaction",
          params: [transactionParameters],
          from: this.customerAddress,
        },
        this.metaMaskCallback.bind(this)
      )
      contract.once("ServicePaid", (error, event) => {
        // The customer has paid for the SLA SC
        service.paymentTransactionHash = event.transactionHash
        if (event.event === "ServicePaid") {
          console.log(event)
          this.customerService.addServiceForCustomer(
            this.customerAddress,
            service
          )
          this.slaService.addToMyContracts({
            service: service,
            web3ContractInstance: contract,
          })
          this.servicePaidSuccess(event)
        } else {
          this.servicePaidError(error)
        }
      })
    }
  }

  async servicePaidSuccess(event: any) {
    const alert: HTMLIonAlertElement = await this.alertCtrl.create({
      cssClass: "my-custom-class",
      message: "Please ignore MetaMask, your payment was indeed successful",
      buttons: [
        {
          text: "ok",
          role: "cancel",
        },
        {
          text: "inspect transaction",
          handler: () => {
            this.inspectTransaction(event)
          },
        },
      ],
    })
    alert.present().catch()
  }

  async inspectTransaction(event: any) {
    const message = JSON.stringify(event, null, 2)
    const toast: HTMLIonToastElement = await this.toastController.create({
      message: message,
      color: "primary",
      duration: 5000,
      position: "top",
      buttons: [
        {
          text: "close",
          handler: () => {
            console.log("Close clicked")
          },
        },
      ],
    })
    toast.present().catch((err) => console.error(err))
  }

  async servicePaidError(error: any) {
    const message = error
    const toast: HTMLIonToastElement = await this.toastController.create({
      message: message,
      duration: 10008,
      position: "top",
    })
    toast.present().catch((err) => console.error(err))
  }

  async metaMaskCallback(message: any) {
    // METAMASK fails with pure randomness
    if (message && message.code && message.code === -32603) {
      console.log("LETS PAY")
      this.http
        .post(`http://localhost:1008/contracts/pay/${this.contractAddress}`, {
          ethPrice: this.selectedService.price,
        })
        .subscribe((res) => console.log("WE ACTUALLY MADE A CALL", res))
    }
  }

  async leaveRating(service: Service) {
    console.log("service", JSON.stringify(service))

    const modal: HTMLIonModalElement = await this.modalController.create({
      component: LeaveRatingComponent,
      componentProps: {
        customerAddress: this.customerAddress,
        service: service,
      },
    })
    modal.present().catch((err) => console.error(err))
    modal.onDidDismiss().then(() => {
      console.log("let's reload ratings")
      this.loadRatings()
    })
  }

  async viewAllRatingsOfService(service: Service) {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: RatingsComponent,
      componentProps: {
        service: service,
      },
    })
    modal.present().catch((err) => console.error(err))
  }

  async showSlaDetails(service: Service) {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: SlaDetailsComponent,
      componentProps: {
        service: service,
      },
    })
    modal.present().catch((err) => console.error(err))
  }
}
