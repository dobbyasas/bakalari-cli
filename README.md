# Bakaláři CLI

## Příkazy

| Název     | Alias     | Funkce                                   |
| --------- | --------- | ---------------------------------------- |
| help      | napoveda  | vypíše nápovědu                          |
| hours     | hodiny    | vypíše kdy začíná a končí jaká hodina    |
| teachers  | ucitele   | vypíše všechny učitele ve stálém rozvrhu |
| timetable | rozvrh    | vypíše aktuální rozvrh                   |
| marks     | znamky    | vypíše známky ze všech předmětů          |
| changes   | zmeny     | vypíše změny v aktuálním rozvrhu         |
| final     | pololeti  | vypíše konečné známky z každého pololetí |
| absence   | absence   | vypíše absenci z předmětů                |
| bfetch    | bfetch    | vypíše informace o aplikaci a API        |
| logout    | odhlasit  | odhlásí uživatele a vymaže data o loginu |

## Možnosti

- timetable (rozvrh)
  - s (stable) -> stálý
  - p (previous) -> minulý týden
  - n (next) -> další týden
  - m (minimal) -> nevypíše čísla hodin a názvy dnů

- marks (znamky)
  - \[SUBJECT\] -> vypíše známky z daného předmětu (např. marks MAT)
  - m (minimal) -> nevypíše průměr a název předmětu
