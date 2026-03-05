import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PlayTimelineComponent } from '../../shared/components/play/play-timeline/play-timeline.component';

@Component({
  selector: 'app-play-timeline-page',
  imports: [NavBarComponent, PlayTimelineComponent],
  templateUrl: './play-timeline-page.component.html',
  styleUrl: './play-timeline-page.component.css',
})
export class PlayTimelinePageComponent {}
