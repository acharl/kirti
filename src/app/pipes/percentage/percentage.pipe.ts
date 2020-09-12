import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "percentage",
})
export class PercentagePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const val = value.toString()
    return `${val.slice(0, 2)}.${val.slice(2)}%`
  }
}
