import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-wordle-start-game',
  standalone: true,
  imports: [],
  templateUrl: './wordle-start-game.component.html',
  styleUrl: './wordle-start-game.component.css',
})
export class WordleStartGameComponent {
  public timer: boolean = false;
  @Output() guessSelected = new EventEmitter<boolean>();

  startGame() {
    this.guessSelected.emit(this.timer);
  }
}
