import { ROWS, COLS, AISLE_AFTER, TIERS, tierOfRow } from '../data/seats.js';
import { currency } from '../data/helpers.js';

export default function SeatGrid({ taken, selected, onToggle }) {
  const cols = Array.from({ length: COLS }, (_, i) => i + 1);

  return (
    <div className="seat-wrap">
      <div className="screen" aria-hidden="true">
        <div className="screen-bar" />
        <span>All eyes this way</span>
      </div>

      <div className="seat-grid" role="group" aria-label="Seat map">
        {ROWS.map((row, idx) => {
          const tier = tierOfRow(row);
          const startsTier = idx === 0 || tierOfRow(ROWS[idx - 1]).name !== tier.name;
          return (
            <div key={row}>
              {startsTier && (
                <div className="tier-label">
                  {tier.name} · {currency(tier.price)}
                </div>
              )}
              <div className="seat-row">
                <span className="row-letter">{row}</span>
                {cols.map((c) => {
                  const id = `${row}${c}`;
                  const isTaken = taken.has(id);
                  const isSel = selected.includes(id);
                  return (
                    <span key={id} className="seat-slot">
                      <button
                        type="button"
                        className={`seat ${isTaken ? 'taken' : ''} ${isSel ? 'selected' : ''}`}
                        disabled={isTaken}
                        aria-pressed={isSel}
                        aria-label={`Seat ${id}${isTaken ? ', unavailable' : ''}`}
                        title={isTaken ? 'Sold' : `${id} · ${currency(tier.price)}`}
                        onClick={() => onToggle(id)}
                      >
                        {c}
                      </button>
                      {c === AISLE_AFTER && <span className="aisle" />}
                    </span>
                  );
                })}
                <span className="row-letter">{row}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="legend">
        <span>
          <i className="seat-demo" /> Available
        </span>
        <span>
          <i className="seat-demo selected" /> Selected
        </span>
        <span>
          <i className="seat-demo taken" /> Sold
        </span>
      </div>
    </div>
  );
}
