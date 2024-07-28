import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ServerService } from "./service/server.service";
import { BehaviorSubject, map, Observable, of, startWith } from "rxjs";
import { AppState } from "./interface/app-state";
import { CustomResponse } from "./interface/custom-reponse";
import { DataState } from "./enum/data-state.enum";
import { catchError } from "rxjs/operators";
import { HttpClientModule } from "@angular/common/http";
import { Status } from './enum/status.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'server-frontend';

  appState$ : Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly ServerStatus = Status;
  private filterSubject = new BehaviorSubject<string>('');
  filterStatus$ = this.filterSubject.asObservable();


  // Video 25
  constructor(private serverService: ServerService) {

  }

  ngOnInit(): void {
    console.log("Initing the App...");
    console.log("bao bap baderie good");
    this.appState$ = this.serverService.servers$
    .pipe(
      map(response => {
        return {
          dataState: DataState.LOADED_STATE,
          appData: response
        }
      }),
      startWith({ dataState: DataState.LOADING_STATE } ),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }
}
