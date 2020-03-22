import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nameFirstLetters'
})
export class NameFirstLettersPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if (!value){return value}
        return value.split(' ').slice(0,2).map(w => w[0]).join("")
    }

}
