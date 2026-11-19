import {TestBed} from '@angular/core/testing';

import {ProgrammService} from './programm.service';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

describe('ProgrammService', () => {
  let service: ProgrammService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgrammService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProgrammService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fragt ohne Filter nur mit Datum an', () => {
    service.holeProgramm('2025-03-19').subscribe();

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.get('datum')).toBe('2025-03-19');
    expect(req.request.params.has('nurKinderfilme')).toBe(false);
    req.flush([]);
  });

  it('fragt mit Kinderfilm-Filter an', () => {
    service.holeProgramm('2025-03-19', true).subscribe();

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.get('datum')).toBe('2025-03-19');
    expect(req.request.params.get('nurKinderfilme')).toBe('true');
    req.flush([]);
  });

  it('fragt mit Sprachfilter an', () => {
    service.holeProgramm('2025-03-19', false, 'englisch').subscribe();

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.get('datum')).toBe('2025-03-19');
    expect(req.request.params.get('sprache')).toBe('englisch');
    expect(req.request.params.has('nurKinderfilme')).toBe(false);
    req.flush([]);
  });

  it('kombiniert Kinderfilm- und Sprachfilter', () => {
    service.holeProgramm('2025-03-19', true, 'deutsch').subscribe();

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.get('nurKinderfilme')).toBe('true');
    expect(req.request.params.get('sprache')).toBe('deutsch');
    req.flush([]);
  });

  it('schickt bei leerer Sprache (Alle) keinen Sprachparameter', () => {
    service.holeProgramm('2025-03-19', false, '').subscribe();

    const req = httpTesting.expectOne(r => r.url === '/api/programm');
    expect(req.request.params.has('sprache')).toBe(false);
    req.flush([]);
  });

  it('fragt die Sprachen des Tages an', () => {
    service.holeSprachen('2025-03-19').subscribe();

    const req = httpTesting.expectOne(r => r.url === '/api/programm/sprachen');
    expect(req.request.params.get('datum')).toBe('2025-03-19');
    expect(req.request.params.has('nurKinderfilme')).toBe(false);
    expect(req.request.params.has('sprache')).toBe(false);
    req.flush(['deutsch', 'englisch']);
  });
});
