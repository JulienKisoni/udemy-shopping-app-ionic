import { environement } from './../../models/environements';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nom: string;
  description: string;

  constructor( private http : HttpClient) {
    this.loadArticles();
  }

  loadArticles() : void {
    let url : string = `${environement.api_url}/Articles`;
    console.log('url', url);
    this.http.get(url)
      .subscribe(data => console.log('data', data));
  }
  create() : void {
    let url : string = `${environement.api_url}/Articles`;
    this.http.post(url, { nom : this.nom, description: this.description})
      .subscribe(data => console.log('data', data));
  }
  update() : void {
    let id : string = "5cdd31ac93a0d41028f7a4ee";
    let url : string = `${environement.api_url}/Articles/${id}`;
    this.http.patch(url, { nom: "Belle Chemise (updated)"})
      .subscribe(data => console.log('data', data));
  }
}
