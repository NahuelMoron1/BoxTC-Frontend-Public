import { Component, Input } from '@angular/core';
import { H2HGameResponse } from '../../models/h2h-game-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-h2h-team-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './h2h-team-info.component.html',
  styleUrl: './h2h-team-info.component.css',
})
export class H2hTeamInfoComponent {
  @Input() gameData?: H2HGameResponse;
  private bffUrl: string = environment.endpoint;

  getImage(url: string) {
    return this.bffUrl + url + '.jpg';
  }
}
