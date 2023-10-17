import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Main.css';
import { socket } from "./socket.js";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import blueMarkerIcon from "./blue-marker-icon.png";


// function MainView() {
//   const [delayedTrains, setDelayedTrains] = useState({ data: [] });
//   const [mapInitialized, setMapInitialized] = useState(false);
//   const [ticketView, setTicketView] = useState(false);
//   const [selectedTrain, setSelectedTrain] = useState(null);
//   const [lastId, setLastId] = useState(0);
//   const [newTicketId, setNewTicketId] = useState(0);
//   const [oldTickets, setOldTickets] = useState([]);
//   const [selectedCode, setSelectedCode] = useState("");

//   const [isBackClicked, setIsBackClicked] = useState(false);
//   const [codeOptions, setCodeOptions] = useState([]);
//   const [showDelayedTrains, setShowDelayedTrains] = useState(true);
//   const [newTicket, setNewTicket] = useState(null); // Deklarera newTicket och setNewTicket
//   const [ticketList, setTicketList] = useState([]);
//   const [markers, setMarkers] = useState([])
  
//   let map;

  
  
//   useEffect(() => { //NU använder vi en useeffect() för kartan och markörerna, inte varsin för båda som innan
//     const container = L.DomUtil.get("map");
  
//     if (!mapInitialized) { //Här kollar vi ifall !!mapInitialized är inte satt i så fall: false. Då ritas kartan ut. 
//       if (container != null) {
//         container._leaflet_id = null;
//         map = L.map('map').setView([62.173276, 14.942265], 5);
  
//         L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           maxZoom: 19,
//           attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         }).addTo(map);
//       }
//     } else { //Här kollar vi ifall mapInitialized är satt i så fall: true och då sätter vi den till false igen så att kartvyn ritas. 
//         setMapInitialized(false); 
//     }

//     // Här ritar vi ut våra kartmarkörer
//         const markers = {};

//         const blueIcon = new L.Icon({
//           iconSize: [25, 41], // Storlek på ikonen i pixlar
//           iconAnchor: [12, 41], // Position där markören ska anslutas till kartan
//           popupAnchor: [1, -34], // Positionen för popupen i förhållande till ikonen
//           iconUrl: blueMarkerIcon // Vägen till din anpassade blå ikon
//         });
      
//         socket.on("message", (data) => {
//           try {
//             if(!mapInitialized) {
//               if (markers.hasOwnProperty(data.trainnumber)) {
//                 //console.log(markers, "markers")
//                 let marker = markers[data.trainnumber];
//                 marker.setLatLng(data.position);
//               } else {
//                 let marker = L.marker(data.position, { icon: blueIcon }).bindPopup(data.trainnumber).addTo(map);
//                 markers[data.trainnumber] = marker;
//               }
//             }
//           } catch (error) {
//             console.error("Error handling 'message' event:", error);
//           }
//         });
//       },[mapInitialized, map]);
  
//     //handleReturn triggas när vi klickar på tillbaka knappen i delayed vyn och då ska den återskapa vyn för listan över tågförseningarna och kartvyn
//       const handleReturn = () => {
//         setTicketView(true);
//         setMapInitialized(true); //Här sätter vi setMapInitialized till true så att vi vet att den redan blivit satt en gång innan, och vi kan testa den i vår if else sats i useffect()
//       };

//   useEffect(() => {
//     //initializeMap();
//     // Fetchar från alla HTTP förfrågningar
//     Promise.all([ //använder promise.all för att pararellt köra flera asykrona förfrågningar samtidigt och vänta på att 
//     // alla ska slutföras innan vi går vidare. Inuti Promise.all passerar vi en array av promises(det är vad fetch returnerar)
//       fetch("http://localhost:1337/delayed", { mode: 'cors' }), 
//       fetch("http://localhost:1337/tickets", { mode: 'cors' }),
//       fetch("http://localhost:1337/codes", { mode: 'cors' }),
//     ])
//       .then(([delayedResponse, ticketsResponse, codesResponse]) => { //.then blocket körs när alla HTTP-förfrågningar har slutförts, där hanterar vi resultaten av alla
//         //förfrågningar. delayedResponse, ticketsResponse, codesResponse innehåller resultaten av alla fetch-anropen. Inuti .then blocket kör vi en annan promise.all för att 
//         //behandla svaret som JSON. 
//         return Promise.all([
//           delayedResponse.json(),
//           ticketsResponse.json(),
//           codesResponse.json(),
//         ]);
//       })
//       .then(([delayedResult, ticketsResult, codesResult]) => { //den sista .then blocket tar en array  som innehåller resultatet av de 3 förfrågningarna konverterade till JSON.
//         setDelayedTrains({ data: delayedResult.data }); //Här uppdaterar vi state variabeln setdelayedTrains med försenad tågtrafik data.
//         console.log(delayedResult.data, "delayedResult.data")

//         //console.log(codesResult, "codesResult")

//         const lastIdFromData = ticketsResult.data[1] ? ticketsResult.data[1]._id : 0; //new ticket id blir inte riktigt rätt här

//         setLastId(lastIdFromData); //Sätter last id här, så att det inte kan dupliceras och är unikt för ärendet

     
//         //console.log(ticketsResult.data[1])

//         const newId = lastIdFromData + 1; //Detta funkar inte för vi har inte rätt "typ" av id, vi har  #65153a8a87dea25ab368eff2 som id,, går inte att lägga till +1
//         //console.log(lastId, "lastId")
//         //console.log(newId, "newId")
//         setNewTicketId(newId); //Sätter new id här så vi får ett nytt unikt id för ärendet

//         const ticketElements = ticketsResult.data.map((ticket) => ( //Här skriver vi ut alla befintliga ärenden
//           <div key={ticket._id}>
//             {ticket._id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
//           </div>
//         ));

//         setOldTickets(ticketElements); //Här uppdaterar vi useState för setOldtickets till att fylla den tomma arrayen med datan som läggs till efter ett nytt ärende skapats


//         const codeOptions = codesResult.data.map((code) => ({ //Denna kod går igenom varje element i codesResult.data vilket är localhost:1337/codes, för varje code-objekt skapas ett nytt objekt med egenskapen "label"
//           //value: code.Code,
//           label: `${code.Code} - ${code.Level3Description}`, //Här får vi ut alla tågfelmeddelanden i formatet: label : "ANA002 - Bakre tåg"
//         }));
        

//         const codeValues = codeOptions.map((option) => option.label); //Här skapas en ny array "codeValues" som går igenom varje objekt i arrayen codeOptions för att lägga till endast option.label i den nya arrayen codeValues, formatet blir då "ANA002 - Bakre tåg"
        

//         //console.log(codeValues,"code values to send to the orsakskod form");

        
//         setCodeOptions(codeValues); //Här uppdaterar vi useState för setCodeOptions med codeValues data

//       });
//   }, []);

//   //
//   // DETTA ÄR VYN MED TABELLEN PÅ FÖRSENADE TÅG, STARTVYN
//   //
//   const renderDelayedTable = (data) => {
//     return (
//       <div>
//       <div className="delayed-trains">
//         {data.map((item, index) => (
//           <div key={index} className="train-item" onClick={() => handleTrainClick(item)}>
//             <div className="train-number">{item.OperationalTrainNumber}</div>
//             <div className="current-station">
//               <div>{item.LocationSignature}</div>
//               <div>
//                 {item.FromLocation ? item.FromLocation[0].LocationName + " -> " : ""}{" "}
//                 {item.ToLocation ? item.ToLocation[0].LocationName : ""}
//               </div>
//             </div>
//           <div className="delay">{outputDelay(item)}</div>
//         </div>
//         ))}
//       </div>
//       <div className='mapContainer'>
//       <div id="map" className="map"></div>
//       </div>
//       </div>
//     );
//   };

// // BERÄKNAR FÖRSENINGEN I 
//   const outputDelay = (item) => {
//     let advertised = new Date(item.AdvertisedTimeAtLocation);
//     let estimated = new Date(item.EstimatedTimeAtLocation);

//     const diff = Math.abs(estimated - advertised);

//     return Math.floor(diff / (1000 * 60)) + " minuter";
//   };


//   const handleTrainClick = (item) => { //Denna hanterar när ett tåg har blivit klickat på i listan av försenade tåg
//     setSelectedTrain(item); //Skickar item till setSelectedTrain(item), så uppdaterar state variabeln med denna data
//     setTicketView(false); // Sätter setTicketView till false så att denna vy kan återskapas
//   };

//   const clearSelectedTrain = () => {
//     setSelectedTrain(null);
//     setTicketView(false);
//   };


//   //
//   // DETTA ÄR VYN MED ÄRENDEN
//   //
//   const renderTicketView = (item) => {
//     //console.log(L.DomUtil.get("map"), "container i ticketview");

//     let locationString = "";

//     const handleFormSubmit = (event) => {
//       event.preventDefault();

//       const newTicket = { //Ett nytt ärende (ticket) skapas med de parametrar som ska med från tickets, code, item.OperationalTrainNumber och item.EstimatedTimeAtLocation
//         code: selectedCode,
//         trainnumber: item.OperationalTrainNumber,
//         traindate: item.EstimatedTimeAtLocation.substring(0, 10),
//       };

//       console.log(newTicket, "newTicket")
//       //console.log(L.DomUtil.get("map"), "container i ticketview");


//       fetch("http://localhost:1337/tickets", {
//         body: JSON.stringify(newTicket),
//         headers: {
//           'content-type': 'application/json',
//         },
//         method: 'POST',
//       })
//         .then((response) => response.json())
//         .then((result) => {
//           console.log(result.data, "result")
//           const newTicketData = result.data
//           setTicketList([...ticketList, newTicketData]);
//           //setTicketList([...ticketList, newTicketData]); //Här skapas ett nytt ärende omvandlat till JSON-data
//         });
        
//     };

//     return ( //Denna komponent hanterar biljettvyn, vad som ska visas på denna sida, data från localhost:1337/codes ska visas här. 
//       <div className="ticket-container">
//         <div className="ticket">
//         <button onClick={handleReturn}>Tillbaka</button>
//           <h1>Nytt ärende #{newTicketId}</h1>
//           {locationString && <h3>{locationString}</h3>}
//           <p><strong>Försenad:</strong> {outputDelay(item)}</p>
//           <form onSubmit={handleFormSubmit} id="new-ticket-form">
//             <label>Orsakskod</label><br />
//             <select value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)} id="reason-code">
//       {codeOptions.map((value) => (
//         <option key={value} value={value}>
//           {value}
//         </option>
//       ))}
//     </select>
//     <br /><br />
//                 <input type="submit" value="Skapa nytt ärende" />
//               </form>
//             </div>
//             <br />
//             <div className="old-tickets" id="old-tickets">
//       <h2>Befintliga ärenden</h2>
//       {oldTickets}
//       {ticketList.map((ticket) => (
//         <div key={ticket._id} className="ticket-item">
//           {ticket._id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
//         </div>
//   ))}
// </div>

//       </div>
//     );
//   };


//   const clearContainer = () => {
//     setSelectedTrain(null);
//   };

//   return (
//     <div className="ticket-view">
//       {selectedTrain && ticketView === false ? (
//         <div>
//           {renderTicketView(selectedTrain)}
//         </div>
//       ) : (
//         <div className="delayed">
//           <h1>Försenade tåg</h1>
//           {renderDelayedTable(delayedTrains.data)}
//         </div>
//       )}
      
//     </div>
//   );

//       } 
// export default MainView;



function MainView() {
  const [delayedTrains, setDelayedTrains] = useState({ data: [] });
  const [mapInitialized, setMapInitialized] = useState(null);
  const [ticketView, setTicketView] = useState(false);
  // Detta är markören som visar vilket tåg vi klickat på
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [lastId, setLastId] = useState(0);
  const [newTicketId, setNewTicketId] = useState(0);
  const [oldTickets, setOldTickets] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  const [isBackClicked, setIsBackClicked] = useState(false);
  const [codeOptions, setCodeOptions] = useState([]);
  const [showDelayedTrains, setShowDelayedTrains] = useState(true);
  const [newTicket, setNewTicket] = useState(null); // Deklarera newTicket och setNewTicket
  const [ticketList, setTicketList] = useState([]);
  const [markers, setMarkers] = useState([])
  const [count, setCounter] = useState(0);
  const mapInitializedRef = useRef(mapInitialized);

  
  let map;

  
  const handleTrainClick = (train) => { 
    setCounter((prevCount) => prevCount + 1);

    
    if (mapInitialized === null) {
      setMapInitialized(train.AdvertisedTrainIdent);
    }
  
    if (count > 0) {
      setCounter(0);
      setSelectedTrain(train);
      setTicketView(false);
    }
  };


  const handleMarkerClick = (train) => {

    console.log(train.trainnumber, "train")
    
  };


  
  useEffect(() => { //NU använder vi en useeffect() för kartan och markörerna, inte varsin för båda som innan
    const container = L.DomUtil.get("map");
    mapInitializedRef.current = mapInitialized;

    console.log(mapInitializedRef.current, "mapInitializedRef.current")
  
    if (!mapInitializedRef.current) { //Här kollar vi ifall !!mapInitialized är inte satt i så fall: false. Då ritas kartan ut. 
      if (container != null) {
        container._leaflet_id = null;
        map = L.map('map').setView([62.173276, 14.942265], 5);
  
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
      }
    } else { //Här kollar vi ifall mapInitialized är satt i så fall: true och då sätter vi den till false igen så att kartvyn ritas. 
        mapInitializedRef.current = mapInitialized;
    }

    // Här ritar vi ut våra kartmarkörer
        const markers = {};

        const blueIcon = new L.Icon({
          iconSize: [25, 41], // Storlek på ikonen i pixlar
          iconAnchor: [12, 41], // Position där markören ska anslutas till kartan
          popupAnchor: [1, -34], // Positionen för popupen i förhållande till ikonen
          iconUrl: blueMarkerIcon // Vägen till din anpassade blå ikon
        });


      
        //console.log(mapInitialized, "mapInitialized")
        socket.on("message", (data) => {
          try {
            if (mapInitializedRef.current != null) {
              if (mapInitializedRef.current === data.trainnumber) {
                console.log(mapInitializedRef.current, "mapnumber matches");
                data.trainnumber = mapInitializedRef.current;

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
                  marker = L.marker(data.position, { icon: blueIcon }).bindPopup(data.trainnumber).addTo(map);
                  marker.on('click', () => handleMarkerClick(data));
                  console.log(data, "data")
                  markers[data.trainnumber] = marker;
                } else {
                  marker.setLatLng(data.position);
                }

                console.log(data.position, "data.position");
              }
            } else {
              if (mapInitializedRef.current === null) {
                if (markers.hasOwnProperty(data.trainnumber)) {
                    //console.log(markers, "markers")
                    let marker = markers[data.trainnumber];
                    marker.setLatLng(data.position);
                    } else {
                    let marker = L.marker(data.position, { icon: blueIcon }).bindPopup(data.trainnumber).addTo(map);
                    marker.on('click', () => handleMarkerClick(data));
                    //console.log(data, "data")
                    markers[data.trainnumber] = marker;
                    }
                  }
              
            }
          } catch (error) {
            console.error("Error handling 'message' event:", error);
          }
        });

        
        
      },[mapInitialized, map]);
  
    //handleReturn triggas när vi klickar på tillbaka knappen i delayed vyn och då ska den återskapa vyn för listan över tågförseningarna och kartvyn
    const handleReturn = () => {
      console.log(count, "count från handleReturn")
      setTicketView(true);
      setMapInitialized(null); //Satte den till false för att återställa setMap så den ritar ut alla markörer igen
    };
    
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



  const renderDelayedTable = (data) => {

    const delayedTrains = filterDelayedTrains(data);

    return (
      <div>
      <div className="delayed-trains">
        {delayedTrains.map((item, index) => (
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
      <div className='mapContainer'>
      <div id="map" className="map"></div>
      </div>
      </div>
    );
  };

// BERÄKNAR FÖRSENINGEN I 
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



    //setSelectedTrain(train); //Skickar item till setSelectedTrain(item), så uppdaterar state variabeln med denna data



  const clearSelectedTrain = () => {
    setSelectedTrain(null);
    setTicketView(false);
  };


  //
  // DETTA ÄR VYN MED ÄRENDEN
  //
  const renderTicketView = (item) => {
    //console.log(L.DomUtil.get("map"), "container i ticketview");

    let locationString = "";

    const handleFormSubmit = (event) => {
      event.preventDefault();

      const newTicket = { //Ett nytt ärende (ticket) skapas med de parametrar som ska med från tickets, code, item.OperationalTrainNumber och item.EstimatedTimeAtLocation
        code: selectedCode,
        trainnumber: item.OperationalTrainNumber,
        traindate: item.EstimatedTimeAtLocation.substring(0, 10),
      };

      console.log(newTicket, "newTicket")
      //console.log(L.DomUtil.get("map"), "container i ticketview");


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

    return ( //Denna komponent hanterar biljettvyn, vad som ska visas på denna sida, data från localhost:1337/codes ska visas här. 
      <div className="ticket-container">
        <div className="ticket">
        <button onClick={handleReturn}>Tillbaka</button>
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
      {ticketList.map((ticket) => (
        <div key={ticket._id} className="ticket-item">
          {ticket._id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
        </div>
  ))}
</div>

      </div>
    );
  };


  const clearContainer = () => {
    setSelectedTrain(null);
  };


  // RETURN FÖR HELA FUNKTIONEN MAINVIEW
  return (
    <div className="ticket-view">
      {selectedTrain && ticketView === false ? (
        <div>
          {renderTicketView(selectedTrain)}
        </div>
      ) : (
        <div className="delayed">
          <h1>Försenade tåg</h1>
          {renderDelayedTable(delayedTrains.data)}
        </div>
      )}
      
    </div>
  );

      } 
export default MainView;