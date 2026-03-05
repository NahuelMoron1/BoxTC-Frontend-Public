import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-timeline-selector',
  imports: [],
  templateUrl: './timeline-selector.component.html',
  styleUrl: './timeline-selector.component.css',
})
export class TimelineSelectorComponent {
  public gameMode?: string;
  @Output() guessSelected = new EventEmitter<string>();

  startGame() {
    if (this.gameMode) this.guessSelected.emit(this.gameMode);
  }
}
