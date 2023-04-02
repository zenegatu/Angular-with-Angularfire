import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThumbnailComponent } from '../../components/thumbnail/thumbnail.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  thumbnail!: {
    imgURL: string;
    description: string;
    title: string;
    author: string;
    year: Date;
  };

  constructor(
    public dialogRef: MatDialogRef<ThumbnailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.thumbnail = data;
  }

  ngOnInit() {}

  buyLink() {
    const title = this.thumbnail.title.replace(/\s+/g, '+');
    const author = this.thumbnail.author.replace(/\s+/g, '+');
    return `https://shopping.google.com/search?q=${title}+by+${author}`;
  }

  onclose() {
    this.dialogRef.close();
  }
}
