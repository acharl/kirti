import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "shortenString",
})
// copyright: taken from AirGap Wallet
export class ShortenStringPipe implements PipeTransform {
  public transform(value: string, args: { ifMatches?: string | RegExp } = {}) {
    if (!value || !(typeof value === "string")) {
      // console.warn(`ShortenStringPipe: invalid value: ${value}`)
      return ""
    }

    let result = value
    if (
      value.length >= 12 &&
      (args.ifMatches === undefined || result.match(args.ifMatches))
    ) {
      result = `${value.substr(0, 5)}...${value.substr(-5)}`
    }

    return result
  }
}
