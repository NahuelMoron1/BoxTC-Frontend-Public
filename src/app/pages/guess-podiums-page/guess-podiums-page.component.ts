import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PlayGuessPodiumsComponent } from '../../shared/components/play/play-guess-podiums/play-guess-podiums.component';

@Component({
  selector: 'app-guess-podiums-page',
  templateUrl: './guess-podiums-page.component.html',
  styleUrls: ['./guess-podiums-page.component.css'],
  standalone: true,
  imports: [NavBarComponent, PlayGuessPodiumsComponent],
})
export class GuessPodiumsPageComponent {}
