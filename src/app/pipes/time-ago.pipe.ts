import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo'
})

export class TimeAgoPipe implements PipeTransform {

    transform(value: Date): any {
        const creationDate = new Date(value).getTime();
        const now = new Date().getTime();
        const duration = (now - creationDate) / 1000;
        let timeValue = 0;
        let timeMeasuring;
        if (duration < 1) {
            return 'now';
        }
        if (duration < 60) {
            timeValue = duration;
            timeMeasuring = 'second';
        } else if (duration < 3600) {
            timeValue = duration / 60;
            timeMeasuring = 'minute';
        } else if (duration < 86400) {
            timeValue = duration / 3600;
            timeMeasuring = 'hour';
        } else if (duration < 2592000) {
            timeValue = duration / 86400;
            timeMeasuring = 'day';
        } else if (duration < 31104000) {
            timeValue = duration / 2592000;
            timeMeasuring = 'month';
        } else if (duration) {
            timeValue = duration / 31104000;
            timeMeasuring = 'year';
        }
        if (Math.floor(timeValue) > 1) {
            timeMeasuring += 's';
        }
        return Math.floor(timeValue) + ' ' + timeMeasuring;
    }
}
