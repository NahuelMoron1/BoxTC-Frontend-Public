import { Component } from '@angular/core';
import { AboutUsComponent } from '../../shared/components/about-us/about-us.component';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [NavBarComponent, AboutUsComponent],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css',
})
export class AboutUsPageComponent {}
