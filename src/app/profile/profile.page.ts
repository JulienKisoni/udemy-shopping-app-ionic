import { NavController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Utilisateur } from './../../models/utilisateur-interface';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
profileType: string = "Profil";
utilisateur = {} as Utilisateur;
  constructor(private storage: NativeStorage, private imagePicker: ImagePicker, private camera: Camera,
    private navCtrl: NavController, private actionSheet: ActionSheetController) { }

  async ngOnInit() {
    this.utilisateur = await this.storage.getItem('Utilisateur');
    if (this.utilisateur.avatar === "") {
      this.utilisateur.avatar = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';
    }
  }

  segmentChanged($event) {
    console.log('event', $event);
    this.profileType = $event.detail.value;
  }

  updateProfile() {
    console.log('utilisateur', this.utilisateur);
  }

  async galerie(imageNum: number) {
    let options: ImagePickerOptions = {
      maximumImagesCount: imageNum,
      outputType: 0,
      quality: 100,
    }
    return this.imagePicker.getPictures(options);
  }
  async getCam() {
    let options: CameraOptions = {
      sourceType: 1,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    return this.camera.getPicture(options);
  }

  async action() {
    const actionSheet = await this.actionSheet.create({
      header: 'Sélectionner la source',
      buttons: [
        {
          text: 'Galerie',
          icon: 'images',
          handler: async ()=> {
            console.log('Galerie');
            let pictures: string[] = await this.galerie(1);
              for (let i = 0; i < pictures.length; i++) {
                const element = pictures[i];
                console.log('element de pictures', element);
                this.utilisateur.avatar = element;
              }
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: ()=> {
            console.log('Camera');
            this.getCam().then(image => {
              console.log('image', image);
              this.utilisateur.avatar = image;
            })
          }
        },
        {
          text: 'Annuler',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

}