import { RatingService } from "./../../services/rating/rating.service"
import {
  RatingScore,
  CustomerRating,
  Service,
} from "./../../../../contracts/interfaces"
import { Component } from "@angular/core"
import { ModalController, NavParams, ToastController } from "@ionic/angular"
const Web3 = require("web3")
const web3 = new Web3("ws://localhost:9545")

@Component({
  selector: "app-leave-rating",
  templateUrl: "./ratings.component.html",
  styleUrls: ["./ratings.component.scss"],
})
export class RatingsComponent {
  private service: Service
  public ratings: CustomerRating[]

  public ratingScore: RatingScore = {
    accurracy: undefined,
    usability: undefined,
    pricing: undefined,
    support: undefined,
    features: undefined,
    ratingText: undefined,
  }

  constructor(
    private readonly navParams: NavParams,
    private readonly ratingService: RatingService,
    private readonly viewCtrl: ModalController,
    private readonly toastController: ToastController
  ) {
    this.service = this.navParams.get("service")
    console.log("RatingsComponent", this.service)

    this.ratingService.getAllRatingsOfService(this.service).then((ratings) => {
      this.ratings = ratings
    })
  }

  ionViewWillEnter() {}
  async setRatingValueForMetric(value: string, ratingMetric: string) {
    this.ratingScore[ratingMetric] = value
  }

  public async showTxDetails(hash: string): Promise<void> {
    const tx = await web3.eth.getTransactionReceipt(hash)

    const message = JSON.stringify(tx, null, 2)
    const toast: HTMLIonToastElement = await this.toastController.create({
      message: message,
      translucent: true,
      duration: 7777,
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

  public async dismiss(): Promise<void> {
    await this.viewCtrl.dismiss()
  }
}
