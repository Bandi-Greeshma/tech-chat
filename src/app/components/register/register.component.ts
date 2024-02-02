import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Register } from '../../shared/models/auth.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private auth: AuthService, private http: HttpClient) {}

  async ngOnInit() {
    this.getPosition().subscribe((res) => {
      const { latitude, longitude } = res.coords;
      this.http
        .get<any>(`https://geocode.xyz/${latitude},${longitude}?geoit=json`)
        .subscribe((position) => {
          console.log(position.country);

          this.registerForm.patchValue({
            country: position.country,
          });
        });
    });

    // const position: GeolocationPosition = await this.getPosition();
    // const { latitude, longitude } = position.coords;
    // const resGeo = await fetch(
    //   `https://geocode.xyz/${latitude},${longitude}?geoit=json`
    // );
    // const dataGeo = await resGeo.json();
    // console.log(dataGeo);
    // this.registerForm.patchValue({
    //   country: dataGeo.country,
    // });
  }

  // getPosition() {
  //   return new Promise<GeolocationPosition>((resolve, reject) => {
  //     navigator.geolocation.getCurrentPosition((loc) => {
  //       resolve(loc);
  //     });
  //   });
  // }

  getPosition() {
    return new Observable<GeolocationPosition>((observer) => {
      navigator.geolocation.getCurrentPosition((loc) => {
        observer.next(loc);
      });
    });
  }

  registerForm = new FormGroup({
    personalDetails: new FormGroup({
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    }),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}:;<>,.?~\\-]).{8,20}$'
      ),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    country: new FormControl(''),
    gender: new FormControl(''),
  });

  onSubmit() {
    console.log(this.registerForm.value);
    const value = this.registerForm.value;
    if (this.registerForm.valid) {
      const payload: Register = {
        username: value.personalDetails?.userName || '',
        email: value.personalDetails?.email || '',
        password: value.password || '',
      };
      this.auth.register(payload);
      this.registerForm.reset();
    }
  }
}
