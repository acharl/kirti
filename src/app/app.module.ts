import { MonitorService } from "./services/monitor/monitor.service"
import { ComponentsModule } from "./components/components.module"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { RouteReuseStrategy } from "@angular/router"
import { IonicStorageModule } from "@ionic/storage"

import { IonicModule, IonicRouteStrategy } from "@ionic/angular"
import { SplashScreen } from "@ionic-native/splash-screen/ngx"
import { StatusBar } from "@ionic-native/status-bar/ngx"

import { AppComponent } from "./app.component"
import { AppRoutingModule } from "./app-routing.module"
import { ProtectionService } from "./services/protection-upload/protection-upload.service"
import { SLAService } from "./services/sla/sla.service"
import { AccountService } from "./services/account/account.service"
import { RatingService } from "./services/rating/rating.service"
import { LeaveRatingComponent } from "./components/leave-rating/leave-rating.component"
import { PipesModule } from "./pipes/pipes.module"
import { HttpClient, HttpClientModule } from "@angular/common/http"

@NgModule({
  declarations: [AppComponent],
  entryComponents: [LeaveRatingComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    TooltipModule.forRoot(),
    IonicStorageModule.forRoot({
      name: "__SLA_storage",
      driverOrder: ["localstorage"],
    }),
    PipesModule,
    ComponentsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ProtectionService,
    SLAService,
    RatingService,
    Storage,
    AccountService,
    MonitorService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
