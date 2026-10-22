export type RoadSignCategory = 'mandatory' | 'cautionary' | 'informatory' | 'markings_signals';

export type RoadSignSubcategory = 
  | 'control'
  | 'prohibitory'
  | 'parking'
  | 'speed_limit'
  | 'compulsory_direction'
  | 'restriction_ends'
  | 'curves_bends'
  | 'intersections'
  | 'road_hazards'
  | 'crossings'
  | 'railway'
  | 'direction_route'
  | 'facility'
  | 'parking_facility'
  | 'highway_service'
  | 'lane_markings'
  | 'intersection_markings'
  | 'traffic_lights'
  | 'road_studs';

export type SignShape = 
  | 'circle'
  | 'octagon'
  | 'triangle_inverted'
  | 'triangle_up'
  | 'rectangle'
  | 'square'
  | 'shield'
  | 'road_surface';

export type AppLanguage = 'en' | 'hi' | 'mizo';

export interface RoadSign {
  id: string;
  code: string; // Official IRC code e.g. IRC-M01, IRC-C14
  name: string;
  hindiName: string;
  mizoName: string;
  category: RoadSignCategory;
  subcategory: RoadSignSubcategory;
  shape: SignShape;
  colors: string[];
  meaning: string;
  driverAction: string;
  vehicleApplicability: string;
  example: string;
  fineMva?: string; // Motor Vehicles Act 1988 (Amended 2019) penalty
  sourceUrl: string; // IRC standard reference
  verificationStatus: 'IRC:67-2022 Verified' | 'IRC:35-2015 Verified' | 'MoRTH Official' | 'MVA 1988 Schedule';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  quizTags: string[];
  svgType: string; // Identifier for custom vector render
  svgParams?: Record<string, string | number>;
  inGameSpeedLimit?: number; // km/h if applicable
  inGameRule?: 'stop' | 'speed_limit' | 'slow_down' | 'no_turn_left' | 'no_turn_right' | 'no_entry' | 'keep_left' | 'yield';
}

export interface QuizQuestion {
  id: string;
  signId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  fineInfo?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'sign_identification' | 'driver_action' | 'penalty_rule' | 'road_scenario';
}

export interface DrivingViolation {
  id: string;
  timestamp: number;
  signId: string;
  signName: string;
  ruleViolated: string;
  penaltyFine: string;
  explanation: string;
  correctAction: string;
  severity: 'minor' | 'major' | 'critical';
}
