import historicalFigureDataRaw from '../../../data/historicalfigure/historical-figure.json';
import { HistoricalFigureData } from './HistoricalFigureData';

/**
 * Loads historical figure configuration from a JSON file.
 * @returns A HistoricalFigureData instance containing the configuration.
 */
export function loadHistoricalFigureData(): HistoricalFigureData {
  return HistoricalFigureData.create(historicalFigureDataRaw);
}
