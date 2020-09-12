import { PipesModule } from "src/app/pipes/pipes.module"
import { RatingsComponent } from "./ratings/ratings.component"
import { StarComponent } from "./star/star.component"
import { LeaveRatingComponent } from "./leave-rating/leave-rating.component"
import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { SlaDetailsComponent } from "./sla-details/sla-details.component"

@NgModule({
  declarations: [
    StarComponent,
    LeaveRatingComponent,
    RatingsComponent,
    SlaDetailsComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  exports: [
    StarComponent,
    LeaveRatingComponent,
    RatingsComponent,
    SlaDetailsComponent,
  ],
  entryComponents: [
    StarComponent,
    LeaveRatingComponent,
    RatingsComponent,
    SlaDetailsComponent,
  ],
})
export class ComponentsModule {}
