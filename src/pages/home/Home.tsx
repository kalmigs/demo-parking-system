import { Button, Dropdown, Menu, message } from 'antd';
import { cloneDeep } from 'lodash';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { carData, size, spaceData } from './data-types';
import { initCars, initSpaces } from './initial-data';

function Home() {
  const [spaces, setSpaces] = useState(initSpaces);
  const [cars, setCars] = useState(initCars);
  const [elapsedTime, setElapsedTime] = useState(0);

  const addCar = () => {
    setCars([
      ...cars,
      {
        id: nanoid(),
        size: Math.floor(Math.random() * 3) as size,
      },
    ]);
  };

  const parkCar = (car: carData, entrance: 0 | 1 | 2) => {
    const clone = cloneDeep(spaces);
    clone.sort((a, b) => a.distance[entrance] - b.distance[entrance]);
    for (let i in clone) {
      if (!clone[i].parkedCar && car.size <= clone[i].size) {
        const newSpaces = cloneDeep(spaces);
        newSpaces[newSpaces.findIndex((s) => s.id === clone[i].id)].parkedCar =
          car;
        setSpaces(newSpaces);

        const newCars = cloneDeep(cars);
        const { leftSince, parkedSince } =
          newCars[newCars.findIndex((c) => c.id === car.id)];
        newCars[newCars.findIndex((c) => c.id === car.id)].parkedSince =
          leftSince && elapsedTime - leftSince <= 1 ? parkedSince : elapsedTime;
        setCars(newCars);
        return;
      }
    }

    message.warning('No more parking space for this car');
  };

  const leaveSpace = (space: spaceData) => {
    const newSpaces = cloneDeep(spaces);
    delete newSpaces[newSpaces.findIndex((s) => s.id === space.id)].parkedCar;
    setSpaces(newSpaces);

    const newCars = cloneDeep(cars);
    newCars[newCars.findIndex((c) => c.id === space.parkedCar?.id)].leftSince =
      elapsedTime;
    setCars(newCars);
  };

  const isCarParked = (car: carData) => {
    return spaces.find((s) => s.parkedCar?.id === car.id) ? true : false;
  };

  const calculateFee = (spaceSize: size, car: carData) => {
    // All types of car pay the flat rate of 40 pesos for the first three (3) hours
    // - 20/hour for vehicles parked in SP;
    // - 60/hour for vehicles parked in MP; and
    // - 100/hour for vehicles parked in LP
    // For parking that exceeds 24 hours, every full 24 hour chunk is charged 5,000 pesos regardless of parking slot.
    //   The remainder hours are charged using the method explained in (b).

    let time = Math.round(elapsedTime - car.parkedSince!);
    if (time <= 3) return 40;

    if (time >= 24) {
      const dayFee = Math.floor(time / 24) * 5000;
      const remainderTime = time % 24;
      const remainderFee =
        remainderTime * (spaceSize === 0 ? 20 : spaceSize === 1 ? 60 : 100);
      return dayFee + remainderFee;
    } else {
      time = time - 3;
      return 40 + time * (spaceSize === 0 ? 20 : spaceSize === 1 ? 60 : 100);
    }
  };

  const parkCarMenu = (
    <Menu>
      {cars.map((c) => {
        const isParked = isCarParked(c);
        return (
          <Menu.Item key={c.id}>
            <p style={{ width: '300px' }}>
              {c.id}
              {isParked ? ' - Parked' : ''}
            </p>

            <Button disabled={isParked} onClick={() => parkCar(c, 0)}>
              0
            </Button>
            <Button disabled={isParked} onClick={() => parkCar(c, 1)}>
              1
            </Button>
            <Button disabled={isParked} onClick={() => parkCar(c, 2)}>
              2
            </Button>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <div>
      <div
        style={{
          margin: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <Button
          type="primary"
          onClick={() => setElapsedTime(elapsedTime + 0.25)}
        >
          Add 1/4 hour
        </Button>
        <Button type="primary" onClick={() => setElapsedTime(elapsedTime + 1)}>
          Add an hour
        </Button>
        <Button type="primary" onClick={() => setElapsedTime(elapsedTime + 24)}>
          Add 24 hours
        </Button>
        <div style={{ marginRight: 'auto' }}>Elapsed Time: {elapsedTime}</div>
        <Dropdown overlay={parkCarMenu} placement="bottomLeft">
          <Button type="primary">Park a car</Button>
        </Dropdown>
        <Button type="primary" onClick={addCar}>
          Add a car
        </Button>
      </div>

      <div style={{ margin: '20px', display: 'flex' }}>
        <div style={{ width: '350px' }}>
          <h1>Spaces</h1>
          {spaces.map((s) => {
            const car = cars.find((c) => c.id === s.parkedCar?.id);

            return (
              <div key={s.id} style={{ margin: '20px' }}>
                <div>Size: {s.size}</div>
                <div>Distance from entrance: {JSON.stringify(s.distance)}</div>
                <div>Parked Car: {s.parkedCar?.id ?? 'N/A'}</div>
                <div>
                  Elapsed time:{' '}
                  {s.parkedCar ? elapsedTime - (car?.parkedSince ?? 0) : 'N/A'}
                </div>
                <div>
                  Fee:{' '}
                  {s.parkedCar ? `${calculateFee(s.size, car!)} PHP` : 'N/A'}
                </div>
                <Button
                  disabled={s.parkedCar ? false : true}
                  type="default"
                  onClick={() => leaveSpace(s)}
                >
                  Leave Parking Space
                </Button>
              </div>
            );
          })}
        </div>
        <div>
          <h1>Cars</h1>
          {cars.map((c) => (
            <div key={c.id} style={{ margin: '20px' }}>
              <div>Car ID: {c.id}</div>
              <div>Size: {c.size}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
