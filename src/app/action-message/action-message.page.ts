import { ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Utilisateur } from './../../models/utilisateur-interface';
import { environement } from 'src/models/environements';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Message } from 'src/models/message-interface';

@Component({
  selector: 'app-action-message',
  templateUrl: './action-message.page.html',
  styleUrls: ['./action-message.page.scss'],
})
export class ActionMessagePage implements OnInit {
action: string;
id: string;
uid: string;
message: Message;
msgContent: string ="";
utilisateur: Utilisateur;
  constructor(private activatedRoute : ActivatedRoute, private http: HttpClient,
    private storage: NativeStorage, private toastCtrl: ToastController) { }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid');
    console.log('route params', this.id, this.action, this.uid);
    this.utilisateur = await this.storage.getItem('Utilisateur');
    if (this.id === '1000') {
      this.message = {} as Message;
    } else {
      this.loadMessage()
      .subscribe(message => {
        console.log('message', message);
        this.message = message;
      })
    }
  }
  loadMessage() {
    let url: string = `${environement.api_url}/Messages/${this.id}`;
    return this.http.get<Message>(url);
  }
  toggleAction() {
    this.action = 'write';
  }
  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  send() {
    let id: string;
    let pictureId: string = this.message.picture;
    const url1: string =`${environement.api_url}/Utilisateurs/findOne?filter[where][avatar]=${pictureId}`;
    this.http.get<Utilisateur>(url1)
      .subscribe(result => {
        id = result.id;
        let url: string = `${environement.api_url}/Utilisateurs/${id}/messages`;
        let message : Message = {
          title: this.utilisateur.username,
          picture: this.utilisateur.avatar,
          content: this.msgContent,
          createdAt: new Date().getTime(),
          read: false,
          messageTo: id
        };
        console.log('url et message', url, message);
        this.http.post(url, message)
          .subscribe(data => {
            console.log('data', data);
            this.presentToast('Envoyé', 1000);
            this.msgContent = "";
          }, error => {
            console.log('error', error);
            this.presentToast('Non envoyé', 1000);
          })
      })
  }

  contact() {
    console.log('contact');
    let id: string = this.uid;
    let url: string = `${environement.api_url}/Utilisateurs/${id}/messages`;
        let message : Message = {
          title: this.utilisateur.username,
          picture: this.utilisateur.avatar,
          content: this.msgContent,
          createdAt: new Date().getTime(),
          read: false,
          messageTo: id
        };
        console.log('url et message', url, message);
        this.http.post(url, message)
          .subscribe(data => {
            console.log('data', data);
            this.presentToast('Envoyé', 1000);
            this.msgContent = "";
          }, error => {
            console.log('error', error);
            this.presentToast('Non envoyé', 1000);
          })
  }

}
