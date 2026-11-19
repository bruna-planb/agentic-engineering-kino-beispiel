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

  public holeProgramm(datum: string, nurKinderfilme: boolean = false, sprache?: string): Observable<Film[]> {
    const params: Record<string, string> = {datum: datum};
    if (nurKinderfilme) {
      params['nurKinderfilme'] = 'true';
    }
    if (sprache) {
      params['sprache'] = sprache;
    }
    return this.http.get<Film[]>(this.programmUrl, {params})
  }

  public holeSprachen(datum: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.programmUrl}/sprachen`, {params: {datum: datum}})
  }

}
