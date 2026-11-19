import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProgrammComponent} from './programm.component';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';

describe('ProgrammComponent', () => {
  let component: ProgrammComponent;
  let fixture: ComponentFixture<ProgrammComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ProgrammComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgrammComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  /** Beantwortet die beim Start ausgelösten Anfragen (Programm und Sprachen des heutigen Tages). */
  function beantworteOffeneAnfragen(sprachen: string[] = ['deutsch', 'englisch']) {
    httpTesting.match(r => r.url === '/api/programm/sprachen').forEach(req => req.flush(sprachen));
    httpTesting.match(r => r.url === '/api/programm').forEach(req => req.flush([]));
    fixture.detectChanges();
  }

  function sprachSelect(): HTMLSelectElement {
    return fixture.nativeElement.querySelector('[data-testid="filter-sprache"]');
  }

  function waehleSprache(wert: string) {
    const select = sprachSelect();
    select.value = wert;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lädt das Programm beim Einschalten des Kinderfilm-Filters mit Filter neu', () => {
    httpTesting.match(() => true).forEach(req => req.flush([]));

    const toggle: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="filter-kinderfilme"]');
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.get('nurKinderfilme')).toBe('true');
    req.flush([]);
    fixture.detectChanges();

    expect(component.nurKinderfilme()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('An diesem Tag laufen keine Kinderfilme.');
  });

  it('zeigt "Alle" und die Sprachen des Tages im Dropdown, mit großem Anfangsbuchstaben', () => {
    beantworteOffeneAnfragen(['deutsch', 'englisch']);

    const optionen = Array.from(sprachSelect().querySelectorAll('option')).map(o => o.textContent?.trim());
    expect(optionen).toEqual(['Alle', 'Deutsch', 'Englisch']);
    expect(sprachSelect().value).toBe('');
  });

  it('lädt das Programm bei Sprachwahl mit Sprachparameter neu', () => {
    beantworteOffeneAnfragen();

    waehleSprache('englisch');

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.get('sprache')).toBe('englisch');
    expect(req.request.params.has('nurKinderfilme')).toBe(false);
    req.flush([]);
    fixture.detectChanges();

    expect(component.sprache()).toBe('englisch');
    expect(fixture.nativeElement.textContent).toContain('An diesem Tag laufen keine Filme in dieser Sprache.');
  });

  it('wählt wieder "Alle": keine Sprachparameter, kein Leertext', () => {
    beantworteOffeneAnfragen();
    waehleSprache('englisch');
    httpTesting.expectOne(r => r.url === '/api/programm').flush([]);

    waehleSprache('');

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.has('sprache')).toBe(false);
    req.flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('in dieser Sprache');
  });

  it('kombiniert Kinderfilm-Filter und Sprachfilter', () => {
    beantworteOffeneAnfragen();
    const toggle: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="filter-kinderfilme"]');
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    httpTesting.expectOne(r => r.url === '/api/programm').flush([]);

    waehleSprache('deutsch');

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.get('nurKinderfilme')).toBe('true');
    expect(req.request.params.get('sprache')).toBe('deutsch');
    req.flush([]);
  });

  it('behält den Sprachfilter beim Tageswechsel bei', () => {
    beantworteOffeneAnfragen();
    waehleSprache('englisch');
    httpTesting.expectOne(r => r.url === '/api/programm').flush([]);

    component.waehleDatum(new Date(2025, 2, 20));

    const programmReq = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(programmReq.request.params.get('datum')).toBe('2025-03-20');
    expect(programmReq.request.params.get('sprache')).toBe('englisch');
    programmReq.flush([]);
    httpTesting.expectOne(r => r.url === '/api/programm/sprachen').flush(['deutsch']);
    fixture.detectChanges();

    // Englisch gibt es an diesem Tag nicht mehr, der aktive Filter bleibt trotzdem sichtbar.
    expect(component.sprache()).toBe('englisch');
    expect(sprachSelect().value).toBe('englisch');
  });
});
