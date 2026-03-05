import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-guess-drivers-selector',
  standalone: true,
  imports: [],
  templateUrl: './guess-drivers-selector.component.html',
  styleUrl: './guess-drivers-selector.component.css'
})
export class GuessDriversSelectorComponent {
  public timer: boolean = false;
  @Output() guessSelected = new EventEmitter<boolean>();

  startGame() {
    this.guessSelected.emit(this.timer);
  }
}