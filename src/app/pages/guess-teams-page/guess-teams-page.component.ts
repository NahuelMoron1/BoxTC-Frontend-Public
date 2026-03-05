import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PlayGuessTeamsComponent } from '../../shared/components/play/play-guess-teams/play-guess-teams.component';

@Component({
  selector: 'app-guess-teams-page',
  imports: [NavBarComponent, PlayGuessTeamsComponent],
  templateUrl: './guess-teams-page.component.html',
  styleUrl: './guess-teams-page.component.css',
})
export class GuessTeamsPageComponent {}
