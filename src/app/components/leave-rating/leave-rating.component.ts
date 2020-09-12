import { RatingService } from "./../../services/rating/rating.service"
import {
  RatingScore,
  CustomerRating,
  Service,
} from "./../../../../contracts/interfaces"
import { Component } from "@angular/core"
import {
  ModalController,
  AlertController,
  ToastController,
  NavParams,
} from "@ionic/angular"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
const toastController = new ToastController()

@Component({
  selector: "app-leave-rating",
  templateUrl: "./leave-rating.component.html",
  styleUrls: ["./leave-rating.component.scss"],
})
export class LeaveRatingComponent {
  public textForm: FormGroup
  public ratingText: string

  private service: Service
  private customerAddress

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
    private readonly toastController: ToastController,
    private readonly alertCtrl: AlertController,
    private readonly formBuilder: FormBuilder
  ) {
    this.customerAddress = this.navParams.get("customerAddress")
    this.service = this.navParams.get("service")
    this.textForm = this.formBuilder.group({
      ratingText: [this.ratingText, Validators.required],
    })
  }

  async setRatingValueForMetric(value: string, ratingMetric: string) {
    this.ratingScore[ratingMetric] = value
  }

  public async confirmRating(): Promise<void> {
    const formValues = this.textForm.value
    this.ratingScore["ratingText"] = formValues.ratingText
    const ratingIncomplete = Object.values(this.ratingScore)
      .map((val) => val === undefined)
      .includes(true)

    if (ratingIncomplete) {
      const toast: HTMLIonToastElement = await this.toastController.create({
        message: "Please leave a rating for each metric",
        duration: 5000,
        position: "top",
      })
      toast.present().catch((err) => console.error(err))
    } else {
      const alert: HTMLIonAlertElement = await this.alertCtrl.create({
        header: "Confirm Rating",
        message: `Do you want to submit this rating? 
        ${JSON.stringify(this.ratingScore, null, 2)}`,
        buttons: [
          {
            text: "cancel",
            role: "cancel",
          },
          {
            text: "confirm",
            handler: () => {
              const rating: CustomerRating = {
                customerAddress: this.customerAddress,
                serviceName: this.service.serviceName,
                ratingScore: this.ratingScore,
              }
              this.ratingService
                .addRatingForService(rating)
                .then(this.ratingConfirmed, this.ratingRejected)
              this.dismiss()
            },
          },
        ],
      })
      alert.present().catch()
    }
  }

  async ratingConfirmed(registrationHash: string) {
    console.log("registrationHash", registrationHash)
    const toast: HTMLIonToastElement = await toastController.create({
      message: `Your rating has been successfully registered. Transaction hash: ${registrationHash}`,
      duration: 5000,
      position: "top",
    })
    toast.present().catch((err) => console.error(err))
  }

  async ratingRejected(errorMessage: string) {
    console.log("errorMessage", errorMessage)
    const toast: HTMLIonToastElement = await toastController.create({
      message: errorMessage,
      duration: 5000,
      position: "top",
    })
    toast.present().catch((err) => console.error(err))
  }

  public async dismiss(): Promise<void> {
    await this.viewCtrl.dismiss()
  }
}
