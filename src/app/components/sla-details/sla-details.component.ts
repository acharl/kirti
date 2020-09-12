import { Component, OnInit, Input } from "@angular/core"
import { Service } from "contracts/interfaces"

@Component({
  selector: "app-sla-details",
  templateUrl: "./sla-details.component.html",
  styleUrls: ["./sla-details.component.scss"],
})
export class SlaDetailsComponent {
  @Input()
  public service: Service
  constructor() {}
}
