import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { Top10Data } from '../../../models/ITop10Data';
import { Top10Gamedata } from '../../../models/ITop10Gamedata';
import { Top10Results } from '../../../models/Top10_Results';
import { BestTensService } from '../../../services/best-tens.service';
import { GameLostComponent } from '../../game-lost/game-lost.component';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { GameWonComponent } from '../../game-won/game-won.component';
import { GuessSelectorComponent } from '../../guess-selector/guess-selector.component';
import { Best10ModeSelectorComponent } from '../../selectors/best10-mode-selector/best10-mode-selector.component';
import { SurrenderComponent } from '../../surrender/surrender.component';

@Component({
  selector: 'app-best-tens',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    NgClass,
    GameWonComponent,
    GameLostComponent,
    GuessSelectorComponent,
    Best10ModeSelectorComponent,
    GameNotFoundComponent,
    SurrenderComponent,
  ],
  templateUrl: './best-tens.component.html',
  styleUrl: './best-tens.component.css',
})
export class BestTensComponent implements OnInit {
  private best10Service = inject(BestTensService);

  public gameWon: boolean = false;
  public gameOver: boolean = false;
  public gameStarted: boolean = false;
  public timedMode: boolean = false;

  public timeLeft: number = 120; // segundos
  public currentGuess: string = '';
  private timerInterval?: any;
  private bffUrl?: string = environment.endpoint;
  public gamedata?: Top10Gamedata;
  public inputStatus: 'success' | 'error' | '' = '';
  public loaded: boolean = false;
  //public justRevealed: Set<string> = new Set();

  public justRevealed: Set<string> = new Set();
  public revealed: Set<string> = new Set();
  public surrendered: Set<string> = new Set();

  public guesses: string[] = [];
  public revealedResults: Top10Data[] = Array(10).fill(undefined);
  public top10Slots: number[] = Array.from({ length: 10 }, (_, i) => i);
  public today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  async ngOnInit() {
    //await this.getBest10();
    await this.getGamedata();
    this.loaded = true;
    this.getGameStarted();
  }

  getStatus(
    result: Top10Data,
    isPosition?: boolean,
  ): 'correct' | 'missed' | 'none' | 'missed-pos' {
    const id =
      result.Driver?.id || result.Team?.id || result.Track?.id || result.id;

    if (this.revealed.has(id)) return 'correct';
    if (this.surrendered.has(id) && isPosition) return 'missed-pos';
    if (this.surrendered.has(id)) return 'missed';
    return 'none';
  }

  async getGamedata() {
    this.gamedata = await this.best10Service.getGamedataTC();
  }

  getGameStarted() {
    //localStorage.removeItem('f1-best10-progress');
    const saved = localStorage.getItem('f1-best10-progress');
    if (!saved) return;

    const data = JSON.parse(saved);
    const date = data.date;
    const gameDate = date;

    const sameDay = gameDate === this.today;

    if (!sameDay || this.gamedata?.id !== data.gameID) {
      localStorage.removeItem('f1-best10-progress');
      location.reload();
    }

    // Restauramos estado
    this.gameOver = data.gameOver;
    this.gameWon = data.gameWin;
    this.gameStarted = data.gameStarted;
    this.timedMode = data.timedMode;
    this.timeLeft = data.timeLeft;

    // Restauramos resultados revelados
    if (data.revealedResults) {
      this.revealedResults = data.revealedResults;
    }

    if (data.revealedIDs) {
      this.revealed = new Set(data.revealedIDs);
    }

    if (data.surrenderedIDs) {
      this.surrendered = new Set(data.surrenderedIDs);
    }

    this.startGame(this.timedMode);
  }

  startGameFirstTime(timed: boolean) {
    this.timedMode = timed;
    this.gameStarted = true;

    this.saveProgress();

    if (timed) {
      this.startTimer();
    }
  }

  startGame(timed: boolean) {
    this.timedMode = timed;
    this.gameStarted = true;

    if (timed) {
      this.startTimer();
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(async () => {
      this.timeLeft--;
      localStorage.setItem('timeLeft', this.timeLeft.toString());

      if (this.gamedata && this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.gameOver = true;

        const allResults = await this.best10Service.giveUpTC(
          this.gamedata.id,
          this.gamedata.type,
        );
        this.onSurrenderRevealed(allResults || []);
        this.saveProgress();

        Swal.fire({
          title: 'You ran out of time',
          text: 'These were the answers. Keep trying tomorrow!',
          icon: 'info',
          confirmButtonColor: '#ff0000',
          background: '#1b1b1bff',
          color: '#dcecfbff',
        });
      }
    }, 1000);
  }

  surrender() {
    Swal.fire({
      title: '¿Are you sure?',
      text: "If you give up, you'll lose today's Best 10, and the answers will be revealed",
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

        const allResults = await this.best10Service.giveUpTC(
          this.gamedata.id,
          this.gamedata.type,
        );
        this.onSurrenderRevealed(allResults || []);
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

  onSurrenderRevealed(allResults: Top10Data[]) {
    this.revealedResults = allResults.map((r) => {
      const id = r.Driver?.id || r.Team?.id || r.Track?.id || r.id;

      if (this.revealed.has(id)) {
        this.justRevealed.add(id); // ya adivinados
      } else {
        this.surrendered.add(id); // revelados por surrender
      }

      return r;
    });
  }

  isRevealed(result: Top10Results): boolean {
    return (
      (result.driverID && this.revealed.has(result.driverID)) ||
      (result.teamID && this.revealed.has(result.teamID)) ||
      (result.trackID && this.revealed.has(result.trackID)) ||
      false
    );
  }

  getImage(result: Top10Data): string {
    if (result.Driver) {
      return `${this.bffUrl}${result.Driver.image.toLowerCase()}.jpg`;
    }
    if (result.Team) {
      return `${this.bffUrl}${result.Team.logo}.jpg`;
    }
    if (result.Track) {
      return `${
        this.bffUrl
      }uploads/flags/${result.Track.country.toLowerCase()}.webp`;
    }
    return '';
  }

  getAlt(result: Top10Results): string {
    if (result.Driver) return result.Driver.nationality;
    if (result.Team) return result.Team.common_name;
    if (result.Track) return result.Track.country;
    return '';
  }

  handleGuess(result: Top10Data) {
    let id = '';
    if (result.Driver) {
      id = result.Driver.id;
    }
    if (result.Team) {
      id = result.Team.id;
    }
    if (result.Track) {
      id = result.Track.id;
    }

    if (this.revealed.has(id)) {
      this.inputStatus = 'error';
      return;
    }

    const slotIndex =
      result.position ?? this.revealedResults.findIndex((r) => !r);
    if (slotIndex === -1) return;

    this.revealedResults[slotIndex - 1] = result;
    this.revealed.add(id);
    this.justRevealed.add(id);
    this.inputStatus = 'success';

    this.winner();
    this.saveProgress();
  }

  winner() {
    if (this.revealed.size === 10) {
      this.gameWon = true;
      this.gameOver = true;

      // Podés mostrar un mensaje de victoria si querés
      Swal.fire({
        title: 'You won! 🏁',
        text: 'You guessed all 10 correctly. See you tomorrow!',
        icon: 'success',
        confirmButtonColor: '#00ff00',
        background: '#1b1b1bff',
        color: '#dcecfbff',
      });
    }
  }

  saveProgress() {
    const revealedData = this.revealedResults.map((r) => {
      if (!r) return null;

      const id = r.Driver?.id || r.Team?.id || r.Track?.id || r.id;
      const base = {
        id,
        position: r.position,
        totalStat: r.totalStat,
        type: r.Driver ? 'driver' : r.Team ? 'team' : 'track',
      };

      if (r.Driver) {
        return {
          ...base,
          Driver: {
            firstname: r.Driver.firstname,
            lastname: r.Driver.lastname,
            nationality: r.Driver.nationality,
            image: r.Driver.image,
          },
        };
      }

      if (r.Team) {
        return {
          ...base,
          Team: {
            common_name: r.Team.common_name,
            base: r.Team.base,
            logo: r.Team.logo,
          },
        };
      }

      if (r.Track) {
        return {
          ...base,
          Track: {
            track_name: r.Track.track_name,
            country: r.Track.country,
            image: r.Track.image,
          },
        };
      }

      return base;
    });

    const data = {
      gameStarted: this.gameStarted,
      gameOver: this.gameOver,
      gameWin: this.gameWon,
      gameID: this.gamedata?.id,
      revealed: revealedData,
      revealedIDs: Array.from(this.revealed),
      surrenderedIDs: Array.from(this.surrendered),
      revealedResults: this.revealedResults,
      timeLeft: this.timeLeft,
      timedMode: this.timedMode,
      date: this.today,
    };

    localStorage.setItem('f1-best10-progress', JSON.stringify(data));
  }
}
