import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  games = [
    {
      title: 'Impostor',
      image: 'impostor.png',
      tagline: 'Spot the impostors among the grid.',
      description:
        'A fast deduction game. Inspired by the paddock, it challenges your knowledge of F1 history and context.',
      howToPlay: [
        'Read the clues carefully.',
        'Identify the driver or team that does not belong.',
        'Win by solving in the fewest attempts.',
      ],
    },
    {
      title: 'Top10',
      image: 'top10.png',
      tagline: 'Rank the grid like a strategist.',
      description:
        'A tactical experience: build your best Top 10 using memory and stats. Perfect for fans who love rankings.',
      howToPlay: [
        'Drag and drop drivers or teams to form your Top 10.',
        'Validate your order and learn from instant feedback.',
        'Compete for the best daily score.',
      ],
    },
    {
      title: 'Wordle',
      image: 'wordle.png',
      tagline: 'Guess the paddock word of the day.',
      description:
        'The F1 twist on the global word game: drivers, circuits, technical terms, and historic moments.',
      howToPlay: [
        'Enter a word related to Formula 1.',
        'Use feedback on correct/incorrect letters.',
        'Solve in the fewest attempts possible.',
      ],
    },
    {
      title: 'Connections',
      image: 'connections.png',
      tagline: 'Find the hidden relationships.',
      description:
        'The classic association puzzle with F1 DNA: eras, stats, designs, and curiosities. Each solved group is celebrated visually.',
      howToPlay: [
        'Select groups of 4 related elements.',
        'Each correct guess reorganizes the grid.',
        'Complete the daily challenge with logic and knowledge.',
      ],
    },
    {
      title: 'Guess Teams',
      image: 'guess-teams-1.png',
      tagline: 'Guess the team and all the team members.',
      description: 'Can you guess the team and all the team members?',
      howToPlay: [
        'You will be given a team, two drivers and the team principal.',
        'For the team and drivers, you will be given a list of options to choose from.',
        'It is important to notice that you need to choose the driver/team and not guess by typing the name in the input field.',
        'For the team principal, you will need to guess the name by typing it in the input field. You can guess it by typing either firstname, lastname or both',
        'Solve in the fewest attempts possible.',
      ],
    },
    {
      title: 'Head To Head',
      image: 'h2h-about-us.png',
      tagline:
        'Guess which driver finished higher at different stats on a season, compared by their teammates',
      description:
        'Which driver finished higher at different stats on a season, compared by their teammates',
      howToPlay: [
        'You will see all stats hidden to guess them, after you guess them, you will see the results of the head to head.',
        'You can either play normal mode or one by one mode.',
        'In normal mode, you will see the results of the head to head after you guess all the stats togheter.',
        'In one by one mode, you will see the results of the head to head after you guess each stat one by one.',
        'Solve in the fewest attempts possible.',
      ],
    },
    {
      title: 'Guess Driver',
      image: 'guess_careers2.png',
      tagline: 'Guess the driver of a career based on the given clues',
      description:
        'Can you guess the driver of a career based on the given teams?',
      howToPlay: [
        'You will see a list of teams, but only the first team will be shown at first',
        'As you try to guess the driver, if you get it wrong, you will see the next team',
        'If you get it right, you will see the driver of the career',
        'Solve in the fewest attempts possible.',
      ],
    },
  ];

  newsInfo = {
    title: 'Motorsport News',
    description:
      'Daily editorial coverage of the motorsport world: analysis, interviews, and paddock reports. If you want your article to appear, contact us to request contributor access.',
    image: '/news.png',
    contactCta: 'Contact Us',
    contactRoute: '/contact',
  };
}
