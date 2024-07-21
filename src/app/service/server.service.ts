import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '../interface/custom-reponse';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:10000';

  constructor(private httpClient: HttpClient) { }

  /** The procedural approach

  getServers(): Observable<CustomResponse> {
    return this.httpClient.get<CustomResponse>(`http://localhost:8080/server/list`);
  }
  */

  // We will use the reactive approach
  servers$ = <Observable<CustomResponse>> this.httpClient.get<CustomResponse>(`${this.apiUrl}/server/list`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
  );

  save$ = (server: Server) => <Observable<CustomResponse>>
   this.httpClient.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
   .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  ping$ = (ipAddress: string) => <Observable<CustomResponse>>
  this.httpClient.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  filter$ = (status : Status, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      subscriber => {
        console.log(response);
        subscriber.next(
          status === Status.ALL ?
            {
              ...response,
              message: `Servers fitered by ${status} status!`
            } :
            {
              ...response,
              message: response.data.servers
                .filter(server => server.status === status)
                .length > 0 ? `Servers filtered by ${status}` : `No servers of ${status} status found!`,
              data: { servers: response.data.servers.filter(server => server.status === status) }
            }
        );
        subscriber.complete();
      }
    )


  delete$ = (serverId: number) => <Observable<CustomResponse>>
  this.httpClient.delete(`${this.apiUrl}/server/delete/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occured - Error code: ${error.status}`);
  }

    // ccontinuer à la vidéo 19
}
