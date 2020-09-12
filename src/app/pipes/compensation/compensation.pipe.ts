import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "compensation",
})
export class CompensationPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return `${value / 1000000000000000000} ETH`
  }
}
