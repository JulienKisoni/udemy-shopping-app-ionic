import { HttpClient } from '@angular/common/http';
import { NavController, ActionSheetController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Utilisateur } from './../../models/utilisateur-interface';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Component, OnInit } from '@angular/core';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { environement } from 'src/models/environements';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
profileType: string = "Profil";
utilisateur = {} as Utilisateur;
imgUploaded: boolean = false;
  constructor(private storage: NativeStorage, private imagePicker: ImagePicker, private camera: Camera,
    private navCtrl: NavController, private actionSheet: ActionSheetController,
    private transfer: FileTransfer, private http: HttpClient, private toastCtrl: ToastController) { }

  async ngOnInit() {
    this.utilisateur = await this.storage.getItem('Utilisateur');
    if (this.utilisateur.avatar === "") {
      this.utilisateur.avatar = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';
    }
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  segmentChanged($event) {
    console.log('event', $event);
    this.profileType = $event.detail.value;
  }

  async uploadImages(image: string) {
        let elementName: string = image.substr(image.lastIndexOf('/')+1);
        console.log('elementName', elementName);
        let fileTransfer: FileTransferObject = this.transfer.create();
        const url: string = `${environement.api_url}/Containers/photos/upload`;
        console.log('url',url);
        let options: FileUploadOptions = {
          fileKey: 'Shopping',
          fileName: elementName,
          chunkedMode: false,
          mimeType: 'image/jpeg',
          headers: {}
        }
        if (!this.imgUploaded) {
          let data = await fileTransfer.upload(image, url, options);
          let id: string = JSON.parse(data.response)._id;
          console.log('id', id);
          // this.utilisateur.avatar = id;
          this.imgUploaded = true;
          return id;
        }
  }


  async updateProfile() {
    console.log('utilisateur', this.utilisateur);
    let flag : string = await this.uploadImages(this.utilisateur.avatar);
    if (flag) {
      this.utilisateur.avatar = flag;
      const url: string = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}`;
      this.http.put(url, this.utilisateur)
        .subscribe(result => {
          // Afficher un message toast
          console.log('result', result);
          this.presentToast('Mise à jour réussie !', 2000);
        }, error => {
          console.log('echec', error);
          this.presentToast('Echec de la mise à jour !', 2000);
        })
    }
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