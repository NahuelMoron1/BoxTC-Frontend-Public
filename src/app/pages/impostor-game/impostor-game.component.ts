import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PlayImpostorComponent } from '../../shared/components/play/play-impostor/play-impostor.component';

@Component({
  selector: 'app-impostor-game',
  standalone: true,
  imports: [NavBarComponent, PlayImpostorComponent],
  templateUrl: './impostor-game.component.html',
  styleUrl: './impostor-game.component.css',
})
export class ImpostorGameComponent {}
