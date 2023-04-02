import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service/firebase.service';
import { IBook } from '../../models/book.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  books: IBook[] = [];

  constructor(private firebase: FirebaseService) {}

  ngOnInit(): void {
    this.firebase
      .getAllData()
      .then((allBooks) => {
        this.books = allBooks;
      })
      .then(() => {});
  }

  trackByID(index: number, book: IBook) {
    return book.id;
  }
}
