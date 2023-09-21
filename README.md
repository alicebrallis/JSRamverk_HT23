# JSRamverk_HT23

### Beskriv i README.md vilka säkerhetshål ni hittade och hur ni åtgärdade de.

Säkerhetshålen vi hittade med hjälp av kommandot npm audit var 
1. debug
2. express
3. finalhandler
4. fresh
5. mime
6. ms
7. node-fetch
8. qs
9. semver
För att lösa säkerhetshålen i projektet använde vi oss dokumentionen npm audit och utförde kommandona som föreslogs där. Det kommandot
som löste de flesta säkerhetsnålen var npm audit fix.

### Beskriv i README.md vilka steg ni fick gå igenom för att få applikationen att fungera.
Genom att köra console.log upptäckte vi att det var något fel med apinyckeln, den blev undefinied. Då gick vi in på trafikverkets hemsida
och skapade ett konto för att därefter hämta en apinyckel. Sedan i rooten av backend mappen skapade vi sedan en fil, .env, för att konfiguera 
miljövariablen TRAFIKVERKET_API_KEY. 

### Vårt val av ramverk
I vår grupp valde vi att jobba med ramverket React. Vi har förstått att react är relativt enkelt att lära sig om man är bekant med javascript och därför kände vi att hade en bra grund att lära oss det ramverket. Genom att kolla på videorna om React så kunde vi förstå att det går
snabbare att utveckla applikationer och webbsidor därför tänkte vi det är fördelaktigt att använda oss av detta ramverk. 