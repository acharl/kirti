import { Component, OnInit } from "@angular/core"
import { Platform } from "@ionic/angular"
import { SplashScreen } from "@ionic-native/splash-screen/ngx"
import { StatusBar } from "@ionic-native/status-bar/ngx"
import { Router } from "@angular/router"
import { AccountService } from "./services/account/account.service"
declare const window: any

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0
  public appPages = [
    {
      title: "Buy",
      url: "/buy",
      icon: "cash",
    },
    {
      title: "Sell",
      url: "/sell",
      icon: "cloud-upload",
    },
    {
      title: "My Services",
      url: "/sla",
      icon: "stats-chart",
    },
  ]

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private accountService: AccountService
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })
  }

  async ngOnInit() {
    const path = window.location.pathname.split("buy/")[1]
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      )
    }
    if (typeof window.ethereum !== "undefined") {
      const ethereum = window["ethereum"]
      console.log("MetaMask is installed!")
      const accounts = await ethereum.enable()
      this.accountService.set(accounts[0])
    }
  }
}
