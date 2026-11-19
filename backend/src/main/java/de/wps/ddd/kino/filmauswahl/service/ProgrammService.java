package de.wps.ddd.kino.filmauswahl.service;

import de.wps.ddd.kino.common.architecture.ApplicationService;
import de.wps.ddd.kino.filmauswahl.data.AktuelleFilme;
import de.wps.ddd.kino.filmauswahl.data.Film;
import de.wps.ddd.kino.filmauswahl.data.Vorstellung;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@ApplicationService
@Service
@RequiredArgsConstructor
public class ProgrammService {

    private final AktuelleFilme aktuelleFilme;

    public List<Film> holeVorstellungenFuerTag(LocalDate datum) {
        return holeVorstellungenFuerTag(datum, false);
    }

    /**
     * Liefert die Filme mit ihren Vorstellungen am Tag. Mit {@code nurKinderfilme} enthält das
     * Ergebnis nur Vorstellungen der Kategorie {@value Vorstellung#KINDERFILM}; Filme ohne solche
     * Vorstellung entfallen.
     */
    public List<Film> holeVorstellungenFuerTag(LocalDate datum, boolean nurKinderfilme) {
        LocalDateTime start = datum.atStartOfDay();
        LocalDateTime ende = LocalTime.MAX.atDate(datum);
        if (nurKinderfilme) {
            return aktuelleFilme.findeVorstellungenZwischenMitKategorie(start, ende, Vorstellung.KINDERFILM);
        }
        return aktuelleFilme.findeVorstellungenZwischen(start, ende);
    }
}
