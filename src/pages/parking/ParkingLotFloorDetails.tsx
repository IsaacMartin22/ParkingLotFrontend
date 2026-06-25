import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import '../../styles/ServicePageStyles.css';
import '../../styles/ParkingLots.css';
import {Car, Floor, ParkingSpace} from "../../types/parking";
import useFloorForParkingLot from "../../hooks/useFloorForParkingLot";
import CarCard from "../../components/CarCard";
import { API_URL } from "../../types/constants";

interface RouteParams {
  lotId: string;
  floorId: string;
}

type ParkingSpaceEventAction = 'ADD' | 'UPDATE' | 'REMOVE' | 'OCCUPY' | 'VACATE';

interface ParkingSpaceSseEvent {
  action?: ParkingSpaceEventAction | string;
  type?: ParkingSpaceEventAction | string;
  eventType?: ParkingSpaceEventAction | string;
  floor?: Floor;
  floorId?: number | string;
  sectionId?: number | string;
  spaceId?: number | string;
  parkingSpaceId?: number | string;
  car?: Car | null;
  space?: Partial<ParkingSpace> & {
    car?: Car | null;
    occupied?: boolean;
    isOccupied?: boolean;
  };
}

function toNumber(value: unknown): number | undefined {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function normalizeCar(car: any): Car | null {
  if (!car) {
    return null;
  }

  return {
    id: toNumber(car?.id ?? car?.carId) ?? 0,
    color: String(car?.color ?? ''),
    make: String(car?.make ?? ''),
    model: String(car?.model ?? ''),
    manufacturingYear: toNumber(car?.manufacturingYear ?? car?.year) ?? 0,
    licensePlate: String(car?.licensePlate ?? car?.plate ?? car?.plateNumber ?? ''),
  };
}

function normalizeEventAction(event: ParkingSpaceSseEvent): string {
  return String(event.action ?? event.type ?? event.eventType ?? 'UPDATE').toUpperCase();
}

function getEventSpaceId(event: ParkingSpaceSseEvent): number | undefined {
  return toNumber(
    event.space?.id ??
    event.spaceId ??
    event.parkingSpaceId
  );
}

function getEventCar(event: ParkingSpaceSseEvent): Car | null {
  if ('car' in event) {
    return normalizeCar(event.car);
  }

  if (event.space && 'car' in event.space) {
    return normalizeCar(event.space.car);
  }

  return null;
}

function hasEventCarUpdate(event: ParkingSpaceSseEvent): boolean {
  return Object.prototype.hasOwnProperty.call(event, 'car')
    || Boolean(event.space && Object.prototype.hasOwnProperty.call(event.space, 'car'));
}

function getEventOccupied(
  event: ParkingSpaceSseEvent,
  action: string,
  car: Car | null,
  currentOccupied: boolean
): boolean {
  if (action === 'REMOVE' || action === 'VACATE') {
    return false;
  }

  if (typeof event.space?.occupied === 'boolean') {
    return event.space.occupied;
  }

  if (typeof event.space?.isOccupied === 'boolean') {
    return event.space.isOccupied;
  }

  if (hasEventCarUpdate(event)) {
    return car !== null;
  }

  return currentOccupied;
}

function updateFloorFromSseEvent(currentFloor: Floor | undefined, event: ParkingSpaceSseEvent): Floor | undefined {
  if (!currentFloor) {
    return currentFloor;
  }

  if (event.floor) {
    return event.floor;
  }

  const spaceId = getEventSpaceId(event);

  if (spaceId === undefined) {
    return currentFloor;
  }

  const action = normalizeEventAction(event);
  const eventCar = getEventCar(event);
  const hasCarUpdate = hasEventCarUpdate(event);
  let didUpdateSpace = false;

  const sections = (currentFloor.sections ?? []).map((section) => ({
    ...section,
    spaces: section.spaces.map((space) => {
      if (space.id !== spaceId) {
        return space;
      }

      didUpdateSpace = true;

      const car = hasCarUpdate ? eventCar : space.car;
      const occupied = getEventOccupied(event, action, car, space.occupied);

      return {
        ...space,
        ...event.space,
        id: space.id,
        number: String(event.space?.number ?? space.number),
        occupied,
        car: occupied ? car : null,
      };
    }),
  }));

  if (!didUpdateSpace) {
    return currentFloor;
  }

  const totalSpaces = sections.reduce((count, section) => count + section.spaces.length, 0);
  const occupiedSpaces = sections.reduce(
    (count, section) => count + section.spaces.filter((space) => space.occupied).length,
    0
  );

  return {
    ...currentFloor,
    sections,
    capacity: currentFloor.capacity ?? totalSpaces,
    totalFreeSpaces: Math.max(0, totalSpaces - occupiedSpaces),
  };
}

export default function ParkingLotFloors() {
  // @ts-ignore
  const { lotId, floorId } = useParams<RouteParams>();
  const queryClient = useQueryClient();
  const { data: floor, isLoading: loading, isError } = useFloorForParkingLot(lotId, floorId);

  useEffect(() => {
    if (!lotId || !floorId) {
      return;
    }

    const eventSource = new EventSource(`${API_URL}/lots/${lotId}/floors/${floorId}/events`);

    const handleParkingSpaceEvent = (message: MessageEvent<string>) => {
      try {
        const parsedEvent = JSON.parse(message.data) as ParkingSpaceSseEvent;
        const eventType = message.type !== 'message' ? message.type : undefined;
        const event: ParkingSpaceSseEvent = {
          ...parsedEvent,
          action: parsedEvent.action ?? parsedEvent.type ?? parsedEvent.eventType ?? eventType,
        };

        queryClient.setQueryData<Floor | undefined>(
          ['parkingLotFloor', lotId, floorId],
          (currentFloor) => updateFloorFromSseEvent(currentFloor, event)
        );

        queryClient.invalidateQueries(['parkingLot', lotId]);
      } catch (error) {
        console.error('Unable to process parking floor SSE event', error);
      }
    };

    eventSource.onmessage = handleParkingSpaceEvent;

    eventSource.addEventListener('ADD', handleParkingSpaceEvent);
    eventSource.addEventListener('UPDATE', handleParkingSpaceEvent);
    eventSource.addEventListener('REMOVE', handleParkingSpaceEvent);
    eventSource.addEventListener('OCCUPY', handleParkingSpaceEvent);
    eventSource.addEventListener('VACATE', handleParkingSpaceEvent);
    eventSource.addEventListener('parking-space-added', handleParkingSpaceEvent);
    eventSource.addEventListener('parking-space-updated', handleParkingSpaceEvent);
    eventSource.addEventListener('parking-space-removed', handleParkingSpaceEvent);
    eventSource.addEventListener('car-added', handleParkingSpaceEvent);
    eventSource.addEventListener('car-updated', handleParkingSpaceEvent);
    eventSource.addEventListener('car-removed', handleParkingSpaceEvent);

    eventSource.onerror = (error) => {
      console.error('Parking floor SSE connection error', error);
    };

    return () => {
      eventSource.close();
    };
  }, [floorId, lotId, queryClient]);

  if (loading) {
    return (
      <main className="service-container">
        <p>Loading parking lot floor...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="service-container">
        <p className="error">Error loading parking lot floor.</p>
      </main>
    );
  }

  if (!floor) {
    return (
      <>
        <header className="service-header">
          <div className="service-header-nav">
            <Link to={`/parking-lots/${lotId}`} className="back-link">← Lot Details</Link>
            <Link to="/services" className="header-action-link">Settings</Link>
          </div>
          <p className="service-eyebrow">Parking lot app</p>
          <h1>Parking Lot Floor</h1>
          <p className="service-subtitle">Return to the lot details page to choose another floor.</p>
        </header>
        <main className="service-container">
          <div className="service-details parking-container">
            <p>Floor not found.</p>
          </div>
        </main>
      </>
    );
  }

  const sections = floor.sections || [];

  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
          <Link to={`/parking-lots/${lotId}`} className="back-link">← Lot Details</Link>
          <Link to="/services" className="header-action-link">Settings</Link>
        </div>
        <p className="service-eyebrow">Parking lot app</p>
        <h1>{floor.name} Sections</h1>
        <p className="service-subtitle">
          Review section occupancy and live parking space updates for this floor.
        </p>
      </header>

      <main className="service-container">
        <div className="service-details parking-container">
          <div className="parking-card floor-overview-card">
            <div className="parking-card-header">
              <h3>Floor Overview</h3>
              <span className="parking-status">{sections.length} Sections</span>
            </div>

            <div className="parking-body">
              <p><strong>Floor:</strong> {floor.name}</p>
              <p><strong>Total Sections:</strong> {sections.length}</p>
              {floor.capacity !== undefined && <p><strong>Capacity:</strong> {floor.capacity}</p>}
              {floor.totalFreeSpaces !== undefined && <p><strong>Available:</strong> {floor.totalFreeSpaces}</p>}
            </div>
          </div>

          <section className="floor-list">
            <h3>Sections ({sections.length})</h3>

            {sections.length === 0 && <p>No section data available.</p>}

            {sections.length > 0 && (
                <div className="floor-sections">
                  {[...sections]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((section) => (
                          <div className="floor-section" key={section.id}>
                            <p className="floor-section-name">{section.name}</p>

                            <div className="space-grid">
                              {section.spaces.map((space) => (
                                  <div key={space.id}>
                                    <strong>{space.number}</strong>
                                     <CarCard car={space.car} occupied={space.occupied} />
                                  </div>
                              ))}
                            </div>
                          </div>
                      ))}
                </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
