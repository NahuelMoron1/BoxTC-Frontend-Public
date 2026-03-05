import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Connections } from '../../../models/Connections';
import { Driver } from '../../../models/Driver';
import { Connections_Results } from '../../../models/IConnectionsResults';
import { Team } from '../../../models/Team';
import { Track } from '../../../models/Track';
import { ConnectionsService } from '../../../services/connections.service';
import { GameLostComponent } from '../../game-lost/game-lost.component';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { GameWonComponent } from '../../game-won/game-won.component';
import { ConnectionsModeSelectorComponent } from '../../selectors/connections-mode-selector/connections-mode-selector.component';

@Component({
  selector: 'app-play-connections',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    GameWonComponent,
    GameLostComponent,
    ConnectionsModeSelectorComponent,
    GameNotFoundComponent,
  ],
  templateUrl: './play-connections.component.html',
  styleUrl: './play-connections.component.css',
})
export class PlayConnectionsComponent {
  private connectionsService = inject(ConnectionsService);
  private bffUrl: string = environment.endpoint;
  private readonly STORAGE_KEY = 'f1-connections-progress';

  gameOver: boolean = false;
  gameWon: boolean = false;
  gameStarted: boolean = false;

  gameID: string = '';
  type: string = '';
  feedback: string = '';
  selected: string[] = [];

  results?: Connections;
  visualResults?: Connections_Results;

  selectedGroup?: { title: string; description?: string };
  selectedGroupResults: { id: string; name: string; image: string }[] = [];
  guessedGroups: {
    title: string;
    description?: string;
    results: { id: string; name: string; image: string }[];
  }[] = [];

  remainingResults: any[] = []; // plano, con todos los resultados visuales
  loaded: boolean = false;

  async ngOnInit() {
    //localStorage.removeItem(this.STORAGE_KEY);
    this.results = await this.connectionsService.getGamedataTC();
    this.loaded = true;
    if (!this.results) {
      return;
    }
    this.gameID = this.results.id;
    this.type = this.results.type;
    this.getGameStarted();
    this.getVisualResults();
  }

  startGame(gameMode?: string) {
    if (!gameMode) {
      return;
    }
    this.gameStarted = true;
  }

  getGameStarted() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.guessedGroups = parsed.guessedGroups ?? [];
      this.gameOver = parsed.gameOver ?? false;
      this.gameWon = parsed.gameWin ?? false;
      const gameIDAux = parsed.gameID ?? '';
      if (!gameIDAux || gameIDAux !== this.gameID) {
        localStorage.removeItem(this.STORAGE_KEY);
      }

      // Eliminar resultados ya adivinados
      const guessedIDs = this.guessedGroups.flatMap((g) =>
        g.results.map((r) => r.id),
      );
      this.remainingResults = this.remainingResults.filter(
        (r) => !guessedIDs.includes(r.id),
      );
      this.gameStarted = true;
    }
  }

  async getVisualResults() {
    const raw = await this.connectionsService.getGamedataResultsTC(
      this.gameID,
      this.type,
    );
    const source = raw?.driver ?? raw?.team ?? raw?.track ?? [];

    // Normalizar todos los resultados
    const allResults = source.map((r) => {
      const id = r.id;
      let image = '';
      let name = '';

      if ('firstname' in r && 'lastname' in r) {
        name = r.lastname.toUpperCase();
      } else if ('name' in r) {
        name = r.name.toUpperCase();
      } else if ('track_name' in r) {
        name = r.track_name.toUpperCase();
      }

      if ('image' in r) {
        image = r.image;
      } else if ('logo' in r) {
        image = r.logo;
      }

      return { id, name, image };
    });

    // Filtrar los que ya fueron adivinados
    const guessedIDs = this.guessedGroups.flatMap((g) =>
      g.results.map((r) => r.id),
    );

    this.remainingResults = allResults.filter(
      (r) => !guessedIDs.includes(r.id),
    );
  }

  toggleSelect(id: string) {
    if (this.selected.includes(id)) {
      this.selected = this.selected.filter((r) => r !== id);
    } else {
      if (this.selected.length >= 4) return;
      this.selected.push(id);
    }
  }

  async submitSelection() {
    if (this.selected.length !== 4) {
      this.feedback = 'You must select exactly 4 results.';
      return;
    }

    const res = await this.connectionsService.guessGroupTC(
      this.gameID,
      this.selected,
    );

    if (!res) {
      this.feedback = 'Something went wrong. Try again.';
      return;
    }

    // Reset feedback and group display
    this.feedback = '';
    const matchCount = res.matchCount ?? 0;

    switch (matchCount) {
      case 4:
        this.feedback = `✅ Perfect! You found a full group: ${res.group?.title}`;

        // Extraer los resultados seleccionados
        const matched = this.remainingResults.filter((r) =>
          this.selected.includes(r.id),
        );

        // Normalizar resultados
        const normalized = matched.map((r) => {
          const id = r.id;
          let name = '';
          let image = '';

          if ('firstname' in r && 'lastname' in r) {
            name = `${r.firstname} ${r.lastname}`;
          } else if ('name' in r) {
            name = r.name;
          } else if ('track_name' in r) {
            name = r.track_name;
          }

          if ('image' in r) {
            image = r.image;
          } else if ('logo' in r) {
            image = r.logo;
          }
          return { id, name, image };
        });

        // Agregar grupo acertado
        this.guessedGroups.push({
          title: res.group?.title ?? 'Unnamed Group',
          description: res.group?.title ?? '',
          results: normalized,
        });

        // Eliminar los resultados acertados de la grilla
        this.remainingResults = this.remainingResults.filter(
          (r) => !this.selected.includes(r.id),
        );

        // Verificar si ya se adivinaron todos los grupos
        if (this.remainingResults.length === 0) {
          this.gameOver = true;
          this.gameWon = true;
        }

        this.saveGameState();
        this.selected = [];
        break;

      case 3:
        this.feedback =
          '🟡 Almost! 3 of your selections belong to the same group.';
        break;

      case 2:
        this.feedback = '🟠 Getting closer! 2 of your selections match.';
        break;

      default:
        this.feedback = '❌ Incorrect. Try again!';
    }
  }

  saveGameState() {
    const state = {
      gameID: this.gameID,
      type: this.type,
      date: this.results?.date,
      guessedGroups: this.guessedGroups,
      gameOver: this.gameOver,
      gameWin: this.gameWon,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  surrender() {
    this.gameOver = true;
    this.gameWon = false;
    this.saveGameState();
  }

  normalizeResult(result: Driver | Team | Track): {
    id: string;
    name: string;
    image: string;
  } {
    const id = result.id;
    let image = '';
    let name = '';
    if ('firstname' in result && 'lastname' in result) {
      name = `${result.firstname} ${result.lastname}`;
    } else if ('name' in result) {
      name = result.name;
    } else if ('track_name' in result) {
      name = result.track_name;
    }

    if ('image' in result) {
      image = result.image;
    } else if ('logo' in result) {
      image = result.logo;
    }

    return { id, name, image };
  }

  clearSelection() {
    this.selected = [];
    this.feedback = '';
  }

  getEntityImage(entity: any) {
    switch (this.type) {
      case 'driver':
        return `${this.bffUrl}${entity.image}.jpg`;
      case 'team':
        return `${this.bffUrl}${entity.logo}.jpg`;
      case 'track':
        return `${this.bffUrl}${entity.image}.jpg`;
      default:
        return 'assets/default.png';
    }
  }
}
