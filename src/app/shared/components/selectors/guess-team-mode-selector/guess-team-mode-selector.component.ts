import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-guess-team-mode-selector',
  imports: [],
  templateUrl: './guess-team-mode-selector.component.html',
  styleUrl: './guess-team-mode-selector.component.css',
})
export class GuessTeamModeSelectorComponent {
  public gameMode?: string;
  @Output() guessSelected = new EventEmitter<string>();

  startGame() {
    this.guessSelected.emit(this.gameMode);
  }
}
