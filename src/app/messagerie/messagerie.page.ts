import { NavController } from '@ionic/angular';
import { Notification } from './../../models/notification-interface';
import { environement } from 'src/models/environements';
import { Observable, forkJoin } from 'rxjs';
import { Utilisateur } from './../../models/utilisateur-interface';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Message } from 'src/models/message-interface';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.page.html',
  styleUrls: ['./messagerie.page.scss'],
})
export class MessageriePage implements OnInit {
  messageType: string = 'received';
  utilisateur: Utilisateur;
  messages_received: Message[];
  messages_sent : Message[];
  notifications: Notification[];
  constructor(private http: HttpClient, private storage : NativeStorage,
      private navCtrl: NavController) { }

  async ngOnInit() {
    this.utilisateur = await this.storage.getItem('Utilisateur');
    this.loadAll()
      .subscribe(results => {
        console.log('results', results);
        this.messages_received = results[0];
        this.messages_sent = results[1];
        this.notifications = results[2];
      })
  }

  segmentChanged($event) {
    this.messageType = $event.detail.value;
  }

  loadAll(event?) {
    if (event) {
      forkJoin(this.loadReceived(), this.loadSent(), this.loadNotif())
      .subscribe(results => {
        console.log('results', results);
        this.messages_received = results[0];
        this.messages_sent = results[1];
        this.notifications = results[2];
        event.target.complete();
      })
    } else {
      return forkJoin(this.loadReceived(), this.loadSent(), this.loadNotif());
    }
  }

  loadReceived(event?) : Observable<Message[]> {
    let url: string = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}/messages`;
    console.log('url', url);
    return this.http.get<Message[]>(url);
  }
  loadSent(event?) : Observable<Message[]> {
    let url: string = `${environement.api_url}/Messages?filter[where][title]=${this.utilisateur.username}`;
    console.log('url', url);
    return this.http.get<Message[]>(url);
  }
  loadNotif(event?) : Observable<Notification[]> {
    let url: string = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}/notifications`;
    console.log('url', url);
    return this.http.get<Notification[]>(url);
  }

  messageWrite(message: Message, i) {
    this.navCtrl.navigateForward(`/action-message/${message.id}/write/${'1000'}`);
  }
  messageView(message: Message, i) {
    this.navCtrl.navigateForward(`/action-message/${message.id}/read/${'1000'}`);
  }


}
