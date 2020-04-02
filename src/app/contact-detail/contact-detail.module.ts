import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ContactDetailComponent} from './contact-detail.component';
import {ContactDetailShellComponent} from './contact-detail-shell/contact-detail-shell.component';
import {ContactDetailResolverService} from './contact-detail-resolver.service';
import {AuthGuard} from '../auth/auth.guard';
import {ContactFormComponent} from './contact-form/contact-form.component';

import { ReactiveFormsModule } from '@angular/forms';

import {FormsModule} from "@angular/forms";
import {StartWithCapitalDirective} from "src/app/directives/startWithCapital.directive";
import { ContactFormReactiveComponent } from './contact-form-reactive/contact-form-reactive.component';

const contactDetailRoutes: Routes = [
  {
    path: 'contact-detail',
    component: ContactDetailShellComponent,
    data: {title: "Contact Formulario Template"},
    children: [
      {path: '', component: ContactFormComponent},
      {
        path: ':id', component: ContactDetailComponent,
        resolve: {contact: ContactDetailResolverService}
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path : 'contat-form-reactive',
    component: ContactFormReactiveComponent,
    data: {title: "Contact Formulario Reactivo"}
  },
];

@NgModule({
  imports: [
    //Modules
    CommonModule,
    RouterModule.forChild(contactDetailRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ContactDetailComponent,
    ContactDetailShellComponent,
    ContactFormComponent,

    StartWithCapitalDirective,

    ContactFormReactiveComponent   //Importamos la directiva ya que se usara en el formulario
  ]

})
export class ContactDetailModule {
}
