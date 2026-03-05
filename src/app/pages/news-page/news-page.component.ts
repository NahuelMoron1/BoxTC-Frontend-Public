import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { NewsComponent } from '../../shared/components/news/news.component';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [NavBarComponent, NewsComponent],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css',
})
export class NewsPageComponent {
  newsList = [
    {
      title: 'Verstappen dominates in Brazil',
      summary: 'Red Bull’s pace proves unstoppable as Max takes another win.',
      image: '/verstappen.jpg',
      author: 'Will Buxton',
      date: 'Nov 17, 2025',
    },

    {
      title: "Hamilton's pace in Ferrari is 'not enough' says Mattia Binnotto",
      summary:
        'Former Ferrari team principal Mattia Binnotto talks for the first time after leaving the team.',
      image: '/hamilton.jpg',
      author: 'Sky F1',
      date: 'Nov 15, 2025',
    },
    {
      title: 'Audi reveals promising next two years for the team',
      summary:
        'Technical director Jonathan Weathley shows confidence on his 2026 new car',
      image: '/audi.jpg',
      author: 'Kim Illman',
      date: 'Nov 14, 2025',
    },
    {
      title: 'Sergio Perez ready to comeback after a difficult Red Bull exit',
      summary:
        "The mexican seems to be ready to this new challenge, as he said the team is 'on a great form'",
      image: '/perez.jpg',
      author: 'Motorsport LATAM',
      date: 'Nov 9, 2025',
    },
    // más artículos...
  ];
}
