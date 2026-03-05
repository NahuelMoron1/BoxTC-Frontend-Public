import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { SelectGameMenuComponent } from '../../shared/components/select-game-menu/select-game-menu.component';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [NavBarComponent, SelectGameMenuComponent],
  templateUrl: './game-menu.component.html',
  styleUrl: './game-menu.component.css',
})
export class GameMenuComponent {}
