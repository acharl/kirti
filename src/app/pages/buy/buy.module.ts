import { PipesModule } from "./../../pipes/pipes.module"
import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { IonicModule } from "@ionic/angular"

import { BuyPageRoutingModule } from "./buy-routing.module"

import { BuyPage } from "./buy.page"
import { StarComponent } from "../../components/star/star.component"
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  entryComponents: [StarComponent],
  declarations: [BuyPage],
})
export class BuyPageModule {}
