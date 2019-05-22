import { environement } from './../../models/environements';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nom: string;
  description: string;

  constructor(private http: HttpClient) {
    this.loadArticles();
  }

  loadArticles() : void {
    let url = `${environement.api_url}/Articles`;
    console.log('url', url);
    this.http.get(url)
      .subscribe(articles => console.log('articles', articles));
  }
  insertArticle() : void {
    let url = `${environement.api_url}/Articles`;
    this.http.post(url, { nom: this.nom, description: this.description})
      .subscribe(results => console.log('results', results));
  }
  updateArticle() : void {
    let id : string = "5cdd320d93a0d41028f7a4f1";
    let url = `${environement.api_url}/Articles/${id}`;
    this.http.patch(url, { nom : "Montre (updated)"})
      .subscribe(result => console.log('result', result));
  }
  removeArticle() : void {
    let id : string = "5ce560af6ec6870ba84b8851";
    let url = `${environement.api_url}/Articles/${id}`;
    this.http.delete(url)
      .subscribe(result => console.log('result', result));
  }
}
