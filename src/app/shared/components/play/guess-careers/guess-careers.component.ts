import { Component, OnInit } from '@angular/core';
import { GuessCareersSelectorComponent } from '../../selectors/guess-careers-selector/guess-careers-selector.component';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';
import {
  GuessCareers,
  GuessCareersComplete,
} from '../../../models/GuessCareers';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuessCareersService } from '../../../services/guess-careers.service';
import { GameWonComponent } from '../../game-won/game-won.component';
import { GameLostComponent } from '../../game-lost/game-lost.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-guess-careers',
  standalone: true,
  imports: [
    GuessCareersSelectorComponent,
    GameNotFoundComponent,
    CommonModule,
    FormsModule,
    GameWonComponent,
    GameLostComponent,
  ],
  templateUrl: './guess-careers.component.html',
  styleUrl: './guess-careers.component.css',
})
export class GuessCareersComponent implements OnInit {
  public gamedata?: GuessCareersComplete;
  public gameStarted: boolean = false;
  public gameWon: boolean = false;
  public gameLost: boolean = false;
  public gameOver: boolean = false;
  private readonly STORAGE_KEY = 'f1-guessCareers-progress';
  private bffUrl?: string = environment.endpoint;

  public driverGuess: string = '';
  public revealedTeams: any[] = [];
  public revealedTeamsBeforeGameOver: any[] = []; // Equipos revelados antes del game over
  public allTeamSlots: any[] = [];
  public driverInfo: any = null;
  public hintsRemaining: number = 2;
  public hints: {
    nationality?: string;
    teamYears?: { start_year: number; end_year: number; team_id?: string };
  } = {};
  public driverNationalityFlag: string | null = null;
  public loaded: boolean = false;

  searchTerm$ = new Subject<string>();
  filteredDrivers: { id: string; name: string }[] = [];

  constructor(private guessCareersService: GuessCareersService) {}

  async ngOnInit() {
    //localStorage.removeItem(this.STORAGE_KEY);
    this.gamedata = await this.guessCareersService.getGameTC();
    this.loaded = true;
    if (this.gamedata?.Teams && this.gamedata.Teams.length > 0) {
      this.revealedTeams = [...this.gamedata.Teams];
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
        this.gameOver = parsed.gameOver;
        this.gameWon = parsed.gameWin;
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
        this.driverNationalityFlag = parsed.driverNationalityFlag || null;
      }
    }
  }

  saveProgress() {
    const data = {
      gameStarted: this.gameStarted,
      gameOver: this.gameOver,
      gameWin: this.gameWon,
      gameLost: this.gameLost,
      date: new Date().toISOString().split('T')[0],
      revealedTeams: this.revealedTeams,
      revealedTeamsBeforeGameOver: this.revealedTeamsBeforeGameOver,
      driverInfo: this.driverInfo,
      hintsRemaining: this.hintsRemaining,
      hints: this.hints,
      driverNationalityFlag: this.driverNationalityFlag,
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

    // Limpiamos la entrada del usuario (eliminamos espacios adicionales)
    const cleanGuess = this.driverGuess.trim();

    // Si el usuario no ingresó nada después de limpiar, no hacemos nada
    if (!cleanGuess) return;

    // Verificamos si el piloto ya está revelado (en caso de que el usuario haya perdido)
    if (this.driverInfo) {
      // Comparamos exactamente con el nombre o apellido del piloto
      const isExactMatch =
        cleanGuess.toLowerCase() === this.driverInfo.firstname.toLowerCase() ||
        cleanGuess.toLowerCase() === this.driverInfo.lastname.toLowerCase();

      if (isExactMatch) {
        // Si es una coincidencia exacta, mostramos que ganó
        this.gameWon = true;
        this.gameOver = true;

        this.saveProgress();
        Swal.fire({
          title: 'Correct!',
          text: `You guessed the driver: ${this.driverInfo.firstname} ${this.driverInfo.lastname}`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        return;
      }
    }

    const result = await this.guessCareersService.guessDriverTC(
      this.gamedata.id,
      cleanGuess,
    );

    if (result?.correct && result.driver) {
      // Verificamos si la adivinanza es exactamente igual al nombre o apellido
      const isExactMatch =
        cleanGuess.toLowerCase() === result.driver.firstname.toLowerCase() ||
        cleanGuess.toLowerCase() === result.driver.lastname.toLowerCase();

      if (isExactMatch) {
        this.gameWon = true;
        this.gameOver = true;
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
        // Si no es una coincidencia exacta pero el servidor dice que es correcto,
        // significa que el usuario ingresó una parte del nombre pero no el nombre completo
        Swal.fire({
          title: 'Almost!',
          text: 'You need to enter the exact first name or last name of the driver.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });

        // Tratamos como una adivinanza incorrecta
        await this.handleIncorrectGuess();
      }
    } else {
      await this.handleIncorrectGuess();
    }
  }

  // Método para manejar las adivinanzas incorrectas
  async handleIncorrectGuess() {
    if (!this.gamedata) return;

    // Si no adivinó y ya se revelaron todos los equipos, el juego termina
    // Usamos totalTeams en lugar de Teams.length porque Teams solo contiene el primer equipo
    const totalTeams = this.gamedata.totalTeams || this.gamedata.Teams.length;
    if (this.revealedTeams.length >= totalTeams) {
      this.gameLost = true;
      this.gameOver = true;

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

  async revealNextTeam() {
    if (!this.gamedata?.id) return;

    const result = await this.guessCareersService.getNextTeamTC(
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
    const result = await this.guessCareersService.getHintTC(
      this.gamedata.id,
      hintNumber,
    );

    if (result?.hint) {
      if (result.hint.type === 'nationality') {
        this.hints.nationality = result.hint.value;
        // Set the flag URL based on the nationality
        if (this.hints.nationality) {
          this.driverNationalityFlag = `${this.bffUrl}${this.gamedata.driver_flag}.svg`;
          console.log(this.driverNationalityFlag);
        }
      } else if (result.hint.type === 'team_years') {
        this.hints.teamYears = result.hint.value;

        if (
          this.hints.teamYears &&
          !this.isTeamRevealed(this.hints.teamYears)
        ) {
          // Try to get another hint if this one can't be shown yet
          if (this.hintsRemaining > 0) {
            await this.useHint();
            return;
          }
        }
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
      const allTeams = await this.guessCareersService.getAllTeamsTC(
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
      const driverInfo = await this.guessCareersService.getDriverInfoTC(
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

  // Check if a team is revealed based on team_id or years in the teamYears hint
  isTeamRevealed(teamYears: {
    start_year: number;
    end_year: number;
    team_id?: string;
  }): boolean {
    if (!teamYears) return false;

    // Si tenemos el team_id, verificamos si está en los equipos revelados
    if (teamYears.team_id) {
      return this.revealedTeams.some((team) => team.id === teamYears.team_id);
    }

    // Si no tenemos team_id, buscamos por los años
    return this.revealedTeams.some(
      (team) =>
        team.start_year === teamYears.start_year &&
        team.end_year === teamYears.end_year,
    );
  }

  // Get the team object for the years hint
  getTeamForYears(teamYears?: {
    start_year: number;
    end_year: number;
    team_id?: string;
  }): any {
    if (!teamYears) return null;

    let team;

    // Primero intentamos buscar por team_id si existe
    if (teamYears.team_id) {
      team = this.revealedTeams.find((t) => t.id === teamYears.team_id);
    }

    // Si no encontramos por ID o no hay ID, buscamos por años
    if (!team) {
      team = this.revealedTeams.find(
        (t) =>
          t.start_year === teamYears.start_year &&
          t.end_year === teamYears.end_year,
      );
    }

    // Si encontramos un equipo y tiene la propiedad Team, la devolvemos
    if (team && team.Team) {
      return team.Team;
    }

    return null;
  }
}
