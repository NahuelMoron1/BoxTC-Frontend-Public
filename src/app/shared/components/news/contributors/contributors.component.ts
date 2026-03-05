import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contributors',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.css',
})
export class ContributorsComponent {}
