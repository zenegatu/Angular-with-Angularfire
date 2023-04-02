import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DetailComponent} from "../../modals/detail/detail.component";


@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css'],
})
export class ThumbnailComponent implements OnInit {
  @Input() record!: any;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }


  openDialog() {
    const config = new MatDialogConfig()
    config.data = {
      imgURL: this.record.imgURL,
      description: this.record.description,
      title: this.record.title,
      author: this.record.author,
      year: this.record.year
    }
    config.width = '90%'

    this.dialog.open(DetailComponent, config);
  }
}
