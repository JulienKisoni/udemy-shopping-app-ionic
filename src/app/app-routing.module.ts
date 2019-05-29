import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },  { path: 'category', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'messagerie', loadChildren: './messagerie/messagerie.module#MessageriePageModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
