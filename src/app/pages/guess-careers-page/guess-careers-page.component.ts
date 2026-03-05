import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { GuessCareersComponent } from '../../shared/components/play/guess-careers/guess-careers.component';

@Component({
  selector: 'app-guess-careers-page',
  imports: [NavBarComponent, GuessCareersComponent],
  templateUrl: './guess-careers-page.component.html',
  styleUrl: './guess-careers-page.component.css'
})
export class GuessCareersPageComponent {

}
