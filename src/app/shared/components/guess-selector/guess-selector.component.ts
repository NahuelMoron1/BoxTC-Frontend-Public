import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Suggestions } from '../../models/ISuggestions';
import { Top10Data } from '../../models/ITop10Data';
import { BestTensService } from '../../services/best-tens.service';

@Component({
  selector: 'app-guess-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './guess-selector.component.html',
  styleUrl: './guess-selector.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class GuessSelectorComponent {
  @Input() gameID!: string;
  @Input() type?: string;
  @Output() guessSelected = new EventEmitter<Top10Data>();

  private best10Service = inject(BestTensService);

  guessControl = new FormControl('');
  filteredOptions: Suggestions[] = [];
  selectedOption: { id: string; name: string } | null = null;

  ngOnInit() {
    this.guessControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (!value) return;
        this.fetchSuggestions(value);
        this.selectedOption = null; // reset if user types manually
      });
  }

  async fetchSuggestions(input: string) {
    if (!this.type) return;
    this.filteredOptions = await this.best10Service.getSuggestionsTC(
      input,
      this.type,
    );
  }

  async onSelect(event: MatAutocompleteSelectedEvent) {
    const selectedName = event.option.value;
    const selected = this.filteredOptions?.find((o) => o.name === selectedName);

    if (!selected || !this.type) return;

    this.selectedOption = selected;
    this.guessControl.reset();
    const result = await this.best10Service.getBesto10TC(
      this.gameID,
      this.type,
      selected.id,
    );
    if (result) {
      this.guessSelected.emit(result); // ← emite al componente padre
    } else {
    }
  }
}
