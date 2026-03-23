import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  Gamedata_Impostor,
  Gamedata_ImpostorByOne,
} from '../../../models/IGamedata_Impostor';
import { Top10Gamedata } from '../../../models/ITop10Gamedata';
import { ImpostorService } from '../../../services/impostor.service';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { ImpostorModeSelectorComponent } from '../../selectors/impostor-mode-selector/impostor-mode-selector.component';
import { SurrenderComponent } from '../../surrender/surrender.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-play-impostor',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ImpostorModeSelectorComponent,
    GameNotFoundComponent,
    SurrenderComponent,
  ],
  templateUrl: './play-impostor.component.html',
  styleUrl: './play-impostor.component.css',
})
export class PlayImpostorComponent implements OnInit {
  private impostorService = inject(ImpostorService);
  private readonly STORAGE_KEY = 'f1-impostor-progress';

  public gamedata?: Top10Gamedata;
  public gameMode?: string;
  public selectedIDs: string[] = [];
  public selectedID?: string;
  public verifiedInnocents: string[] = [];
  public verifiedAttempts: { id: string; correct: boolean }[] = [];
  public tryNumber: number = 0;
  public gameResult?: Gamedata_Impostor;
  public gameResultByOne?: Gamedata_ImpostorByOne;
  public gameOver: boolean = false;
  public gameWin: boolean = false;
  private bffUrl: string = environment.endpoint;
  public today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  public loaded: boolean = false;

  // Listas para el surrender
  public impostorIDs: string[] = [];
  public innocentIDs: string[] = [];
  public hasSurrendered: boolean = false;

  async ngOnInit() {
    this.gamedata = await this.impostorService.getGamedataTC();
    this.loaded = true;
    //localStorage.removeItem(this.STORAGE_KEY);
    this.loadProgress();
  }

  startGame(gameMode?: string) {
    if (!gameMode) {
      return;
    }
    this.gameMode = gameMode;
  }

  loadProgress() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved || !this.gamedata) return;

    const data = JSON.parse(saved);
    if (data.gameID !== this.gamedata.id) {
      localStorage.removeItem(this.STORAGE_KEY);
      return;
    }

    this.gameMode = data.gameMode || 'normal';
    this.gameOver = data.gameOver || false;
    this.hasSurrendered = data.hasSurrendered || false;
    this.impostorIDs = data.impostorIDs || [];
    this.innocentIDs = data.innocentIDs || [];

    if (this.gameMode === 'normal') {
      this.selectedIDs = data.selectedIDs || [];
      this.gameResult = {
        impostors_selected: data.impostors_selected || [],
        innocents_selected: data.innocents_selected || [],
        all_innocents: data.all_innocents || [],
        game_won: data.gameWin || false,
      };
    } else {
      this.selectedID = data.selectedIDs?.[0] || '';
      this.tryNumber = data.tryNumber;
      this.verifiedInnocents = data.verifiedInnocents || [];
      this.verifiedAttempts = data.verifiedAttempts || [];
      this.gameResultByOne = {
        victory: data.victory || false,
        game_won: data.gameWin,
        all_innocents: data.all_innocents || [],
      };
    }
  }

  getEntityName(entity: any): string {
    switch (this.gamedata?.type) {
      case 'driver':
        return `${entity.firstname} ${entity.lastname}`;
      case 'team':
        return entity.common_name;
      case 'track':
        return entity.track_name;
      default:
        return 'Unknown';
    }
  }

  getEntityImage(entity: any) {
    switch (this.gamedata?.type) {
      case 'driver':
        /*const url = await this.removeBackgroundFromURL(
          `${this.bffUrl}${entity.image}.jpg`
        );*/
        return `${this.bffUrl}${entity.image}.jpg`;
      case 'team':
        return `${this.bffUrl}${entity.logo}.jpg`;
      case 'track':
        return `${this.bffUrl}${entity.image}.jpg`;
      default:
        return 'assets/default.png';
    }
  }

  isSelected(entity: any): boolean {
    if (this.gameMode === 'normal') {
      return this.selectedIDs.includes(entity.id);
    } else {
      return this.selectedID === entity.id;
    }
  }

  toggleSelection(entity: any): void {
    if (this.gameOver) return; // ⛔ no se puede seleccionar
    const id = entity.id;
    this.selectedIDs.includes(id)
      ? (this.selectedIDs = this.selectedIDs.filter((i) => i !== id))
      : this.selectedIDs.push(id);
  }

  async verifySelection(): Promise<void> {
    if (this.gameOver || !this.gamedata || !this.gameMode) return; // ⛔ no se puede verificar de nuevo

    switch (this.gameMode) {
      case 'normal':
        const result = await this.impostorService.playNormalGameTC(
          this.gamedata.id,
          this.selectedIDs,
        );
        if (result) {
          this.gameResult = result;
          this.gameOver = true;
          this.saveProgress();
        }
        break;
      case 'byOne':
        if (!this.selectedID) {
          return;
        }

        this.tryNumber++;

        const provisionalResult = await this.impostorService.playOneByOneGameTC(
          this.gamedata.id,
          this.selectedID,
          this.tryNumber,
        );
        if (provisionalResult) {
          this.gameResultByOne = provisionalResult;
          if (this.gameResultByOne.victory === false) {
            this.gameOver = true;
          } else if (this.gameResultByOne.game_won === true) {
            this.gameOver = true;
            this.gameWin = true;
          }
          this.verifiedAttempts.push({
            id: this.selectedID!,
            correct: provisionalResult.victory,
          });
          this.saveProgress();
        }
        break;
      default:
        break;
    }
  }

  isImpostor(entity: any): boolean {
    // Verificar si la entidad es un impostor según los resultados del juego
    return this.gameResult?.impostors_selected.includes(entity.id) ?? false;
  }

  wasCorrect(entity: any): boolean {
    return this.isSelected(entity) && !this.isImpostor(entity);
  }

  wasWrong(entity: any): boolean {
    // Si el usuario seleccionó un impostor, es una selección incorrecta
    return this.isSelected(entity) && this.isImpostor(entity);
  }

  // Nuevos métodos para el surrender
  isImpostorAfterSurrender(entity: any): boolean {
    if (this.hasSurrendered) {
      return this.impostorIDs.includes(entity.id);
    }
    return this.isImpostor(entity);
  }

  isInnocentAfterSurrender(entity: any): boolean {
    if (this.hasSurrendered) {
      return this.innocentIDs.includes(entity.id);
    }
    return this.wasCorrect(entity);
  }

  wasCorrectByOne(entity: any): boolean {
    return this.verifiedAttempts.some(
      (a) => a.id === entity.id && a.correct === true,
    );
  }

  wasWrongByOne(entity: any): boolean {
    return this.verifiedAttempts.some(
      (a) => a.id === entity.id && a.correct === false,
    );
  }

  wasMissedInnocentByOne(entity: any): boolean {
    return (
      this.gameMode === 'byOne' &&
      this.gameOver &&
      this.gameResultByOne?.victory === false &&
      this.gameResultByOne?.all_innocents.some((r) => r === entity.id) &&
      !this.verifiedAttempts.some((a) => a.id === entity.id)
    );
  }

  wasMissedInnocent(entity: any): boolean {
    if (!this.gameOver || !this.gameResult) return false;

    return (
      this.gameResult.all_innocents.includes(entity.id) &&
      !this.selectedIDs.includes(entity.id) &&
      !this.isImpostor(entity)
    );
  }

  saveProgress() {
    const data = {
      gameOver: this.gameOver,
      gameWin:
        this.gameMode === 'normal'
          ? (this.gameResult?.game_won ?? false)
          : (this.gameResultByOne?.game_won ?? false),
      gameID: this.gamedata?.id,
      gameMode: this.gameMode,
      tryNumber: this.tryNumber,
      verifiedAttempts: this.verifiedAttempts,
      verifiedInnocents:
        this.gameMode === 'byOne' ? this.verifiedInnocents : [],
      hasSurrendered: this.hasSurrendered,
      impostorIDs: this.impostorIDs,
      innocentIDs: this.innocentIDs,

      selectedIDs:
        this.gameMode === 'normal' ? this.selectedIDs : [this.selectedID],
      impostors_selected:
        this.gameMode === 'normal'
          ? (this.gameResult?.impostors_selected ?? [])
          : [], // opcional en byOne
      innocents_selected:
        this.gameMode === 'normal'
          ? (this.gameResult?.innocents_selected ?? [])
          : this.selectedID
            ? [this.selectedID]
            : [],
      all_innocents:
        this.gameMode === 'normal'
          ? (this.gameResult?.all_innocents ?? [])
          : (this.gameResultByOne?.all_innocents ?? []),
      date: this.today,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  handleClick(entity: any): void {
    if (this.gameOver) return;
    if (this.gameMode === 'normal') {
      this.toggleSelection(entity);
    } else {
      this.selectedID = entity.id;
      this.gameResultByOne = undefined;
    }
  }

  async surrender() {
    if (!this.gamedata) return;

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Si te rindes, perderás el juego del impostor de hoy, y las respuestas serán reveladas',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, rendirme',
      cancelButtonText: 'Cancelar',
      background: '#1b1b1bff',
      color: '#dcecfbff',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.gameOver = true;
        this.hasSurrendered = true;

        const surrenderResult = await this.impostorService.surrenderTC(
          this.gamedata!.id,
        );

        if (surrenderResult) {
          // Guardar las listas de impostores e inocentes
          this.impostorIDs = surrenderResult.impostors || [];
          this.innocentIDs = surrenderResult.innocents || [];

          // Guardar también en el formato original para compatibilidad
          if (this.gameMode === 'normal') {
            this.gameResult = {
              game_won: false,
              // Solo los impostores que el usuario seleccionó (probablemente ninguno)
              impostors_selected: this.selectedIDs.filter((id) =>
                this.impostorIDs.includes(id),
              ),
              innocents_selected: this.selectedIDs.filter((id) =>
                this.innocentIDs.includes(id),
              ),
              all_innocents: this.innocentIDs,
            };
          } else {
            this.gameResultByOne = {
              victory: false,
              game_won: false,
              all_innocents: this.innocentIDs,
            };
          }
          this.saveProgress();
        }

        Swal.fire({
          title: 'Te rendiste 🏳️',
          text: 'Estas eran las respuestas. Sigue intentando mañana!',
          icon: 'info',
          confirmButtonColor: '#ff0000',
          background: '#1b1b1bff',
          color: '#dcecfbff',
        });
      }
    });
  }
}
