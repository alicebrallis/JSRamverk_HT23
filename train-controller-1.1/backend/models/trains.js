const fetch = require('node-fetch')
const EventSource = require('eventsource')


async function fetchTrainPositions(io) {
    console.log("heeeeej")
    const query = `<REQUEST>
    <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
    <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
</REQUEST>`

    const trainPositions = {};

    const response = await fetch(
        "https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/xml" }
        }
    )
    const result = await response.json()

    const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL

    const eventSource = new EventSource(sseurl)


    eventSource.onopen = function() {
        console.log("Connection to server opened.")
    }

    io.on('connection', (socket) => {
        console.log('a user connected')

        eventSource.onmessage = function (e) {
            try {
                const parsedData = JSON.parse(e.data);

                if (parsedData) {
                    //console.log(parsedData.RESPONSE.RESULT[0].TrainPosition[0])
                    const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];


                    const matchCoords = /(\d*\.\d+|\d+),?/g

                    const position = changedPosition.Position.WGS84.match(matchCoords).map((t=>parseFloat(t))).reverse()
                    //console.log(position, "position")

                    const trainObject = {
                        trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                        position: position,
                        timestamp: changedPosition.TimeStamp,
                        bearing: changedPosition.Bearing,
                        status: !changedPosition.Deleted,
                        speed: changedPosition.Speed,
                    };
                    
                    //console.log(trainObject)
                   

                    if (trainPositions.hasOwnProperty(changedPosition.Train.AdvertisedTrainNumber)) {
                        socket.emit("message", trainObject);
                

                    }

                    trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
                    //console.log(trainPositions[changedPosition.Train.AdvertisedTrainNumber])
                }
            } catch (e) {
                console.log(e)
            }

            return 
        }
    })



    eventSource.onerror = function(e) {
        console.log("EventSource failed.")
    }
}

module.exports = fetchTrainPositions;
