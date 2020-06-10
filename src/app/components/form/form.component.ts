import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  datos: any;
  warningText: string;
  warningPhone: string;
  warningPhoneBool = false;
  warningName: string;
  warningLastName: string;
  warningMail: string;
  warningMailBool = false;
  doneFormText: string;
  warBool = false;
  doneForm = false;

  verifiedData: object;
  constructor(private http: HttpClient) { }

  obtainForm = new FormGroup({
    name: new FormControl(''),
    lastname: new FormControl(''),
    mail: new FormControl(''),
    countries: new FormControl(''),
    gender: new FormControl(''),
    phone: new FormControl('')
  });


  showVerifiedData() { 
    this.verifiedData = this.obtainForm.value;
    console.log(this.verifiedData);
    
   }

  warning(a: string) {
    this.warBool = true;
    this.warningText = `El campo ${a} no ha sido llenado,
                        Por favor llena todos los campos`;
    return;
  }


  validateName(name: string, lastname: string): string {
    this.obtainForm.value.name = name.trim().split(' ')[0];
    this.obtainForm.value.lastname = lastname.trim().split(' ')[0];
    return this.obtainForm.value.name;
  }

  validateNumber(numero: string) {
    if (numero.match(/^[0-9]+$/)) {
      this.obtainForm.value.phone = `(${numero.substring(0, 2)}) - ${numero.substring(2, 5)} - ${numero.substring(5, 8)} - ${numero.substring(8, 10)}`;
    } else {
      this.warningPhoneBool = true;
      this.warningPhone = 'Introduce un número correcto';
     }
}
  validateMail(mail: string) {

    const arrStrings = mail.split('@');
    const arrSubString = arrStrings[1].split('.');

    // tslint:disable-next-line: use-isnan
    if (isNaN(Number(mail.substring(0, 1))) && arrSubString[1] === 'com') {
       this.obtainForm.value.mail = `${arrStrings[0]}@${arrSubString[0]}${arrSubString[1]}`;
      return; 
    } else {
      this.warningMail = `Por favor introduzca un correo váildo`;
      this.warningMailBool = true;
    }
}

  
  
  valInputs(objeto: any) {
    
    this.validateName(objeto.name, objeto.lastname);
    this.validateNumber(objeto.phone);
    this.validateMail(objeto.mail);
    
    if (this.warningPhoneBool == this.warningMailBool) {
      this.showVerifiedData();
    }
    
    this.warBool = false;
    return;
  }


  showObtain(e): any  {
    e.preventDefault();
    // tslint:disable-next-line: forin
    for (const key in this.obtainForm.value) {
      if (this.obtainForm.value[key] == '')
      { return this.warning(key); }
    }
    this.valInputs(this.obtainForm.value);
  }


  async getApi() {
return await this.http.get('https://restcountries.eu/rest/v2/all')
                      .subscribe((data: any) => { this.datos = data; });
 }


  ngOnInit(): void {
    this.getApi();
  }

}
