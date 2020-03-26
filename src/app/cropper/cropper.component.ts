import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
    selector: 'app-cropper',
    templateUrl: './cropper.component.html',
    styleUrls: ['./cropper.component.css']
})
export class CropperComponent implements AfterViewInit {
    private cropper: Cropper;

    @Input() selectedImage;
    @ViewChild('imageToBeCropped', {static: false}) myImage: ElementRef;
    @Output() passCroppedImage = new EventEmitter();
    @Output() closeModal = new EventEmitter();
    constructor() { }

    ngAfterViewInit() {
        this.cropper = new Cropper(this.myImage.nativeElement, {
            aspectRatio: 1,
            zoomable: true,
            viewMode: 2
        });
    }
    saveImage() {
        const canvas = this.cropper.getCroppedCanvas();
        this.passCroppedImage.emit(canvas);
    }
    emitCloseModal() {
        this.closeModal.emit();
    }
}
