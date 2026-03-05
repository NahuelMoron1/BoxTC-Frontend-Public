import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-lost',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game-lost.component.html',
  styleUrl: './game-lost.component.css'
})
export class GameLostComponent {
  @Input() gameName: string = '';
}
