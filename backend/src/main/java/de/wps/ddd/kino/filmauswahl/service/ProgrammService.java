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
import java.util.TreeSet;

@ApplicationService
@Service
@RequiredArgsConstructor
public class ProgrammService {

    private final AktuelleFilme aktuelleFilme;

    public List<Film> holeVorstellungenFuerTag(LocalDate datum) {
        return holeVorstellungenFuerTag(datum, false, null);
    }

    public List<Film> holeVorstellungenFuerTag(LocalDate datum, boolean nurKinderfilme) {
        return holeVorstellungenFuerTag(datum, nurKinderfilme, null);
    }

    /**
     * Liefert die Filme mit ihren Vorstellungen am Tag. Mit {@code nurKinderfilme} enthält das
     * Ergebnis nur Vorstellungen der Kategorie {@value Vorstellung#KINDERFILM}; Filme ohne solche
     * Vorstellung entfallen.
     * <p>
     * Mit {@code sprache} bleiben nur Filme dieser Sprache (ohne Beachtung der Groß-/Kleinschreibung).
     * Filme ohne Sprache entfallen dann. Eine leere oder fehlende Sprache bedeutet „Alle".
     */
    public List<Film> holeVorstellungenFuerTag(LocalDate datum, boolean nurKinderfilme, String sprache) {
        LocalDateTime start = datum.atStartOfDay();
        LocalDateTime ende = LocalTime.MAX.atDate(datum);
        var filme = nurKinderfilme
                ? aktuelleFilme.findeVorstellungenZwischenMitKategorie(start, ende, Vorstellung.KINDERFILM)
                : aktuelleFilme.findeVorstellungenZwischen(start, ende);
        if (sprache == null || sprache.isBlank()) {
            return filme;
        }
        return filme.stream()
                .filter(film -> film.getSprache() != null && film.getSprache().equalsIgnoreCase(sprache))
                .toList();
    }

    /**
     * Liefert die am Tag vorkommenden Sprachen der Filme, unabhängig von den Filtern. Gleiche Sprachen
     * in unterschiedlicher Schreibung erscheinen einmal; die Liste ist alphabetisch sortiert.
     */
    public List<String> holeSprachenFuerTag(LocalDate datum) {
        LocalDateTime start = datum.atStartOfDay();
        LocalDateTime ende = LocalTime.MAX.atDate(datum);
        var sprachen = new TreeSet<String>(String.CASE_INSENSITIVE_ORDER);
        aktuelleFilme.findeVorstellungenZwischen(start, ende).stream()
                .map(Film::getSprache)
                .filter(sprache -> sprache != null && !sprache.isBlank())
                .forEach(sprachen::add);
        return List.copyOf(sprachen);
    }
}
