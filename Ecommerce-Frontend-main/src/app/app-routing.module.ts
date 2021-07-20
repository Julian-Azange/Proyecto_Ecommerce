import { UsuariosDetailsComponent } from './components/usuarios-details/usuarios-details.component';
import { ProductoDetailsComponent } from './components/producto-details/producto-details.component';
import { CategoriaDetailsComponent } from './components/categoria-details/categoria-details.component';
import { Page404Component } from './components/page404/page404.component';
import { AdminGuard } from './guard/admin.guard';
import { NormalGuard } from './guard/normal.guard';
import { CategoriaAddEditComponent } from './components/categoria-add-edit/categoria-add-edit.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { ResultsComponent } from './components/results/results.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileGuard } from './guard/profile.guard';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ModalLoginComponent } from './components/modal-login/modal-login.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { ProductoAdminComponent } from './components/producto-admin/producto-admin.component';
import { ProductoAddEditComponent } from './components/producto-add-edit/producto-add-edit.component';
import { UsuariosAdminComponent } from './components/usuarios-admin/usuarios-admin.component';
import { UsuariosAddEditComponent } from './components/usuarios-add-edit/usuarios-add-edit.component';


const routes: Routes = [
  // Define routes for the landing / home page, create a separate component for the layout of home page
  // put only header, footer and router-outlet there
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '', component: HomeComponent
      },
      {
        path: 'home', redirectTo: '/'
      },
      {
        path: '#', redirectTo: '/'
      },
      {
        path: 'product/:id', component: ProductComponent
      },
      {
        path: 'cart', component: CartComponent
      },
      {
        path: 'checkout', component: CheckoutComponent, canActivate: [ProfileGuard]
      },
      {
        path: 'thankyou/:idOrder', component: ThankyouComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard]
      },
      {
        path: 'register', component: RegisterComponent
      },
      {
        path: 'categories', component: CategoriesComponent
      },
      {
        path: 'modal-login', component: ModalLoginComponent
      },
      {
        path: 'contact', component: ContactComponent
      },
      {
        path: 'about', component: AboutComponent
      },
      {
        path: 'purchases', component: PurchasesComponent, canActivate: [ProfileGuard]
      },
      {
        path: 'results/search/:page/:text', component: ResultsComponent
      },
      {
        path: 'results/categories/:page/:idCategory', component: ResultsComponent
      },
      {
        path: 'admin', component: AdminMenuComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/categoria', component: CategoriaComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/categoria/Add', component: CategoriaAddEditComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/categoria/Edit/:idCategory', component: CategoriaAddEditComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/categoria/Details/:idCategory', component: CategoriaDetailsComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/producto', component: ProductoAdminComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/producto/Add', component: ProductoAddEditComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/producto/Edit/:idProduct', component: ProductoAddEditComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/producto/Details/:idProduct', component: ProductoDetailsComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/users', component: UsuariosAdminComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/users/Add', component: UsuariosAddEditComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/users/Edit/:idUser', component: UsuariosAddEditComponent, canActivate: [AdminGuard]
      },
      {
        path: 'admin/users/Details/:idUser', component: UsuariosDetailsComponent, canActivate: [AdminGuard]
      },
      // Wildcard Route if no route is found == 404 NOTFOUND page
      {
        path: '**', component: Page404Component
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
