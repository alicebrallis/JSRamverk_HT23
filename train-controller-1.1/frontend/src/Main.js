import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import io from "socket.io-client";
import 'leaflet/dist/leaflet.css';
import './Main.css';

function MainView() {
  const [delayedTrains, setDelayedTrains] = useState({ data: [] });
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showTicketView, setTicketView] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [lastId, setLastId] = useState(0);
  const [newTicketId, setNewTicketId] = useState(0);
  const [oldTickets, setOldTickets] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  const [isBackClicked, setIsBackClicked] = useState(false);
  const [codeOptions, setCodeOptions] = useState([]);
  const [showDelayedTrains, setShowDelayedTrains] = useState(true);
  const [newTicket, setNewTicket] = useState(null); // Deklarera newTicket och setNewTicket


  const socket = io("http://localhost:1337");

  const handleReturn = () => {
    setTicketView(true);
    setMapInitialized(true);
  };

  const initializeMap = () => {
    var container = L.DomUtil.get("map");

    if (container != null) {
      container._leaflet_id = null;
      const map = L.map('map').setView([62.173276, 14.942265], 5);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      setMapInitialized(true);

      const markers = {};

      socket.on("message", (data) => {
        if (markers.hasOwnProperty(data.trainnumber)) {
          let marker = markers[data.trainnumber];
          marker.setLatLng(data.position);
        } else {
          let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map);
          markers[data.trainnumber] = marker;
        }
      });
    }
  };

  useEffect(() => {
    initializeMap();

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

        setLastId(lastIdFromData) //Sätter last id här, så att det inte kan dupliceras och är unikt för ärendet

     
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

  const renderDelayedTable = (data) => {
/* 
    if (!showDelayedTrains) {
      // If showDelayedTrains is false (i.e., handleTrainClick is clicked), return null to hide the content.
      return null;
    } */
  
    return (
      <div className="delayed-trains">
        {data.map((item, index) => (
          <div key={index} className="train-item" onClick={() => handleTrainClick(item)}>
            <div className="train-number">{item.OperationalTrainNumber}</div>
            <div className="current-station">
              <div>{item.LocationSignature}</div>
              <div>
                {item.FromLocation ? item.FromLocation[0].LocationName + " -> " : ""}{" "}
                {item.ToLocation ? item.ToLocation[0].LocationName : ""}
              </div>
            </div>
            <div className="delay">{outputDelay(item)}</div>
          </div>
        ))}
      </div>
    );
  };

  const outputDelay = (item) => {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);

    return Math.floor(diff / (1000 * 60)) + " minuter";
  };

  const handleTrainClick = (item) => { //Denna hanterar när ett tåg har blivit klickat på i listan av försenade tåg
    setSelectedTrain(item); //Skickar item till setSelectedTrain(item), så uppdaterar state variabeln med denna data
    setTicketView(false) // Sätter setTicketView till false så att denna vy kan återskapas
  };

  const clearSelectedTrain = () => {
    setSelectedTrain(null);
    setTicketView(false);
  };

  const renderTicketView = (item) => {
    let locationString = "";
    const handleBackClick = () => {
      setIsBackClicked(true);
    };

    const handleFormSubmit = (event) => {
      event.preventDefault();

      const newTicket = { //Ett nytt ärende (ticket) skapas med de parametrar som ska med från tickets, code, item.OperationalTrainNumber och item.EstimatedTimeAtLocation
        code: selectedCode,
        trainnumber: item.OperationalTrainNumber,
        traindate: item.EstimatedTimeAtLocation.substring(0, 10),
      };

      console.log(newTicket, "newTicket")

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
          setNewTicket(result.data) //Här skapas ett nytt ärende omvandlat till JSON-data
        });
        
    };
  
    return (
      <div className="ticket-container">
        <div className="ticket">
          <a href="Gå tillbaka" onClick={handleBackClick} id="back"></a>
          <h1>Nytt ärende #{newTicketId}</h1>
          {locationString && <h3>{locationString}</h3>}
          <p><strong>Försenad:</strong> {outputDelay(item)}</p>
          <form onSubmit={handleFormSubmit} id="new-ticket-form">
            <label>Orsakskod</label><br />
            <select value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)} id="reason-code">
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
          {newTicket && (
  <div className="new-ticket">
    {newTicket._id} - {newTicket.code} - {newTicket.trainnumber} - {newTicket.traindate}
  </div>
)}
        </div>
      </div>
    );
  };

  const clearContainer = () => {
    setSelectedTrain(null);
  };

  return (
    <div>
      <div className="ticket-view">
        {selectedTrain && !showTicketView ? (
          <div>
            <button onClick={handleReturn}>Tillbaka</button>
            {renderTicketView(selectedTrain)}
          </div>
        ) : (
          <div className="delayed">
            <h1>Försenade tåg</h1>
            {renderDelayedTable(delayedTrains.data)}
          </div>
        )}
      </div>

      <div>
      
        <div id="map" className="map"></div>
      </div>
    </div>
  );
}


export default MainView;



/* 
function RenderMainView() {
  
  const [delayedTrains, setDelayedTrains] = useState({ data: [] }); 
  // delayedTrains använder useState för att lagra försendad tågtrafik data, initierar det som ett objekt med en tom array
  //setDelayedTrains är en funktion som genereras av Reacts useState, denna funktion kommer användas för att uppdatera värdet av delatedTrains, 
  //när vi tillkallar setDelayed(nytt value) kommer delayedTrains att uppdateras med det nya värdet och komponenten att omrenderas med den uppdaterade datan.


  useEffect(() => { //useEffect används när komponenten renderas i detta fall är det fetchInfo funktionen, dvs när tågdata och karta fetchas
    //useEffect hanterar olika saker som händer i din komponent och sedan utför vissa åtgärder när dessa händelser inträffar.
    const fetchInfo = () => {// Denna funktion definieras här och initierar en karta och hämtar förseningsdatan för tågen

      // Tar elementet containern och raderar child element
      const container = document.getElementById('container');
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Skapar HTML element för kartan och de försenade tågen
      const mapDiv = document.createElement('div');
      mapDiv.id = 'map';
      mapDiv.className = 'map';

      const delayedTrainsDiv = document.createElement('div');
      delayedTrainsDiv.className = 'delayed';
      delayedTrainsDiv.innerHTML = `
        <h1>Försenade tåg</h1>
        <div id="delayed-trains" class="delayed-trains"></div>
      `;

      // Lägger till dessa element i containern
      container.appendChild(delayedTrainsDiv);
      container.appendChild(mapDiv);

      //  socket.io connection till servern
      const socket = io("http://localhost:1337");
      console.log(socket, "Socket");

      // Skapar och konfiguerar en Leaflet karta.
      const map = L.map('map').setView([62.173276, 14.942265], 5);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Skapar markörer för de försenade tågen och uppdaterar deras positioner
      let markers = {};

      socket.on("message", (data) => {
        if (markers.hasOwnProperty(data.trainnumber)) {
          let marker = markers[data.trainnumber];

          marker.setLatLng(data.position);
        } else {
          let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map);

          markers[data.trainnumber] = marker;
        }
      });

      
      let delayed = document.getElementById("delayed-trains");

      // Fetchar alla försenade tågen från data från server använder CORS för att få tillgång till denna data från en annan server: localhost:1337

      fetch("http://localhost:1337/delayed", { mode: 'cors' })
        .then((response) => response.json())
        .then(function (result) {
          console.log('Fetched data:', result);
           setDelayedTrains({ data: result });// Här updateras useState med den fetchade datan (delayed trains)
        });
    };

    fetchInfo();
  }, []);

  let delayedtrain_array = Object.values(delayedTrains.data)
  console.log(delayedtrain_array, "delayedtrain_array")


  const delayedTrainData = delayedtrain_array; //detta är delayedTrains, det är ett objekt som innehåller en array med de försenade tågdatan
  console.log(delayedTrains.data, "delayedTrains.data")

  console.log(typeof(delayedTrainData))

  // Här returneras en container för att visa upp kartan och de försenade tågen, det kallas för JSX (React element)
  return (
    <div id="container">
      <h1>Försenade tåg</h1>
      <div id="delayed-trains" className="delayed-trains">
      <ul>
  {delayedTrainData.map((train, index) => (
    <li key={index}>
      {train.ActivityId}: {train.AdvertisedTimeAtLocation},
    </li>,
      console.log(train, index, "train, index")
  ))}
</ul>
      </div>
      <div id="map" className="map"></div>
    </div>
  );
  
}



export default RenderMainView;
 */