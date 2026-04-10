import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-guess-driver-selector',
  imports: [],
  templateUrl: './guess-driver-selector.component.html',
  styleUrl: './guess-driver-selector.component.css',
})
export class GuessDriverSelectorComponent {
  public gameMode?: string = 'normal';
  @Output() guessSelected = new EventEmitter<string>();

  startGame() {
    this.guessSelected.emit(this.gameMode);
  }
}
