import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-guess-podium-mode-selector',
  templateUrl: './guess-podium-mode-selector.component.html',
  styleUrls: ['./guess-podium-mode-selector.component.css'],
  standalone: true,
})
export class GuessPodiumModeSelectorComponent {
  @Output() guessSelected = new EventEmitter<'normal' | 'byOne'>();

  selectMode(mode: 'normal' | 'byOne'): void {
    this.guessSelected.emit(mode);
  }
}
