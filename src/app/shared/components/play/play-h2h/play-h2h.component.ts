import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { H2hModeSelectorComponent } from '../../selectors/h2h-mode-selector/h2h-mode-selector.component';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { H2hGameService } from '../../../services/h2h-game.service';
import { H2HGameResponse } from '../../../models/h2h-game-response';
import { H2hTeamInfoComponent } from '../../h2h-team-info/h2h-team-info.component';
import { H2hStatsDisplayComponent } from '../../h2h-stats-display/h2h-stats-display.component';
import { GameWonComponent } from '../../game-won/game-won.component';
import { GameLostComponent } from '../../game-lost/game-lost.component';

@Component({
  selector: 'app-play-h2h',
  imports: [
    CommonModule,
    FormsModule,
    H2hModeSelectorComponent,
    GameNotFoundComponent,
    H2hTeamInfoComponent,
    H2hStatsDisplayComponent,
    GameWonComponent,
    GameLostComponent,
  ],
  templateUrl: './play-h2h.component.html',
  styleUrl: './play-h2h.component.css',
})
export class PlayH2hComponent implements OnInit {
  private h2hService = inject(H2hGameService);
  private readonly STORAGE_KEY = 'f1-h2h-progress';

  public gameMode?: string;
  public gameID?: string;
  public gameData?: H2HGameResponse;
  public gameResult?: any;
  public gameResultByOne?: any;
  public gameOver: boolean = false;
  public gameWin: boolean = false;
  public currentStatType: string = 'race'; // Default stat type
  public today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  public guessSelections: { type: string; driverID: string }[] = []; // Para el modo normal
  public selectedGuess: { type: string; driverId: string } | null = null;
  public userSelections: { type: string; driverId: string }[] = [];
  public loaded: boolean = false;

  async ngOnInit() {
    this.gameData = await this.h2hService.getGameDataTC();
    this.gameID = this.gameData?.id;
    this.loaded = true;

    this.loadProgress();
  }

  startGame(gameMode?: string) {
    if (!gameMode) {
      return;
    }
    this.gameMode = gameMode;
  }

  async submitGuess() {
    if (!this.gameID || !this.selectedGuess) return;

    try {
      const result = await this.h2hService.guessOneByOneGameTC(this.gameID, {
        type: this.selectedGuess.type,
        id: this.selectedGuess.driverId,
        gameID: this.gameID,
      });

      if (result) {
        // Create or update results array
        if (!this.gameResult) {
          this.gameResult = [];
        }

        // Check if we already have a result for this type
        const existingIndex = this.gameResult.findIndex(
          (r: any) => r.type === (result as any).type,
        );
        if (existingIndex >= 0) {
          // Replace existing result
          this.gameResult[existingIndex] = result;
        } else {
          // Add new result
          this.gameResult.push(result);
        }

        // Update the gameResultByOne with the latest result
        this.gameResultByOne = result;

        // Add the selection to our history
        this.userSelections.push({ ...this.selectedGuess });

        // Reset the selected guess
        this.selectedGuess = null;

        // Force change detection by creating a new array reference
        this.gameResult = [...this.gameResult];

        // Check if the game is over
        this.checkGameStatus();

        // Save progress
        this.saveProgress();
      }
    } catch (error) {
      console.error('Error submitting guess:', error);
    }
  }

  // Check if all stats have been guessed and determine if the player won or lost
  checkGameStatus() {
    // Define all possible stat types
    const allStatTypes = [
      'race',
      'qualifying',
      'points',
      'points_finishes',
      'dnfs',
    ];

    // If we've guessed all stat types, the game is over
    const guessedTypes = new Set(this.gameResult.map((r: any) => r.type));

    if (guessedTypes.size >= allStatTypes.length) {
      this.gameOver = true;

      // Check if all guesses were correct
      const allCorrect = this.gameResult.every((r: any) => r.correct);
      this.gameWin = allCorrect;
    }
  }

  handleStatSelected(selection: { type: string; driverId: string }) {
    this.selectedGuess = selection;
  }

  loadProgress() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved || !this.gameData) return;

    const data = JSON.parse(saved);
    if (data.gameID !== this.gameData.id) {
      localStorage.removeItem(this.STORAGE_KEY);
      return;
    }

    // Restaurar el estado del juego
    this.gameMode = data.gameMode;
    this.gameOver = data.gameOver || false;
    this.gameWin = data.gameWin || false;
    this.gameResultByOne = data.gameResultByOne;
    this.gameResult = data.gameResult || [];

    if (data.guessSelections) {
      this.guessSelections = data.guessSelections;
    }

    if (data.userSelections) {
      this.userSelections = data.userSelections;
    }

    // Check game status in case we need to update it
    if (this.gameResult && this.gameResult.length > 0) {
      this.checkGameStatus();
    }
  }

  saveProgress() {
    const data = {
      gameOver: this.gameOver,
      gameWin: this.gameWin,
      gameID: this.gameData?.id,
      gameMode: this.gameMode,
      date: this.today,
      gameResultByOne: this.gameResultByOne,
      guessSelections: this.guessSelections,
      gameResult: this.gameResult,
      userSelections: this.userSelections,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
}
