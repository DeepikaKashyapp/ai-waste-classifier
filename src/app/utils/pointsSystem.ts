export interface UserData {
  name: string;
  points: number;
  itemsClassified: number;
  co2Saved: number; // in kg
  weeklyStats: {
    itemsThisWeek: number;
    pointsThisWeek: number;
    co2ThisWeek: number;
  };
}

export const POINTS_PER_CLASSIFICATION = 10;
export const CO2_SAVED_PER_ITEM = 0.5; // kg

export function getUserData(): UserData {
  const stored = localStorage.getItem('zeroWasteUser');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default user data
  const defaultData: UserData = {
    name: 'You',
    points: 0,
    itemsClassified: 0,
    co2Saved: 0,
    weeklyStats: {
      itemsThisWeek: 0,
      pointsThisWeek: 0,
      co2ThisWeek: 0
    }
  };
  
  localStorage.setItem('zeroWasteUser', JSON.stringify(defaultData));
  return defaultData;
}

export function addPoints(points: number = POINTS_PER_CLASSIFICATION): UserData {
  const userData = getUserData();
  userData.points += points;
  userData.itemsClassified += 1;
  userData.co2Saved += CO2_SAVED_PER_ITEM;
  userData.weeklyStats.itemsThisWeek += 1;
  userData.weeklyStats.pointsThisWeek += points;
  userData.weeklyStats.co2ThisWeek += CO2_SAVED_PER_ITEM;
  
  localStorage.setItem('zeroWasteUser', JSON.stringify(userData));
  return userData;
}

export function updateUserName(name: string): UserData {
  const userData = getUserData();
  userData.name = name;
  localStorage.setItem('zeroWasteUser', JSON.stringify(userData));
  return userData;
}

// Mock leaderboard data
export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  itemsClassified: number;
  isCurrentUser?: boolean;
}

export function getLeaderboard(): LeaderboardEntry[] {
  const userData = getUserData();
  
  const mockUsers: Omit<LeaderboardEntry, 'rank'>[] = [
    { name: 'EcoWarrior_2024', points: 1250, itemsClassified: 125 },
    { name: 'GreenQueen', points: 980, itemsClassified: 98 },
    { name: 'RecycleMaster', points: 875, itemsClassified: 87 },
    { name: 'PlanetSaver', points: 720, itemsClassified: 72 },
    { name: 'ZeroWasteZoe', points: 650, itemsClassified: 65 },
    { name: userData.name, points: userData.points, itemsClassified: userData.itemsClassified, isCurrentUser: true },
    { name: 'EarthGuardian', points: 540, itemsClassified: 54 },
    { name: 'SustainableSteve', points: 480, itemsClassified: 48 },
    { name: 'CompostKing', points: 420, itemsClassified: 42 },
    { name: 'TrashTamer', points: 350, itemsClassified: 35 }
  ];
  
  // Sort by points
  const sorted = mockUsers.sort((a, b) => b.points - a.points);
  
  // Add ranks
  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1
  }));
}

export interface RecyclingCenter {
  id: number;
  name: string;
  address: string;
  distance: number; // in km
  types: string[];
  hours: string;
  lat: number;
  lng: number;
}

export function getRecyclingCenters(): RecyclingCenter[] {
  return [
    {
      id: 1,
      name: 'Green Valley Recycling Center',
      address: '123 Eco Street, Green District',
      distance: 1.2,
      types: ['Electronics', 'Batteries', 'Hazardous Materials'],
      hours: 'Mon-Sat: 8AM-6PM',
      lat: 37.7749,
      lng: -122.4194
    },
    {
      id: 2,
      name: 'EcoHub Disposal Facility',
      address: '456 Recycle Road, Sustainability Park',
      distance: 2.5,
      types: ['Paint', 'Chemicals', 'Light Bulbs', 'Motor Oil'],
      hours: 'Mon-Fri: 9AM-5PM',
      lat: 37.7849,
      lng: -122.4094
    },
    {
      id: 3,
      name: 'City Hazardous Waste Center',
      address: '789 Clean Ave, Environmental Zone',
      distance: 3.8,
      types: ['Medications', 'Pesticides', 'Automotive Fluids'],
      hours: 'Tue-Sun: 10AM-4PM',
      lat: 37.7649,
      lng: -122.4294
    },
    {
      id: 4,
      name: 'TechRecycle Solutions',
      address: '321 Digital Drive, Tech Valley',
      distance: 4.2,
      types: ['Computers', 'Phones', 'Tablets', 'Printers'],
      hours: 'Mon-Sat: 10AM-7PM',
      lat: 37.7949,
      lng: -122.3994
    },
    {
      id: 5,
      name: 'Organic Waste Composting Center',
      address: '555 Garden Lane, Organic Hills',
      distance: 5.1,
      types: ['Food Waste', 'Yard Waste', 'Compostables'],
      hours: 'Daily: 7AM-8PM',
      lat: 37.7549,
      lng: -122.4394
    }
  ];
}
