import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import '../../styles/ServicePageStyles.css';
import '../../styles/ParkingLots.css';
import {ParkingSpaceResponse, Floor} from "../../types/parking";
import useFloorForParkingLot from "../../network/useFloorForParkingLot";
import usePostAnalyticsRequest from "../../network/usePostAnalyticsRequest";
import useAnalyticsErrorReporter from "../../network/useAnalyticsErrorReporter";
import { buildErrorAnalyticsRequest } from "../../network/analyticsError";
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

function updateFloorFromSseEvent(currentFloor: Floor | undefined, event: ParkingSpaceSseEvent): Floor | undefined {
  if (!currentFloor) {
    return currentFloor;
  }

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
  const { data: floor, isLoading: loading, isError, error } = useFloorForParkingLot(lotId, floorId);
  useAnalyticsErrorReporter(error, 'Error loading parking lot floor.');
  const postAnalyticsRequest = usePostAnalyticsRequest();

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
        const errorMessage = error instanceof Error ? error.message : 'Unable to process parking floor SSE event';
        console.error('Unable to process parking floor SSE event', error);
        postAnalyticsRequest.mutate(buildErrorAnalyticsRequest(errorMessage));
      }
    };

    eventSource.onmessage = handleParkingSpaceEvent;

    eventSource.addEventListener('UPDATE', handleParkingSpaceEvent);
    eventSource.addEventListener('REMOVE', handleParkingSpaceEvent);

    eventSource.onerror = (error) => {
      console.error('Parking floor SSE connection error', error);
    };

    return () => {
      eventSource.close();
    };
  }, [floorId, lotId]);

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
        <header className="service-header parking-page--floor-details">
          <div className="service-header-nav">
            <Link to={`/parking-lots/${lotId}`} className="back-link">← Lot Details</Link>
          </div>
          <p className="parking-page-path">Hierarchy: Lots {'>'} Floors {'>'} Sections</p>
          <p className="service-eyebrow">Parking lot app</p>
          <div className="parking-page-level">
            <span className="parking-level-pill parking-level-pill--floor">Level 3 - Floor Sections</span>
          </div>
          <h1>Parking Lot Floor</h1>
          <p className="service-subtitle">Return to the lot details page to choose another floor.</p>
        </header>
        <main className="service-container">
          <div className="service-details parking-container parking-content--floor">
            <p>Floor not found.</p>
          </div>
        </main>
      </>
    );
  }

  const sections = floor.sections || [];

  return (
    <>
      <header className="service-header parking-page--floor-details">
        <div className="service-header-nav">
          <Link to={`/parking-lots/${lotId}`} className="back-link">← Lot Details</Link>
        </div>
        <p className="parking-page-path">Hierarchy: Lots {'>'} Floors {'>'} Sections</p>
        <p className="service-eyebrow">Parking lot app</p>
        <div className="parking-page-level">
          <span className="parking-level-pill parking-level-pill--floor">Level 3 - Floor Sections</span>
        </div>
        <h1>{floor.name} Sections</h1>
        <p className="service-subtitle">
          Review section occupancy and live parking space updates for this floor.
        </p>
      </header>

      <main className="service-container">
        <div className="service-details parking-container parking-content--floor">
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

                            <div className="space-grid space-grid--cards">
                              {section.spaces.sort((a, b) => a.id - b.id).map((space) => (
                                  <ParkingSpaceCard key={space.id} parkingSpace={space} />
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
