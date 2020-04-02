import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";
import {Directive, Input} from "@angular/core";

//Funcion que permitira validar si el input, empieza la primera letra en mayuscula
export function startWithCapitalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    //Control.value devuelve los datos digitados en el input
    if (!control.value) {  // Si no tiene datos en el input, no ejecuta nada y retorno un null para que el formulario sea valido
      return null;
    } else {
      const valid = /^[A-Z]/.test(control.value);   //Provara el valor desde donde venga el input, que empiece en una mayuscula
      //retornara un objeto, con el posible error
      return valid ? null : {'startsWithCapital': {value: control.value}}
    }
  }
}

@Directive({
  selector: '[startsWithCapital]',   //selecctor que se pondra en el elemento para acceder
  providers: [{
    provide: NG_VALIDATORS,  //Provee las validaciones propias de angular
    useExisting: StartWithCapitalDirective,  //Indica que se debe usar la instancia de la clase definida abajo
    multi: true  //Permite añadir este validador a otros validators
  }]
})

export class StartWithCapitalDirective implements Validator {
  //La propiedad recibira un boolean al llamar la directiva
  @Input('startsWithCapital') isActive:boolean;

  validate(control:AbstractControl):(ValidationErrors | null){

    //si es false isActive retornamos un null ya que significa que al llamar la directiva se paso un false
    //si es true, ejecutara la funcion de validacion y le pasamos el control
    return !this.isActive ? null : startWithCapitalValidator()(control);
  }
}
