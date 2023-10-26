import { render } from '@testing-library/react';
import MainView from './Main';


test('renders the landing page', async () => {
    render(<MainView />);
    
    // Använd await för att vänta på att asynkrona operationer slutförs
    await new Promise(resolve => setImmediate(resolve));
});

// //import React from 'react';
// //import { render } from '@testing-library/react';
// //import { MainView } from '../src/Main.js';
// //const setimmediate = require( "setimmediate");

// //import { render, fireEvent } from '@testing-library/react';
// //const { render, fireEvent } = require('@testing-library/react');

// /* import React from 'react';
// import { render, fireEvent } from '@testing-library/react'; */
// import MainView from './MainView';

// test('should filter out trains with 0 minutes delay', () => {
//     const testData = [
//         {
//             OperationalTrainNumber: 'TestTrain1',
//             AdvertisedTimeAtLocation: '2023-10-16T12:00:00',
//             EstimatedTimeAtLocation: '2023-10-16T12:00:00',
//         },
//         {
//             OperationalTrainNumber: 'TestTrain2',
//             AdvertisedTimeAtLocation: '2023-10-16T12:00:00',
//             EstimatedTimeAtLocation: '2023-10-16T12:01:00',
//         },
//     ];

//     const outputDelay = (item) => {
//         let advertised = new Date(item.AdvertisedTimeAtLocation);
//         let estimated = new Date(item.EstimatedTimeAtLocation);
    
//         const diff = Math.abs(estimated - advertised);
    
//         return Math.floor(diff / (1000 * 60)) + " minuter";
//     };

//     const filterDelayedTrains = (data) => {
//         return data.filter((item) => {
//             const delay = outputDelay(item);
//             const delayMinutes = parseInt(delay, 10);
//             return delayMinutes >= 1;
//         });
//     };
    
//     const filteredTrains = filterDelayedTrains(testData);

//     expect(filteredTrains.some(train => train.OperationalTrainNumber === 'TestTrain1')).toBe(false);
// });

// test('should include trains with 1 minute or more delay', () => {
//     const testData = [
//         {
//             OperationalTrainNumber: 'TestTrain1',
//             AdvertisedTimeAtLocation: '2023-10-16T12:00:00',
//             EstimatedTimeAtLocation: '2023-10-16T12:00:00',
//         },
//         {
//             OperationalTrainNumber: 'TestTrain2',
//             AdvertisedTimeAtLocation: '2023-10-16T12:00:00',
//             EstimatedTimeAtLocation: '2023-10-16T12:01:00',
//         },
//     ];

//         const outputDelay = (item) => {
//             let advertised = new Date(item.AdvertisedTimeAtLocation);
//             let estimated = new Date(item.EstimatedTimeAtLocation);

//             const diff = Math.abs(estimated - advertised);

//             return Math.floor(diff / (1000 * 60)) + " minuter";
//         };

//         const filterDelayedTrains = (data) => {
//             return data.filter((item) => {
//             const delay = outputDelay(item);
//             const delayMinutes = parseInt(delay, 10);
//             return delayMinutes >= 1;
//             });
//         };

//     const filteredTrains = filterDelayedTrains(testData);
//     expect(filteredTrains.some(train => train.OperationalTrainNumber === 'TestTrain2')).toBe(true);
// });

// // test('when marker is clicked one train should appear in table', () => {
// //     const testData = [
// //         {
// //             OperationalTrainNumber: '123'
// //         },
// //     ];

// //     const outputDelay = (item) => {
        
// //         let advertised = new Date(item.AdvertisedTimeAtLocation);
// //         let estimated = new Date(item.EstimatedTimeAtLocation);

// //         const diff = Math.abs(estimated - advertised);

// //         return Math.floor(diff / (1000 * 60)) + " minuter";
// //     };

// //     const filterDelayedTrains = (data) => {
// //         return data.filter((item) => {
// //         const delay = outputDelay(item);
// //         const delayMinutes = parseInt(delay, 10);
// //         return delayMinutes >= 1;
// //         });
// //     };

// //     const setSelectedTrainMark = null

// //     const handleMarkerClick = (train, data) => {
// //         console.log(train, data)
// //         const delayedTrains = filterDelayedTrains(data);
    
// //         const advertised_train_idents = []; 
// //         let matchedTrain = null; 
    
// //         for (const item of delayedTrains) { 
// //             advertised_train_idents.push(item); 
// //         }
    
// //         for (const advertisedTrainIdent of advertised_train_idents) {
// //             if (advertisedTrainIdent.OperationalTrainNumber === train.OperationalTrainNumber) {
// //                 matchedTrain = advertisedTrainIdent; 
// //                 break;
// //             }
// //         }
    
// //         if (matchedTrain !== null) {
// //             setSelectedTrainMark(matchedTrain);
// //         } else {
// //             console.log("Tågnumret matchar inte med tågnummer i listan av försenade tåg...")
// //         }
// //     };

// //     const selectedTrain = handleMarkerClick(testData[0].OperationalTrainNumber, testData);



// //     console.log(testData[0].OperationalTrainNumber, testData, "kolla här")
// //     // För att testa om handleMarkerClick-funktionen fungerar som förväntat
// //     expect(selectedTrain).not.toBeNull(); // Kontrollera att selectedTrain inte är null
// //     expect(selectedTrain.OperationalTrainNumber).toBe('123'); // Kontrollera att det valda tåget är det förväntade tågnumret
// // });


// /* test('Clicking a map marker displays the corresponding train in the table', () => {
//     // Mock the delayed train data and select a train.
//     const delayedTrainsData = {
//       data: [
//         {
//           AdvertisedTrainIdent: '123',
//           // Add other relevant properties here.
//         },
//         {
//           AdvertisedTrainIdent: '456',
//           // Add other relevant properties here.
//         },
//       ],
//     };
  
//     const { getByText } = render(<MainView delayedTrains={delayedTrainsData} />);
  
//     // Find a map marker (you can use appropriate selectors based on your actual implementation).
//     const mapMarker = getByText('123'); // Assuming the map marker displays train ID.
  
//     // Click the map marker to simulate the user's action.
//     fireEvent.click(mapMarker);
  
//     // Write expectations to check if the selected train is displayed in the table.
//     const selectedTrainInTable = getByText('123'); // Assuming the table displays the selected train.
  
//     expect(selectedTrainInTable).toBeInTheDocument();
//   });
//  */


//   test('Testa handleMarkerClick', () => {
//     const trainData = { trainnumber: '123' }; // Ersätt med rätt tågnummer
//     const delayedTrainsData = [{ AdvertisedTrainIdent: '123' }]; // Exempel på data för försenade tåg
  
//     const setSelectedTrainMark = jest.fn(); // Skapa en mock-funktion
  
//     const matchedTrain = {
//       AdvertisedTrainIdent: '123',
//       // Lägg till andra fält som krävs för din komponent
//     };
  
//     // Anropa funktionen med mockade parametrar
//     MainView.handleMarkerClick(trainData, delayedTrainsData, setSelectedTrainMark);
  
//     // Kontrollera att setSelectedTrainMark anropades med det matchande tåget
//     expect(setSelectedTrainMark).toHaveBeenCalledWith(matchedTrain);
//   });