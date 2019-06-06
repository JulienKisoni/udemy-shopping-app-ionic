import { ToastController, NavController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from 'src/models/article-interface';
import { environement } from 'src/models/environements';
import { itemCart } from 'src/models/itemCart-interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
article : Article;
slidesOpt = {
  speed: 1000,
  autoplay: {
    delay: 500
  }
}
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
      private photoViewer : PhotoViewer, private storage: NativeStorage,
      private toastCtrl: ToastController, private navCtlr: NavController) { }

  ngOnInit() {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('id', id);
    this.loadData(id)
      .subscribe(data => {
        this.article = data;
      })
  }

  loadData(id: string) : Observable<Article> {
    let url: string = `${environement.api_url}/Articles/${id}`;
    return this.http.get<Article>(url);
      
  }
  showImage(imgId: string, imgTitle: string) {
    this.photoViewer.show(`http://192.168.8.101:3000/api/Containers/photos/download/${imgId}`, 
    imgTitle, {share: true});
  }

  openCart() {
    this.navCtlr.navigateForward('/cart');
  }

  async addToCart(item: Article) {
    try {
      let data: itemCart[];
      let added: boolean = false;
    data = await this.storage.getItem("Cart");
    console.log("data", data);
    // on vérifie si le panier est vide
    if (data === null || data.length === 0) {
      data.push({
        item: item,
        qty: 1,
        amount: item.price
      });
    }
    // Si le panier n'est pas vide
    else {
      for (let i = 0; i < data.length; i++) {
        const element: itemCart = data[i];
        if (item.id === element.item.id) {
          // le panier contient déjà cette article
          element.qty += 1;
          element.amount += item.price;
          added = true;
        }
      }
    }
    if (!added) {
      // le panier n'est pas vide et ne contient pas l'article
      data.push({
        item: item,
        qty: 1,
        amount: item.price
      });
    }
      await this.storage.setItem("Cart", data);
      this.presentToast('Votre panier a été mis à jour', 1500);
    }
    catch(e){
      let myData: itemCart[] = [];
      console.log("error", e);
      if (e.code === 2) {
        myData.push({
          item: item,
        qty: 1,
        amount: item.price
      });
      await this.storage.setItem("Cart", myData);
        this.presentToast('Votre panier a été mis à jour', 1500);
      }
    }
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

}
