import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-select-game-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './select-game-menu.component.html',
  styleUrl: './select-game-menu.component.css',
})
export class SelectGameMenuComponent {
  gameStatuses = {
    impostor: null as 'win' | 'lost' | null,
    best10: null as 'win' | 'lost' | null,
    wordle: null as 'win' | 'lost' | null,
    connections: null as 'win' | 'lost' | null,
    guessTeams: null as 'win' | 'lost' | null,
    h2h: null as 'win' | 'lost' | null,
    guessCareers: null as 'win' | 'lost' | null,
    timeline: null as 'win' | 'lost' | null,
  };
  public today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  ngOnInit() {
    this.checkGameStatus('impostor', 'f1-impostor-progress');
    this.checkGameStatus('best10', 'f1-best10-progress');
    this.checkGameStatus('wordle', 'f1-wordle-progress');
    this.checkGameStatus('connections', 'f1-connections-progress');
    this.checkGameStatus('guessTeams', 'f1-guessTeams-progress');
    this.checkGameStatus('h2h', 'f1-h2h-progress');
    this.checkGameStatus('guessCareers', 'f1-guessCareers-progress');
    this.checkGameStatus('timeline', 'f1-timeline-progress');
  }

  checkGameStatus(key: keyof typeof this.gameStatuses, storageKey: string) {
    const saved = localStorage.getItem(storageKey);

    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      const date = data.date;

      const sameDay = date == this.today;

      if (!sameDay) {
        localStorage.removeItem(storageKey);
        location.reload();
      }

      if (data.gameOver) {
        this.gameStatuses[key] = data.gameWin ? 'win' : 'lost';
      }
    } catch (e) {
      console.warn(`Error parsing ${storageKey}`, e);
    }
  }
}
