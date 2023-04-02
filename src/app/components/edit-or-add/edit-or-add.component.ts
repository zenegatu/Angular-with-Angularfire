import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBook } from '../../models/book.model';
import { FirebaseService } from '../../services/firebase.service/firebase.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageComponent } from '../../modals/message/message.component';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-edit-or-add',
  templateUrl: './edit-or-add.component.html',
  styleUrls: ['./edit-or-add.component.css'],
})
export class EditOrAddComponent implements OnInit, OnDestroy {
  record?: IBook;
  imgFile!: File;
  userID!: string | undefined;
  attachedFilename: string | undefined = 'attach an image. max size:2 MB';
  preview: string | undefined = '';
  pageTitle = '';
  submitBtnLabel = '';
  isDisabled: boolean = true;
  uploadProgress = 0;
  error: string | null = null;
  wait = false;
  getSub!: Subscription;
  authSub!: Subscription;
  year = new Date().getFullYear();
  img_size_limit = 2000000;
  oversize = '';

  inputForm: FormGroup = this.formBuilder.group({
    title: [
      '',
      [Validators.required, Validators.maxLength(50), Validators.minLength(2)],
    ],
    author: [
      '',
      [Validators.required, Validators.maxLength(50), Validators.minLength(2)],
    ],
    genre: ['', [Validators.required]],
    year: [
      '',
      [
        Validators.required,
        Validators.max(this.year),
        Validators.pattern('[0-9]{4}'),
      ],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(50),
      ],
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private firebase: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getSub = this.firebase
      .getSelectedRecord()
      .subscribe((result: IBook) => {
        if (result) {
          this.record = result;
          this.inputForm.patchValue(result);
          this.preview = this.record.imgURL;
          this.attachedFilename = this.record?.fileName;
          this.pageTitle = 'Edit Record';
          this.submitBtnLabel = 'Update';
        } else {
          this.inputForm.reset();
          this.preview = '';
          this.pageTitle = 'Add New Record';
          this.submitBtnLabel = 'Upload';
        }
      });
    this.inputForm.valueChanges.subscribe((value) => {
      this.isDisabled = !value || this.inputForm.invalid;
    });
    this.authSub = this.authService.loggedInUser$.subscribe((user) => {
      if (user) {
        this.userID = user.uid;
        console.log('****** logged in user *****', user);
      }
    });
  }

  selectedFile(event: any) {
    this.imgFile = event.target.files[0];
    if (this.imgFile.size > this.img_size_limit) {
      this.oversize =
        'Image is bigger than the allowed size ' +
        this.img_size_limit / 1000000 +
        'MB :' +
        this.imgFile.size / 1000000 +
        'MB.';
    }
    this.attachedFilename = this.imgFile.name;
    const reader = new FileReader();
    reader.readAsDataURL(this.imgFile);
    reader.onload = (e: any) => {
      this.preview = e.target.result;
    };
  }

  uploadImg(file: File) {
    return this.firebase.createFile(file).then((result: any) => {
      this.uploadProgress = this.firebase.uploadProgress;
      return {
        imgURL: result[0],
        fileName: result[1].name,
        userID: this.userID,
        date: Date.now(),
      };
    });
  }

  async onSubmit() {
    let uploadData: IBook;
    if (this.record) {
      uploadData = this.record;
      if (this.imgFile) {
        try {
          this.wait = true;
          const imgData = await this.uploadImg(this.imgFile);
          this.wait = false;
          uploadData = { ...uploadData, ...imgData };
          this.wait = true;
          await this.firebase.deleteFile(this.record.fileName);
          this.wait = false;
        } catch (error: any) {
          this.error = error.message;
        }
      }
      try {
        this.wait = true;
        await this.firebase
          .updateRecord({
            ...uploadData,
            ...this.cleanFormValues(),
          })
          .then(() => {
            this.wait = false;
          });
        const config = this.dialogConfig('update', 'success');
        this.dialog
          .open(MessageComponent, config)
          .afterClosed()
          .subscribe(() => {
            this.clearForm();
          });
      } catch (error: any) {
        this.error = error.message;
        console.log('!!! upload failed !!!', error);
      }
    } else {
      try {
        let imgData = await this.uploadImg(this.imgFile);
        this.wait = true;
        await this.firebase.createRecord({
          ...this.cleanFormValues(),
          ...imgData,
        });
        this.wait = false;
        const config = this.dialogConfig('create', 'success');
        this.dialog
          .open(MessageComponent, config)
          .afterClosed()
          .subscribe(() => {
            this.clearForm();
          });
      } catch (error: any) {
        this.error = error.message;
        console.log('!!! upload failed !!!', error);
      }
    }
  }

  dialogConfig(action: string, result: string): MatDialogConfig {
    const config = new MatDialogConfig();
    config.data = {
      action: action,
      title: this.inputForm.get('title')?.value,
      result: result,
    };
    config.disableClose = true;
    return config;
  }

  closeBtn() {
    this.router.navigate(['list']).then(() => {
      this.firebase.setSelectedRecord(null);
    });
  }

  clearForm() {
    this.inputForm.reset();

    this.uploadProgress = 0;
    this.attachedFilename = '';
    this.preview = './assets/images/preview.PNG';
    this.firebase.setSelectedRecord(null);
  }

  getErrorMessage(controlName: any) {
    if (controlName.hasError('required')) {
      return 'You must enter a value';
    }

    if (
      controlName.hasError('maxLength') ||
      controlName.hasError('minLength')
    ) {
      return '2 to 25 characters are allowed';
    }
    if (controlName.hasError('max')) {
      return 'year can not be in the future';
    }
    return '';
  }

  cleanFormValues() {
    const betweenSpace = /\s+/g;
    Object.keys(this.inputForm.controls).forEach((key) => {
      this.inputForm
        .get(key)!
        .setValue(
          this.inputForm.get(key)!.value.trim().replace(betweenSpace, ' ')
        );
    });
    this.inputForm.patchValue({
      title: this.inputForm.get('title')?.value.toUpperCase(),
    });
    this.inputForm.patchValue({
      author: this.inputForm.get('author')?.value.toUpperCase(),
    });
    return this.inputForm.value;
  }

  ngOnDestroy() {
    this.getSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
