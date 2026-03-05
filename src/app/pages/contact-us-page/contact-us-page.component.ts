import { Component } from '@angular/core';
import { ContactUsComponent } from '../../shared/components/contact-us/contact-us.component';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-contact-us-page',
  standalone: true,
  imports: [NavBarComponent, ContactUsComponent],
  templateUrl: './contact-us-page.component.html',
  styleUrl: './contact-us-page.component.css',
})
export class ContactUsPageComponent {}
