import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-surrender',
  imports: [],
  templateUrl: './surrender.component.html',
  styleUrl: './surrender.component.css',
})
export class SurrenderComponent {
  @Output() surrender = new EventEmitter<void>();

  onSurrender() {
    this.surrender.emit();
  }
}
