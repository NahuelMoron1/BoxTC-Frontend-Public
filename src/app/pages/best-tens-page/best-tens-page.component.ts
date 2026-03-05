import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { BestTensComponent } from '../../shared/components/play/best-tens/best-tens.component';

@Component({
  selector: 'app-best-tens-page',
  standalone: true,
  imports: [NavBarComponent, BestTensComponent],
  templateUrl: './best-tens-page.component.html',
  styleUrl: './best-tens-page.component.css',
})
export class BestTensPageComponent {}
