package de.wps.ddd.kino.filmauswahl.service;

import de.wps.ddd.kino.filmauswahl.data.AktuelleFilme;
import de.wps.ddd.kino.filmauswahl.data.Film;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Randfälle des Sprachfilters ohne Datenbank: Film ohne Sprache, Schreibweise und Dubletten bei der
 * Sprachenliste. Die Integrationstests auf dem Wochenplan-Fixture decken den Normalfall ab.
 */
class ProgrammServiceTest {

    private static final LocalDate DATUM = LocalDate.parse("2025-03-19");
    private static final LocalDateTime START = DATUM.atStartOfDay();
    private static final LocalDateTime ENDE = LocalTime.MAX.atDate(DATUM);

    private final AktuelleFilme aktuelleFilme = mock(AktuelleFilme.class);
    private final ProgrammService programmService = new ProgrammService(aktuelleFilme);

    @Test
    void holeVorstellungenFuerTag_filmOhneSprache_erscheintNurBeiAlle() {
        // arrange
        when(aktuelleFilme.findeVorstellungenZwischen(START, ENDE)).thenReturn(List.of(
                film(1L, "Ohne Sprache", null),
                film(2L, "Deutscher Film", "deutsch")));

        // act / assert
        assertThat(programmService.holeVorstellungenFuerTag(DATUM, false, null))
                .extracting(Film::getTitel).containsExactly("Ohne Sprache", "Deutscher Film");
        assertThat(programmService.holeVorstellungenFuerTag(DATUM, false, "deutsch"))
                .extracting(Film::getTitel).containsExactly("Deutscher Film");
    }

    @Test
    void holeVorstellungenFuerTag_filmMitLeererSprache_erscheintNurBeiAlle() {
        // arrange
        when(aktuelleFilme.findeVorstellungenZwischen(START, ENDE)).thenReturn(List.of(
                film(1L, "Leere Sprache", ""),
                film(2L, "Deutscher Film", "deutsch")));

        // act / assert
        assertThat(programmService.holeVorstellungenFuerTag(DATUM, false, "deutsch"))
                .extracting(Film::getTitel).containsExactly("Deutscher Film");
    }

    @Test
    void holeSprachenFuerTag_ohneSchreibungUndOhneLeerwerte_liefertJedeSpracheEinmal() {
        // arrange
        when(aktuelleFilme.findeVorstellungenZwischen(START, ENDE)).thenReturn(List.of(
                film(1L, "A", "Deutsch"),
                film(2L, "B", "deutsch"),
                film(3L, "C", null),
                film(4L, "D", "  "),
                film(5L, "E", "englisch")));

        // act
        var sprachen = programmService.holeSprachenFuerTag(DATUM);

        // assert
        assertThat(sprachen).containsExactly("Deutsch", "englisch");
    }

    private static Film film(Long id, String titel, String sprache) {
        var film = new Film();
        film.setId(id);
        film.setTitel(titel);
        film.setSprache(sprache);
        film.setVorstellungen(List.of());
        return film;
    }
}
