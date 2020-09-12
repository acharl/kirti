import { AbstractControl } from '@angular/forms'
import { BigNumber } from 'bignumber.js'

export class PercentageValidator {
  public static validate(): (control: AbstractControl) => { pattern: string } | null {
    const regExp = /^100$|^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,3}$/g;

    return (control: AbstractControl): { pattern: string } | null => {
      const controlVal = new BigNumber(control.value)
      const stringAmount: string = controlVal.toFixed()
      if (controlVal.gt(100) || stringAmount.match(regExp) === null) {
        return { pattern: 'Pattern does not match.' }
      }
      return null
    }
  }
}
