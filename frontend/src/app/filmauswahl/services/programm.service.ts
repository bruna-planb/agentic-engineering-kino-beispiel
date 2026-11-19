import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Film} from '../dtos/programm';

@Injectable({
  providedIn: 'root'
})
export class ProgrammService {
  private http = inject(HttpClient);

  private programmUrl: string = '/api/programm';

  public holeProgramm(datum: string, nurKinderfilme: boolean = false): Observable<Film[]> {
    const params: Record<string, string> = {datum: datum};
    if (nurKinderfilme) {
      params['nurKinderfilme'] = 'true';
    }
    return this.http.get<Film[]>(this.programmUrl, {params})
  }

}
