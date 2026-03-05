import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-not-found',
  standalone: true,
  imports: [],
  templateUrl: './game-not-found.component.html',
  styleUrl: './game-not-found.component.css',
})
export class GameNotFoundComponent {
  @Input() gameName: string = 'F1';
}
