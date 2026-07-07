import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import '../../styles/ServicePageStyles.css';
import '../../styles/ParkingLots.css';
import {ParkingSpaceResponse, Floor} from "../../types/parking";
import useFloorForParkingLot from "../../network/useFloorForParkingLot";
import ParkingSpaceCard from "../../components/ParkingSpaceCard";
import { API_URL } from "../../types/constants";

interface RouteParams {
  lotId: string;
  floorId: string;
}

type ParkingSpaceEventAction = 'UPDATE' | 'REMOVE';

interface ParkingSpaceSseEvent {
  action: ParkingSpaceEventAction;
  lotId: number;
  floorId: number;
  spaceId: number;
  parkingSpaceResponse: ParkingSpaceResponse;
  timestamp: number;
}

function updateFloorFromSseEvent(currentFloor: Floor, event: ParkingSpaceSseEvent): Floor {
  let didUpdateSpace = false;

  const sections = (currentFloor.sections ?? []).map((section) => ({
    ...section,
    spaces: section.spaces.map((space) => {
      if (space.id !== event.spaceId) {
        return space;
      }

      didUpdateSpace = true;
      return {
        ...event.parkingSpaceResponse,
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
        const event: ParkingSpaceSseEvent = {
          ...parsedEvent,
          action: parsedEvent.action,
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
                              {section.spaces.sort((a, b) => a.id - b.id).map((space) => (
                                  <div key={space.id}>
                                    <strong>{space.id}</strong>
                                     <ParkingSpaceCard parkingSpace={space} />
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
