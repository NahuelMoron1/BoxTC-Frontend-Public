import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuessDriversService } from '../../../services/guess-drivers.service';
import { GuessDriversComplete } from '../../../models/GuessDrivers';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import { GameWonComponent } from '../../game-won/game-won.component';
import { GameLostComponent } from '../../game-lost/game-lost.component';
import { GuessDriversSelectorComponent } from '../../selectors/guess-drivers-selector/guess-drivers-selector.component';

@Component({
  selector: 'app-guess-drivers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GameNotFoundComponent,
    GameWonComponent,
    GameLostComponent,
    GuessDriversSelectorComponent,
  ],
  templateUrl: './guess-drivers.component.html',
  styleUrl: './guess-drivers.component.css',
})
export class GuessDriversComponent implements OnInit {
  public gamedata?: GuessDriversComplete;
  public gameStarted: boolean = false;
  public gameWon: boolean = false;
  public gameLost: boolean = false;
  private readonly STORAGE_KEY = 'f1-guessDrivers-progress';
  private bffUrl?: string = environment.endpoint;

  public loaded: boolean = false;
  public driverGuess: string = '';
  public revealedTeams: any[] = [];
  public revealedTeamsBeforeGameOver: any[] = []; // Equipos revelados antes del game over
  public allTeamSlots: any[] = [];
  public driverInfo: any = null;
  public hintsRemaining: number = 2;
  public hints: {
    nationality?: string;
    teamYears?: { start_year: number; end_year: number };
  } = {};

  searchTerm$ = new Subject<string>();
  filteredDrivers: { id: string; name: string }[] = [];

  constructor(private guessDriversService: GuessDriversService) {}

  async ngOnInit() {
    this.gamedata = await this.guessDriversService.getGameTC();
    this.loaded = true;
    if (this.gamedata?.Teams && this.gamedata.Teams.length > 0) {
      this.revealedTeams = [this.gamedata.Teams[0]];

      // Crear slots para todos los equipos
      // Usamos la propiedad totalTeams que viene del backend
      const totalTeams = this.gamedata.totalTeams || 5; // Valor predeterminado de 5 si no viene la propiedad
      this.allTeamSlots = new Array(totalTeams).fill(null);
    }

    await this.loadSavedProgress();

    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (!value) return;
        this.fetchDriverSuggestions(value);
      });
  }

  async loadSavedProgress() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.date === new Date().toISOString().split('T')[0]) {
        this.gameStarted = parsed.gameStarted;
        this.gameWon = parsed.gameWon;
        this.gameLost = parsed.gameLost;

        // Si tenemos datos del juego actual y datos guardados, usamos los datos guardados
        // pero preservamos la estructura original de Team
        if (
          this.gamedata?.Teams &&
          parsed.revealedTeams &&
          parsed.revealedTeams.length > 0
        ) {
          // Mapeamos los equipos guardados a los equipos originales por ID
          this.revealedTeams = parsed.revealedTeams.map((savedTeam: any) => {
            // Buscar el equipo original por ID
            const originalTeam = this.gamedata?.Teams.find(
              (t: any) => t.id === savedTeam.id,
            );
            if (originalTeam) {
              // Devolver el equipo original con los datos guardados
              return {
                ...savedTeam,
                Team: originalTeam.Team,
              };
            }
            return savedTeam;
          });
        } else {
          this.revealedTeams = parsed.revealedTeams || [];
        }

        // Cargar los equipos revelados antes del game over
        if (parsed.revealedTeamsBeforeGameOver) {
          this.revealedTeamsBeforeGameOver = parsed.revealedTeamsBeforeGameOver;
        } else {
          // Si no existe esta propiedad en los datos guardados, asumimos que todos los equipos revelados
          // fueron revelados antes del game over
          this.revealedTeamsBeforeGameOver = [...this.revealedTeams];
        }

        this.driverInfo = parsed.driverInfo;
        this.hintsRemaining = parsed.hintsRemaining ?? 2;
        this.hints = parsed.hints || {};
      }
    }
  }

  saveProgress() {
    const data = {
      gameStarted: this.gameStarted,
      gameWon: this.gameWon,
      gameLost: this.gameLost,
      date: new Date().toISOString().split('T')[0],
      revealedTeams: this.revealedTeams,
      revealedTeamsBeforeGameOver: this.revealedTeamsBeforeGameOver,
      driverInfo: this.driverInfo,
      hintsRemaining: this.hintsRemaining,
      hints: this.hints,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async startGameFirstTime(timer: boolean) {
    // Not using timer now because it's only normal game mode ATM.
    this.gameStarted = true;
    this.saveProgress();
  }

  async fetchDriverSuggestions(query: string) {
    // Aquí se implementaría la lógica para buscar sugerencias de pilotos
    // Por ahora, dejamos esto vacío ya que no tenemos un endpoint para esto
  }

  onInputChange(event: any) {
    const value = event.target.value;
    this.driverGuess = value;
    this.searchTerm$.next(value);
  }

  async submitGuess() {
    if (!this.driverGuess || !this.gamedata?.id) return;

    const result = await this.guessDriversService.guessDriverTC(
      this.gamedata.id,
      this.driverGuess,
    );

    if (result?.correct && result.driver) {
      this.gameWon = true;
      this.driverInfo = result.driver;

      // Revelar todos los equipos al ganar
      await this.revealAllTeams();

      this.saveProgress();
      Swal.fire({
        title: 'Correct!',
        text: `You guessed the driver: ${result.driver.firstname} ${result.driver.lastname}`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } else {
      // Si no adivinó y ya se revelaron todos los equipos, el juego termina
      // Usamos totalTeams en lugar de Teams.length porque Teams solo contiene el primer equipo
      const totalTeams = this.gamedata.totalTeams || this.gamedata.Teams.length;
      if (this.revealedTeams.length >= totalTeams) {
        this.gameLost = true;

        // Obtener información del piloto para mostrarla al perder
        const driverInfo = await this.getDriverInfo();
        if (driverInfo) {
          this.driverInfo = driverInfo;
        }

        this.saveProgress();
        Swal.fire({
          title: 'Game Over',
          text: 'You have revealed all teams and failed to guess the driver.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        // Si no adivinó pero aún hay equipos por revelar, revelamos el siguiente
        await this.revealNextTeam();
      }
    }
  }

  async revealNextTeam() {
    if (!this.gamedata?.id) return;

    const result = await this.guessDriversService.getNextTeamTC(
      this.gamedata.id,
      this.revealedTeams.length,
    );

    if (result?.team) {
      this.revealedTeams.push(result.team);
      // También añadimos el equipo a los revelados antes del game over
      this.revealedTeamsBeforeGameOver.push(result.team);
      this.saveProgress();
    }
  }

  async useHint() {
    if (this.hintsRemaining <= 0 || !this.gamedata?.id) return;

    const hintNumber = this.hintsRemaining === 2 ? 1 : 2;
    const result = await this.guessDriversService.getHintTC(
      this.gamedata.id,
      hintNumber,
    );

    if (result?.hint) {
      if (result.hint.type === 'nationality') {
        this.hints.nationality = result.hint.value;
      } else if (result.hint.type === 'team_years') {
        this.hints.teamYears = result.hint.value;
      }

      this.hintsRemaining--;
      this.saveProgress();
    }
  }

  // Método para revelar todos los equipos
  async revealAllTeams() {
    if (!this.gamedata?.id) return;

    try {
      // Obtener todos los equipos del juego
      const allTeams = await this.guessDriversService.getAllTeamsTC(
        this.gamedata.id,
      );
      if (allTeams?.teams) {
        // Guardamos los equipos que ya estaban revelados antes del game over
        // para mantener sus bordes rojos
        this.revealedTeamsBeforeGameOver = [...this.revealedTeams];

        // Revelamos todos los equipos
        this.revealedTeams = allTeams.teams;
        this.saveProgress();
      }
    } catch (error) {
      console.error('Error al revelar todos los equipos:', error);
    }
  }

  // Método para obtener la información del piloto
  async getDriverInfo() {
    if (!this.gamedata?.id) return null;

    try {
      // Obtener la información del piloto
      const driverInfo = await this.guessDriversService.getDriverInfoTC(
        this.gamedata.id,
      );
      return driverInfo?.driver || null;
    } catch (error) {
      console.error('Error al obtener información del piloto:', error);
      return null;
    }
  }

  getTeamLogoSrc(index: number): string {
    let logo = '';

    try {
      // Primero intentamos obtener el logo del equipo revelado
      if (index < this.revealedTeams.length) {
        const team = this.revealedTeams[index];

        // Verificar si tenemos el logo en Team
        if (team?.Team?.logo) {
          logo = team.Team.logo;
        }
        // Si no tenemos el logo en Team, buscamos el equipo original en gamedata
        else if (team?.id && this.gamedata?.Teams) {
          const originalTeam = this.gamedata.Teams.find(
            (t) => t.id === team.id,
          );
          if (originalTeam?.Team?.logo) {
            logo = originalTeam.Team.logo;
          }
        }
      }
      // Si el juego terminó, mostramos todos los equipos
      else if (
        (this.gameWon || this.gameLost) &&
        this.gamedata?.Teams[index]?.Team?.logo
      ) {
        logo = this.gamedata.Teams[index].Team.logo;
      }
    } catch (error) {
      console.error('Error getting team logo:', error);
      return 'https://cdn-icons-png.flaticon.com/512/4974/4974985.png';
    }

    if (!logo) {
      return 'https://cdn-icons-png.flaticon.com/512/4974/4974985.png';
    }

    return `${this.bffUrl}${logo}.jpg`;
  }

  hasYears(index: number): boolean {
    try {
      if (index < this.revealedTeams.length) {
        return (
          !!this.revealedTeams[index]?.start_year &&
          !!this.revealedTeams[index]?.end_year
        );
      } else if (
        (this.gameWon || this.gameLost) &&
        this.gamedata?.Teams[index]
      ) {
        return (
          !!this.gamedata.Teams[index]?.start_year &&
          !!this.gamedata.Teams[index]?.end_year
        );
      }
    } catch (error) {
      console.error('Error checking years:', error);
    }
    return false;
  }

  getStartYear(index: number): number | string {
    try {
      if (index < this.revealedTeams.length) {
        return this.revealedTeams[index]?.start_year || '';
      } else if (
        (this.gameWon || this.gameLost) &&
        this.gamedata?.Teams[index]
      ) {
        return this.gamedata.Teams[index]?.start_year || '';
      }
    } catch (error) {
      console.error('Error getting start year:', error);
    }
    return '';
  }

  getEndYear(index: number): number | string {
    try {
      if (index < this.revealedTeams.length) {
        return this.revealedTeams[index]?.end_year || '';
      } else if (
        (this.gameWon || this.gameLost) &&
        this.gamedata?.Teams[index]
      ) {
        return this.gamedata.Teams[index]?.end_year || '';
      }
    } catch (error) {
      console.error('Error getting end year:', error);
    }
    return '';
  }

  getTeamName(index: number): string {
    try {
      if (index < this.revealedTeams.length) {
        return this.revealedTeams[index]?.Team?.name || '';
      } else if (
        (this.gameWon || this.gameLost) &&
        this.gamedata?.Teams[index]
      ) {
        return this.gamedata.Teams[index]?.Team?.name || '';
      }
    } catch (error) {
      console.error('Error getting team name:', error);
    }
    return '';
  }

  getTeamImage(logo: string): string {
    if (!logo) return 'https://cdn-icons-png.flaticon.com/512/4974/4974985.png';
    return `${this.bffUrl}${logo}.jpg`;
  }

  getDriverImage(image: string): string {
    if (!image)
      return 'https://cdn-icons-png.flaticon.com/512/3048/3048122.png';
    return `${this.bffUrl}${image}.jpg`;
  }
}
