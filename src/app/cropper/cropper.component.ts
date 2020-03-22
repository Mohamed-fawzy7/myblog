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
    @ViewChild("imageToBeCropped", {static: false}) myImage: ElementRef;
    @Output() passCroppedImage = new EventEmitter();
    @Output() closeModal = new EventEmitter();
    constructor() { }

    ngAfterViewInit(){
        this.cropper = new Cropper(this.myImage.nativeElement, {
            aspectRatio: 1,
            zoomable: false,
            viewMode: 2,
            // autoCrop: false,
            // crop: () =>{
            //     console.log('cropped');
            //     const canvas = this.cropper.getCroppedCanvas();
            //     const croppedImage = canvas.toDataURL("image/jpg");
            //     this.passCroppedImage.emit(croppedImage);
            // }
        })
    }
    saveImage(){
        const canvas = this.cropper.getCroppedCanvas();
        this.passCroppedImage.emit(canvas);
    }
    emitCloseModal(){
        this.closeModal.emit();
    }
}
