import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { GuessDriverGameData } from '../../../models/GuessDriver';
import { BestTensService } from '../../../services/best-tens.service';
import { GuessDriverService } from '../../../services/guess-driver.service';
import { GameLostComponent } from '../../game-lost/game-lost.component';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { GameWonComponent } from '../../game-won/game-won.component';
import { GuessDriverModeSelectorComponent } from '../../selectors/guess-driver-mode-selector/guess-driver-mode-selector.component';
import { SurrenderComponent } from '../../surrender/surrender.component';

@Component({
  selector: 'app-play-guess-driver',
  imports: [
    CommonModule,
    FormsModule,
    GameNotFoundComponent,
    GuessDriverModeSelectorComponent,
    GameWonComponent,
    GameLostComponent,
    SurrenderComponent,
  ],
  templateUrl: './play-guess-driver.component.html',
  styleUrl: './play-guess-driver.component.css',
})
export class PlayGuessDriverComponent implements OnInit {
  private guessDriverService = inject(GuessDriverService);
  private best10Service = inject(BestTensService);
  private readonly STORAGE_KEY = 'boxtc-guessDriver-progress';

  protected readonly environment = environment;

  public gamedata?: GuessDriverGameData;

  // Estados del juego
  public loaded: boolean = false;
  public gameStarted: boolean = false;
  public gameOver: boolean = false;
  public gameWon: boolean = false;
  public gameLost: boolean = false;
  public gameID?: string;
  public season?: number;

  // Información del juego
  public selectedDriver?: string;
  public selectedDriverId?: string;
  public driverInput: string = '';
  public filteredDrivers: { id: string; name: string }[] = [];
  public activeField: boolean = false;

  // Pistas y control
  public hints: string[] = [];
  public currentHintIndex: number = 0;
  public attemptCount: number = 0;
  public maxHints: number = 6;

  // Respuesta correcta
  public correctAnswer?: any;

  // Debounce
  searchTerm$ = new Subject<string>();

  async ngOnInit() {
    this.gamedata = await this.guessDriverService.getGameOfTheDayTC();
    this.loaded = true;

    if (this.gamedata) {
      this.gameID = this.gamedata.id;
      this.season = this.gamedata.season;
      await this.getGameProgress();
    }

    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.fetchDrivers(value);
        }
      });
  }

  async getGameProgress() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const gameIDAux = parsed.gameID ?? '';

      if (!gameIDAux || gameIDAux !== this.gameID) {
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }

      this.gameStarted = parsed.gameStarted || false;
      this.gameOver = parsed.gameOver || false;
      this.gameWon = parsed.gameWon || false;
      this.gameLost = parsed.gameLost || false;
      this.selectedDriver = parsed.selectedDriver || '';
      this.selectedDriverId = parsed.selectedDriverId || '';
      this.hints = parsed.hints || [];
      this.currentHintIndex = parsed.currentHintIndex || 0;
      this.attemptCount = parsed.attemptCount || 0;
      this.correctAnswer = parsed.correctAnswer || undefined;

      if (this.gameStarted && !this.gameOver && this.hints.length === 0) {
        await this.showInitialHint();
      }
    }
  }

  async showInitialHint() {
    const initialHint = `¡Hola! Soy un piloto del Turismo Carretera de la temporada ${this.season}. ¡Intenta adivinarme!`;
    this.hints = [initialHint];
    this.currentHintIndex = 0;
    this.saveProgress();
  }

  async fetchDrivers(input: string) {
    this.filteredDrivers = await this.best10Service.getSuggestionsTC(
      input,
      'driver',
    );
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.activeField = true;
    this.searchTerm$.next(input.value);
  }

  selectDriver(driver: { id: string; name: string }) {
    this.selectedDriver = driver.name;
    this.selectedDriverId = driver.id;
    this.driverInput = driver.name;
    this.filteredDrivers = [];
    this.activeField = false;
  }

  async guessDriver() {
    if (!this.selectedDriverId || !this.gameID) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un piloto',
        text: 'Por favor selecciona un piloto antes de adivinar',
        background: '#0d0d0d',
        color: '#ffe32d',
      });
      return;
    }

    const response = await this.guessDriverService.guessDriverTC(
      this.gameID,
      this.selectedDriverId,
    );

    if (!response) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al procesar tu adivinanza',
        background: '#0d0d0d',
        color: '#ff2d55',
      });
      return;
    }

    if (response.isCorrect) {
      this.gameWon = true;
      this.gameOver = true;
      this.correctAnswer = response;
      this.saveProgress();
      return;
    }

    // Adivinanza incorrecta
    this.attemptCount++;
    this.driverInput = '';
    this.selectedDriver = '';
    this.selectedDriverId = '';

    Swal.fire({
      icon: 'error',
      title: 'Incorrecto',
      text: 'Ese no es el piloto. ¡Intenta nuevamente!',
      background: '#0d0d0d',
      color: '#ff2d55',
    });

    // Obtener la siguiente pista
    if (this.currentHintIndex < this.maxHints - 1) {
      await this.getNextHint();
    } else {
      // Sin más pistas
      Swal.fire({
        icon: 'info',
        title: 'Sin más pistas',
        text: 'Ya no hay más pistas disponibles. ¡Sigue intentando!',
        background: '#0d0d0d',
        color: '#c0e600',
      });
    }

    this.saveProgress();
  }

  async getNextHint() {
    if (!this.gameID) return;

    const hintResponse = await this.guessDriverService.getNextHintTC(
      this.gameID,
      this.currentHintIndex + 1,
    );

    if (hintResponse) {
      this.currentHintIndex = hintResponse.attemptNumber;
      this.hints.push(hintResponse.hint);
      this.saveProgress();
    }
  }

  startGame() {
    this.gameStarted = true;
    this.showInitialHint();
  }

  async surrender() {
    if (!this.gameID) return;

    const response = await this.guessDriverService.surrenderGameTC(this.gameID);

    if (response) {
      this.gameOver = true;
      this.gameLost = true;
      this.correctAnswer = response;
      this.saveProgress();
    }
  }

  saveProgress() {
    const progress = {
      gameID: this.gameID,
      gameStarted: this.gameStarted,
      gameOver: this.gameOver,
      gameWon: this.gameWon,
      gameLost: this.gameLost,
      selectedDriver: this.selectedDriver,
      selectedDriverId: this.selectedDriverId,
      hints: this.hints,
      currentHintIndex: this.currentHintIndex,
      attemptCount: this.attemptCount,
      correctAnswer: this.correctAnswer,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }
}
