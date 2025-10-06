import historicalFigureBirthDataRaw from '../../../data/historicalfigure/historical-figure-birth.json';
import { HistoricalFigureBirthData } from './HistoricalFigureBirthData';

/**
 * Loads historical figure birth configuration from a JSON file.
 * @returns A HistoricalFigureBirthData instance containing the configuration.
 */
export function loadHistoricalFigureBirthData(): HistoricalFigureBirthData {
  return HistoricalFigureBirthData.create(historicalFigureBirthDataRaw);
}
