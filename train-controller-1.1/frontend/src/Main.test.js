//import React from 'react';
//import { render } from '@testing-library/react';
//import { MainView } from '../src/Main.js';
//const setimmediate = require( "setimmediate");


test('should filter out trains with 0 minutes delay', () => {
    const testData = [
        {
            OperationalTrainNumber: 'TestTrain1',
            AdvertisedTimeAtLocation: '2023-10-16T12:00:00',
            EstimatedTimeAtLocation: '2023-10-16T12:00:00',
        },
        {
            OperationalTrainNumber: 'TestTrain2',
            AdvertisedTimeAtLocation: '2023-10-16T12:00:00',
            EstimatedTimeAtLocation: '2023-10-16T12:01:00',
        },
    ];

    const outputDelay = (item) => {
        let advertised = new Date(item.AdvertisedTimeAtLocation);
        let estimated = new Date(item.EstimatedTimeAtLocation);
    
        const diff = Math.abs(estimated - advertised);
    
        return Math.floor(diff / (1000 * 60)) + " minuter";
    };

    const filterDelayedTrains = (data) => {
        return data.filter((item) => {
          const delay = outputDelay(item);
          const delayMinutes = parseInt(delay, 10);
          return delayMinutes >= 1;
        });
      };
    
    const filteredTrains = filterDelayedTrains(testData);

    expect(filteredTrains.some(train => train.OperationalTrainNumber === 'TestTrain1')).toBe(false);
});

test('should include trains with 1 minute or more delay', () => {
    const testData = [
        {
            OperationalTrainNumber: 'TestTrain1',
            AdvertisedTimeAtLocation: '2023-10-16T12:00:00',
            EstimatedTimeAtLocation: '2023-10-16T12:00:00',
        },
        {
            OperationalTrainNumber: 'TestTrain2',
            AdvertisedTimeAtLocation: '2023-10-16T12:00:00',
            EstimatedTimeAtLocation: '2023-10-16T12:01:00',
        },
    ];

        const outputDelay = (item) => {
            let advertised = new Date(item.AdvertisedTimeAtLocation);
            let estimated = new Date(item.EstimatedTimeAtLocation);

            const diff = Math.abs(estimated - advertised);

            return Math.floor(diff / (1000 * 60)) + " minuter";
        };

        const filterDelayedTrains = (data) => {
            return data.filter((item) => {
            const delay = outputDelay(item);
            const delayMinutes = parseInt(delay, 10);
            return delayMinutes >= 1;
            });
        };

    const filteredTrains = filterDelayedTrains(testData);
    expect(filteredTrains.some(train => train.OperationalTrainNumber === 'TestTrain2')).toBe(true);
});