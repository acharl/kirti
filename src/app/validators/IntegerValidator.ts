import { AbstractControl } from '@angular/forms'
import { BigNumber } from 'bignumber.js'

// all integers > 0 
export class IntegerValidator {
  public static validate(): (control: AbstractControl) => { pattern: string } | null {
    const regExp = /^[1-9][0-9]*$/g;
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
