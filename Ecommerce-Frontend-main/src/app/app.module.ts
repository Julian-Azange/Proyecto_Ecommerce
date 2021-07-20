import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from '@app/components/header/header.component';
import { FooterComponent } from '@app/components/footer/footer.component';
import { CartComponent } from '@app/components/cart/cart.component';
import { CheckoutComponent } from '@app/components/checkout/checkout.component';
import { HomeComponent } from '@app/components/home/home.component';
import { ProductComponent } from '@app/components/product/product.component';
import { ThankyouComponent } from '@app/components/thankyou/thankyou.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '@app/components/login/login.component';
import { ProfileComponent } from '@app/components/profile/profile.component';
import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { RegisterComponent } from '@app/components/register/register.component';
import { HomeLayoutComponent } from '@app/components/home-layout/home-layout.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ModalLoginComponent } from './components/modal-login/modal-login.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { ResultsComponent } from './components/results/results.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CategoriaAddEditComponent } from './components/categoria-add-edit/categoria-add-edit.component';
import { ProductoAdminComponent } from './components/producto-admin/producto-admin.component';
import { ProductoAddEditComponent } from './components/producto-add-edit/producto-add-edit.component';
import { UsuariosAdminComponent } from './components/usuarios-admin/usuarios-admin.component';
import { UsuariosAddEditComponent } from './components/usuarios-add-edit/usuarios-add-edit.component';
import { Page404Component } from './components/page404/page404.component';
import { CategoriaDetailsComponent } from './components/categoria-details/categoria-details.component';
import { ProductoDetailsComponent } from './components/producto-details/producto-details.component';
import { UsuariosDetailsComponent } from './components/usuarios-details/usuarios-details.component';


const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('241767022865-k5vmtcirlp6j5k2n9us6s5akj0rnq2go.apps.googleusercontent.com')
  }

]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CartComponent,
    CheckoutComponent,
    HomeComponent,
    ProductComponent,
    ThankyouComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    HomeLayoutComponent,
    CategoriesComponent,
    ModalLoginComponent,
    ContactComponent,
    AboutComponent,
    PurchasesComponent,
    ResultsComponent,
    AdminMenuComponent,
    CategoriaComponent,
    CategoriaAddEditComponent,
    ProductoAdminComponent,
    ProductoAddEditComponent,
    UsuariosAdminComponent,
    UsuariosAddEditComponent,
    Page404Component,
    CategoriaDetailsComponent,
    ProductoDetailsComponent,
    UsuariosDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
