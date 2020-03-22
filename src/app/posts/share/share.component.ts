import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
    @Input() sharedLink;
    fbLink;
    twitterLink;
    linkedinLink;
    constructor() {

    }

    ngOnInit() {
        const fullLink = window.location.href + this.sharedLink;
        const transformedLink = fullLink.replace(/\//g, "%2F").replace(/:/g, '%3A')
        this.fbLink = "https://www.facebook.com/sharer/sharer.php?u=" + transformedLink + "&amp;src=sdkpreparse";
        this.twitterLink = "https://twitter.com/intent/tweet?url=" + fullLink;
        this.linkedinLink = "https://www.linkedin.com/sharing/share-offsite/?url=" + transformedLink
    }
}