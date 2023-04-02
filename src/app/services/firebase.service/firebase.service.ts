import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IBook } from '../../models/book.model';
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { MessageComponent } from '../../modals/message/message.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy {
  uploadProgress = 0;
  email: string | null = 'guest';
  userID: string | null = '';
  rowCount = false;
  authSub!: Subscription;
  private selectedRecord = new BehaviorSubject<any>(null);
  private basePath = `/users`;

  constructor(
    private readonly fs: Firestore,
    private readonly storage: Storage,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.authSub = this.authService.loggedInUser$.subscribe((user) => {
      if (user?.email) {
        this.email = user.email;
        this.userID = user.uid;
      }
    });
  }

  //......................firebase database...........................

  async getAllData() {
    let allBooks: IBook[] = [];
    const q = query(collectionGroup(this.fs, 'books'), orderBy('date'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allBooks.push({ ...doc.data(), id: doc.id } as IBook);
    });
    return allBooks;
  }

  async getUsersData() {
    let userBooks: IBook[] = [];
    if (this.userID) {
      const q = query(
        collectionGroup(this.fs, 'books'),
        where('userID', '==', this.userID)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userBooks.push({ ...doc.data(), id: doc.id } as IBook);
      });
    }
    return userBooks;
  }

  createRecord(book: IBook) {
    const bookRef = collection(this.fs, `${this.basePath}/${this.email}/books`);
    return addDoc(bookRef, book);
  }

  updateRecord(book: IBook) {
    const docRef = doc(
      this.fs,
      `${this.basePath}/${this.email}/books/${book.id}`
    );
    return updateDoc(docRef, { ...book });
  }

  deleteRecord(book: IBook): Promise<void> {
    const docRef = doc(
      this.fs,
      `${this.basePath}/${this.email}/books/${book.id}`
    );
    return deleteDoc(docRef);
  }

  //......................firebase storage...........................

  createFile(fileUpload: File) {
    let timestamp = Date.now();
    let uniqueFileName = `${timestamp}_${fileUpload.name}`;
    const storageRef = ref(
      this.storage,
      `${this.basePath}/${this.email}/${uniqueFileName}`
    );

    let uploadTask = uploadBytesResumable(storageRef, fileUpload);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: any) => {
          this.uploadProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error: any) => {
          return reject(error);
        },
        () => {
          return Promise.all([
            getDownloadURL(uploadTask.snapshot.ref),
            getMetadata(uploadTask.snapshot.ref),
          ]).then((result) => {
            return resolve(result);
          });
        }
      );
    });
  }

  updateFile(oldFile: string, newFile: File) {
    this.createFile(newFile)
      .then(() => {
        this.deleteFile(oldFile)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteFile(fileName: string | undefined) {
    const storageRef = ref(
      this.storage,
      `${this.basePath}/${this.email}/${fileName}`
    );
    return deleteObject(storageRef);
  }

  //'''''''''''''''''firebase database and storage''''''''''''''''''''''''''//
  deleteRecordAndFile(book: IBook) {
    this.deleteRecord(book).then(() => {});
    this.deleteFile(book.fileName).then(() => {});
  }

  //''''''''''''''''''''utility'''''''''''''''''''''''//
  setSelectedRecord(record: IBook | null) {
    this.selectedRecord.next(record);
  }

  getSelectedRecord(): Observable<IBook> {
    return this.selectedRecord.asObservable();
  }

  goToEditPage(record?: IBook) {
    this.router
      .navigate(['editOrAdd'])
      .then(() => {
        if (record) {
          this.selectedRecord.next(record);
        } else {
          this.selectedRecord.next(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  openDialog(dialogData: {
    action: string;
    title: string | undefined;
    notice: string;
  }): MatDialogRef<any> {
    return this.dialog.open(MessageComponent, {
      data: dialogData,
      disableClose: true,
    });
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
