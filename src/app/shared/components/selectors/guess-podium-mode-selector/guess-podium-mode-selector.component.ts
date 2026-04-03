import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-guess-podium-mode-selector',
  templateUrl: './guess-podium-mode-selector.component.html',
  styleUrls: ['./guess-podium-mode-selector.component.css'],
  standalone: true,
})
export class GuessPodiumModeSelectorComponent {
  public gameMode?: string;
  @Output() guessSelected = new EventEmitter<string>();

  startGame() {
    this.guessSelected.emit(this.gameMode);
  }
}
