import { NgModule } from "@angular/core"
import { StarPipe } from "./star/star.pipe"
import { CompensationPipe } from "./compensation/compensation.pipe"
import { PercentagePipe } from "./percentage/percentage.pipe"
import { MinutesPipe } from "./minutes/minutes.pipe"
import { ShortenStringPipe } from "./shorten-string/shorten-string.pipe"

@NgModule({
  declarations: [
    StarPipe,
    CompensationPipe,
    PercentagePipe,
    MinutesPipe,
    ShortenStringPipe,
  ],
  imports: [],
  exports: [
    StarPipe,
    CompensationPipe,
    PercentagePipe,
    MinutesPipe,
    ShortenStringPipe,
  ],
})
export class PipesModule {}
