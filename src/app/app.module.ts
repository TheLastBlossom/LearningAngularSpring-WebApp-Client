import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ClientComponent } from './components/client/client.component';
import { RouterModule, Routes } from '@angular/router';
import { ExampleComponent } from './components/example/example.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormComponent } from './components/client/form.component';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { DetailsComponent } from './components/client/details/details.component';
import { LoginComponent } from './components/user/login.component';
import { authGuard } from './components/user/guards/auth.guard';
import { roleGuard } from './components/user/guards/role.guard';
import { AuthInterceptor } from './components/user/interceptors/auth.interceptor';
import { ResponseInterceptor } from './components/user/interceptors/reponse.interceptor';
import { BillDetailsComponent } from './components/bills/bill-details.component';
import { BillsComponent } from './components/bills/bills.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
registerLocaleData(localeEs, 'es')
const routes: Routes = [
  { path: '', redirectTo: '/clients', pathMatch: 'full' },
  { path: 'clients', component: ClientComponent },
  { path: 'clients/page/:page', component: ClientComponent },
  { path: 'accordion', component: ExampleComponent },
  { path: 'clients/form', component: FormComponent, canActivate: [authGuard, roleGuard], data: { role: "ROLE_ADMIN" } },
  { path: 'clients/form/:id', component: FormComponent, canActivate: [authGuard, roleGuard], data: { role: "ROLE_ADMIN" } },
  { path: 'login', component: LoginComponent },
  { path: 'bills/:id', component: BillDetailsComponent },
  { path: 'bills/form/:clientId', component: BillsComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientComponent,
    ExampleComponent,
    FormComponent,
    PaginatorComponent,
    DetailsComponent,
    LoginComponent,    
    BillDetailsComponent, BillsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    NoopAnimationsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en' }, 
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
