import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core"

@Component({
  selector: "star",
  templateUrl: "./star.component.html",
  styleUrls: ["./star.component.scss"],
})
export class StarComponent {
  public numFullStars
  public numHollowStars
  public freezeStars: boolean = false
  @Output()
  private readonly amountSetEmitter: EventEmitter<string> = new EventEmitter()

  @Input()
  set stars(value: string) {
    this.freezeStars = true
    if (!value) {
      this.numFullStars = 0
      this.numHollowStars = 10
    } else {
      value = Number(value).toFixed() // round value
      this.numFullStars = Number(value)
      this.numHollowStars = 10 - Number(this.numFullStars)
    }
  }

  constructor() {
    this.numFullStars = 0
    this.numHollowStars = 10
  }

  updateStars(idx: number, type: string) {
    if (this.freezeStars) {
      return
    }
    if (type === "hollow") {
      this.numFullStars = this.numFullStars + idx + 1
    } else if (type === "full") {
      this.numFullStars = idx + 1
    }
    this.numHollowStars = 10 - this.numFullStars

    this.amountSetEmitter.emit(this.numFullStars)
  }
}
