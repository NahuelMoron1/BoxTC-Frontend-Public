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
      tagline: 'Identifica los impostores en la grilla.',
      description:
        'Un juego de deducción rápida. Inspirado en el TC, desafía tu conocimiento de la historia y contexto del turismo carretera.',
      howToPlay: [
        'Lee las pistas cuidadosamente.',
        'Identifica el piloto o equipo que no pertenece.',
        'Gana resolviendo en el menor número de intentos.',
      ],
    },
    {
      title: 'Top10',
      image: 'top10.png',
      tagline: 'Ordena la grilla como un estratega.',
      description:
        'Una experiencia táctica: construye tu mejor Top 10 usando memoria y estadísticas. Perfecto para fans que aman los rankings.',
      howToPlay: [
        'Arrastra y suelta pilotos o equipos para formar tu Top 10.',
        'Valida tu orden y aprende de la retroalimentación instantánea.',
        'Compite por la mejor puntuación diaria.',
      ],
    },
    {
      title: 'Wordle',
      image: 'wordle.png',
      tagline: 'Adivina el apellido del piloto del día.',
      description:
        'El giro del TC al juego de palabras global: pilotos, circuitos, términos técnicos y momentos históricos.',
      howToPlay: [
        'Ingresa una palabra relacionada con el Turismo Carretera.',
        'Usa la retroalimentación sobre letras correctas/incorrectas.',
        'Resuelve en el menor número de intentos posible.',
      ],
    },
    {
      title: 'Conexiones',
      image: 'connections.png',
      tagline: 'Encuentra las relaciones ocultas.',
      description:
        'El clásico puzzle de asociación con ADN del TC: eras, estadísticas, diseños y curiosidades. Cada grupo resuelto se celebra visualmente.',
      howToPlay: [
        'Selecciona grupos de 4 elementos relacionados.',
        'Cada acierto reorganiza la grilla.',
        'Completa el desafío diario con lógica y conocimiento.',
      ],
    },
    /*{
      title: 'Guess Teams',
      image: 'guess-teams-1.png',
      tagline: 'Adivina el equipo y todos los miembros del equipo.',
      description:
        '¿Puedes adivinar el equipo y todos los miembros del equipo?',
      howToPlay: [
        'Te darán un equipo, dos pilotos y el jefe del equipo.',
        'Para el equipo y pilotos, se te dará una lista de opciones para elegir.',
        'Es importante notar que debes elegir el piloto/equipo y no adivinar escribiendo el nombre en el campo de entrada.',
        'Para el jefe del equipo, deberás adivinar el nombre escribiéndolo en el campo de entrada. Puedes adivinarlo escribiendo el nombre, apellido o ambos.',
        'Resuelve en el menor número de intentos posible.',
      ],
    },
    {
      title: 'Head To Head',
      image: 'h2h-about-us.png',
      tagline:
        'Adivina qué piloto terminó mejor en diferentes estadísticas en una temporada, comparado con sus compañeros.',
      description:
        'Qué piloto terminó mejor en diferentes estadísticas en una temporada, comparado con sus compañeros de equipo.',
      howToPlay: [
        'Verás todas las estadísticas ocultas para adivinarlas. Después de que las adivines, verás los resultados del cara a cara.',
        'Puedes jugar en modo normal o en modo uno por uno.',
        'En modo normal, verás los resultados del cara a cara después de adivinar todas las estadísticas juntas.',
        'En modo uno por uno, verás los resultados del cara a cara después de adivinar cada estadística una por una.',
        'Resuelve en el menor número de intentos posible.',
      ],
    },
    {
      title: 'Guess Driver',
      image: 'guess_careers2.png',
      tagline: 'Adivina el piloto de una carrera basado en las pistas dadas.',
      description:
        '¿Puedes adivinar el piloto de una carrera basado en los equipos dados?',
      howToPlay: [
        'Verás una lista de equipos, pero solo el primer equipo se mostrará al principio.',
        'Mientras intentas adivinar el piloto, si te equivocas, verás el siguiente equipo.',
        'Si aciertas, verás el piloto de la carrera.',
        'Resuelve en el menor número de intentos posible.',
      ],
    },*/
  ];

  newsInfo = {
    title: 'Noticias de Automovilismo',
    description:
      'Cobertura editorial diaria del mundo del automovilismo: análisis, entrevistas y reportes del TC. Si deseas que tu artículo aparezca, contáctanos para solicitar acceso de colaborador.',
    image: '/news.png',
    contactCta: 'Contáctanos',
    contactRoute: '/contact',
  };
}
