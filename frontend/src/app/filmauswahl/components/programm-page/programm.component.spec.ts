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
});
