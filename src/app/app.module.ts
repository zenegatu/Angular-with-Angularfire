import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/home/home.component';
import { ItemsListComponent } from './components/itemsList/items-list.component';
import { LoginComponent } from './modals/login/login.component';
import { EditOrAddComponent } from './components/edit-or-add/edit-or-add.component';
import { MessageComponent } from './modals/message/message.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { MaterialComponentsModule } from './material-components/material-components.module';
import { AppRoutingModule } from './app-routing.module';
import { DetailComponent } from './modals/detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItemsListComponent,
    LoginComponent,
    EditOrAddComponent,
    MessageComponent,
    ThumbnailComponent,
    DetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialComponentsModule,
    FormsModule,
    ReactiveFormsModule,

    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    RouterOutlet,
    AppRoutingModule,
    RouterLink,
    NgOptimizedImage,
  ],
  providers: [
    {
      provide: FIREBASE_OPTIONS,
      useValue: environment.firebaseConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
