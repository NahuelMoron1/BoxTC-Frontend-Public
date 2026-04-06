import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PlayGuessDriverComponent } from '../../shared/components/play/play-guess-driver/play-guess-driver.component';

@Component({
  selector: 'app-play-guess-driver-page',
  imports: [NavBarComponent, PlayGuessDriverComponent],
  templateUrl: './play-guess-driver-page.component.html',
  styleUrl: './play-guess-driver-page.component.css',
})
export class PlayGuessDriverPageComponent {}
