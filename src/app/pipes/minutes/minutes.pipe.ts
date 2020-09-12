import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "minutes",
})
export class MinutesPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return `${value}min`
  }
}
