import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PlayConnectionsComponent } from '../../shared/components/play/play-connections/play-connections.component';

@Component({
  selector: 'app-connections-game',
  standalone: true,
  imports: [NavBarComponent, PlayConnectionsComponent],
  templateUrl: './connections-game.component.html',
  styleUrl: './connections-game.component.css',
})
export class ConnectionsGameComponent {}
