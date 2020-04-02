import {Component, OnInit} from '@angular/core';
import {Contact, PhoneType} from 'src/app/contact.model';
import {ContactsService} from 'src/app/contacts.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

//Funcion de validacion
import {startWithCapitalValidator} from "src/app/directives/startWithCapital.directive";
import {zip} from "rxjs/index";
import {filter, map, tap} from "rxjs/internal/operators";

@Component({
  selector: 'app-contact-form-reactive',
  templateUrl: './contact-form-reactive.component.html',
  styleUrls: ['./contact-form-reactive.component.scss']
})
export class ContactFormReactiveComponent implements OnInit {

  public readonly phoneTypes: string[] = Object.values(PhoneType);


  /*
  * FormGroup = recibe una instacia de FormGroup
  * entre [] recibira todos los valores de los campos
  * */
  public contactForm: FormGroup = new FormGroup({

    //aributo: instancia_clase(valor_inicial, [reglas de validacion])
    name: new FormControl('', [Validators.required, Validators.minLength(2), startWithCapitalValidator()]),
    picture: new FormControl('assets/default-user.png'),
    phones: new FormArray([   // FormArray  permite recibir una serie de elementos, para iterar o pushear dinamicamente
      new FormGroup({
        type: new FormControl(null),
        number: new FormControl('')
      }),
    ]),
    email: new FormControl(''),
    address: new FormControl('', [Validators.required])
  });

  constructor(private contactsService: ContactsService) {
  }

  ngOnInit() {
    this.interactuandoApiObservablesForms();

    this.getStorageLocalValidForm();
  }

  addContact() {


  }


  addNewPhoneToModel() {
    //accedemos al get phones para pushear un nuevo objeto al arreglo de phones
    this.phones.push(
      new FormGroup({
        type: new FormControl(null),
        number: new FormControl('')
      })
    )
  }


  addImage(event) {
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (evt) => {

      //.pathValue   permite modificar el estado a un elemento o varios
      this.contactForm.patchValue({
        picture: reader.result  // cambiara el valor  de picture por reader.result
      });
    }
  }


  //De esta forma accedera con solo address desde la vista al .get(elemento)
  get address() {
    return this.contactForm.get('address');
  }

  get phones() {
    return this.contactForm.get('phones') as FormArray;
  }

  resetForm() {

    //.reset() funcionaria pero cambia los valores por default de los elementos
    this.contactForm.reset();

    this.contactForm.setValue({
      name: '',
      picture: "assets/default-user.png",
      phones: [{
        type: null,
        number: ''
      }],
      email: '',
      address: ''
    });
  }

  interactuandoApiObservablesForms() {

    //zip(recibe observables, y los conviertes a objetos para poder ser manupulados)
    zip(this.contactForm.statusChanges, this.contactForm.valueChanges).pipe(
      filter(([state, value]) => state == 'VALID'),  // [destructuring] => accedemos al estado del evento y filtrara solo los que tenga VALID
      map(([state, value]) => value),  // edita la respuesta dejando solo value a retornar
      tap(data => console.log(data))   //tap(datos)  permite devolver simplemente la data a retornada
    ).subscribe(
      //do something
      (valoresFormulario) => {
        ///Cada ves que sea valido los campos, llamara est funcion
        this.saveStorageLocalValidForm(valoresFormulario);
      }
    );
  }


  saveStorageLocalValidForm(valoresFormulario) {
    localStorage.setItem('contact', JSON.stringify(valoresFormulario));
  }

  getStorageLocalValidForm() {
    let contact = localStorage.getItem('contact');
    if (contact) {
      let contactObject = JSON.parse(contact);

      this.phones.clear();   //De esta forma borra todos los objetos FormGroup que se crean por default

      //Como phones es un arreglo, para setear el valor, es necsario tantos FormGroup de phones como telefonos esten el storage
      for (let i = 0; i < contactObject.phones.length; i++) {
        this.addNewPhoneToModel();  //Creara FormsGroup nulos
      }

      this.contactForm.setValue(contactObject);
    }

  }

}
