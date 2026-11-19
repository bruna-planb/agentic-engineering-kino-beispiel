import {Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProgrammService} from '../../services/programm.service';
import {Film} from '../../dtos/programm';
import {KalenderComponent} from '../kalender/kalender.component';
import {ProgrammeintragComponent} from '../programmeintrag/programmeintrag.component';

import {format} from 'date-fns';
import {NavbarComponent} from '../../../common/components/navbar/navbar.component';

@Component({
  selector: 'app-programm',
  imports: [
    KalenderComponent,
    ProgrammeintragComponent,
    NavbarComponent
],
  templateUrl: './programm.component.html',
  styleUrl: './programm.component.css',
})
export class ProgrammComponent {
  private programmService = inject(ProgrammService);
  private destroyRef = inject(DestroyRef);

  readonly filme = signal<Film[] | undefined>(undefined);
  readonly nurKinderfilme = signal(false);
  /** Gewählte Sprache; leer bedeutet „Alle". */
  readonly sprache = signal('');
  /** Vorkommende Sprachen des gewählten Tages. */
  readonly sprachen = signal<string[]>([]);
  /** Optionen des Dropdowns; die aktive Sprache bleibt auch dann wählbar, wenn der Tag sie nicht führt. */
  readonly sprachenOptionen = computed(() => {
    const aktiv = this.sprache();
    const alle = this.sprachen();
    return aktiv && !alle.includes(aktiv) ? [...alle, aktiv] : alle;
  });
  private datum: Date | undefined;

  waehleDatum(datum: Date) {
    this.datum = datum;
    this.ladeSprachen();
    this.ladeProgramm();
  }

  setzeNurKinderfilme(nurKinderfilme: boolean) {
    this.nurKinderfilme.set(nurKinderfilme);
    this.ladeProgramm();
  }

  setzeSprache(sprache: string) {
    this.sprache.set(sprache);
    this.ladeProgramm();
  }

  anzeigename(sprache: string): string {
    return sprache.charAt(0).toLocaleUpperCase('de') + sprache.slice(1);
  }

  private ladeProgramm() {
    if (!this.datum) {
      return;
    }
    this.programmService.holeProgramm(format(this.datum, "yyyy-MM-dd"), this.nurKinderfilme(), this.sprache())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.filme.set(data));
  }

  private ladeSprachen() {
    if (!this.datum) {
      return;
    }
    this.programmService.holeSprachen(format(this.datum, "yyyy-MM-dd"))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.sprachen.set(data));
  }
}
