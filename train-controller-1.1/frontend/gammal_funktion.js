
function MainView() {
  const [delayedTrains, setDelayedTrains] = useState({ data: [] });
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showTicketView, setTicketView] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [newTicketId, setNewTicketId] = useState(0);
  const [oldTickets, setOldTickets] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [isBackClicked, setIsBackClicked] = useState(false);

  

  const handleReturn = () => {
    setTicketView(true)
  }

  useEffect(() => {
    const socket = io("http://localhost:1337");
  
    // Initialize the map
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
  
    // Fetch delayed trains
    fetch("http://localhost:1337/delayed", { mode: 'cors' })
      .then((response) => response.json())
      .then((result) => {
        setDelayedTrains({ data: result.data });
      });
  
    // Fetch tickets
    fetch("http://localhost:1337/tickets", { mode: 'cors' })
      .then((response) => response.json())
      .then((result) => {
        const lastId = result.data[1] ? result.data[1].id : 0;
        const newId = lastId + 1;
        setNewTicketId(newId);
  
        const ticketElements = result.data.map((ticket) => (
          <div key={ticket._id}>
            {ticket._id} - {ticket.code} - {ticket.trainnumber} - {ticket.traindate}
          </div>
        ));
  
        setOldTickets(ticketElements);
      });
  
    // Fetch codes
    fetch("http://localhost:1337/codes", { mode: 'cors' })
      .then((response) => response.json())
      .then((result) => {
        // Handle codes and update state accordingly.
        // Example:
        const codeOptions = result.data.map((code) => (
          <option key={code.Code} value={code.Code}>
            {code.Code} - {code.Level3Description}
          </option>
        ));
  
        setSelectedCode(codeOptions[0]?.props.value); // Set the default selected code.
      });
  
  }, [mapInitialized]);
  
    if (isBackClicked) {
      return (
       renderDelayedTable()
      );
    }

  

const renderDelayedTable = (data) => (
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
const outputDelay = (item) => {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);

    return Math.floor(diff / (1000 * 60)) + " minuter";
  };

  const handleTrainClick = (item) => {
    setSelectedTrain(item); // Set the selected train
    setTicketView(true); // Show the ticket view
  };
  
  const clearSelectedTrain = () => {
    setSelectedTrain(null); // Clear the selected train
    setTicketView(false); // Hide the ticket view
  };
  const renderTicketView = (item) => {
    const handleBackClick = () => {
      setIsBackClicked(true);
    };
  
    const handleFormSubmit = (event) => {
      event.preventDefault();
  
      const newTicket = {
        code: selectedCode,
        trainnumber: item.OperationalTrainNumber,
        traindate: item.EstimatedTimeAtLocation.substring(0, 10),
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
          // Handle the result, if needed.
          // You can update state here if necessary.
        });
    };
    return (
      <div className="ticket-container">
        <div className="ticket">
          <a href="" onClick={handleBackClick} id="back">
          </a>
          <h1>Nytt ärende #{newTicketId}</h1>
          {locationString && <h3>{locationString}</h3>}
          <p><strong>Försenad:</strong> {outputDelay(item)}</p>
          <form onSubmit={handleFormSubmit} id="new-ticket-form">
            <label>Orsakskod</label><br />
            <select value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)} id="reason-code">
              {/* Render code options here */}
            </select><br /><br />
            <input type="submit" value="Skapa nytt ärende" />
          </form>
        </div>
        <br />
        <div className="old-tickets" id="old-tickets">
          <h2>Befintliga ärenden</h2>
          {oldTickets}
        </div>
      </div>
    );
  };

  
  

const clearContainer = () => {
  setSelectedTrain(null);
};

  return (
    <div>
    {showTicketView ? (
      <div className="ticket-view">
        {/* Render ticket view using selectedTrain */}
        {selectedTrain && (
          <div>
            {/* Render selected train details here */}
            <button onClick={clearSelectedTrain}>Back</button>
          </div>
        )}
      </div>
    ) : (
      <div>
        <div className="delayed">
          <h1>Försenade tåg</h1>
          {renderDelayedTable(delayedTrains.data)}
        </div>
        <div id="map" className="map"></div>
      </div>
    )}
  </div>
);
}


export default MainView;
