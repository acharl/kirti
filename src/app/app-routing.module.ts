import { NgModule } from "@angular/core"
import { PreloadAllModules, RouterModule, Routes } from "@angular/router"

const routes: Routes = [
  {
    path: "",
    redirectTo: "buy",
    pathMatch: "full",
  },
  {
    path: "buy",
    loadChildren: () =>
      import("./pages/buy/buy.module").then((m) => m.BuyPageModule),
  },
  {
    path: "sell",
    loadChildren: () =>
      import("./pages/sell/sell.module").then((m) => m.SellPageModule),
  },
  {
    path: "sla",
    loadChildren: () =>
      import("./pages/sla/sla.module").then((m) => m.SlaPageModule),
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
