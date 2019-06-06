import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Component, OnInit } from '@angular/core';
import { itemCart } from 'src/models/itemCart-interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
cartItems: itemCart[];
total: number = 0;
  constructor(private storage: NativeStorage) { }

  async ngOnInit() {
    this.cartItems = await this.storage.getItem("Cart");
    this.cartItems.forEach((element: itemCart) => {
      if (element.item.availability.type === "En Magasin") {
        element.item.availability.feed = 0;
      }
      this.total += element.item.availability.feed + element.item.price * element.qty;
    })
  }

}