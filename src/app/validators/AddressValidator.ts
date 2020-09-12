import { AbstractControl } from '@angular/forms'
import { BigNumber } from 'bignumber.js'

export class AddressValidator {
  public static validate(): (control: AbstractControl) => { pattern: string } | null {
    const regExp = /^0x[a-fA-F0-9]{40}$/g;

    return (control: AbstractControl): { pattern: string } | null => {
      const address: string = control.value
      if (address && address.match(regExp) === null) {
        return { pattern: 'Pattern does not match.' }
      }
      return null
    }
  }
} 
