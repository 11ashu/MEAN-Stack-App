import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router }  from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  messageClass;
  message;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  constructor(
    private formBuilder: FormBuilder,
    private authServices: AuthService,
    private router: Router
  ) {
    this.createForm(); 
  }

  // Function to create registration form
  createForm() {
    this.form = this.formBuilder.group({
      // Email Input
      email: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(30), 
        this.validateEmail // Custom validation
      ])],
      // Username Input
      username: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(15), 
        this.validateUsername // Custom validation
      ])],
      // Password Input
      password: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(35), 
        this.validatePassword // Custom validation
      ])],
      // Confirm Password Input
      confirm: ['', Validators.required] 
    }, { validator: this.matchingPasswords('password', 'confirm') }); // Add custom validator to form for matching passwords
  }

  // Function to validate e-mail is proper format
  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true } 
    }
  }

  // Function to validate username is proper format
  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true }
    }
  }

  // Function to validate password
  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true }
    }
  }

  // Funciton to ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }

  // Function to submit form
  onRegisterSubmit() {
    this.processing = true;
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }
    this.authServices.registerUser(user).subscribe(data => {
       if(!data.success){
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
          this.processing = false; // 16:06 min pause video
       }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 2000)
       }
    })
  }
  
  checkEmail() {
    this.authServices.checkEmail(this.form.get('email').value).subscribe(data => {
      if(!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message;
      }else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkUsername() {
    this.authServices.checkUsername(this.form.get('username').value).subscribe(data => {
      if(!data.success) {
        this.usernameValid = false;
        this.usernameMessage = data.message;
      }else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  }

  ngOnInit() {
  }

}