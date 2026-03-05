import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { H2HGameResponse } from '../../../shared/models/h2h-game-response';

interface StatItem {
  label: string;
  type: string;
  driver1Value?: number;
  driver2Value?: number;
  revealed: boolean;
  selected: boolean;
  correct?: boolean;
}

@Component({
  selector: 'app-h2h-stats-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './h2h-stats-display.component.html',
  styleUrls: ['./h2h-stats-display.component.css']
})
export class H2hStatsDisplayComponent implements OnInit, OnChanges {
  @Input() gameData?: H2HGameResponse;
  @Input() gameResults: any[] = [];
  @Input() savedSelections: {type: string, driverId: string}[] = [];
  @Input() gameOver: boolean = false;
  @Output() statSelected = new EventEmitter<{type: string, driverId: string}>();
  @Output() submitGuess = new EventEmitter<void>();
  
  public stats: StatItem[] = [];
  public selectedStat: {type: string, driverId: string} | null = null;
  private guessHistory: {type: string, driverId: string}[] = [];
  
  ngOnInit() {
    this.initStats();
    this.updateFromResults();
    
    // Initialize guess history from saved selections if available
    if (this.savedSelections && this.savedSelections.length > 0) {
      this.guessHistory = [...this.savedSelections];
    }
  }
  
  initStats() {
    this.stats = [
      { label: 'RACE', type: 'race', revealed: false, selected: false },
      { label: 'QUALIFYING', type: 'qualifying', revealed: false, selected: false },
      { label: 'POINTS', type: 'points', revealed: false, selected: false },
      { label: 'POINTS FINISHES', type: 'points_finishes', revealed: false, selected: false },
      { label: 'DNF', type: 'dnfs', revealed: false, selected: false }
    ];
  }
  
  updateFromResults() {
    if (!this.gameResults || this.gameResults.length === 0) return;
    
    // Reset all stats to not revealed
    this.stats.forEach(stat => {
      stat.revealed = false;
      stat.driver1Value = undefined;
      stat.driver2Value = undefined;
      stat.correct = undefined;
    });
    
    // Update with latest results
    this.gameResults.forEach(result => {
      const stat = this.stats.find(s => s.type === result.type);
      if (stat) {
        stat.revealed = true;
        stat.driver1Value = result.driver1?.value;
        stat.driver2Value = result.driver2?.value;
        stat.correct = result.correct;
      }
    });
  }
  
  ngOnChanges() {
    this.updateFromResults();
    
    // Update guess history if savedSelections changes
    if (this.savedSelections && this.savedSelections.length > 0) {
      this.guessHistory = [...this.savedSelections];
    }
  }
  
  selectStat(type: string, driverId: string) {
    // Only allow selection if not already revealed and game is not over
    const stat = this.stats.find(s => s.type === type);
    if (stat && !stat.revealed && !this.gameOver) {
      // Just update the selected stat, no need to modify the stat object
      this.selectedStat = { type, driverId };
      this.statSelected.emit(this.selectedStat);
    }
  }
  
  onSubmitGuess() {
    if (this.selectedStat) {
      // Save the selected stat to history before submitting
      this.guessHistory.push({...this.selectedStat});
      this.submitGuess.emit();
    }
  }
  
  // Expose the current guess history for parent component to save
  getGuessHistory(): {type: string, driverId: string}[] {
    return [...this.guessHistory];
  }
  
  getRowClass(stat: StatItem) {
    if (!stat.revealed) return '';
    return stat.correct !== undefined ? (stat.correct ? 'row-correct' : 'row-incorrect') : '';
  }
  
  getStatClass(stat: StatItem, isDriver1: boolean) {
    if (!stat.revealed) return '';
    
    const driver1Greater = (stat.driver1Value || 0) >= (stat.driver2Value || 0);
    
    if (isDriver1) {
      return driver1Greater ? 'correct' : 'incorrect';
    } else {
      return !driver1Greater ? 'correct' : 'incorrect';
    }
  }
  
  wasSelected(stat: StatItem, driverId: string): boolean {
    return this.guessHistory.some(guess => guess.type === stat.type && guess.driverId === driverId);
  }
  
  wasCorrect(stat: StatItem, driverId: string): boolean {
    if (!stat.revealed) return false;
    
    const driver1Greater = (stat.driver1Value || 0) >= (stat.driver2Value || 0);
    const driver1Id = this.gameData?.Driver1?.id || '';
    const driver2Id = this.gameData?.Driver2?.id || '';
    
    if (driverId === driver1Id) {
      return driver1Greater;
    } else if (driverId === driver2Id) {
      return !driver1Greater;
    }
    
    return false;
  }
}
