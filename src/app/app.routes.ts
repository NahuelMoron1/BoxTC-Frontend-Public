import { Routes } from '@angular/router';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { BestTensPageComponent } from './pages/best-tens-page/best-tens-page.component';
import { ConnectionsGameComponent } from './pages/connections-game/connections-game.component';
import { ContactUsPageComponent } from './pages/contact-us-page/contact-us-page.component';
import { CreateArticlePageComponent } from './pages/create-article-page/create-article-page.component';
import { EditArticlePageComponent } from './pages/edit-article-page/edit-article-page.component';
import { GameMenuComponent } from './pages/game-menu/game-menu.component';
import { GuessTeamsPageComponent } from './pages/guess-teams-page/guess-teams-page.component';
import { ImpostorGameComponent } from './pages/impostor-game/impostor-game.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MyArticlesPageComponent } from './pages/my-articles-page/my-articles-page.component';
import { NewsDetailsPageComponent } from './pages/news-details-page/news-details-page.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { WordleComponent } from './pages/wordle/wordle.component';
import { H2hGameComponent } from './pages/h2h-game/h2h-game.component';
import { GuessCareersPageComponent } from './pages/guess-careers-page/guess-careers-page.component';
import { PlayTimelinePageComponent } from './pages/play-timeline-page/play-timeline-page.component';

export const routes: Routes = [
  //main menu
  { path: '', component: GameMenuComponent },

  //play
  { path: 'play/wordle', component: WordleComponent },
  { path: 'play/best10', component: BestTensPageComponent },
  { path: 'play/impostor', component: ImpostorGameComponent },
  { path: 'play/connections', component: ConnectionsGameComponent },
  //{ path: 'play/guess-teams', component: GuessTeamsPageComponent },
  //{ path: 'play/h2h', component: H2hGameComponent },
  //{ path: 'play/guess-careers', component: GuessCareersPageComponent },
  { path: 'play/timeline', component: PlayTimelinePageComponent },

  //news
  { path: 'news', component: NewsPageComponent },
  { path: 'news/:id', component: NewsDetailsPageComponent },
  { path: 'my-articles/:userID', component: MyArticlesPageComponent },
  { path: 'create-article/:userID', component: CreateArticlePageComponent },
  { path: 'edit-article/:id', component: EditArticlePageComponent },
  { path: 'login', component: LoginPageComponent },

  //info
  { path: 'about-us', component: AboutUsPageComponent },
  { path: 'contact-us', component: ContactUsPageComponent },
];
