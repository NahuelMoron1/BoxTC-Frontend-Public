import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-connections-mode-selector',
  standalone: true,
  imports: [],
  templateUrl: './connections-mode-selector.component.html',
  styleUrl: './connections-mode-selector.component.css',
})
export class ConnectionsModeSelectorComponent {
  public gameMode?: string = 'normal';
  @Output() guessSelected = new EventEmitter<string>();

  startGame() {
    this.guessSelected.emit(this.gameMode);
  }
}
