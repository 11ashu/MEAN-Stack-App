import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _flashMessagesService: FlashMessagesService, private authService: AuthService, private router: Router) { }
  
  onLogoutClick(){
    this.authService.logout();
    this._flashMessagesService.show('You are logged out from portal. Thank yoy!!', { cssClass: 'alert-info'});
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}
