import { ProtectionService } from "../../services/protection-upload/protection-upload.service"
import { SLADetails, Service } from "./../../../../contracts/interfaces"
import { Component } from "@angular/core"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { TimeValidator } from "../../validators/TimeValidator"
import { PriceValidator } from "../../validators/PriceValidator"
import { PercentageValidator } from "../../validators/PercentageValidator"
import { AddressValidator } from "src/app/validators/AddressValidator"
import { ToastController } from "@ionic/angular"
import { IntegerValidator } from "src/app/validators/IntegerValidator"
import { Router } from "@angular/router"

const toastController = new ToastController()

@Component({
  selector: "app-sell",
  templateUrl: "./sell.page.html",
  styleUrls: ["./sell.page.scss"],
})
export class SellPage {
  public uploadForm: FormGroup

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly protectionService: ProtectionService,
    private readonly router: Router
  ) {
    let serviceName: string
    let providerName: string
    let providerAddress: string
    let description: string
    let price: number
    let validityPeriod: number

    let timeToMitigate: number
    let mitigationEfficiency: number
    let serviceAvailability: number

    let timeToMitigateHIGHPercentage: number
    let timeToMitigateMEDIUMPercentage: number
    let timeToMitigateLOWPercentage: number

    let timeToMitigateHIGHThreshold: number
    let timeToMitigateMEDIUMThreshold: number
    let timeToMitigateLOWThreshold: number

    let mitigationEfficiencyHIGHPercentage: number
    let mitigationEfficiencyMEDIUMPercentage: number
    let mitigationEfficiencyLOWPercentage: number

    let mitigationEfficiencyHIGHThreshold: number
    let mitigationEfficiencyMEDIUMThreshold: number
    let mitigationEfficiencyLOWThreshold: number

    let serviceAvailabilityHIGHPercentage: number
    let serviceAvailabilityMEDIUMPercentage: number
    let serviceAvailabilityLOWPercentage: number

    let serviceAvailabilityHIGHThreshold: number
    let serviceAvailabilityMEDIUMThreshold: number
    let serviceAvailabilityLOWThreshold: number

    this.uploadForm = this.formBuilder.group({
      serviceName: [serviceName, Validators.required],
      providerName: [providerName, Validators.required],
      providerAddress: [
        providerAddress,
        Validators.compose([Validators.required, AddressValidator.validate()]),
      ], // valid ETH address
      description: [description, Validators.required],
      price: [
        price,
        Validators.compose([Validators.required, PriceValidator.validate()]),
      ], // any float
      validityPeriod: [
        validityPeriod,
        Validators.compose([Validators.required, TimeValidator.validate()]),
      ], // integer less than 365
      timeToMitigate: [
        timeToMitigate,
        Validators.compose([Validators.required, IntegerValidator.validate()]),
      ],
      mitigationEfficiency: [
        mitigationEfficiency,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ], // valid percentage
      serviceAvailability: [
        serviceAvailability,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ], // valid percentage
      timeToMitigateHIGHPercentage: [
        timeToMitigateHIGHPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      timeToMitigateMEDIUMPercentage: [
        timeToMitigateMEDIUMPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      timeToMitigateLOWPercentage: [
        timeToMitigateLOWPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      timeToMitigateHIGHThreshold: [
        timeToMitigateHIGHThreshold,
        Validators.compose([Validators.required, IntegerValidator.validate()]),
      ],
      timeToMitigateMEDIUMThreshold: [
        timeToMitigateMEDIUMThreshold,
        Validators.compose([Validators.required, IntegerValidator.validate()]),
      ],
      timeToMitigateLOWThreshold: [
        timeToMitigateLOWThreshold,
        Validators.compose([Validators.required, IntegerValidator.validate()]),
      ],
      mitigationEfficiencyHIGHPercentage: [
        mitigationEfficiencyHIGHPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      mitigationEfficiencyMEDIUMPercentage: [
        mitigationEfficiencyMEDIUMPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      mitigationEfficiencyLOWPercentage: [
        mitigationEfficiencyLOWPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      mitigationEfficiencyHIGHThreshold: [
        mitigationEfficiencyHIGHThreshold,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      mitigationEfficiencyMEDIUMThreshold: [
        mitigationEfficiencyMEDIUMThreshold,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      mitigationEfficiencyLOWThreshold: [
        mitigationEfficiencyLOWThreshold,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      serviceAvailabilityHIGHPercentage: [
        serviceAvailabilityHIGHPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      serviceAvailabilityMEDIUMPercentage: [
        serviceAvailabilityMEDIUMPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      serviceAvailabilityLOWPercentage: [
        serviceAvailabilityLOWPercentage,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      serviceAvailabilityHIGHThreshold: [
        serviceAvailabilityHIGHThreshold,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      serviceAvailabilityMEDIUMThreshold: [
        serviceAvailabilityMEDIUMThreshold,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
      serviceAvailabilityLOWThreshold: [
        serviceAvailabilityLOWThreshold,
        Validators.compose([
          Validators.required,
          PercentageValidator.validate(),
        ]),
      ],
    })
  }

  public async uploadService() {
    const formValues = this.uploadForm.value

    const slaDetails: SLADetails = {
      // timeToAlert: formValues.timeToAlert,
      timeToMitigate: Number(formValues.timeToMitigate),
      mitigationEfficiency: formValues.mitigationEfficiency * 1000,
      serviceAvailability: formValues.serviceAvailability * 1000,
      compensationPercentages: [
        formValues.timeToMitigateHIGHPercentage,
        formValues.timeToMitigateMEDIUMPercentage,
        formValues.timeToMitigateLOWPercentage,
        formValues.mitigationEfficiencyHIGHPercentage,
        formValues.mitigationEfficiencyMEDIUMPercentage,
        formValues.mitigationEfficiencyLOWPercentage,
        formValues.serviceAvailabilityHIGHPercentage,
        formValues.serviceAvailabilityMEDIUMPercentage,
        formValues.serviceAvailabilityLOWPercentage,
      ].map((val) => Number(val)),
      violationThresholds: [
        formValues.timeToMitigateHIGHThreshold,
        formValues.timeToMitigateMEDIUMThreshold,
        formValues.timeToMitigateLOWThreshold,
        formValues.mitigationEfficiencyHIGHThreshold,
        formValues.mitigationEfficiencyMEDIUMThreshold,
        formValues.mitigationEfficiencyLOWThreshold,
        formValues.serviceAvailabilityHIGHThreshold,
        formValues.serviceAvailabilityMEDIUMThreshold,
        formValues.serviceAvailabilityLOWThreshold,
      ].map((val) => Number(val)),
    }

    const newService: Service = {
      serviceName: formValues.serviceName,
      providerName: formValues.providerName,
      providerAddress: formValues.providerAddress,
      description: formValues.description,
      price: formValues.price,
      validityPeriod: formValues.validityPeriod,
      slaDetails: slaDetails,
    }

    console.log(JSON.stringify(newService))
    this.protectionService
      .addNewService(newService, newService.providerAddress)
      .then(this.resolved, this.rejected)
  }

  async resolved(registrationHash: string) {
    console.log("registrationHash", registrationHash)
    const toast: HTMLIonToastElement = await toastController.create({
      message: `Your service has been successfully uploaded. Transaction hash: ${registrationHash}`,
      duration: 10008,
      position: "top",
    })
    toast.present().catch((err) => console.error(err))
  }

  async rejected(errorMessage: string) {
    console.log("errorMessage", errorMessage)
    const toast: HTMLIonToastElement = await toastController.create({
      message: errorMessage,
      duration: 10008,
      position: "top",
    })
    toast.present().catch((err) => console.error(err))
  }
}
