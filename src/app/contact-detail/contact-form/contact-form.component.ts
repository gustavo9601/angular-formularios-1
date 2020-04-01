import {Component, OnInit} from '@angular/core';

//Models
import {Contact, PhoneType} from "src/app/contact.model";

//Services
import {ContactsService} from "src/app/contacts.service";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {


  public contactModal: Contact;
  public readonly phoneTypes: string[] = Object.values(PhoneType);

  constructor(private _contactService: ContactsService) {
    this.resetContactModel();
  }

  ngOnInit() {
  }


  addContact() {
    this._contactService.addContact(this.contactModal);
    this.resetContactModel();
  }

  resetContactModel() {
    this.contactModal = new Contact(0, '', 'assets/default-user.png', []);
  }

  addNewPhoneToModel() {
    this.contactModal.phones.push(
      {
        type: null,
        number: null
      }
    )
  }

  addImage(event) {
    console.log("Evento enviado a addImage", event)
    const file = event.target.files[0];   //Ruta para acceder al archivo seleccionado

    //Usando JS puro, usamos la clase FileReader
    const reader = new FileReader();
    reader.readAsDataURL(file);

    //.onload(event) permite devolver en base 64 la imagen cargada
    reader.onload = (evt) => {
      this.contactModal.picture = <string>reader.result;
    }
  }

}
