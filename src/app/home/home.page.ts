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
    
  }
}
