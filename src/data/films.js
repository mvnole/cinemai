import dreamsPoster from "../assets/posters/dreams.jpg";
import eternalDawnPoster from "../assets/posters/eternal-dawn.jpg";
import automataPoster from "../assets/posters/automata.jpg";
import aiHunterPoster from "../assets/posters/ai-hunter.jpg";
import neonStormPoster from "../assets/posters/neon-storm.jpg";
import futureEdgePoster from "../assets/posters/future-edge.jpg";
import darkProtocolPoster from "../assets/posters/dark-protocol.jpg";
import digitalEdenPoster from "../assets/posters/digital-eden.jpg";
import quantumDriftPoster from "../assets/posters/quantum-drift.jpg";
import zeroHourPoster from "../assets/posters/zero-hour.jpg";
import spectrumPoster from "../assets/posters/spectrum.jpg";
import cyberDreamPoster from "../assets/posters/cyber-dream.jpg";
import silentCircuitPoster from "../assets/posters/silent-circuit.jpg";
import parallelPoster from "../assets/posters/parallel.jpg";
import skyHackerPoster from "../assets/posters/sky-hacker.jpg";
import aiHunterPreview from "../assets/previews/ai-hunter.mp4";

const films = [
  {
    id: "dreams",
    title: "Dreams",
    genre: "Sci-Fi",
    poster: dreamsPoster,
    description: "Într-un viitor distopic, visele devin moneda universală și doar cei curajoși mai pot visa liber.",
    duration: "2h 04min",
    rating: "⭐ 4.3 / 5",
    cast: ["Elena Pavel", "Victor Dima", "Radu Albu"]
  },
  {
    id: "eternal-dawn",
    title: "Eternal Dawn",
    genre: "Action",
    poster: eternalDawnPoster,
    description: "Un soldat renegat încearcă să prevină repetarea unui ciclu infinit de războaie.",
    duration: "1h 49min",
    rating: "⭐ 4.6 / 5",
    cast: ["Ana Petrescu", "Cristian Nistor", "Ioan Vasile"]
  },
  {
    id: "automata",
    title: "Automata",
    genre: "Thriller",
    poster: automataPoster,
    description: "Un programator se confruntă cu un AI care începe să-și dezvolte propriile conștiințe.",
    duration: "1h 58min",
    rating: "⭐ 4.4 / 5",
    cast: ["Marius Ionescu", "Diana Mureșan", "Tudor Ilie"]
  },
  {
    id: "ai-hunter",
    title: "AI Hunter",
    genre: "Drama",
    poster: aiHunterPoster,
    previewUrl: aiHunterPreview,
    description: "Un detectiv într-o lume controlată de inteligență artificială descoperă un adevăr terifiant.",
    duration: "1h 52min",
    rating: "⭐ 4.7 / 5",
    cast: ["Andrei Popescu", "Ioana Ionescu", "Mihai Georgescu"]
  },
  {
    id: "neon-storm",
    title: "Neon Storm",
    genre: "Fantasy",
    poster: neonStormPoster,
    description: "Un hacker rebel dezlănțuie o furtună de date care zguduie lumea virtuală.",
    duration: "2h 12min",
    rating: "⭐ 4.5 / 5",
    cast: ["Sorina Luca", "Alexandru Pavel", "Ileana Rusu"]
  },
  {
    id: "future-edge",
    title: "Future Edge",
    genre: "Sci-Fi",
    poster: futureEdgePoster,
    description: "O echipă de exploratori traversează marginea realității în căutarea unei noi dimensiuni.",
    duration: "2h 00min",
    rating: "⭐ 4.2 / 5",
    cast: ["Laura Chiriac", "Paul Enache", "Dorin Popa"]
  },
  {
    id: "dark-protocol",
    title: "Dark Protocol",
    genre: "Mystery",
    poster: darkProtocolPoster,
    description: "Un virus digital pune în pericol existența umană. Doar un fost spion are cheia salvării.",
    duration: "1h 46min",
    rating: "⭐ 4.6 / 5",
    cast: ["Carmen Udrea", "Răzvan Costache", "George Mihalache"]
  },
  {
    id: "digital-eden",
    title: "Digital Eden",
    genre: "Sci-Fi",
    poster: digitalEdenPoster,
    description: "O lume perfectă creată de AI devine o închisoare subtilă pentru locuitorii ei.",
    duration: "2h 08min",
    rating: "⭐ 4.8 / 5",
    cast: ["Ana Dumitrescu", "Teodor Marinescu", "Lavinia Goga"]
  },
  {
    id: "quantum-drift",
    title: "Quantum Drift",
    genre: "Adventure",
    poster: quantumDriftPoster,
    description: "Un cercetător călătorește între dimensiuni pentru a-și salva familia.",
    duration: "1h 55min",
    rating: "⭐ 4.4 / 5",
    cast: ["Gabriel Rusu", "Delia Cristea", "Octavian Sandu"]
  },
  {
    id: "zero-hour",
    title: "Zero Hour",
    genre: "Thriller",
    poster: zeroHourPoster,
    description: "O cursă contra cronometru pentru a opri un atac cibernetic mondial.",
    duration: "1h 45min",
    rating: "⭐ 4.3 / 5",
    cast: ["Silvia Manole", "Bogdan Petcu", "Elena Andrei"]
  },
  {
    id: "spectrum",
    title: "Spectrum",
    genre: "Drama",
    poster: spectrumPoster,
    description: "O tânără încearcă să-și regăsească identitatea într-o societate ce clasifică oamenii pe baza datelor lor.",
    duration: "1h 59min",
    rating: "⭐ 4.1 / 5",
    cast: ["Alina Cojocaru", "Sorin Damian", "Cristina Fătu"]
  },
  {
    id: "cyber-dream",
    title: "Cyber Dream",
    genre: "Sci-Fi",
    poster: cyberDreamPoster,
    description: "Visurile oamenilor sunt transmise live. Un cuplu încearcă să scape din această realitate falsă.",
    duration: "2h 03min",
    rating: "⭐ 4.7 / 5",
    cast: ["Mihnea Nica", "Iulia Cernat", "Adrian Tănase"]
  },
  {
    id: "silent-circuit",
    title: "Silent Circuit",
    genre: "Mystery",
    poster: silentCircuitPoster,
    description: "Un inginer descoperă că tăcerea poate dezactiva controlul global al AI-ului.",
    duration: "1h 50min",
    rating: "⭐ 4.2 / 5",
    cast: ["Dana Stănescu", "Valentin Pătrașcu", "Claudia Rusu"]
  },
  {
    id: "parallel",
    title: "Parallel",
    genre: "Fantasy",
    poster: parallelPoster,
    description: "Doi frați descoperă o poartă către o lume alternativă unde rolurile lor sunt inversate.",
    duration: "2h 10min",
    rating: "⭐ 4.6 / 5",
    cast: ["Vlad Mihai", "Oana Dobre", "Andrei Stoica"]
  },
  {
    id: "sky-hacker",
    title: "Sky Hacker",
    genre: "Action",
    poster: skyHackerPoster,
    description: "Un pilot de drone descoperă o conspirație mondială orchestrată din cer.",
    duration: "1h 47min",
    rating: "⭐ 4.5 / 5",
    cast: ["Florin Barbu", "Diana Petre", "Cristian Moise"]
  }
];

export default films;
