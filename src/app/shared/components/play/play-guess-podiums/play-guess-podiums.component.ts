import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { StartGuess } from '../../../models/GuessPodiums';
import { BestTensService } from '../../../services/best-tens.service';
import { GuessPodiumService } from '../../../services/guess-podium.service';
import { GameLostComponent } from '../../game-lost/game-lost.component';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { GameWonComponent } from '../../game-won/game-won.component';
import { GuessPodiumModeSelectorComponent } from '../../selectors/guess-podium-mode-selector/guess-podium-mode-selector.component';
import { SurrenderComponent } from '../../surrender/surrender.component';

@Component({
  selector: 'app-play-guess-podiums',
  imports: [
    CommonModule,
    FormsModule,
    GameNotFoundComponent,
    GuessPodiumModeSelectorComponent,
    GameWonComponent,
    GameLostComponent,
    SurrenderComponent,
  ],
  templateUrl: './play-guess-podiums.component.html',
  styleUrl: './play-guess-podiums.component.css',
})
export class PlayGuessPodiumsComponent implements OnInit {
  @Input() gameMode?: string;
  private guessPodiumService = inject(GuessPodiumService);
  private best10Service = inject(BestTensService);
  private readonly STORAGE_KEY = 'f1-guessPodiums-progress';

  private bffUrl?: string = environment.endpoint;
  public gamedata?: StartGuess;

  public loaded: boolean = false;
  public gameWon: boolean = false;
  public gameStarted: boolean = false;
  public gameOver: boolean = false;
  public gameLost: boolean = false;

  public gameID?: string;

  // Posiciones: first, second, third
  // Tipos: driver, car
  public selectedIds: {
    firstDriver?: string;
    firstCar?: string;
    secondDriver?: string;
    secondCar?: string;
    thirdDriver?: string;
    thirdCar?: string;
  } = {};

  public results: {
    firstDriver?: { name: string; image: string };
    firstCar?: { name: string; image: string };
    secondDriver?: { name: string; image: string };
    secondCar?: { name: string; image: string };
    thirdDriver?: { name: string; image: string };
    thirdCar?: { name: string; image: string };
  } = {};

  public inputValues = {
    firstDriver: '',
    firstCar: '',
    secondDriver: '',
    secondCar: '',
    thirdDriver: '',
    thirdCar: '',
  };

  searchTerm$ = new Subject<string>();
  filteredOptions: { id: string; name: string }[] = [];
  activeField:
    | 'firstDriver'
    | 'firstCar'
    | 'secondDriver'
    | 'secondCar'
    | 'thirdDriver'
    | 'thirdCar'
    | null = null;

  // Guessable fields count for progress
  guessableFields = 3; // Only 3 drivers
  guessedCount = 0;

  // Track if each result is correct (true) or incorrect (false)
  resultCorrectness = {
    firstDriver: undefined as boolean | undefined,
    secondDriver: undefined as boolean | undefined,
    thirdDriver: undefined as boolean | undefined,
  };

  async ngOnInit() {
    this.gamedata = await this.guessPodiumService.getGameTC();
    this.loaded = true;
    this.gameID = this.gamedata?.id;

    await this.getGameStarted();

    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (!value || !this.activeField) return;
        this.fetchSuggestions(value, this.activeField);
      });
  }

  async getGameStarted() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.results = parsed.results || {};
      this.selectedIds = parsed.selectedIds || {};
      this.inputValues = parsed.inputValues || {};
      this.resultCorrectness = parsed.resultCorrectness || {};
      this.gameStarted = parsed.gameStarted;
      this.gameMode = parsed.gameMode;
      this.gameWon = parsed.gameWin || false;
      this.gameOver = parsed.gameOver || false;
      this.gameLost = parsed.gameLost || false;

      const gameIDAux = parsed.gameID ?? '';
      if (!gameIDAux || gameIDAux !== this.gameID) {
        localStorage.removeItem(this.STORAGE_KEY);
        location.reload();
      }

      this.updateGuessedCount();
      await this.checkLost();
    }
  }

  updateGuessedCount() {
    // Only count drivers that were guessed CORRECTLY
    const correctCount = [
      this.resultCorrectness.firstDriver,
      this.resultCorrectness.secondDriver,
      this.resultCorrectness.thirdDriver,
    ].filter((v) => v === true).length;

    this.guessedCount = correctCount;
  }

  async checkLost() {
    if (this.gameOver && this.gameLost) {
      const gameDataFinished = await this.guessPodiumService.surrenderTC();

      if (!gameDataFinished) {
        return;
      }

      const finalData = gameDataFinished.gamedata;

      if (!this.results.firstDriver) {
        this.results.firstDriver = {
          name:
            finalData.FirstDriver?.firstname! +
            ' ' +
            finalData.FirstDriver?.lastname!,
          image: finalData.FirstDriver?.image!,
        };
        this.inputValues.firstDriver = this.results.firstDriver.name;
      }

      if (!this.results.firstCar) {
        this.results.firstCar = {
          name: finalData.FirstCar?.name!,
          image: finalData.FirstCar?.image!,
        };
        this.inputValues.firstCar = this.results.firstCar.name;
      }

      // Similar for second and third
      this.updateGuessedCount();
    }
  }

  startGame(gameMode?: string) {
    if (!gameMode) return;
    this.gameMode = gameMode;
    this.gameStarted = true;
    this.saveProgress();
  }

  getImage(url: string) {
    return this.bffUrl + url + '.svg';
  }

  getCarImage(url: string) {
    return this.bffUrl + url + '.jpg';
  }

  getDriverImage(url: string) {
    return this.bffUrl + url + '.jpg';
  }

  async fetchSuggestions(input: string, type: string) {
    if (!type) return;
    const serviceType = type.includes('Driver') ? 'driver' : 'brand';

    this.filteredOptions = await this.best10Service.getSuggestionsTC(
      input,
      serviceType,
    );
  }

  onInputChange(
    event: Event,
    field:
      | 'firstDriver'
      | 'firstCar'
      | 'secondDriver'
      | 'secondCar'
      | 'thirdDriver'
      | 'thirdCar',
  ) {
    const input = event.target as HTMLInputElement;
    this.activeField = field;
    this.searchTerm$.next(input.value);

    if (input.value === '') {
      this.filteredOptions = [];
    }
  }

  selectOption(
    option: { id: string; name: string },
    field:
      | 'firstDriver'
      | 'firstCar'
      | 'secondDriver'
      | 'secondCar'
      | 'thirdDriver'
      | 'thirdCar',
  ) {
    this.selectedIds[field] = option.id;
    this.inputValues[field] = option.name;
    this.filteredOptions = [];
    this.activeField = null;
  }

  async guess(type: 'driver' | 'car', position: 'first' | 'second' | 'third') {
    const fieldDriver = `${position}Driver` as
      | 'firstDriver'
      | 'secondDriver'
      | 'thirdDriver';
    const fieldCar = `${position}Car` as 'firstCar' | 'secondCar' | 'thirdCar';

    const field = type === 'driver' ? fieldDriver : fieldCar;
    const selectedID = this.selectedIds[field];

    if (!selectedID) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona algo',
        text: 'Por favor selecciona un elemento antes de adivinar',
        background: '#0d0d0d',
        color: '#ffe32d',
      });
      return;
    }

    const data = await this.guessPodiumService.guessOneTC(
      type,
      position,
      selectedID,
    );
    if (!data) {
      Swal.fire({
        icon: 'error',
        title: 'Incorrecto',
        text: 'Eso no es correcto, intenta de nuevo',
        background: '#0d0d0d',
        color: '#ff2d55',
      });
      return;
    }

    this.results[field] = data.data;
    this.inputValues[field] = data.data.name;
    this.updateGuessedCount();
    this.saveProgress();
  }

  async guessAll() {
    if (
      !this.selectedIds.firstDriver ||
      !this.selectedIds.secondDriver ||
      !this.selectedIds.thirdDriver
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Faltan campos',
        text: 'Por favor completa los 3 pilotos antes de adivinar',
        background: '#0d0d0d',
        color: '#ff2d55',
      });
      return;
    }

    const data = await this.guessPodiumService.guessAllTC(
      this.selectedIds.firstDriver,
      this.selectedIds.secondDriver,
      this.selectedIds.thirdDriver,
      '', // No cars needed for guessAll
      '',
      '',
    );

    if (!data) return;

    this.gameOver = true;
    this.gameWon = data.gameWon;
    this.gameLost = !data.gameWon;

    const finalData = data.gamedata;

    if (!finalData) {
      return;
    }

    // Populate results - only drivers and determine correctness
    this.results.firstDriver = {
      name:
        finalData.FirstDriver?.firstname! +
        ' ' +
        finalData.FirstDriver?.lastname!,
      image: finalData.FirstDriver?.image!,
    };
    this.results.secondDriver = {
      name:
        finalData.SecondDriver?.firstname! +
        ' ' +
        finalData.SecondDriver?.lastname!,
      image: finalData.SecondDriver?.image!,
    };
    this.results.thirdDriver = {
      name:
        finalData.ThirdDriver?.firstname! +
        ' ' +
        finalData.ThirdDriver?.lastname!,
      image: finalData.ThirdDriver?.image!,
    };

    // Use the correctness values returned by the backend (they're already boolean)
    this.resultCorrectness.firstDriver = data.firstDriver;
    this.resultCorrectness.secondDriver = data.secondDriver;
    this.resultCorrectness.thirdDriver = data.thirdDriver;

    this.updateGuessedCount();
    this.saveProgress();
  }

  saveProgress() {
    const progress = {
      gameID: this.gameID,
      gameStarted: this.gameStarted,
      gameMode: this.gameMode,
      gameWin: this.gameWon,
      gameOver: this.gameOver,
      gameLost: this.gameLost,
      date: this.gamedata?.date,
      results: this.results,
      selectedIds: this.selectedIds,
      inputValues: this.inputValues,
      resultCorrectness: this.resultCorrectness,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }
}
