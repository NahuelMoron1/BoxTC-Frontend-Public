import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PlayH2hComponent } from '../../shared/components/play/play-h2h/play-h2h.component';

@Component({
  selector: 'app-h2h-game',
  imports: [NavBarComponent, PlayH2hComponent],
  templateUrl: './h2h-game.component.html',
  styleUrl: './h2h-game.component.css',
})
export class H2hGameComponent {}
