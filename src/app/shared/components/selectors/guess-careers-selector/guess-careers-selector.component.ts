import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-guess-careers-selector',
  imports: [],
  templateUrl: './guess-careers-selector.component.html',
  styleUrl: './guess-careers-selector.component.css'
})
export class GuessCareersSelectorComponent {
  public timer: boolean = false;
  @Output() guessSelected = new EventEmitter<boolean>();

  startGame() {
    this.guessSelected.emit(this.timer);
  }
}
