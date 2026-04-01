/**
 * UK City Coordinates Lookup
 * Pre-defined coordinates for common UK cities so Hope Map entries
 * can reference city names instead of manually entering lng/lat.
 * MapLibre uses [lng, lat] order.
 */

export interface Coordinates {
    lng: number;
    lat: number;
}

export const ukCities: Record<string, Coordinates> = {
    "London": { lng: -0.1276, lat: 51.5074 },
    "Manchester": { lng: -2.2426, lat: 53.4808 },
    "Birmingham": { lng: -1.8904, lat: 52.4862 },
    "Leeds": { lng: -1.5491, lat: 53.8008 },
    "Glasgow": { lng: -4.2518, lat: 55.8642 },
    "Edinburgh": { lng: -3.1883, lat: 55.9533 },
    "Liverpool": { lng: -2.9916, lat: 53.4084 },
    "Bristol": { lng: -2.5879, lat: 51.4545 },
    "Sheffield": { lng: -1.4701, lat: 53.3811 },
    "Newcastle upon Tyne": { lng: -1.6178, lat: 54.9783 },
    "Nottingham": { lng: -1.1581, lat: 52.9548 },
    "Southampton": { lng: -1.4044, lat: 50.9097 },
    "Cardiff": { lng: -3.1791, lat: 51.4816 },
    "Belfast": { lng: -5.9301, lat: 54.5973 },
    "Leicester": { lng: -1.1398, lat: 52.6369 },
    "Coventry": { lng: -1.5197, lat: 52.4068 },
    "Bradford": { lng: -1.7594, lat: 53.7960 },
    "Brighton": { lng: -0.1363, lat: 50.8225 },
    "Plymouth": { lng: -4.1427, lat: 50.3755 },
    "Wolverhampton": { lng: -2.1266, lat: 52.5870 },
    "Aberdeen": { lng: -2.0943, lat: 57.1497 },
    "Dundee": { lng: -2.9707, lat: 56.4620 },
    "Swansea": { lng: -3.9436, lat: 51.6214 },
    "Oxford": { lng: -1.2578, lat: 51.7520 },
    "Cambridge": { lng: 0.1218, lat: 52.2053 },
    "York": { lng: -1.0827, lat: 53.9600 },
    "Bath": { lng: -2.3597, lat: 51.3811 },
    "Exeter": { lng: -3.5339, lat: 50.7184 },
    "Norwich": { lng: 1.2993, lat: 52.6309 },
    "Derby": { lng: -1.4746, lat: 52.9225 },
    "Sunderland": { lng: -1.3812, lat: 54.9069 },
    "Middlesbrough": { lng: -1.2355, lat: 54.5742 },
    "Stoke-on-Trent": { lng: -2.1753, lat: 53.0027 },
    "Luton": { lng: -0.4217, lat: 51.8787 },
    "Peterborough": { lng: -0.2405, lat: 52.5695 },
    "Ipswich": { lng: 1.1557, lat: 52.0567 },
    "Inverness": { lng: -4.2246, lat: 57.4778 },
};

/**
 * Get coordinates for a UK city by name.
 * Returns undefined if the city is not in the lookup.
 */
export function getCityCoordinates(city: string): Coordinates | undefined {
    return ukCities[city];
}
