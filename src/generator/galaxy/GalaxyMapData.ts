/**
 * Output structure for generated galaxy map data.
 */
export interface GalaxyMapData {
    sectors: {
        id: string;
        name: string;
        position: {
            x: number;
            y: number;
            z: number;
        };
    }[];
}
