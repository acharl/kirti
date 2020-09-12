import { AbstractControl } from '@angular/forms'
import { BigNumber } from 'bignumber.js'

export class PriceValidator {
  public static validate(): (control: AbstractControl) => { pattern: string } | null {
    const regExp = /^([0-9]*|\d*\.\d{1}?\d*)$/g;
    return (control: AbstractControl): { pattern: string } | null => {
      const controlVal = new BigNumber(control.value)
      const stringAmount: string = controlVal.toFixed()
      if (stringAmount.match(regExp) === null) {
        return { pattern: 'Pattern does not match.' }
      }
      return null
    }
  }
}
