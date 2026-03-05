import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-won',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game-won.component.html',
  styleUrl: './game-won.component.css'
})
export class GameWonComponent {
  @Input() gameName: string = '';
}
