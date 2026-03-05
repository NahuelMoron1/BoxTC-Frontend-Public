import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-best10-mode-selector',
  standalone: true,
  imports: [],
  templateUrl: './best10-mode-selector.component.html',
  styleUrl: './best10-mode-selector.component.css',
})
export class Best10ModeSelectorComponent {
  public timer: boolean = false;
  @Output() guessSelected = new EventEmitter<boolean>();

  startGame() {
    this.guessSelected.emit(this.timer);
  }
}
