# RoadReady India — 3D Driving Simulator & Complete Indian Road Signs Learning System

An advanced, interactive Indian road safety education platform and 3D driving simulator built with **Next.js App Router**, **TypeScript**, **Three.js / React Three Fiber**, and **Tailwind CSS**.

---

## 🇮🇳 Project Overview

**RoadReady India** bridges official Indian road transport regulations (**IRC:67-2022**, **IRC:35-2015**, **MoRTH**, and the **Motor Vehicles (Amendment) Act 2019**) with an immersive, gamified left-hand traffic 3D simulator, an interactive flashcard system, and official RTO computer test simulations.

---

## 🌟 Key Features

### 1. Source-Verified Indian Road Signs Catalogue
- **42+ Official Indian Road Signs & Markings** meticulously modelled with authentic IRC proportions, official colors, and sharp vector SVG graphics.
- **Multilingual Support**: Fully supported in **English**, **Hindi (हिन्दी)**, and **Mizo (Mizo ṭawng)** with official terms, real-time language switcher, and speech synthesis pronunciation.
  - **A. Mandatory / Regulatory Signs (IRC:67-2022 Sec 8)**: Stop, Give Way, No Entry, One-Way (Ahead & Right), Prohibited in both directions, Right Turn Prohibited, Left Turn Prohibited, U-Turn Prohibited, Overtaking Prohibited, Horn Prohibited (Silence Zone), No Parking, No Stopping / Standing, Speed Limits (30, 40, 50, 60, 80, 100 km/h), Height Limit 3.5m, Width Limit 2m, Gross Vehicle Weight 5T, Compulsory Turn Left/Right, Compulsory Ahead, Compulsory Keep Left, Compulsory Sound Horn, Restriction Ends.
  - **B. Cautionary / Warning Signs (IRC:67-2022 Sec 9)**: Right Hand Curve, Left Hand Curve, Right Hairpin Bend, Left Hairpin Bend, Steep Ascent, Steep Descent, Narrow Road Ahead, Narrow Bridge, Slippery Road, Pedestrian Crossing, School Ahead, Men at Work / Road Works, Cattle Crossing, Speed Breaker / Road Hump, Dangerous Dip, Cross Road, T-Junction, Roundabout Ahead, Traffic Signals Ahead, Guarded Railway Level Crossing, Unguarded Railway Level Crossing (Sec 131 MVA), Falling Rocks / Landslide, Gap in Median.
  - **C. Informatory / Guide Signs (IRC:67-2022 Sec 10)**: Hospital (with Silence Zone protocol), First Aid Post, Petrol Pump, EV Charging Station, Eating Place / Dhaba, Resting Place / Motel, Toll Plaza Ahead (FASTag Rules), Parking Area, National Highway Route Marker (NH 44), Expressway Route Marker (NE-1), Advance Direction Sign, No Through Road (Dead End).
  - **D. Road Markings & Traffic Signals (IRC:35-2015 & MoRTH)**: Broken White Centre Line, Single Solid White Line, Double Solid Yellow Lines, Transverse Stop Line, Zebra Crossing, Yellow Box Junction, Standard 3-Aspect Traffic Signal (Red/Amber/Green), Pedestrian Walk Signal, Retroreflective Road Studs (Cat's Eyes: White, Red, Amber, Green).
- **Comprehensive Metadata per Sign**:
  - Official IRC Code (e.g. `IRC-M01`, `IRC-C14`, `IRC-RM04`)
  - English & Hindi names (e.g. `रुकिए (Rukiye)`, `गति अवरोधक (Gati Avarodhak)`)
  - Official meaning and exact compulsory driver action
  - Real-world Indian road placement & vehicle applicability
  - Specific fine under the **Motor Vehicles (Amendment) Act 2019**
  - Web Speech API integration for audio read-aloud and pronunciation

### 2. Realistic 3D Indian Driving Simulation (Three.js & React Three Fiber)
- **Left-Hand Traffic (LHT)**: Authentic Indian driving conditions where vehicles keep left and overtake on the right.
- **Vehicle Physics**:
  - Realistic acceleration, progressive braking, smooth steering with bicycle kinematics model, reverse gear, and handbrake.
  - Front wheels dynamically steer and spin; rear wheels rotate with drive velocity.
  - Dual headlights with active illumination; taillights glow bright red during deceleration.
  - Dynamic Web Audio API synthesized engine rumble (pitch scales with vehicle speed) and dual-tone Indian horn.
- **Physical Road Features**:
  - Raised 3D asphalt speed humps with yellow chevrons that cause physics bounce if crossed too fast.
  - Solid stop line markings and zebra crosswalks.
  - Yellow-and-black alternating kerb stones.
  - Working 3D traffic light posts with cycling red/amber/green phases.
- **Camera Modes**:
  - 3rd-person chase camera
  - Cockpit / Hood view
  - Top-down tactical overview
- **Real-Time Approach Detection & Violation Engine**:
  - Detects vehicle distance from roadside signs.
  - Displays HUD advisory: *"Approaching: School Ahead — Reduce speed below 30 km/h"*.
  - Detects violations (over-speeding, crossing speed breaker at unsafe speeds, failing to halt at Stop line) and issues real MVA penalty fines.
  - Practice Mode (free exploration without penalties) vs Test Mode (strict 100-point driving score evaluation).

### 3. Interactive Learning Tools & Flashcards
- **Search & Filters**: Real-time search across sign name, code, Hindi translation, meaning, and tags.
- **Quick Filters**: All, Favorites, Learned, Unlearned, and Difficulty tiers.
- **Interactive 3D Flip Flashcards**: Question on front, tap to flip and reveal IRC rule, driver action, and penalty.
- **Progress Tracking**: Tracks mastery percentage and saves bookmarks in `localStorage`.

### 4. RTO Learner's Licence Mock Exam & Certificate
- **Official Mock Exam**: Randomized multiple-choice questions formatted identically to the Indian Parivahan / RTO computer examination.
- **60% Passing Standard**: 12/20 required to pass.
- **Mistake Review**: Re-test incorrect answers until 100% mastery.
- **Official Certificate of Road Sign Mastery**: Printable and downloadable credential with student name, score, issue date, Ashok Chakra watermark seal, and confetti celebration.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **3D Engine** | Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`) |
| **Styling** | Tailwind CSS with custom Indian road palette & glassmorphism |
| **Audio** | Web Audio API (Synthesized engine rumble, horn, violation chime) |
| **Icons** | Lucide React |
| **FX** | Canvas Confetti |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v26.12.0`)
- npm `v10+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Production Build & Deployment Test
```bash
npm run build
npm start
```
The build is optimized and verified with `npm run build` passing with zero errors.

---

## 🎮 Driving Controls

| Key / Action | Desktop Keyboard | Mobile Touch |
|---|---|---|
| **Accelerate** | `W` or `↑ Up Arrow` | Green Gas Pedal |
| **Brake / Reverse** | `S` or `↓ Down Arrow` | Red Brake Pedal |
| **Steer Left** | `A` or `← Left Arrow` | Left D-Pad Button |
| **Steer Right** | `D` or `→ Right Arrow` | Right D-Pad Button |
| **Handbrake** | `Spacebar` | Emergency Stop |
| **Honk Horn** | `H` | Horn Button |
| **Switch Camera** | `C` | Camera Toggle Button |

---

## 📜 Standards & Verification Statement

All signs, dimensions, colors, and legal citations in RoadReady India are verified against:
1. **IRC:67-2022**: *Code of Practice for Road Signs*, Indian Roads Congress.
2. **IRC:35-2015**: *Code of Practice for Road Markings*, Indian Roads Congress.
3. **IRC:99-2018**: *Guidelines on Traffic Calming Measures in Urban Areas*.
4. **Motor Vehicles (Amendment) Act 2019**: Ministry of Road Transport and Highways (MoRTH), Government of India.

---

## 👨‍💻 Creator & Support

- **Design and Developed By**: **Zomuana Sailo**
- **WhatsApp (Tap to Chat)**: [https://wa.me/918730063275](https://wa.me/918730063275) (`+91 8730063275`)
- **Customer & Technical Support**: [https://wa.me/918730063275](https://wa.me/918730063275) (`918730063275`)

