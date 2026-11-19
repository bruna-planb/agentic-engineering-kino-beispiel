package de.wps.ddd.kino.filmauswahl.service;

import de.wps.ddd.kino.IntegrationTestMitWochenplan;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
class ProgrammServiceIntegrationTest extends IntegrationTestMitWochenplan {

    @Autowired
    private ProgrammService programmService;

    @Test
    void holeVorstellungenFuerTag_dreiVorstellungenAmTag_liefertFilme() {
        // arrange
        var datum = LocalDate.parse("2025-03-19");

        // act
        var filme = programmService.holeVorstellungenFuerTag(datum);

        // assert
        assertThat(filme).isNotNull();
        assertThat(filme).hasSize(3);
        var film1 = filme.get(0);
        var film2 = filme.get(1);
        var film3 = filme.get(2);
        assertThat(film1.getTitel()).isEqualTo("Guardians of the Lunacy");
        assertThat(film2.getTitel()).isEqualTo("The Fast and the Curious");
        assertThat(film3.getTitel()).isEqualTo("Clown Wars");
        assertThat(film1.getVorstellungen()).hasSize(1);
        assertThat(film2.getVorstellungen()).hasSize(2);
        assertThat(film3.getVorstellungen()).hasSize(1);
        assertThat(film1.getVorstellungen().get(0).getBeginn()).isEqualTo("2025-03-19T14:30:00");
        assertThat(film2.getVorstellungen().get(0).getBeginn()).isEqualTo("2025-03-19T15:00:00");
        assertThat(film2.getVorstellungen().get(1).getBeginn()).isEqualTo("2025-03-19T20:30:00");
        assertThat(film3.getVorstellungen().get(0).getBeginn()).isEqualTo("2025-03-19T22:30:00");
    }

    @Test
    void holeVorstellungenFuerTag_nurKinderfilme_liefertNurKinderfilmVorstellungen() {
        // arrange
        var datum = LocalDate.parse("2025-03-19");

        // act
        var filme = programmService.holeVorstellungenFuerTag(datum, true);

        // assert
        assertThat(filme).hasSize(1);
        var film = filme.get(0);
        assertThat(film.getTitel()).isEqualTo("Guardians of the Lunacy");
        assertThat(film.getVorstellungen()).hasSize(1);
        assertThat(film.getVorstellungen().get(0).getBeginn()).isEqualTo("2025-03-19T14:30:00");
        assertThat(film.getVorstellungen().get(0).getKategorie()).isEqualTo("Kinderfilm");
    }

    @Test
    void holeVorstellungenFuerTag_nurKinderfilme_filmMitAuchAnderenVorstellungen_liefertNurKinderfilmVorstellung() {
        // arrange — Donnerstag: Guardians läuft 14:30 als Kinderfilm und 20:00 als PrimeTime
        var datum = LocalDate.parse("2025-03-20");

        // act
        var filme = programmService.holeVorstellungenFuerTag(datum, true);

        // assert
        assertThat(filme).hasSize(1);
        assertThat(filme.get(0).getTitel()).isEqualTo("Guardians of the Lunacy");
        assertThat(filme.get(0).getVorstellungen())
                .extracting(v -> v.getBeginn().toLocalTime().toString())
                .containsExactly("14:30");
    }

    @Test
    void holeVorstellungenFuerTag_keineVorstellungenAmTag_liefertLeereListe() {
        // arrange
        var datum = LocalDate.parse("2000-01-01");

        // act
        var filme = programmService.holeVorstellungenFuerTag(datum);

        // assert
        assertThat(filme).isNotNull();
        assertThat(filme).isEmpty();
    }
}
