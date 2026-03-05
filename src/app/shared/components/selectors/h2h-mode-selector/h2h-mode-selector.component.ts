import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-h2h-mode-selector',
  imports: [],
  templateUrl: './h2h-mode-selector.component.html',
  styleUrl: './h2h-mode-selector.component.css',
})
export class H2hModeSelectorComponent {
  public gameMode?: string;
  @Output() guessSelected = new EventEmitter<string>();

  startGame() {
    this.guessSelected.emit(this.gameMode);
  }
}
