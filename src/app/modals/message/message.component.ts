import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service/firebase.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  dialogData!: any;

  constructor(
    public dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public firebase: FirebaseService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.dialogData = this.data;
  }

  onClose() {
    this.dialogRef.close();
    this.router.navigate(['list']).then(() => {});
  }

  onAddNew() {
    this.dialogRef.close();
    this.router.navigate(['editOrAdd']).then(() => {
      this.firebase.setSelectedRecord(null);
    });
  }

  onDelete() {
    this.dialogRef.close('delete');
  }
}
