import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "starPipe",
})
export class StarPipe implements PipeTransform {
  transform(value: number, ...args: any[]): any {
    console.log("StarPipe", value)
    const numFullStars = value
    const numHollowStars = 10 - numFullStars

    const fullStar = '<ion-icon name="star"></ion-icon>'
    const hollowStar = '<ion-icon name="star-outline"></ion-icon>'
    const result = `${fullStar.repeat(numFullStars)} ${hollowStar.repeat(
      numHollowStars
    )}`
    console.log(result)
    return result
  }
}
