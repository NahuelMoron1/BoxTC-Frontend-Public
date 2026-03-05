import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { WordleDataComponent } from '../../shared/components/play/wordle-data/wordle-data.component';

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [WordleDataComponent, NavBarComponent],
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.css',
})
export class WordleComponent {}
