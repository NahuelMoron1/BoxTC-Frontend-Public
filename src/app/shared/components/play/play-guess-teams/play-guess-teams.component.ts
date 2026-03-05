import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { StartGuess } from '../../../models/GuessTeams';
import { BestTensService } from '../../../services/best-tens.service';
import { GuessTeamService } from '../../../services/guess-team.service';
import { GameLostComponent } from '../../game-lost/game-lost.component';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { GameWonComponent } from '../../game-won/game-won.component';
import { GuessTeamModeSelectorComponent } from '../../selectors/guess-team-mode-selector/guess-team-mode-selector.component';
import { SurrenderComponent } from '../../surrender/surrender.component';

@Component({
  selector: 'app-play-guess-teams',
  imports: [
    CommonModule,
    FormsModule,
    GameNotFoundComponent,
    GuessTeamModeSelectorComponent,
    GameWonComponent,
    GameLostComponent,
    SurrenderComponent,
  ],
  templateUrl: './play-guess-teams.component.html',
  styleUrl: './play-guess-teams.component.css',
})
export class PlayGuessTeamsComponent implements OnInit {
  @Input() gameMode?: string;
  private guessTeamsService = inject(GuessTeamService);
  private best10Service = inject(BestTensService);
  private readonly STORAGE_KEY = 'f1-guessTeams-progress';

  private bffUrl?: string = environment.endpoint;
  public gamedata?: StartGuess;

  public loaded: boolean = false;
  public gameWon: boolean = false;
  public gameStarted: boolean = false;
  public gameOver: boolean = false;
  public gameLost: boolean = false;

  public gameID?: string;

  public selectedIds: {
    team?: string;
    driver1?: string;
    driver2?: string;
    tp?: string;
  } = {};

  public results: {
    team?: { name: string; image: string };
    driver1?: { name: string; image: string };
    driver2?: { name: string; image: string };
    tp?: { name: string; image: string };
  } = {};

  public inputValues = {
    team: '',
    driver1: '',
    driver2: '',
    tp: '',
  };

  searchTerm$ = new Subject<string>();
  filteredOptions: { id: string; name: string }[] = [];
  activeField: 'team' | 'driver1' | 'driver2' | 'season' | 'tp' | null = null;

  async ngOnInit() {
    this.gamedata = await this.guessTeamsService.getGameTC();
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
    //localStorage.removeItem(this.STORAGE_KEY);
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.results = {
        team: parsed.team,
        driver1: parsed.driver1,
        driver2: parsed.driver2,
        tp: parsed.tp,
      };
      this.selectedIds = parsed.selectedIds || {};
      this.inputValues.team = parsed.team?.name || '';
      this.inputValues.driver1 = parsed.driver1?.name || '';
      this.inputValues.driver2 = parsed.driver2?.name || '';
      this.inputValues.tp = parsed.tp?.name || '';
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

      await this.checkLost();
    }
  }

  async checkLost() {
    if (this.gameOver && this.gameLost) {
      const gamedataFinished = await this.guessTeamsService.surrenderTC();

      if (!gamedataFinished) {
        return;
      }

      const finalData = gamedataFinished.gamedata;

      if (!this.results.team) {
        this.results.team = {
          name: finalData.Team?.name!,
          image: finalData.Team?.logo!,
        };
        this.inputValues.team = finalData.Team?.name!;
      }

      if (!this.results.driver1) {
        this.results.driver1 = {
          name:
            finalData.Driver1?.firstname! + ' ' + finalData.Driver1?.lastname!,
          image: finalData.Driver1?.image!,
        };
        this.inputValues.driver1 = this.results.driver1.name;
      }

      if (!this.results.driver2) {
        this.results.driver2 = {
          name:
            finalData.Driver2?.firstname! + ' ' + finalData.Driver2?.lastname!,
          image: finalData.Driver2?.image!,
        };
        this.inputValues.driver2 = this.results.driver2.name;
      }

      if (!this.results.tp) {
        this.results.tp = {
          name: finalData.team_principal,
          image: finalData.tp_flag,
        };
        this.inputValues.tp = finalData.team_principal;
      }
    }
  }

  startGame(gameMode?: string) {
    if (!gameMode) return;
    this.gameMode = gameMode;
    this.saveProgress();
  }

  getImage(url: string) {
    return this.bffUrl + url + '.svg';
  }

  getTeamsImage(url: string) {
    return this.bffUrl + url + '.jpg';
  }

  getMembersImage(url: string) {
    return this.bffUrl + url + '.jpg';
  }

  async fetchSuggestions(input: string, type: string) {
    if (!type) return;
    const serviceType =
      type === 'driver1' || type === 'driver2' ? 'driver' : type;

    this.filteredOptions = await this.best10Service.getSuggestionsTC(
      input,
      serviceType,
    );
  }

  onInputChange(
    event: Event,
    field: 'team' | 'driver1' | 'driver2' | 'season' | 'tp',
  ) {
    const input = event.target as HTMLInputElement;
    this.activeField = field;
    this.searchTerm$.next(input.value);

    if (input.value === '') {
      this.filteredOptions = [];
    }
  }

  async guess(type: string) {
    let selectedID: string | undefined = '';
    switch (type) {
      case 'team':
        selectedID = this.selectedIds.team || this.inputValues.team;
        break;
      case 'driver1':
        selectedID = this.selectedIds.driver1 || this.inputValues.driver1;
        break;
      case 'driver2':
        selectedID = this.selectedIds.driver2 || this.inputValues.driver2;
        break;
      case 'tp':
        selectedID = this.selectedIds.tp || this.inputValues.tp;
        break;
    }

    if (!selectedID) return;

    const data = await this.guessTeamsService.guessOneTC(type, selectedID);
    if (!data) return;

    this.selectedIds[type as 'team' | 'driver1' | 'driver2' | 'tp'] =
      selectedID;
    this.results[type as 'team' | 'driver1' | 'driver2' | 'tp'] = data.data;
    this.inputValues[type as 'team' | 'driver1' | 'driver2' | 'tp'] =
      data.data.name;

    if (
      this.results.team &&
      this.results.driver1 &&
      this.results.driver2 &&
      this.results.tp
    ) {
      this.gameWon = true;
      this.gameOver = true;
    }

    this.saveProgress();
  }

  async guessAll() {
    if (
      !this.selectedIds.team ||
      !this.selectedIds.driver1 ||
      !this.selectedIds.driver2 ||
      !this.inputValues.tp
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Missing fields',
        text: 'Please complete all fields before guessing',
        background: '#1b1b1bff',
        color: '#dcecfbff',
      });
      return;
    }

    this.selectedIds.tp = this.inputValues.tp;

    const data = await this.guessTeamsService.guessAllTC(
      this.selectedIds.team,
      this.selectedIds.driver1,
      this.selectedIds.driver2,
      this.selectedIds.tp,
    );

    if (!data) return;

    this.gameOver = true;
    this.gameWon = data.gameWon;
    this.gameLost = !data.gameWon;

    const finalData = data.gamedata;

    if (!finalData) {
      return;
    }

    this.results = {
      team: {
        name: finalData.Team?.name!,
        image: finalData.Team?.logo!,
      },
      driver1: {
        name:
          finalData.Driver1?.firstname! + ' ' + finalData.Driver1?.lastname!,
        image: finalData.Driver1?.image!,
      },
      driver2: {
        name:
          finalData.Driver2?.firstname! + ' ' + finalData.Driver2?.lastname!,
        image: finalData.Driver2?.image!,
      },
      tp: {
        name: finalData.team_principal,
        image: finalData.tp_flag,
      },
    };

    if (!data.team) delete this.selectedIds.team;
    if (!data.driver1) delete this.selectedIds.driver1;
    if (!data.driver2) delete this.selectedIds.driver2;
    if (!data.tp) delete this.selectedIds.tp;

    if (
      !this.results ||
      !this.results.team ||
      !this.results.driver1 ||
      !this.results.driver2 ||
      !this.results.tp
    ) {
      return;
    }

    this.inputValues = {
      team: this.results.team.name,
      driver1: this.results.driver1.name,
      driver2: this.results.driver2.name,
      tp: this.results.tp.name,
    };

    this.saveProgress();
  }

  selectOption(
    option: { id: string; name: string },
    field: 'team' | 'driver1' | 'driver2' | 'tp',
  ) {
    this.selectedIds[field] = option.id;
    this.inputValues[field] = option.name;
    this.filteredOptions = [];
    this.activeField = null;
  }

  surrender() {
    Swal.fire({
      title: '¿Are you sure?',
      text: "If you give up, you'll lose today's Guess Team, and the answers will be revealed",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, give up',
      cancelButtonText: 'Cancel',
      background: '#1b1b1bff',
      color: '#dcecfbff',
    }).then(async (result) => {
      if (this.gamedata && result.isConfirmed) {
        this.gameOver = true;
        this.gameLost = true;

        const gamedataFinished = await this.guessTeamsService.surrenderTC();

        if (!gamedataFinished) {
          return;
        }

        await this.checkLost();

        this.saveProgress();

        Swal.fire({
          title: 'You gave up 🏳️',
          text: 'These were the answers. Keep trying tomorrow!',
          icon: 'info',
          confirmButtonColor: '#ff0000',
          background: '#1b1b1bff',
          color: '#dcecfbff',
        });
      }
    });
  }

  saveProgress() {
    const progress = {
      gameID: this.gameID,
      gameStarted: true,
      gameOver: this.gameOver,
      gameMode: this.gameMode,
      team: this.results.team,
      driver1: this.results.driver1,
      driver2: this.results.driver2,
      tp: this.results.tp,
      selectedIds: this.selectedIds,
      gameWin: this.gameWon,
      gameLost: this.gameLost,
      date: this.gamedata?.date,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }
}
