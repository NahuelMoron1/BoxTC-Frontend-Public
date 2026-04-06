import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-guess-driver-mode-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-driver-mode-selector.component.html',
  styleUrl: './guess-driver-mode-selector.component.css',
})
export class GuessDriverModeSelectorComponent {
  @Output() startGame = new EventEmitter<void>();

  onStartGame() {
    this.startGame.emit();
  }
}
