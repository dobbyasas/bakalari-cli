# Bakaláři CLI

## O projektu

## Požadavky

- Node
- NPM či Yarn (package manager)
- Git

Git musí být nainstalován pouze v případě, že chceš získat zdrojový kód pomocí klonování
(viz. Instalace) nebo chceš provést update kódu skrze Git.

## Instalace

Pokud máš všechny požadované aplikace nainstalované, můžeš začít se stažením zdrojového kódu.
V případě, že nevíš, jak Node nainstalovat, využij tento návod pro instalaci na Windows:
https://www.youtube.com/watch?v=4Wq53LL4alQ

Společně s Node se ti pak nainstaluje NPM. Chceš-li využít package manager yarn, můžeš využít
NPM pro jeho instalaci. V příkazové řádce či terminálu použij:

```
npm i -g yarn
```

Nyní můžeš využívat yarn.

Pokud tyto aplikace máš, pak si ulož zdrojový kód aplikace. Je hned několik způsobů:

1. stáhni si nejnovější release ve formátu .zip (nejoptimálnejší)
2. stáhni si kód z větve `master`
3. naklonuj si větev `master`

Pokud chceš stáhnout release (1.):

Jdi na hlavní stránku repozitáře a v pravém bočním panelu najdeš sekci Releases. Najdeš zde
release, který má štítek *Latest*. Klikni na něj a na konci stránky najdeš sekci Assets.
Klikni na `Source code (zip)` a kód se ti v tomto formátu stáhne.

Pokud chceš stáhnout kód z větve `master` (2.):

Jdi na hlavní stránku repozitáře a ujisti se, že u ikonky větve je její název master. Vpravo
od názvu najdeš zelené tlačítko *Code*. Na to klikni a zvol `Download (zip)`. Archiv .zip se
ti pak stáhne do zařízení.

Pokud chceš repo klonovat (3.):

```
git clone https://github.com/rpsloup/bakalari-cli.git
```

V případě, že zvolíš jednu z prvních dvou možností, ulož si někam složku, kterou obsahuje
archiv .zip. V této složce se nachází zdrojový kód.

Pokud sis repozitář naklonoval, nemusíš extrahovat obsah archivu a máš složku s kódem
připravenou. Nyní si otevři složku s kódem a otevři si v ní příkazový řádek nebo terminál.
Teď musíš spustit příkaz pro instalaci balíčků.

Nevíš-li, jak spustit příkazovou řádku ve složce, zde je návod pro operační systém Windows:
https://www.howtogeek.com/789662/how-to-open-a-cmd-window-in-a-folder-on-windows/

```
V případě, že používáš NPM -
npm i

Pro uživatele yarn -
yarn
```

Vyčkej, než se nainstalují balíčky. Tento proces zabere maximálně minutu, dle rychlosti připojení
k internetu. Tento krok už při příštím spuštění nemusíš opakovat. Teď už můžeš spustit samotný
projekt.

```
V případě, že používáš NPM -
npm start

Pro uživatele yarn -
yarn start
```

Aplikace je spuštěna a můžeš začít proces přihlášení.

## Přihlášení

Po nastartování aplikace musíš zadat 3 údaje - uživatelské jméno, heslo a URL k systému Bakaláři.
Pokud nevíš, jakou zadat URL, jdi na přihlášení v prohlížeči. dostaneš se na URL, která vypadá
takto:

```
https://bakalari.maskola.cz/login
https://bakalari.maskola.cz/bakaweb/login
```

Musíš zadat URL adresu bez `/login` a `/` na konci, tedy -

```
https://bakalari.maskola.cz
https://bakalari.maskola.cz/bakaweb
```

Při zadání nesprávných údajů se aplikace ukončí. Pokud se tento krok povedl, vyčkej několik sekund,
než API vrátí přístupový token, který aplikace používá pro získání dat. Následně už je možné zadávat
příkazy, které najdeš v lekci Příkazy.

Tvé přihlašovací údaje nejsou posílány žádné třetí straně, jsou posílány pouze serveru Bakaláři. Dále
jsou tyto údaje uloženy lokálně ve souboru `data/auth.json`, který se vytvoří po prvním přihlášení.
Slouží k automatickému přihlašování a heslo je zde šifrovaně uloženo.

Celé přihlašování pak vypadá takto:

```
Bakaláři CLI
Release 1.0.2
Made by Robin Patrik Sloup
© 2023

Enter the URL of Bakaláři
> https://bakalari.maskola.cz
Enter your username
> Novak52487
Enter your password
> ********

[Novak52487@bakalari]$
```

## Příkazy

| Název     | Alias     | Funkce                                   |
| --------- | --------- | ---------------------------------------- |
| help      | napoveda  | vypíše nápovědu                          |
| hours     | hodiny    | vypíše kdy začíná a končí jaká hodina    |
| teachers  | ucitele   | vypíše všechny učitele ve stálém rozvrhu |
| subjects  | predmety  | vypíše předměty a jejich učitele         |
| timetable | rozvrh    | vypíše aktuální rozvrh                   |
| marks     | znamky    | vypíše známky ze všech předmětů          |
| changes   | zmeny     | vypíše změny v aktuálním rozvrhu         |
| final     | pololeti  | vypíše konečné známky z každého pololetí |
| absence   | absence   | vypíše absenci z předmětů                |
| komens    | komens    | vypíše záznamy z komensu                 |
| bfetch    | bfetch    | vypíše informace o aplikaci a API        |
| clear     | cls       | vyčistí obrazovku                        |
| logout    | odhlasit  | odhlásí uživatele a vymaže data o loginu |

### Možnosti

- help (napoveda)
  - \[COMMAND\] -> vypíše nápovědu k příkazu (např. `help timetable`)

- subjects (predmety)
  - t (teachers) -> zobrazit učitele

- timetable (rozvrh)
  - s (stable) -> stálý
  - p (previous) -> minulý týden
  - n (next) -> další týden
  - m (minimal) -> nevypíše čísla hodin a názvy dnů
  - r (rooms) -> vypíše názvy tříd namísto předmětů
  - t (teachers) -> vypíše názvy učitelů namísto předmětů
  - d (dates) -> vypíše čísla dnů

- marks (znamky)
  - m (minimal) -> nevypíše průměr a název předmětu
  - l (list)    -> vypíše u každého předmětu známky
  - \[SUBJECT\] -> vypíše známky z daného předmětu (např. `marks MAT`)

- changes (zmeny)
  - s (sort) -> seřádí změny dle jejich druhu

- komens (komens)
  - \[ID\] -> vypíše zprávu z komensu dle jejího ID
