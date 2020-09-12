import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import { IonicModule } from "@ionic/angular"

import { SlaPageRoutingModule } from "./sla-routing.module"

import { SlaPage } from "./sla.page"
import { PipesModule } from "src/app/pipes/pipes.module"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SlaPageRoutingModule,
  ],
  declarations: [SlaPage],
})
export class SlaPageModule {}
