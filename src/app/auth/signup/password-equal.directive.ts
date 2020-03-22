// import { Validator, FormControl, AbstractControl } from '@angular/forms';


// export class PasswordEqualDirective implements Validator{
//     validate(control: AbstractControl){
//         // if (control.value === control.root)
//         // console.log(control.root)
//         return null;
//     }
// }


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
    validate(control: FormControl) {
        const passwordInput = control.root.controls.password;
        if (passwordInput.value === control.value) {
            return null;
        }
        return {confirmPasswordError: true};
    }

}
