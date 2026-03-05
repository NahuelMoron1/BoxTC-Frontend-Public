export class News {
  id: string;
  title: string;
  summary: string;
  image: string;
  author: string;
  date: string;
  text: string;
  approved?: boolean;
  userID: string;
  temporaryFile: File | null = null;

  constructor(
    id: string,
    title: string,
    summary: string,
    image: string,
    author: string,
    date: string,
    text: string,
    userID: string,
    approved?: boolean
  ) {
    this.id = id;
    this.title = title;
    this.summary = summary;
    this.image = image;
    this.author = author;
    this.date = date;
    this.text = text;
    this.userID = userID;
    this.approved = approved;
  }
}
