import { Component, OnInit } from '@angular/core';
import { IBook } from '../../models/book.model';
import { MatTableDataSource } from '@angular/material/table';

import { FirebaseService } from '../../services/firebase.service/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-itemsList',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css'],
})
export class ItemsListComponent implements OnInit {
  userBooks: IBook[] = [];

  displayedColumns: string[] = ['order', 'title', 'author', 'edit', 'delete'];
  dataSource!: { data: any };
  hasBooks = false;
  getUserDataSub!: Subscription;

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.firebase
      .getUsersData()
      .then((books: IBook[]) => {
        this.userBooks = books;
        this.dataSource = new MatTableDataSource<IBook>(this.userBooks);
        this.hasBooks = books.length > 0;
      })
      .then(() => {});
  }

  deleteBookAndImg(book: IBook) {
    const dialogData = { title: book.title, action: 'delete', notice: 'warn' };
    this.openDialog(dialogData)
      .afterClosed()
      .subscribe({
        next: (data) => {
          if (data == 'delete') {
            this.firebase.deleteRecordAndFile(book);
            this.firebase.redirectTo('list');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  goToEditPage(record: IBook) {
    this.firebase.goToEditPage(record);
  }

  openDialog(dialogData: {
    action: string;
    title: string | undefined;
    notice: string;
  }) {
    return this.firebase.openDialog(dialogData);
  }
}
