const { DecodeStream, ...r } = require('restructure');

const Header = new r.Struct({
  // 2019
  format: r.uint16le,
  // Game major version - "X.00"
  gameMajorVersion: r.uint8,
  // Game minor version - "1.XX"
  gameMinorVersion: r.uint8,
  // Version of this packet type, all start from 1
  version: r.uint8,
  // Identifier for the packet type, see below
  id: r.uint8,
  // Unique identifier for the session
  sessionUID: new r.Buffer(8),
  // Session timestamp
  sessionTime: r.floatle,
  // Identifier for the frame the data was retrieved on
  frameIdentifier: r.uint32le,
  // Index of player's car in the array
  playerCarIndex: r.uint8
});

// The motion packet gives physics data for all the cars being driven. There is additional data for the car being driven with the goal of being able to drive a motion platform setup.
const Motion = new r.Struct({
  // Header
  header: Header,
  // Data for all cars on track
  carMotionData: new r.Array(
    new r.Struct({
      // World space X position
      worldPositionX: r.floatle,
      // World space Y position
      worldPositionY: r.floatle,
      // World space Z position
      worldPositionZ: r.floatle,
      // Velocity in world space X
      worldVelocityX: r.floatle,
      // Velocity in world space Y
      worldVelocityY: r.floatle,
      // Velocity in world space Z
      worldVelocityZ: r.floatle,
      // World space forward X direction (normalised)
      worldForwardDirX: r.int8,
      // World space forward Y direction (normalised)
      worldForwardDirY: r.int8,
      // World space forward Z direction (normalised)
      worldForwardDirZ: r.int8,
      // World space right X direction (normalised)
      worldRightDirX: r.int8,
      // World space right Y direction (normalised)
      worldRightDirY: r.int8,
      // World space right Z direction (normalised)
      worldRightDirZ: r.int8,
      // Lateral G-Force component
      gForceLateral: r.floatle,
      // Longitudinal G-Force component
      gForceLongitudinal: r.floatle,
      // Vertical G-Force component
      gForceVertical: r.floatle,
      // Yaw angle in radians
      yaw: r.floatle,
      // Pitch angle in radians
      pitch: r.floatle,
      // Roll angle in radians
      roll: r.floatle
    }),
    20
  ),

  // Extra player car ONLY data

  // Note: All wheel arrays have the following order:
  suspensionPosition: new r.Array(r.floatle, 4),
  // RL, RR, FL, FR
  suspensionVelocity: new r.Array(r.floatle, 4),
  // RL, RR, FL, FR
  suspensionAcceleration: new r.Array(r.floatle, 4),
  // Speed of each wheel
  wheelSpeed: new r.Array(r.floatle, 4),
  // Slip ratio for each wheel
  wheelSlip: new r.Array(r.floatle, 4),
  // Velocity in local space
  localVelocityX: r.floatle,
  // Velocity in local space
  localVelocityY: r.floatle,
  // Velocity in local space
  localVelocityZ: r.floatle,
  // Angular velocity x-component
  angularVelocityX: r.floatle,
  // Angular velocity y-component
  angularVelocityY: r.floatle,
  // Angular velocity z-component
  angularVelocityZ: r.floatle,
  // Angular velocity x-component
  angularAccelerationX: r.floatle,
  // Angular velocity y-component
  angularAccelerationY: r.floatle,
  // Angular velocity z-component
  angularAccelerationZ: r.floatle,
  // Current front wheels angle in radians
  frontWheelsAngle: r.floatle
});

// The session packet includes details about the current session in progress.
const Session = new r.Struct({
  // Header
  header: Header,
  // Weather - 0 = clear, 1 = light cloud, 2 = overcast, 3 = light rain, 4 = heavy rain, 5 = storm
  weather: r.uint8,
  // Track temp. in degrees celsius
  trackTemperature: r.int8,
  // Air temp. in degrees celsius
  airTemperature: r.int8,
  // Total number of laps in this race
  totalLaps: r.uint8,
  // Track length in metres
  trackLength: r.uint16le,
  // 0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P, 5 = Q1, 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ, 10 = R, 11 = R2, 12 = Time Trial
  sessionType: r.uint8,
  // -1 for unknown, 0-21 for tracks, see appendix
  trackId: r.int8,
  // Formula, 0 = F1 Modern, 1 = F1 Classic, 2 = F2,
  formula: r.uint8,
  // Time left in session in seconds
  sessionTimeLeft: r.uint16le,
  // Session duration in seconds
  sessionDuration: r.uint16le,
  // Pit speed limit in kilometres per hour
  pitSpeedLimit: r.uint8,
  // Whether the game is paused
  gamePaused: r.uint8,
  // Whether the player is spectating
  isSpectating: r.uint8,
  // Index of the car being spectated
  spectatorCarIndex: r.uint8,
  // SLI Pro support, 0 = inactive, 1 = active
  sliProNativeSupport: r.uint8,
  // Number of marshal zones to follow
  numMarshalZones: r.uint8,
  // List of marshal zones – max 21
  marshalZones: new r.Array(
    new r.Struct({
      // Fraction (0..1) of way through the lap the marshal zone starts
      zoneStart: r.floatle,
      // -1 = invalid/unknown, 0 = none, 1 = green, 2 = blue, 3 = yellow, 4 = red
      zoneFlag: r.int8
    }),
    21
  ),
  // 0 = no safety car, 1 = full safety car, 2 = virtual safety car
  safetyCarStatus: r.uint8,
  // 0 = offline, 1 = online
  networkGame: r.uint8
});

// The lap data packet gives details of all the cars in the session.
const Lap = new r.Struct({
  // Header
  header: Header,
  // Lap data for all cars on track
  lapData: new r.Array(
    new r.Struct({
      // Last lap time in seconds
      lastLapTime: r.floatle,
      // Current time around the lap in seconds
      currentLapTime: r.floatle,
      // Best lap time of the session in seconds
      bestLapTime: r.floatle,
      // Sector 1 time in seconds
      sector1Time: r.floatle,
      // Sector 2 time in seconds
      sector2Time: r.floatle,
      // Distance vehicle is around current lap in metres – could, be negative if line hasn’t been crossed yet
      lapDistance: r.floatle,
      // Total distance travelled in session in metres – could, be negative if line hasn’t been crossed yet
      totalDistance: r.floatle,
      // Delta in seconds for safety car
      safetyCarDelta: r.floatle,
      // Car race position
      carPosition: r.uint8,
      // Current lap number
      currentLapNum: r.uint8,
      // 0 = none, 1 = pitting, 2 = in pit area
      pitStatus: r.uint8,
      // 0 = sector1, 1 = sector2, 2 = sector3
      sector: r.uint8,
      // Current lap invalid - 0 = valid, 1 = invalid
      currentLapInvalid: r.uint8,
      // Accumulated time penalties in seconds to be added
      penalties: r.uint8,
      // Grid position the vehicle started the race in
      gridPosition: r.uint8,
      // Status of driver - 0 = in garage, 1 = flying lap, 2 = in lap, 3 = out lap, 4 = on track
      driverStatus: r.uint8,
      // Result status - 0 = invalid, 1 = inactive, 2 = active, 3 = finished, 4 = disqualified, 5 = not classified. 6 = retired
      resultStatus: r.uint8
    }),
    20
  )
});

// This packet gives details of events that happen during the course of a session.
// | Event             | Code   | Description                            |
// |-------------------|--------|----------------------------------------|
// | Session Started   | “SSTA” | Sent when the session starts           |
// | Session Ended     | “SEND” | Sent when the session ends             |
// | Fastest Lap       | “FTLP” | When a driver achieves the fastest lap |
// | Retirement        | “RTMT” | When a driver retires                  |
// | DRS enabled       | “DRSE” | Race control have enabled DRS          |
// | DRS disabled      | “DRSD” | Race control have disabled DRS         |
// | Team mate in pits | “TMPT” | Your team mate has entered the pits    |
// | Chequered flag    | “CHQF” | The chequered flag has been waved      |
// | Race Winner       | “RCWN” | The race winner is announced           |
const Event = new r.Struct({
  // Header
  header: Header,
  // Event string code, see below
  eventStringCode: new r.String(4),
  // Event details - should be interpreted differently
  eventDetails: new r.Struct({
    vehicleIdx: r.uint8,
    // Lap time is in seconds, if aplicable
    lapTime: r.floatle
  })
});

// This is a list of participants in the race. If the vehicle is controlled by AI, then the name will be the driver name. If this is a multiplayer game, the names will be the Steam Id on PC, or the LAN name if appropriate.
const Participants = new r.Struct({
  // Header
  header: Header,
  // Number of active cars in the data – should match number of cars on HUD
  numActiveCars: r.uint8,
  participants: new r.Array(
    new r.Struct({
      // Whether the vehicle is AI (1) or Human (0) controlled
      aiControlled: r.uint8,
      // Driver id - see appendix
      driverId: r.uint8,
      // Team id - see appendix
      teamId: r.uint8,
      // Race number of the car
      raceNumber: r.uint8,
      // Nationality of the driver
      nationality: r.uint8,
      // Name of participant in UTF-8 format – null terminated Will be truncated with … (U+2026) if too long
      name: new r.String(1),
      // The player's UDP setting, 0 = restricted, 1 = public
      yourTelemetry: r.uint8
    }),
    20
  )
});

// This packet details the car setups for each vehicle in the session. Note that in multiplayer games, other player cars will appear as blank, you will only be able to see your car setup and AI cars.
const CarSetup = new r.Struct({
  // Header
  header: Header,
  carSetups: new r.Array(
    new r.Struct({
      // Front wing aero
      frontWing: r.uint8,
      // Rear wing aero
      rearWing: r.uint8,
      // Differential adjustment on throttle (percentage)
      onThrottle: r.uint8,
      // Differential adjustment off throttle (percentage)
      offThrottle: r.uint8,
      // Front camber angle (suspension geometry)
      frontCamber: r.floatle,
      // Rear camber angle (suspension geometry)
      rearCamber: r.floatle,
      // Front toe angle (suspension geometry)
      frontToe: r.floatle,
      // Rear toe angle (suspension geometry)
      rearToe: r.floatle,
      // Front suspension
      frontSuspension: r.uint8,
      // Rear suspension
      rearSuspension: r.uint8,
      // Front anti-roll bar
      frontAntiRollBar: r.uint8,
      // Front anti-roll bar
      rearAntiRollBar: r.uint8,
      // Front ride height
      frontSuspensionHeight: r.uint8,
      // Rear ride height
      rearSuspensionHeight: r.uint8,
      // Brake pressure (percentage)
      brakePressure: r.uint8,
      // Brake bias (percentage)
      brakeBias: r.uint8,
      // Front tyre pressure (PSI)
      frontTyrePressure: r.floatle,
      // Rear tyre pressure (PSI)
      rearTyrePressure: r.floatle,
      // Ballast
      ballast: r.uint8,
      // Fuel load
      fuelLoad: r.floatle
    }),
    20
  )
});

// This packet details telemetry for all the cars in the race. It details various values that would be recorded on the car such as speed, throttle application, DRS etc.
const CarTelemetry = new r.Struct({
  // Header
  header: Header,
  carTelemetryData: new r.Array(
    new r.Struct({
      // Speed of car in kilometres per hour
      speed: r.uint16le,
      // Amount of throttle applied (0.0 to 1.0)
      throttle: r.floatle,
      // Steering (-1.0 (full lock left) to 1.0 (full lock right))
      steer: r.floatle,
      // Amount of brake applied (0.0 to 1.0)
      brake: r.floatle,
      // Amount of clutch applied (0 to 100)
      clutch: r.uint8,
      // Gear selected (1-8, N=0, R=-1)
      gear: r.int8,
      // Engine RPM
      engineRPM: r.uint16le,
      // 0 = off, 1 = on
      drs: r.uint8,
      // Rev lights indicator (percentage)
      revLightsPercent: r.uint8,
      // Brakes temperature (celsius)
      brakesTemperature: new r.Array(r.uint16le, 4),
      // Tyres surface temperature (celsius)
      tyresSurfaceTemperature: new r.Array(r.uint16le, 4),
      // Tyres inner temperature (celsius)
      tyresInnerTemperature: new r.Array(r.uint16le, 4),
      // Engine temperature (celsius)
      engineTemperature: r.uint16le,
      // Tyres pressure (PSI)
      tyresPressure: new r.Array(r.floatle, 4),
      // Driving surface, see appendices
      surfaceType: new r.Array(r.uint8, 4)
    }),
    20
  ),
  // Bit flags specifying which buttons are being pressed currently - see appendices
  buttonStatus: r.uint32le
});

// This packet details telemetry for all the cars in the race. It details various values that would be recorded on the car such as speed, throttle application, DRS etc.
const CarStatus = new r.Struct({
  // Header
  header: Header,
  carStatusData: new r.Array(
    new r.Struct({
      // 0 (off) - 2 (high)
      tractionControl: r.uint8,
      // 0 (off) - 1 (on)
      antiLockBrakes: r.uint8,
      // Fuel mix - 0 = lean, 1 = standard, 2 = rich, 3 = max
      fuelMix: r.uint8,
      // Front brake bias (percentage)
      frontBrakeBias: r.uint8,
      // Pit limiter status - 0 = off, 1 = on
      pitLimiterStatus: r.uint8,
      // Current fuel mass
      fuelInTank: r.floatle,
      // Fuel capacity
      fuelCapacity: r.floatle,
      // Fuel remaining in terms of laps (value on MFD)
      fuelRemainingLaps: r.floatle,
      // Cars max RPM, point of rev limiter
      maxRPM: r.uint16le,
      // Cars idle RPM
      idleRPM: r.uint16le,
      // Maximum number of gears
      maxGears: r.uint8,
      // 0 = not allowed, 1 = allowed, -1 = unknown
      drsAllowed: r.uint8,
      // Tyre wear percentage
      tyresWear: r.uint8,
      // F1 Modern - 16 = C5, 17 = C4, 18 = C3, 19 = C2, 20 = C1, 7 = inter, 8 = wet, F1 Classic - 9 = dry, 10 = wet, F2 – 11 = super soft, 12 = soft, 13 = medium, 14 = hard, 15 = wet
      actualTyreCompound: r.uint8,
      // F1 visual (can be different from actual compound), 16 = soft, 17 = medium, 18 = hard, 7 = inter, 8 = wet, F1 Classic – same as above, F2 – same as above
      tyreVisualCompound: r.uint8,
      // Tyre damage (percentage)
      tyresDamage: r.uint8,
      // Front left wing damage (percentage)
      frontLeftWingDamage: r.uint8,
      // Front right wing damage (percentage)
      frontRightWingDamage: r.uint8,
      // Rear wing damage (percentage)
      rearWingDamage: r.uint8,
      // Engine damage (percentage)
      engineDamage: r.uint8,
      // Gear box damage (percentage)
      gearBoxDamage: r.uint8,
      // -1 = invalid/unknown, 0 = none, 1 = green, 2 = blue, 3 = yellow, 4 = red
      vehicleFiaFlags: r.int8,
      // ERS energy store in Joules
      ersStoreEnergy: r.floatle,
      // ERS deployment mode, 0 = none, 1 = low, 2 = medium, 3 = high, 4 = overtake, 5 = hotlap
      ersDeployMode: r.uint8,
      // ERS energy harvested this lap by MGU-K
      ersHarvestedThisLapMGUK: r.floatle,
      // ERS energy harvested this lap by MGU-H
      ersHarvestedThisLapMGUH: r.floatle,
      // ERS energy deployed this lap
      ersDeployedThisLap: r.floatle
    }),
    20
  )
});

const Packets = {
  // Contains all motion data for player’s car – only sent while player is in control
  0: Motion,
  // Data about the session – track, time left
  1: Session,
  // Data about all the lap times of cars in the session
  2: Lap,
  // Various notable events that happen during a session
  3: Event,
  // List of participants in the session, mostly relevant for multiplayer
  4: Participants,
  // Packet detailing car setups for cars in the race
  5: CarSetup,
  // Telemetry data for all cars
  6: CarTelemetry,
  // Status data for all cars such as damage
  7: CarStatus
};

module.exports = msg => {
  const { id } = Header.decode(new DecodeStream(msg));
  return Packets[id] ? Packets[id].decode(new DecodeStream(msg)) : null;
};
