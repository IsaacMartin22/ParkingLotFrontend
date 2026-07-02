import React from 'react';
import useFloorForParkingLot from '../hooks/useFloorForParkingLot';

const CAR_COLOR_HEX: Record<string, string> = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Black: '#111827',
  White: '#f3f4f6',
  Silver: '#9ca3af',
  Green: '#10b981',
};

interface SectionSummaryCardProps {
  lotId: string;
  floorId: string;
}

export default function SectionSummaryCard({ lotId, floorId }: SectionSummaryCardProps) {
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
                  const colorHex = space.color ? CAR_COLOR_HEX[space.color] || '#64748b' : '#cbd5e1';
                  return (
                    <div
                      className={`space-tile ${space.occupied ? 'space-occupied' : 'space-free'}`}
                      key={space.id}
                      style={{ borderColor: colorHex, backgroundColor: space.occupied ? `${colorHex}22` : '#f8fafc' }}
                    >
                      <strong>{space.number}</strong>
                      {space.occupied ? (
                        <>
                          <span>Car: {space.manufacturingYear} {space.make || 'Unknown'} {space.model || 'Unknown'}</span>
                          <span>Plate: {space.licensePlate || 'Unknown'}</span>
                          {/*<span>Time: {formatDuration(toNumber(space))}</span>*/}
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

