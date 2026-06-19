import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useFloorForParkingLot from '../../hooks/useFloorForParkingLot';
import '../../styles/ServicePage.css';
import '../../styles/ParkingLots.css';
import CarCard from "../../components/CarCard";

interface RouteParams {
  lotId: string;
  floorId: string;
}

export default function ParkingLotFloors() {
  // @ts-ignore
  const { lotId, floorId } = useParams<RouteParams>();
  const { data: floor, isLoading: loading, isError } = useFloorForParkingLot(lotId, floorId);

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
          <Link to={`/parking-lots/${lotId}`} className="back-link">← Back to Floors</Link>
          <h1>Parking Lot Floor</h1>
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
        <Link to={`/parking-lots/${lotId}`} className="back-link">← Back to Floors</Link>
        <h1>{floor.name} Sections</h1>
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
                  {sections
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((section) => (
                          <div className="floor-section" key={section.id}>
                            <p className="floor-section-name">{section.name}</p>

                            <div className="space-grid">
                              {section.spaces.map((space) => (
                                  <div key={space.id}>
                                    <strong>{space.number}</strong>
                                    <CarCard car={space.car} />
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