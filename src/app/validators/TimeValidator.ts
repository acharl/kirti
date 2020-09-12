import { AbstractControl } from '@angular/forms'
import { BigNumber } from 'bignumber.js'

export class TimeValidator {
  public static validate(): (control: AbstractControl) => { pattern: string } | null {
    const regExp = /^([1-9]\d?|[12]\d\d|3[0-5]\d|36[0-5])$/g;
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
