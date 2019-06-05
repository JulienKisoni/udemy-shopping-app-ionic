import { NavController } from '@ionic/angular';
import { environement } from './../../models/environements';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Article } from 'src/models/article-interface';
import { Observable } from 'rxjs';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  articles : Article[];
  constructor(private http: HttpClient, private photoViewer: PhotoViewer, private navCtrl: NavController) {
    this.loadData();
  }

  ngOnInit() {
    this.loadData()
    .subscribe((data: Article[]) => {
      console.log('articles', data);
      this.articles = data;
    })
  }

  loadData() : Observable<Article[]> {
    let url: string = `${environement.api_url}/Articles`;
    return this.http.get<Article[]>(url);
      
  }

  doRefresh($event) {
    this.loadData()
    .subscribe((data: Article[]) => {
      console.log('articles à partir de doRefresh', data);
      this.articles = data;
        $event.target.complete();
    })
  }

  showImage(imgId: string, imgTitle: string, event) {
    event.stopPropagation();
    this.photoViewer.show(`http://192.168.8.101:3000/api/Containers/photos/download/${imgId}`, 
    imgTitle, {share: true});
  }

  showDetails(id: string) {
    this.navCtrl.navigateForward('/product-detail/'+id)
  }

  onSearch(event) {
    let value: string = event.target.value;
    if(value) {
      this.articles = this.articles.filter((article) => {
        return article.title.toLowerCase().includes(value.toLowerCase());
      })
    }
  }
  onCancel(event) {
    this.loadData()
    .subscribe((data: Article[]) => {
      console.log('articles à partir de doRefresh', data);
      this.articles = data;
    })
  }
}
