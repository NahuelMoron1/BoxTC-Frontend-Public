import { Component, OnInit } from '@angular/core';
import { TimelineService } from '../../../services/timeline.service';
import { TimelineEvent } from '../../../models/TimelineEvent';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Timeline } from '../../../models/Timeline';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { bffenvironment } from '../../../../environments/environment';
import { GameWonComponent } from '../../game-won/game-won.component';
import { GameLostComponent } from '../../game-lost/game-lost.component';
import { TimelineSelectorComponent } from '../../selectors/timeline-selector/timeline-selector.component';
import { GameNotFoundComponent } from '../../game-not-found/game-not-found.component';

@Component({
  selector: 'app-play-timeline',
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    FormsModule,
    GameWonComponent,
    GameLostComponent,
    TimelineSelectorComponent,
    GameNotFoundComponent,
  ],
  templateUrl: './play-timeline.component.html',
  styleUrls: ['./play-timeline.component.css'],
})
export class PlayTimelineComponent implements OnInit {
  private readonly STORAGE_KEY = 'f1-timeline-progress';

  gameMode?: string;
  loaded: boolean = false;
  timelineId?: string;
  events: TimelineEvent[] = [];
  shuffledEvents: TimelineEvent[] = [];
  placedEvents: (TimelineEvent | null)[] = [];
  createdTimeline?: Timeline;
  draggedFromSlotIndex?: number;
  draggedEvent?: TimelineEvent;
  correctOrder: TimelineEvent[] = [];

  isMobile: boolean = false;
  selectedEvent?: TimelineEvent;

  gameOver: boolean = false;
  gameWon: boolean = false;

  constructor(
    private timelineService: TimelineService,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const res = await this.timelineService.getTodayTimelineTC();
    this.loaded = true;
    if (!res) {
      return;
    }
    this.createdTimeline = res.timeline;
    this.timelineId = this.createdTimeline.id;
    this.events = res.events;
    this.shuffledEvents = this.shuffle([...this.events]);
    this.placedEvents = Array(this.events.length).fill(null);
    this.loadProgress();
  }

  onSelectEvent(ev: TimelineEvent) {
    if (this.isMobile) {
      this.selectedEvent = ev;
    }
  }

  onSelectSlot(index: number) {
    if (this.isMobile && this.selectedEvent) {
      const targetEvent = this.placedEvents[index];
      if (!targetEvent) {
        this.placedEvents[index] = this.selectedEvent;
        this.shuffledEvents = this.shuffledEvents.filter(
          (e) => e.id !== this.selectedEvent!.id,
        );
      } else {
        this.shuffledEvents.push(targetEvent);
        this.placedEvents[index] = this.selectedEvent;
        this.shuffledEvents = this.shuffledEvents.filter(
          (e) => e.id !== this.selectedEvent!.id,
        );
      }
      this.selectedEvent = undefined;
      this.saveProgress();
    }
  }

  startGame(gameMode?: string) {
    if (!gameMode) {
      return;
    }
    this.gameMode = gameMode;
    this.saveProgress();
  }

  shuffle(array: TimelineEvent[]): TimelineEvent[] {
    return array.sort(() => Math.random() - 0.5);
  }

  placeEvent(event: TimelineEvent, index: number) {
    this.placedEvents[index] = event;
    this.shuffledEvents = this.shuffledEvents.filter((e) => e.id !== event.id);
    this.saveProgress();
  }

  removeEvent(index: number) {
    const ev = this.placedEvents[index];
    if (ev) {
      this.shuffledEvents.push(ev);
      this.placedEvents[index] = null;
      this.saveProgress();
    }
  }

  validateBeforeSubmit(): boolean {
    if (this.placedEvents.includes(null)) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete',
        text: 'Please place all events before verifying.',
        background: '#1b1b1bff',
        color: '#dcecfbff',
      });
      return false;
    }
    return true;
  }

  verifyOrder() {
    if (!this.validateBeforeSubmit()) return;

    const orderedIds = this.placedEvents.map((ev) => ev!.id);

    this.timelineService
      .verifyTimeline(this.timelineId!, orderedIds)
      .subscribe({
        next: (res) => {
          this.gameOver = true;
          this.gameWon = res.gameWon;
          if (res.correctOrder) {
            this.correctOrder = res.correctOrder;
          }
          this.saveProgress();

          if (this.gameWon) {
            Swal.fire({
              icon: 'success',
              title: 'You Won!',
              text: 'All events are in the correct order!',
              background: '#1b1b1bff',
              color: '#dcecfbff',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'You Lost',
              text: 'Some events are out of order.',
              background: '#1b1b1bff',
              color: '#dcecfbff',
            });
          }
        },
        error: (err) => console.error(err),
      });
  }

  saveProgress() {
    const progress = {
      date: this.createdTimeline?.date,
      gameMode: this.gameMode,
      timelineId: this.timelineId,
      placedEvents: this.placedEvents.map((ev) => ev?.id || null),
      shuffledEvents: this.shuffledEvents.map((ev) => ev.id),
      gameOver: this.gameOver,
      gameWin: this.gameWon,
      correctOrder: this.correctOrder.map((ev) => ev.id),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  loadProgress() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    if (parsed.timelineId !== this.timelineId) {
      localStorage.removeItem(this.STORAGE_KEY);
      return;
    }

    this.gameMode = parsed.gameMode;

    this.gameOver = parsed.gameOver;
    this.gameWon = parsed.gameWin;

    // reconstruir placedEvents y shuffledEvents
    this.placedEvents = parsed.placedEvents.map((id: string | null) =>
      id ? this.events.find((ev) => ev.id === id) || null : null,
    );
    this.shuffledEvents = parsed.shuffledEvents
      .map((id: string) => this.events.find((ev) => ev.id === id))
      .filter((ev: TimelineEvent | undefined) => ev) as TimelineEvent[];

    if (parsed.correctOrder) {
      this.correctOrder = parsed.correctOrder
        .map((id: string) => this.events.find((ev) => ev.id === id))
        .filter((ev: TimelineEvent | undefined) => ev) as TimelineEvent[];
    }
  }

  getFirstEmptySlotIndex(): number {
    return this.placedEvents.findIndex((e) => e === null);
  }

  placeEventInFirstEmptySlot(ev: TimelineEvent) {
    const index = this.getFirstEmptySlotIndex();
    if (index !== -1) {
      this.placeEvent(ev, index);
    }
  }

  onDragStart(event: DragEvent, ev: TimelineEvent, slotIndex?: number) {
    this.draggedEvent = ev;
    this.draggedFromSlotIndex = slotIndex;
  }

  allowDropPool(event: DragEvent) {
    event.preventDefault();
  }

  allowDrop(event: DragEvent, slotIndex: number) {
    event.preventDefault();
    // 🔓 permitir siempre el drop, incluso si está ocupado (para swap)
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(event: DragEvent, slotIndex: number) {
    event.preventDefault();
    if (!this.draggedEvent) return;

    const targetEvent = this.placedEvents[slotIndex];

    if (!targetEvent) {
      // slot vacío → colocar normalmente
      if (this.draggedFromSlotIndex !== undefined) {
        this.placedEvents[this.draggedFromSlotIndex] = null;
      } else {
        this.shuffledEvents = this.shuffledEvents.filter(
          (e) => e.id !== this.draggedEvent!.id,
        );
      }
      this.placedEvents[slotIndex] = this.draggedEvent;
    } else {
      // slot ocupado → swap
      if (this.draggedFromSlotIndex !== undefined) {
        this.placedEvents[this.draggedFromSlotIndex] = targetEvent;
      } else {
        this.shuffledEvents.push(targetEvent);
      }
      this.placedEvents[slotIndex] = this.draggedEvent;
    }

    this.draggedEvent = undefined;
    this.draggedFromSlotIndex = undefined;
    this.saveProgress();
  }

  onDropPool(event: DragEvent) {
    event.preventDefault();
    if (!this.draggedEvent) return;

    // si venía de un slot, liberarlo
    if (this.draggedFromSlotIndex !== undefined) {
      this.placedEvents[this.draggedFromSlotIndex] = null;
    }

    // devolverlo al pool solo si no está ya
    if (!this.shuffledEvents.find((e) => e.id === this.draggedEvent!.id)) {
      this.shuffledEvents.push(this.draggedEvent);
    }

    this.draggedEvent = undefined;
    this.draggedFromSlotIndex = undefined;
    this.saveProgress();
  }

  getImageUrl(image: string) {
    return bffenvironment.endpoint + image;
  }

  resetBoard() {
    // devolver todos los eventos al pool
    this.shuffledEvents = [...this.events];
    // vaciar slots
    this.placedEvents = Array(this.events.length).fill(null);
    // resetear estado de juego
    this.gameOver = false;
    this.gameWon = false;
    this.correctOrder = [];
    this.saveProgress();
  }
}
