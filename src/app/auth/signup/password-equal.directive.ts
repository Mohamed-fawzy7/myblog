import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
    selector: '[appPasswordEqual]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: PasswordEqualDirective, multi: true }
    ]
})
export class PasswordEqualDirective implements Validator {
    constructor() { }
    validate(control: any) {
        const passwordInput = control.root.controls.password;
        if (passwordInput.value === control.value) {
            return null;
        }
        return {confirmPasswordError: true};
    }

}
