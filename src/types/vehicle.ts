export type VehicleType = 'hatchback' | 'auto_rickshaw' | 'truck' | 'r15_bike';

export interface VehicleConfig {
  id: VehicleType;
  name: string;
  hindiName: string;
  mizoName: string;
  tagline: string;
  maxSpeedKmH: number;
  accelRate: number; // m/s²
  brakeRate: number; // m/s²
  steerSpeed: number;
  maxSteerAngle: number;
  wheelBase: number;
  hornType: 'car' | 'rickshaw' | 'truck' | 'bike';
  primaryColor: string;
  secondaryColor: string;
  cameraSettings: {
    thirdPersonDist: number;
    thirdPersonHeight: number;
    hoodHeight: number;
    hoodZ: number;
  };
  specs: {
    speedStars: number; // 1-5
    accelStars: number;
    handlingStars: number;
    capacity: string;
    engineType: string;
  };
}

export const VEHICLE_CONFIGS: Record<VehicleType, VehicleConfig> = {
  hatchback: {
    id: 'hatchback',
    name: 'RoadReady Hatchback',
    hindiName: 'हैचबैक कार',
    mizoName: 'Motor Car Pangngai',
    tagline: 'Balanced Indian Learner Vehicle (Swift / Dzire Spec)',
    maxSpeedKmH: 90,
    accelRate: 12,
    brakeRate: 22,
    steerSpeed: 2.5,
    maxSteerAngle: 0.52,
    wheelBase: 2.4,
    hornType: 'car',
    primaryColor: '#0284C7',
    secondaryColor: '#FF9933',
    cameraSettings: {
      thirdPersonDist: 6.5,
      thirdPersonHeight: 3.2,
      hoodHeight: 1.2,
      hoodZ: 0.4,
    },
    specs: {
      speedStars: 4,
      accelStars: 4,
      handlingStars: 4,
      capacity: '5 Seater',
      engineType: '1.2L Petrol / EV',
    },
  },
  auto_rickshaw: {
    id: 'auto_rickshaw',
    name: 'Desi Auto-Rickshaw (Tuk-Tuk)',
    hindiName: 'ऑटो-रिक्शा (टुक-टुक)',
    mizoName: 'Auto-Rickshaw (Tuk-Tuk)',
    tagline: 'Iconic Yellow & Green 3-Wheeler with Ultra-Sharp Turns',
    maxSpeedKmH: 60,
    accelRate: 14, // Snappy low-end acceleration
    brakeRate: 24,
    steerSpeed: 3.8, // Very agile
    maxSteerAngle: 0.65, // Sharp turning angle
    wheelBase: 1.9,
    hornType: 'rickshaw',
    primaryColor: '#15803D', // Indian Rickshaw Green
    secondaryColor: '#EAB308', // Indian Rickshaw Yellow
    cameraSettings: {
      thirdPersonDist: 5.2,
      thirdPersonHeight: 2.7,
      hoodHeight: 1.3,
      hoodZ: 0.3,
    },
    specs: {
      speedStars: 3,
      accelStars: 4,
      handlingStars: 5,
      capacity: '3 Passengers + Driver',
      engineType: '200cc CNG / LPG',
    },
  },
  truck: {
    id: 'truck',
    name: 'Indian Highway Truck (Tata 1612)',
    hindiName: 'भारतीय हाईवे ट्रक (हॉर्न ओके प्लीज)',
    mizoName: 'Truck Lian (Horn OK Please)',
    tagline: 'Heavy 6-Wheeler with Musical Air Horn & "Horn OK Please" Art',
    maxSpeedKmH: 75,
    accelRate: 7.5, // Heavier momentum
    brakeRate: 17,
    steerSpeed: 1.7, // Steady, slower steering
    maxSteerAngle: 0.42,
    wheelBase: 3.6,
    hornType: 'truck',
    primaryColor: '#EA580C', // Traditional Truck Orange
    secondaryColor: '#16A34A', // Decorative Green
    cameraSettings: {
      thirdPersonDist: 8.8,
      thirdPersonHeight: 4.6,
      hoodHeight: 2.2,
      hoodZ: 0.8,
    },
    specs: {
      speedStars: 3,
      accelStars: 2,
      handlingStars: 2,
      capacity: '16 Ton Payload',
      engineType: 'Turbocharged Diesel',
    },
  },
  r15_bike: {
    id: 'r15_bike',
    name: 'Yamaha YZF-R15 V4 SuperSport',
    hindiName: 'यामाहा R15 V4 सुपरस्पोर्ट बाइक',
    mizoName: 'Yamaha R15 V4 Bike Chak',
    tagline: '155cc VVA Liquid-Cooled, Golden USD Forks & Racing Lean Physics',
    maxSpeedKmH: 135,
    accelRate: 18, // Fastest acceleration
    brakeRate: 26,
    steerSpeed: 3.4,
    maxSteerAngle: 0.55,
    wheelBase: 1.35,
    hornType: 'bike',
    primaryColor: '#0033CC', // Yamaha Racing Blue
    secondaryColor: '#EAB308', // Gold USD Forks
    cameraSettings: {
      thirdPersonDist: 4.6,
      thirdPersonHeight: 2.2,
      hoodHeight: 1.1,
      hoodZ: 0.3,
    },
    specs: {
      speedStars: 5,
      accelStars: 5,
      handlingStars: 5,
      capacity: '2 Seater (Rider + Pillion)',
      engineType: '155cc 4-Valve SOHC VVA',
    },
  },
};
