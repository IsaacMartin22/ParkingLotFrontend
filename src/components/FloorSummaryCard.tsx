import React from 'react';
import useFloorForParkingLot from '../hooks/useFloorForParkingLot';

const CAR_MAKE_COLORS: Record<string, string> = {
  Toyota: '#ef4444',
  Honda: '#3b82f6',
  Ford: '#2563eb',
  Chevrolet: '#f97316',
  Nissan: '#10b981',
  Hyundai: '#8b5cf6',
};

interface FloorSummaryCardProps {
  lotId: string;
  floorId: string;
}

export default function SectionSummaryCard({ lotId, floorId }: FloorSummaryCardProps) {
  const { data: floor, isLoading, isError } = useFloorForParkingLot(lotId, floorId);

  if (isLoading) {
    return (
      <section className="floor-diagram-floor" key={floorId}>
        <h5>{`Floor ${floorId + 1}`}</h5>
        <p>Loading floor details...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="floor-diagram-floor" key={floorId}>
        <h5>{`Floor ${floorId + 1}`}</h5>
        <p className="error">Could not load floor details.</p>
      </section>
    );
  }

  if (!floor) {
    return (
      <section className="floor-diagram-floor" key={floorId}>
        <h5>{`Floor ${floorId + 1}`}</h5>
        <p>No floor details available.</p>
      </section>
    );
  }

  const sections = floor.sections || [];

  return (
    <section className="floor-diagram-floor" key={floor.id}>
      <h5>{floor.name || `Floor ${floorId + 1}`}</h5>
      {sections.length === 0 && <p>No section data available.</p>}
      {sections.length > 0 && (
        <div className="floor-sections">
          {sections.sort((a, b) => a.name.localeCompare(b.name)).map((section) => (
            <div className="floor-section" key={section.id}>
              <p className="floor-section-name">{section.name}</p>
              <div className="space-grid">
                {section.spaces.map((space) => {
                  const colorHex = space.car ? CAR_MAKE_COLORS[space.car.make] || '#64748b' : '#cbd5e1';

                  return (
                    <div
                      className={`space-tile ${space.occupied ? 'space-occupied' : 'space-free'}`}
                      key={space.id}
                      style={{ borderColor: colorHex, backgroundColor: space.occupied ? `${colorHex}22` : '#f8fafc' }}
                    >
                      <strong>{space.number}</strong>
                      {space.occupied && space.car ? (
                        <>
                          <span>{space.car.make} {space.car.model}</span>
                          <span>Year: {space.car.manufacturingYear}</span>
                          <span>Plate: {space.car.licensePlate}</span>
                        </>
                      ) : (
                        <span>Open</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
