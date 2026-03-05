import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-impostor-mode-selector',
  standalone: true,
  imports: [],
  templateUrl: './impostor-mode-selector.component.html',
  styleUrl: './impostor-mode-selector.component.css',
})
export class ImpostorModeSelectorComponent {
  public gameMode?: string;
  @Output() guessSelected = new EventEmitter<string>();

  startGame() {
    this.guessSelected.emit(this.gameMode);
  }
}
