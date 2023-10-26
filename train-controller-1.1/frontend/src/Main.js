import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Main.css';
import { socket } from "./socket.js";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import blueMarkerIcon from "./blue-marker-icon.png";
import { useNavigate } from 'react-router-dom';



function MainView() {
  const [authenticated, setAuthenticated] = useState(false);
  const [delayedTrains, setDelayedTrains] = useState({ data: [] });
  const [mapInitialized, setMapInitialized] = useState(null);
  const [ticketView, setTicketView] = useState(false);
  // Detta är markören som visar vilket tåg vi klickat på
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedTrainMark, setSelectedTrainMark] = useState(null);
  const [lastId, setLastId] = useState(0);
  const [newTicketId, setNewTicketId] = useState(0);
  const [oldTickets, setOldTickets] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  const [isBackClicked, setIsBackClicked] = useState(false);
  const [codeOptions, setCodeOptions] = useState([]);
  //const [showDelayedTrains, setShowDelayedTrains] = useState(true);
  //const [newTicket, setNewTicket] = useState(null); // Deklarera newTicket och setNewTicket
  const [ticketList, setTicketList] = useState([]);
  //const [markers, setMarkers] = useState([])
  const [counter, setCounter] = useState(0);
  const mapInitializedRef = useRef(mapInitialized);
  const [train, setTrain] = useState(null); // Skapa en state för train
  //const [selectedTrains, setSelectedTrains] = useState(null);
  const [selectedTrainClickCount, setSelectedTrainClickCount] = useState(0);
  const [selectedTicketClickCount, setSelectedTicketClickCount] = useState(0);
  const [showDelayedTrains, setShowDelayedTrains] = useState(true); // Lägg till en state för att visa/gömma fördröjda tåg
  const [showDelayedTickets, setShowDelayedTickets] = useState(false); // Lägg till en state för att visa/gömma fördröjda tåg
  const navigate = useNavigate();



  let map;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    navigate('/login')

  };


  //DENNA HANTERAR OM ETT TÅG BLIR KLICKAT PÅ, KNAPPEN CLICK MARKER, OCH VISAR KOORDINATERNA FÖR DETTA TÅG PÅ KARTAN
  const handleTrainClick = (train) => {
    setTicketView(true);
  
    if (train.AdvertisedTrainIdent === null) {
      alert("Tyvärr finns ingen positionsdata för detta tåg")
    }

    setSelectedTrain(train);
    // Om inget tåg har klickats på ännu
    if (selectedTrainClickCount === 0) {
      setMapInitialized(train.AdvertisedTrainIdent);
      setSelectedTrainClickCount(1); // Sätt selectedTrainClickCount till 1 efter det första klicket
    } else { // Om ett tåg redan har klickats på
      setCounter(0); // Återställ räknaren
      setSelectedTrainClickCount(0); // Återställ selectedTrainClickCount
    } 
    // Spara information om det klickade tåget oavsett vilket fall
    setTrain(train);
  };
  
  // DENNA HANTERAR OM KNAPPEN TICKET BLIVIT KLICKAD PÅ OCH VISAR DÅ ÄRENDET FÖR DETTA TÅG
  const handleTicketClick = (train) => { 
    setTicketView(false); //Sätter ticket view till false för att rita ut ticket view
    setTrain(train) //Sätter konstanten train för att den ska innehålla data från tåget så att inte den är null

    if (train !== undefined) { //Om tåget inte är undefinied så ska den gå in i denna
        setSelectedTrain(train.AdvertisedTrainIdent); //Här sätts tågets tågnummer till konstanten selectedTrain så att den vet vilket tåg att visa ärendet för.
        renderTicketView(train); //Här skickar jag tågets data till renderTicketView så att den vyn kan identifiera vilket tåg att rita ärende vyn för

      } else {
        alert("Har inget giltigt tågnummer");
      }
    
    setMapInitialized(null); //Här sätts kartan till null för att gömma kartvyn
    setShowDelayedTrains(false); //Här sätter jag denna konstant till false för att gömma vyn med alla försenade tåg dvs delayed-trains vyn då
  };
  
  
// DENNA HANTERAR OM EN MARKÖR BLIVIT KLICKAD PÅ OCH VISAR DÅ BARA DETTA TÅGET I LISTAN AV FÖRSENADE TÅG
  const handleMarkerClick = (train, data) => {
    const delayedTrainsMarker = filterDelayedTrains(data);

    const advertised_train_idents = []; //Skapar ett lista som ska innehålla och lagra data ifrån delayed trains
    let matchedTrain = null; //Skapar en ny variabel som ska assignas till det tågnummer som matchas med tågnummer i delayed trains

    for (const item of delayedTrainsMarker) { //Här går jag igenom data från delayed trains för att lagra data som behövs för att kolla om tågnummer matchar
      advertised_train_idents.push(item); //Lägger datan i den nya listan här
    }

    for (const advertisedTrainIdent of advertised_train_idents) { //Här går jag igenom alla tågnummer som finns i delayed trains datan
      if (advertisedTrainIdent.AdvertisedTrainIdent === train.trainnumber) { //Här kollar jag om tågnumret som kommert från delayed trains matchar med tågnumret från markören
        matchedTrain = advertisedTrainIdent; //Om det matchar assignar jag det till variabeln matchedTrain
        break;
      }
    }

    if (matchedTrain !== null) { //Om matchedTrain inte är null här så kommer jag använda denna för att sätta selectedTrainMark till denna 
      setSelectedTrainMark(matchedTrain); //Här sätter jag selectedTrainMark till det tåg som matchas
    } else {
      //alert("Finns ingen ytterliggare information om detta tåg")//Om inget tågnummer på kartan matchar i listan av försenade tåg, vad ska hända då?
      console.log("Tågnumret matchar inte med tågnummer i listan av försenade tåg...")
    }
};



  useEffect(() => { //NU använder vi en useeffect() för kartan och markörerna, inte varsin för båda som innan
    const container = L.DomUtil.get("map");
    //mapInitializedRef.current = mapInitialized;

    //console.log(mapInitialized)
  
    if (mapInitialized != null) {
      //console.log("va")
      mapInitializedRef.current = mapInitialized
    }
  
    if (!mapInitializedRef.current || mapInitializedRef.current) { //Här kollar vi ifall !!mapInitialized är inte satt i så fall: false. Då ritas kartan ut. 
      //console.log("varför går den inte in")
      if (container != null) {
        container._leaflet_id = null;
        map = L.map('map').setView([62.173276, 14.942265], 5);
  
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

       //mapInitializedRef.current = true;
      }
    } else { //Här kollar vi ifall mapInitialized är satt i så fall: true och då sätter vi den till false igen så att kartvyn ritas.
      //console.log("heeeeej") 
      mapInitializedRef.current = mapInitialized;
    }

    //console.log(typeof(mapInitializedRef.current), " mapInitializedRef.current ")


    // Här ritar vi ut våra kartmarkörer
        const markers = {};

        const blueIcon = new L.Icon({
          iconSize: [25, 41], // Storlek på ikonen i pixlar
          iconAnchor: [12, 41], // Position där markören ska anslutas till kartan
          popupAnchor: [1, -34], // Positionen för popupen i förhållande till ikonen
          iconUrl: blueMarkerIcon // Vägen till din anpassade blå ikon
        });

        //const delayedTrainsData = [];

        // Utför Fetch-anropet för att hämta data.
        fetch("http://localhost:1337/delayed", { mode: 'cors' })
        .then((response) => response.json())
        .then((fetchedData) => {
          // Extrahera och sortera kolumnen "AdvertisedTrainIdent" från datan.
          const advertisedTrainIdents = fetchedData.data //.map((item) => item.AdvertisedTrainIdent);

          socket.on("message", (data) => {
            const operationalTrainNumbers = advertisedTrainIdents.map(item => item.OperationalTrainNumber);
            const delayedTrains = []
            for (let value of operationalTrainNumbers) {
              delayedTrains.push(value) 
            }
            if (delayedTrains.includes(data.trainnumber)) {
                try {
                  if (typeof mapInitializedRef.current === 'string') { // Kollar här ifall mapInitializedRef.current som lagrar mapInitialized inte är null och satt till tågets tågnummer i så fall går den in i denna if-statement
                    if (mapInitializedRef.current === data.trainnumber) { //Kollar ifall mapInitializedRef.current matchar med data.trainnumber som är tågets tågnummer 
                      data.trainnumber = mapInitializedRef.current; //Då sätter jag data.trainnumber till mapInitializedRef.current för att jag vill använda det specifika tågnumret att visas på kartan
                      
    
                      // Ta bort befintliga markörer som inte matchar
                      for (const trainNumber in markers) {
                        if (trainNumber !== data.trainnumber) {
                          let marker = markers[trainNumber];
                          map.removeLayer(marker);
                          //console.log("Removed marker:", marker);
                          delete markers[trainNumber];
                        }
                      }
                      // Uppdatera eller lägg till markören som matchar
                      let marker = markers[data.trainnumber];
                      if (!marker) {
                        console.log(map, "map")
                        marker = L.marker(data.position, { icon: blueIcon }).bindPopup(data.trainnumber).addTo(map);
                        marker.on('click', () => handleMarkerClick(data, advertisedTrainIdents));
                        //console.log(data, "data")
                        markers[data.trainnumber] = marker;
                      } else {
                        marker.setLatLng(data.position);
                      }
    
                      //console.log(data.position, "data.position");
                    }
                  } else {
                    //console.log(mapInitializedRef.current)
                    if (mapInitializedRef.current === null ) {
                      //console.log("tjenare")
            
                      if (markers.hasOwnProperty(data.trainnumber)) {
                          let marker = markers[data.trainnumber];
                          marker.setLatLng(data.position);
                          } else {
                          
                          let marker = L.marker(data.position, { icon: blueIcon }).bindPopup(data.trainnumber).addTo(map);
                          marker.on('click', () => handleMarkerClick(data, advertisedTrainIdents));
                          //console.log(data, "data")
                          markers[data.trainnumber] = marker;
                          }
                        }
                        }
                } catch (error) {
                  console.error("Error handling 'message' event:", error);
                }
            }
              })
            });
              
          },[mapInitialized, map]);
        
            
  
    //handleReturn triggas när vi klickar på tillbaka knappen i delayed vyn och då ska den återskapa vyn för listan över tågförseningarna och kartvyn
    const handleReturn = () => {
      setTicketView(true);
      setShowDelayedTrains(true);
      setSelectedTrainClickCount(0);
      setSelectedTrain(null);
      setSelectedTrainMark(null);
      //console.log(selectedTrain)
      mapInitializedRef.current = null;
      setMapInitialized(train.position); //Satte den till train för att återställa setMap så den ritar ut alla markörer igen
    };
    
  //DATA HÄMTNING SKER HÄR
  useEffect(() => {
    //initializeMap();
    // Fetchar från alla HTTP förfrågningar
    Promise.all([ //använder promise.all för att pararellt köra flera asykrona förfrågningar samtidigt och vänta på att 
    // alla ska slutföras innan vi går vidare. Inuti Promise.all passerar vi en array av promises(det är vad fetch returnerar)
      fetch("http://localhost:1337/delayed", { mode: 'cors' }), 
      fetch("http://localhost:1337/tickets", { mode: 'cors' }),
      fetch("http://localhost:1337/codes", { mode: 'cors' }),
    ])
      .then(([delayedResponse, ticketsResponse, codesResponse]) => { //.then blocket körs när alla HTTP-förfrågningar har slutförts, där hanterar vi resultaten av alla
        //förfrågningar. delayedResponse, ticketsResponse, codesResponse innehåller resultaten av alla fetch-anropen. Inuti .then blocket kör vi en annan promise.all för att 
        //behandla svaret som JSON. 
        return Promise.all([
          delayedResponse.json(),
          ticketsResponse.json(),
          codesResponse.json(),
        ]);
      })
      .then(([delayedResult, ticketsResult, codesResult]) => { //den sista .then blocket tar en array  som innehåller resultatet av de 3 förfrågningarna konverterade till JSON.
        setDelayedTrains({ data: delayedResult.data }); //Här uppdaterar vi state variabeln setdelayedTrains med försenad tågtrafik data. 

        //console.log(codesResult, "codesResult")

        const lastIdFromData = ticketsResult.data[1] ? ticketsResult.data[1]._id : 0; //new ticket id blir inte riktigt rätt här

        setLastId(lastIdFromData); //Sätter last id här, så att det inte kan dupliceras och är unikt för ärendet

        //console.log(ticketsResult.data[1])

        const newId = lastIdFromData + 1; //Detta funkar inte för vi har inte rätt "typ" av id, vi har  #65153a8a87dea25ab368eff2 som id,, går inte att lägga till +1
        //console.log(lastId, "lastId")
        //console.log(newId, "newId")
        setNewTicketId(newId); //Sätter new id här så vi får ett nytt unikt id för ärendet

        const ticketElements = ticketsResult.data.map((ticket) => ( //Här skriver vi ut alla befintliga ärenden
          <div key={ticket._id}>
            {ticket._id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
          </div>
        ));

        setOldTickets(ticketElements); //Här uppdaterar vi useState för setOldtickets till att fylla den tomma arrayen med datan som läggs till efter ett nytt ärende skapats


        const codeOptions = codesResult.data.map((code) => ({ //Denna kod går igenom varje element i codesResult.data vilket är localhost:1337/codes, för varje code-objekt skapas ett nytt objekt med egenskapen "label"
          //value: code.Code,
          label: `${code.Code} - ${code.Level3Description}`, //Här får vi ut alla tågfelmeddelanden i formatet: label : "ANA002 - Bakre tåg"
        }));
        

        const codeValues = codeOptions.map((option) => option.label); //Här skapas en ny array "codeValues" som går igenom varje objekt i arrayen codeOptions för att lägga till endast option.label i den nya arrayen codeValues, formatet blir då "ANA002 - Bakre tåg"

        //console.log(codeValues,"code values to send to the orsakskod form");
        setCodeOptions(codeValues); //Här uppdaterar vi useState för setCodeOptions med codeValues data

      });
  }, []);

  //
  // DETTA ÄR VYN MED TABELLEN PÅ FÖRSENADE TÅG, STARTVYN
  //
  const renderDelayedTable = (data, selectedTrains) => {
    //console.log(data, "render")
    const delayedTrains = filterDelayedTrains(data);
    

// Skapa en separat knappkomponent
function TicketButton({ label, onClick }) { //Denna används för att skapa knappkomponent som används för att returnera knappelementen TICKET och GOBACK
  //label och onClick är egenskaper som skickas till komponenten när vi använder den, label är namnet för knappen, onClick är en funktion som körs när knappen klickas på
  return <button onClick={onClick}>{label}</button>; //JSX-koden som returneras av komponenten, den skapar en HTML <button>-tagg. Vi passerar båda egenskaperna label och onClick som 
  //props till funktionen vilket innebär att dom kommer köras när knappen blir klickad på.
}


// Skapa en array med komponenter i önskad ordning baserat på selectedTrainMark
const orderOfKeys = [ //Behöver sätta nycklarna i objektet såhär för det ska presenteras i korrekt ordning, annars hamnar det i den ordning nycklarna ligger i objektet och det blir fel
  "OperationalTrainNumber",
  "LocationSignature",
  "FromLocation",
  "ToLocation",
  "EstimatedTimeAtLocation",
  "TrainOwner",
];


const componentsInOrder = orderOfKeys.map((key) => { //Här går vi igenom alla nycklar i arrayen orderOfKeys och för det försenade tåget för att presentera dom i HTML element och allt ska se ut som i vyn för försenade tåg
  if (selectedTrainMark && selectedTrainMark[key]) {
    if (key === "OperationalTrainNumber") {
      return (
        <div key={key} className="train-number">
          {selectedTrainMark[key]}
        </div>
      );
    }else if (key === "LocationSignature" || key === "FromLocation" || key === "ToLocation") {
      let locationName = selectedTrainMark[key] || "";
      let arrow = "";
    
      if (key === "FromLocation" || key === "ToLocation") {
        const location = selectedTrainMark[key];
        if (location && location[0]) {
          locationName = location[0].LocationName;
          if (key === "FromLocation") {
            arrow = " -> ";
          }
        }
      }
      return (
        <div key={key} className="current-station">
          {locationName + arrow}
        </div>
      );
    }
     else if (key === "EstimatedTimeAtLocation") {
      return (
        <div key={key} className="delay">
          {outputDelay(selectedTrainMark)}
        </div>
      );
    } else if (key === "TrainOwner") {
      return (
        <>
          <TicketButton label="ÄRENDE" onClick={() => handleTicketClick(selectedTrainMark)} />
          <TicketButton label="TILLBAKA" onClick={() => handleReturn()} />
        </>
      );
    }
  }
});

return ( //Ifall inget tåg har valts eller ett tåg har valts så ska denna vy av försenade tåg visas
  <div>
    {showDelayedTrains && (
      <div className="delayed-trains">
        <h1>Försenade tåg</h1>
        {selectedTrainMark ? (
          <div>
            {componentsInOrder}
          </div>
        ) : ( //Denna vy är för när inget tåg har valts och visar alla försenade tåg som finns i listan
          delayedTrains.map((item, index) => (
            <div key={index} className="train-item">
              <div className="train-number">
                {item.OperationalTrainNumber}
              </div>
              <div className="current-station">
                <div>{item.LocationSignature}</div>
                <div>
                  {item.FromLocation
                    ? item.FromLocation[0].LocationName + " -> "
                    : ""}{" "}
                  {item.ToLocation
                    ? item.ToLocation[0].LocationName
                    : ""}
                </div>
              </div>
              <div className="delay">{outputDelay(item)}</div>
              <TicketButton
                label="MARKÖR"
                onClick={() => handleTrainClick(item)}
              />
              <TicketButton
                label="ÄRENDE"
                onClick={() => handleTicketClick(item)}
              />
            </div>
          ))
        )}
      </div>
    )}
    {showDelayedTrains && (
      <div className="mapContainer">
        <div id="map" className="map"></div>
      </div>
    )}
  </div>
);
}
                      
// BERÄKNAR FÖRSENINGEN I DE FÖRSENADE TÅGEN
  const outputDelay = (item) => {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);

    return Math.floor(diff / (1000 * 60)) + " minuter";
  };

// FILTRERA DE FÖRSENADE TÅGEN
const filterDelayedTrains = (data) => {
  return data.filter((item) => {
    const delay = outputDelay(item);
    const delayMinutes = parseInt(delay, 10);
    return delayMinutes >= 1;

  
  });
  }

  const clearSelectedTrain = () => { //Tror inte vi använder denna alls, den gör ingenting
    setSelectedTrain(null);
    setTicketView(false);
  };


  // DETTA ÄR VYN MED ÄRENDEN
  const renderTicketView = (selectedTrain) => {
    let locationString = "";

    const handleFormSubmit = (event) => {
      event.preventDefault();

      const newTicket = { //Ett nytt ärende (ticket) skapas med de parametrar som ska med från tickets, code, item.OperationalTrainNumber och item.EstimatedTimeAtLocation
        code: selectedCode,
        trainnumber: selectedTrain.OperationalTrainNumber,
        traindate: selectedTrain.EstimatedTimeAtLocation.substring(0, 10),
      };


      fetch("http://localhost:1337/tickets", {
        body: JSON.stringify(newTicket),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result.data, "result")
          const newTicketData = result.data
          setTicketList([...ticketList, newTicketData]);
          //setTicketList([...ticketList, newTicketData]); //Här skapas ett nytt ärende omvandlat till JSON-data
        });   
    };

    return (
      <div>
        {selectedTrain === null ? (//Villkor för delayed-trains, försenade tåg, inget tåg ska ha satts än dvs (valda tåg === null) så att alla tåg visas i listan
          <div className="delayed-trains">
            {Object.keys(selectedTrain).map((key) => (
              <div key={key} className="train-item">
                <div className="train-number">
                  {selectedTrain[key].OperationalTrainNumber}
                </div>
                <div className="current-station">
                  <div>{selectedTrain[key].LocationSignature}</div>
                  <div>
                    {selectedTrain[key].FromLocation
                      ? selectedTrain[key].FromLocation[0].LocationName + " -> "
                      : ""}{" "}
                    {selectedTrain[key].ToLocation
                      ? selectedTrain[key].ToLocation[0].LocationName
                      : ""}
                  </div>
                </div>
                <div className="delay">{outputDelay(selectedTrain[key])}</div>
                <div onClick={() => handleTicketClick(selectedTrain[key])}>TICKET</div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {selectedTrain && ticketView === false && ( //Villkor för ärende- vyn, ett tåg ska ha satts och ticketView ska vara false
              <div>
                <div className="ticket-container">
                  <div className="ticket">
                    <button className='returnBtn' onClick={handleReturn}>TILLBAKA</button>
                    <h1>Nytt ärende #{newTicketId}</h1>
                    {locationString && <h3>{locationString}</h3>}
                    <p><strong>Försenad:</strong> {outputDelay(selectedTrain)}</p>
                    <form onSubmit={handleFormSubmit} id="new-ticket-form">
                      <label>Orsakskod</label><br />
                      <select
                        value={selectedCode}
                        onChange={(e) => setSelectedCode(e.target.value)}
                        id="reason-code"
                      >
                        {codeOptions.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                      <br /><br />
                      <input type="submit" value="Skapa nytt ärende" />
                    </form>
                  </div>
                  <br />
                  <div className="old-tickets" id="old-tickets">
                    <h2>Befintliga ärenden</h2>
                    {oldTickets}
                    {ticketList.map((ticket) => (
                      <div key={ticket._id} className="ticket-item">
                        {ticket._id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
                  </>
                )}
              </div>
    );
}

  const clearContainer = () => { //Denna tror jag inte vi använder, gör ingenting
    setSelectedTrain(null);
  };


// RETURN FÖR HELA FUNKTIONEN MAINVIEW
  return (
    <div className="ticket-view">
      <button className="logOutBtn"onClick={handleLogout}>LOGGA UT</button>
      {train && ticketView === false ? ( //Vi ska använda train och inte selectedTrain, selectedTrain blir undefinied men inte train och det är samma sak
        <div>
          {renderTicketView(train)}
        </div>
      ) : (
        <div className="delayed">
          {renderDelayedTable(delayedTrains.data)}
        </div>
      )}
    </div>
  );
      }
export default MainView;
