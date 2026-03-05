import { CommonModule, NgFor } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetterResult } from '../../../models/ILetterResult';
import { WordleService } from '../../../services/wordle.service';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { WordleStartGameComponent } from '../../selectors/wordle-start-game/wordle-start-game.component';

@Component({
  selector: 'app-wordle-data',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    CommonModule,
    WordleStartGameComponent,
    GameNotFoundComponent,
  ],
  templateUrl: './wordle-data.component.html',
  styleUrl: './wordle-data.component.css',
})
export class WordleDataComponent implements OnInit {
  word = '';
  guesses: string[] = [];
  maxAttempts = 6;
  currentGuess = '';
  currentRowIndex: number = 0;
  gameOver: boolean = false;
  gameWin: boolean = false;
  showFinalMessage: boolean = false;
  gameStarted: boolean = false;
  letterStates: Record<string, 'correct' | 'present' | 'absent' | ''> = {};
  private readonly STORAGE_KEY = 'f1-wordle-progress';
  public today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  public loaded: boolean = false;

  resultGrid: {
    letter: string;
    status: 'correct' | 'present' | 'absent' | 'pending';
  }[][] = [];

  keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  constructor(private wordleService: WordleService) {}

  async ngOnInit() {
    this.word = await this.wordleService.getWordTC();
    this.initEmptyGrid();
    this.getGameStarted();
    this.loaded = true;
  }

  getGameStarted() {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    //localStorage.removeItem(this.STORAGE_KEY);

    if (saved) {
      const data = JSON.parse(saved);

      this.word = data.word;
      this.guesses = data.guesses;
      this.currentGuess = data.currentGuess;
      this.currentRowIndex = data.currentRowIndex;
      this.gameOver = data.gameOver;
      this.gameWin = data.gameWin;
      this.showFinalMessage = data.showFinalMessage;
      this.resultGrid = data.resultGrid;
      this.gameStarted = data.gameStarted;
      this.letterStates = data.letterStates;
      const date = data.date;
      const gameDate = date;

      const sameDay = gameDate === this.today;

      if (!sameDay) {
        localStorage.removeItem(this.STORAGE_KEY);
        location.reload();
      }
    }
  }

  async startGameFirstTime(timer: boolean) {
    ///Not using timer now because it's only normal game mode ATM.
    this.gameStarted = true;
    const data = {
      gameStarted: this.gameStarted,
      currentGuess: this.currentGuess,
      date: new Date(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  initEmptyGrid() {
    const rows = 6;
    const cols = this.word.length;

    this.resultGrid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        letter: '',
        status: 'absent' as 'correct' | 'present' | 'absent',
      })),
    );
  }

  submitGuess() {
    if (this.currentGuess.length !== this.word.length || this.gameOver) return;

    const guessedWord = this.currentGuess.toLowerCase();

    if (guessedWord === this.word) {
      this.gameOver = true;
      this.gameWin = true;
      setTimeout(() => {
        this.showFinalMessage = true;
        this.saveProgressToLocalStorage();
      }, this.word.length * 1000);
      return;
    }

    const index = this.currentRowIndex + 1;

    if (index >= this.resultGrid.length && guessedWord !== this.word) {
      this.gameOver = true;
      this.gameWin = false;
      setTimeout(() => {
        this.showFinalMessage = true;
        this.saveProgressToLocalStorage();
      }, this.word.length * 1000);
      return;
    }

    // Si no ganó, validar normalmente
    const validatedRow = this.checkGuess(this.currentGuess);
    this.resultGrid[this.currentRowIndex] = validatedRow;
    this.updateKeyboardStates(validatedRow);

    this.currentRowIndex++;
    this.currentGuess = '';
    this.saveProgressToLocalStorage();
  }

  updateKeyboardStates(validatedRow: LetterResult[]) {
    validatedRow.forEach((cell) => {
      const char = cell.letter.toUpperCase();
      const currentState = this.letterStates[char];

      // Prioridad: correct > present > absent
      if (cell.status === 'correct') {
        this.letterStates[char] = 'correct';
      } else if (cell.status === 'present' && currentState !== 'correct') {
        this.letterStates[char] = 'present';
      } else if (cell.status === 'absent' && !currentState) {
        this.letterStates[char] = 'absent';
      }
    });
  }

  checkGuess(guess: string): LetterResult[] {
    const result: LetterResult[] = [];
    const targetLetters = this.word.split('');
    const letterCount: Record<string, number> = {};

    // Contar letras en la palabra objetivo
    for (const letter of targetLetters) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    const usedLetters: Record<string, number> = {};

    // Paso 1: marcar letras correctas
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      if (letter === targetLetters[i]) {
        result[i] = { letter, status: 'correct' };
        usedLetters[letter] = (usedLetters[letter] || 0) + 1;
      } else {
        result[i] = { letter, status: 'absent' }; // temporal
      }
    }

    // Paso 2: marcar letras presentes (posición incorrecta)
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      if (result[i].status === 'absent' && targetLetters.includes(letter)) {
        const used = usedLetters[letter] || 0;
        const available = letterCount[letter] || 0;

        if (used < available) {
          result[i].status = 'present';
          usedLetters[letter] = used + 1;
        }
      }
    }

    return result;
  }

  handleKeyPress(key: string) {
    if (this.gameOver) return;
    if (key === 'ENTER') {
      this.submitGuess();
    } else if (key === '⌫') {
      this.currentGuess = this.currentGuess.slice(0, -1);
    } else if (this.currentGuess.length < this.word.length) {
      this.currentGuess += key.toLowerCase();
    }

    this.updateGrid();
  }

  @HostListener('window:keydown', ['$event'])
  handlePhysicalKey(event: KeyboardEvent) {
    if (this.gameOver) return;

    const key = event.key.toUpperCase();

    if (key === 'ENTER') {
      this.handleKeyPress('ENTER');
    } else if (key === 'BACKSPACE') {
      this.handleKeyPress('⌫');
    } else if (/^[A-Z]$/.test(key)) {
      this.handleKeyPress(key);
    }

    this.updateGrid();
  }

  updateGrid() {
    const row = this.resultGrid[this.currentRowIndex];

    for (let i = 0; i < row.length; i++) {
      row[i].letter = this.currentGuess[i] || '';
      row[i].status = 'absent'; // aún sin validar
    }

    this.saveProgressToLocalStorage();
  }

  getFinalClass(colIndex: number): string {
    if (!this.gameOver && !this.gameWin) return '';

    if (this.gameOver && this.gameWin) return `win delay-${colIndex}`;
    return `lost delay-${colIndex}`;
  }

  getDelay(colIndex: number): string {
    return `${colIndex}s`;
  }

  saveProgressToLocalStorage() {
    const data = {
      word: this.word,
      guesses: this.guesses,
      currentGuess: this.currentGuess,
      currentRowIndex: this.currentRowIndex,
      gameOver: this.gameOver,
      gameWin: this.gameWin,
      resultGrid: this.resultGrid,
      showFinalMessage: this.showFinalMessage,
      date: this.today,
      gameStarted: this.gameStarted,
      letterStates: this.letterStates,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
}
