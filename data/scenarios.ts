export type Category = 'traffic-lights' | 'signs' | 'pedestrians' | 'right-of-way' | 'hazards' | 'parking';

export interface ScenarioOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Scenario {
  id: string;
  category: Category;
  level: 1 | 2 | 3 | 4;
  question: string;
  image?: string;
  options: ScenarioOption[];
  correctExplanation: string;
  realWorldTip: string;
  xp: number;
}

export const SCENARIOS: Scenario[] = [
  // Traffic Lights - Level 1
  {
    id: 'tl-001',
    category: 'traffic-lights',
    level: 1,
    question: 'You approach a traffic light that just turned yellow. What should you do?',
    options: [
      { text: 'Speed up to make it through', isCorrect: false, explanation: 'Speeding up through a yellow light is dangerous and can lead to running a red light or causing an accident.' },
      { text: 'Stop if you can do so safely', isCorrect: true },
      { text: 'Always stop immediately', isCorrect: false, explanation: 'Stopping abruptly can cause a rear-end collision if you\'re too close to the intersection.' },
      { text: 'Honk and proceed', isCorrect: false, explanation: 'Honking doesn\'t make it safe to proceed through a yellow light.' },
    ],
    correctExplanation: 'When a light turns yellow, you should stop if you can do so safely. Only proceed if stopping would be dangerous (e.g., if you\'re too close to the intersection).',
    realWorldTip: 'The "point of no return" is typically when you\'re 2-3 seconds away from the intersection. If you can\'t stop safely, proceed with caution.',
    xp: 25,
  },
  {
    id: 'tl-002',
    category: 'traffic-lights',
    level: 1,
    question: 'What does a flashing yellow traffic light mean?',
    options: [
      { text: 'Stop completely', isCorrect: false, explanation: 'A flashing yellow does not require a complete stop like a red light.' },
      { text: 'Proceed with caution', isCorrect: true },
      { text: 'Speed up', isCorrect: false, explanation: 'Never speed up at any traffic signal - this is dangerous.' },
      { text: 'Treat it like a stop sign', isCorrect: false, explanation: 'Flashing yellow means caution, not stop. Flashing red means stop.' },
    ],
    correctExplanation: 'A flashing yellow light means proceed with caution. Slow down and be prepared to yield to other traffic or pedestrians.',
    realWorldTip: 'Flashing yellow lights are often used at intersections during off-peak hours or when traffic signals malfunction.',
    xp: 20,
  },
  {
    id: 'tl-003',
    category: 'traffic-lights',
    level: 2,
    question: 'What does a flashing red traffic light mean?',
    options: [
      { text: 'Slow down and proceed', isCorrect: false, explanation: 'Flashing red requires a complete stop, not just slowing down.' },
      { text: 'Treat it as a stop sign', isCorrect: true },
      { text: 'Proceed with caution', isCorrect: false, explanation: 'That\'s for flashing yellow. Flashing red means stop.' },
      { text: 'Yield to traffic', isCorrect: false, explanation: 'You must stop completely, not just yield.' },
    ],
    correctExplanation: 'A flashing red light means the same as a stop sign - come to a complete stop, check for traffic, then proceed when safe.',
    realWorldTip: 'Flashing red lights are common when traffic signals malfunction or at dangerous intersections.',
    xp: 30,
  },
  {
    id: 'tl-004',
    category: 'traffic-lights',
    level: 2,
    question: 'You\'re at a red light and want to turn right. What should you do?',
    options: [
      { text: 'Turn right without stopping', isCorrect: false, explanation: 'You must always stop at a red light, even when turning right.' },
      { text: 'Stop, check for traffic and signs, then turn if safe', isCorrect: true },
      { text: 'Wait for green light', isCorrect: false, explanation: 'Right on red is legal in most places unless posted otherwise.' },
      { text: 'Honk and turn', isCorrect: false, explanation: 'Honking doesn\'t make it safe or legal to turn without stopping.' },
    ],
    correctExplanation: 'In most places, you can turn right on red after stopping completely and checking for traffic, unless a sign prohibits it.',
    realWorldTip: 'Always look for "No Turn on Red" signs. Yield to pedestrians and oncoming traffic before turning.',
    xp: 30,
  },
  {
    id: 'tl-005',
    category: 'traffic-lights',
    level: 3,
    question: 'A green arrow appears while the main light is red. What does this mean?',
    options: [
      { text: 'Wait for the main light to turn green', isCorrect: false, explanation: 'The green arrow gives you right-of-way for that direction.' },
      { text: 'You can proceed in the direction of the arrow', isCorrect: true },
      { text: 'Proceed straight only', isCorrect: false, explanation: 'The arrow indicates the specific direction you can go.' },
      { text: 'It\'s a malfunction', isCorrect: false, explanation: 'This is a normal protected turn signal.' },
    ],
    correctExplanation: 'A green arrow means you have a protected turn - oncoming traffic has a red light. You can proceed in the arrow\'s direction.',
    realWorldTip: 'Green arrows are "protected" turns - you have right-of-way. But still check for pedestrians and vehicles running red lights.',
    xp: 35,
  },

  // Signs - Level 1
  {
    id: 'sg-001',
    category: 'signs',
    level: 1,
    question: 'You arrive at a 4-way stop at the same time as another car to your right. Who goes first?',
    options: [
      { text: 'You go first', isCorrect: false },
      { text: 'The car on your right goes first', isCorrect: true },
      { text: 'Whoever honks first', isCorrect: false },
      { text: 'The larger vehicle', isCorrect: false },
    ],
    correctExplanation: 'At a 4-way stop, when two vehicles arrive simultaneously, the driver on the LEFT must yield to the driver on the RIGHT.',
    realWorldTip: 'Always make eye contact with other drivers to confirm who\'s going first. When in doubt, be courteous and let the other driver go.',
    xp: 25,
  },
  {
    id: 'sg-002',
    category: 'signs',
    level: 1,
    question: 'What does a yield sign require you to do?',
    options: [
      { text: 'Stop completely', isCorrect: false },
      { text: 'Slow down and give right-of-way to other traffic', isCorrect: true },
      { text: 'Proceed without slowing', isCorrect: false },
      { text: 'Honk before proceeding', isCorrect: false },
    ],
    correctExplanation: 'A yield sign means you must slow down and be prepared to stop if necessary to give the right-of-way to other vehicles or pedestrians.',
    realWorldTip: 'Unlike a stop sign, you don\'t have to stop if the way is clear. But you must be ready to stop if needed.',
    xp: 20,
  },

  // Pedestrians - Level 1
  {
    id: 'pd-001',
    category: 'pedestrians',
    level: 1,
    question: 'A pedestrian is waiting at a crosswalk. What should you do?',
    options: [
      { text: 'Speed up to pass before they cross', isCorrect: false },
      { text: 'Stop and let them cross', isCorrect: true },
      { text: 'Honk to warn them', isCorrect: false },
      { text: 'Slow down but don\'t stop', isCorrect: false },
    ],
    correctExplanation: 'You must stop and yield to pedestrians at crosswalks. Pedestrians always have the right-of-way in marked or unmarked crosswalks.',
    realWorldTip: 'Make eye contact with pedestrians and wave them across to show you\'re yielding. Never pass a stopped vehicle at a crosswalk.',
    xp: 30,
  },
  {
    id: 'pd-002',
    category: 'pedestrians',
    level: 1,
    question: 'You\'re in a school zone during school hours. What should you do?',
    options: [
      { text: 'Drive at normal speed', isCorrect: false },
      { text: 'Reduce speed to the posted school zone limit', isCorrect: true },
      { text: 'Only slow down if you see children', isCorrect: false },
      { text: 'Honk to warn children', isCorrect: false },
    ],
    correctExplanation: 'School zones have reduced speed limits during school hours (typically 15-25 mph). You must obey these limits whether or not you see children.',
    realWorldTip: 'School zone hours are usually posted on signs. Common times are 7-9 AM and 2-4 PM on school days.',
    xp: 30,
  },

  // Right of Way - Level 2
  {
    id: 'rw-001',
    category: 'right-of-way',
    level: 2,
    question: 'You\'re turning left at an intersection. An oncoming car is going straight. Who has the right-of-way?',
    options: [
      { text: 'You do, because you\'re already turning', isCorrect: false },
      { text: 'The oncoming car going straight', isCorrect: true },
      { text: 'Whoever gets there first', isCorrect: false },
      { text: 'Neither, you both stop', isCorrect: false },
    ],
    correctExplanation: 'When turning left, you must yield to oncoming traffic going straight or turning right. Wait for a safe gap before completing your turn.',
    realWorldTip: 'Never assume oncoming traffic will slow down for you. Wait until you have a clear, safe gap before turning.',
    xp: 35,
  },
  {
    id: 'rw-002',
    category: 'right-of-way',
    level: 2,
    question: 'You\'re merging onto a highway. Who has the right-of-way?',
    options: [
      { text: 'You do, because you\'re merging', isCorrect: false },
      { text: 'Traffic already on the highway', isCorrect: true },
      { text: 'Whoever is going faster', isCorrect: false },
      { text: 'The larger vehicle', isCorrect: false },
    ],
    correctExplanation: 'Traffic already on the highway has the right-of-way. You must adjust your speed and find a safe gap to merge.',
    realWorldTip: 'Use the acceleration lane to match the speed of highway traffic. Signal early and look for a gap.',
    xp: 35,
  },

  // Hazards - Level 2
  {
    id: 'hz-001',
    category: 'hazards',
    level: 2,
    question: 'You see a deer on the side of the road ahead. What should you do?',
    options: [
      { text: 'Swerve to avoid it', isCorrect: false },
      { text: 'Slow down and be prepared to stop', isCorrect: true },
      { text: 'Speed up to pass quickly', isCorrect: false },
      { text: 'Honk continuously', isCorrect: false },
    ],
    correctExplanation: 'When you see an animal near the road, slow down and be prepared to stop. Swerving can cause you to lose control or hit another vehicle.',
    realWorldTip: 'Animals often travel in groups. If you see one, there may be more nearby. Deer are most active at dawn and dusk.',
    xp: 40,
  },
  {
    id: 'hz-002',
    category: 'hazards',
    level: 2,
    question: 'The road is wet and it just started raining. How should you adjust your driving?',
    options: [
      { text: 'Drive normally', isCorrect: false },
      { text: 'Reduce speed and increase following distance', isCorrect: true },
      { text: 'Speed up to get home faster', isCorrect: false },
      { text: 'Turn on hazard lights', isCorrect: false },
    ],
    correctExplanation: 'Wet roads reduce traction. Reduce your speed and increase following distance to at least 4-5 seconds. The first rain after a dry spell is especially slippery.',
    realWorldTip: 'Roads are most slippery during the first 10-15 minutes of rain when oil and debris mix with water.',
    xp: 40,
  },

  // Parking - Level 1
  {
    id: 'pk-001',
    category: 'parking',
    level: 1,
    question: 'When parallel parking on a hill facing uphill with a curb, which way should you turn your wheels?',
    options: [
      { text: 'Toward the curb', isCorrect: false },
      { text: 'Away from the curb', isCorrect: true },
      { text: 'Straight ahead', isCorrect: false },
      { text: 'It doesn\'t matter', isCorrect: false },
    ],
    correctExplanation: 'When parking uphill with a curb, turn your wheels AWAY from the curb. If the car rolls backward, the back of the tire will hit the curb and stop the car.',
    realWorldTip: 'Remember: Uphill = away from curb. Downhill = toward the curb. No curb = toward the edge of the road.',
    xp: 25,
  },
  {
    id: 'pk-002',
    category: 'parking',
    level: 1,
    question: 'How far from a fire hydrant must you park?',
    options: [
      { text: '5 feet', isCorrect: false, explanation: '5 feet is too close - firefighters need more room.' },
      { text: '10 feet', isCorrect: false, explanation: '10 feet is still too close for emergency access.' },
      { text: '15 feet', isCorrect: true },
      { text: '20 feet', isCorrect: false, explanation: 'While safe, 15 feet is the legal minimum.' },
    ],
    correctExplanation: 'You must park at least 15 feet away from a fire hydrant. This ensures firefighters have room to access the hydrant in an emergency.',
    realWorldTip: 'Parking too close to a fire hydrant can result in a ticket and your car being towed, even in an emergency.',
    xp: 20,
  },

  // Additional Signs Scenarios
  {
    id: 'sg-003',
    category: 'signs',
    level: 2,
    question: 'What does a diamond-shaped yellow sign indicate?',
    options: [
      { text: 'Regulatory information', isCorrect: false, explanation: 'Regulatory signs are usually white rectangles or red circles.' },
      { text: 'Warning of road conditions ahead', isCorrect: true },
      { text: 'Construction zone', isCorrect: false, explanation: 'Construction signs are usually orange.' },
      { text: 'School zone', isCorrect: false, explanation: 'School zones use pentagon-shaped signs.' },
    ],
    correctExplanation: 'Diamond-shaped yellow signs are warning signs that alert you to potential hazards or changes in road conditions ahead.',
    realWorldTip: 'Yellow diamond signs include warnings for curves, merges, pedestrian crossings, and animal crossings.',
    xp: 25,
  },
  {
    id: 'sg-004',
    category: 'signs',
    level: 2,
    question: 'What should you do when you see a "Do Not Enter" sign?',
    options: [
      { text: 'Proceed with caution', isCorrect: false, explanation: 'Do Not Enter means exactly that - you cannot enter.' },
      { text: 'Do not enter that roadway', isCorrect: true },
      { text: 'Enter only if no traffic', isCorrect: false, explanation: 'Never enter - it\'s usually a one-way street going the wrong way.' },
      { text: 'Slow down and enter', isCorrect: false, explanation: 'This is dangerous and illegal.' },
    ],
    correctExplanation: 'A "Do Not Enter" sign means you must not drive on that road. It\'s often placed at the entrance of one-way streets or exit ramps.',
    realWorldTip: 'These signs prevent wrong-way driving which can cause head-on collisions. Always obey them.',
    xp: 30,
  },
  {
    id: 'sg-005',
    category: 'signs',
    level: 3,
    question: 'What does a pennant-shaped yellow sign mean?',
    options: [
      { text: 'School zone ahead', isCorrect: false, explanation: 'School zones use pentagon signs.' },
      { text: 'No passing zone', isCorrect: true },
      { text: 'Merge ahead', isCorrect: false, explanation: 'Merge signs are diamond-shaped.' },
      { text: 'Construction zone', isCorrect: false, explanation: 'Construction signs are orange.' },
    ],
    correctExplanation: 'A pennant-shaped (triangular) yellow sign marks the beginning of a no-passing zone. Do not pass other vehicles when you see this sign.',
    realWorldTip: 'No-passing zones are marked for safety - usually on hills, curves, or areas with limited visibility.',
    xp: 30,
  },

  // Additional Pedestrian Scenarios
  {
    id: 'pd-003',
    category: 'pedestrians',
    level: 2,
    question: 'A pedestrian with a white cane is crossing the street. What should you do?',
    options: [
      { text: 'Honk to alert them', isCorrect: false, explanation: 'Honking can startle and confuse a blind pedestrian.' },
      { text: 'Stop and wait until they have completely crossed', isCorrect: true },
      { text: 'Proceed slowly around them', isCorrect: false, explanation: 'Never proceed - they may not hear you coming.' },
      { text: 'Flash your lights', isCorrect: false, explanation: 'A white cane indicates blindness - lights won\'t help.' },
    ],
    correctExplanation: 'A white cane indicates the pedestrian is blind or visually impaired. Always stop and wait until they have completely crossed the street.',
    realWorldTip: 'Never honk at blind pedestrians - it can disorient them. Be patient and give them plenty of time.',
    xp: 35,
  },
  {
    id: 'pd-004',
    category: 'pedestrians',
    level: 2,
    question: 'You\'re turning right at an intersection. Pedestrians are crossing. Who has the right-of-way?',
    options: [
      { text: 'You do, because you\'re turning', isCorrect: false, explanation: 'Pedestrians always have right-of-way in crosswalks.' },
      { text: 'The pedestrians', isCorrect: true },
      { text: 'Whoever gets there first', isCorrect: false, explanation: 'Pedestrians always have priority.' },
      { text: 'Neither, both must wait', isCorrect: false, explanation: 'Pedestrians have the right to cross.' },
    ],
    correctExplanation: 'Pedestrians in crosswalks always have the right-of-way, even when you\'re turning. You must wait for them to cross.',
    realWorldTip: 'Before turning, always check the crosswalk for pedestrians, even if you have a green light.',
    xp: 30,
  },
  {
    id: 'pd-005',
    category: 'pedestrians',
    level: 3,
    question: 'You see children playing near the road. What should you do?',
    options: [
      { text: 'Maintain your speed', isCorrect: false, explanation: 'Children are unpredictable - always slow down.' },
      { text: 'Slow down and be prepared to stop', isCorrect: true },
      { text: 'Honk to warn them', isCorrect: false, explanation: 'Honking might startle them into the road.' },
      { text: 'Speed up to pass quickly', isCorrect: false, explanation: 'This is extremely dangerous.' },
    ],
    correctExplanation: 'When you see children near the road, slow down and be prepared to stop. Children can be unpredictable and may run into the street.',
    realWorldTip: 'Children may not understand traffic dangers. Always assume they might run into the road without looking.',
    xp: 35,
  },

  // Additional Right-of-Way Scenarios
  {
    id: 'rw-003',
    category: 'right-of-way',
    level: 2,
    question: 'At an uncontrolled intersection (no signs/signals), who has the right-of-way?',
    options: [
      { text: 'The larger vehicle', isCorrect: false, explanation: 'Vehicle size doesn\'t determine right-of-way.' },
      { text: 'The vehicle on the right', isCorrect: true },
      { text: 'The faster vehicle', isCorrect: false, explanation: 'Speed doesn\'t determine right-of-way.' },
      { text: 'Whoever arrives first', isCorrect: false, explanation: 'If arriving simultaneously, yield to the right.' },
    ],
    correctExplanation: 'At an uncontrolled intersection, the vehicle on the right has the right-of-way when two vehicles arrive at the same time.',
    realWorldTip: 'Slow down at uncontrolled intersections and be prepared to yield, even if you have the right-of-way.',
    xp: 35,
  },
  {
    id: 'rw-004',
    category: 'right-of-way',
    level: 3,
    question: 'An emergency vehicle with lights and sirens is approaching from behind. What should you do?',
    options: [
      { text: 'Stop immediately where you are', isCorrect: false, explanation: 'Stopping in traffic can block the emergency vehicle.' },
      { text: 'Pull to the right and stop', isCorrect: true },
      { text: 'Speed up to get out of the way', isCorrect: false, explanation: 'Never speed up - pull over instead.' },
      { text: 'Change lanes to the left', isCorrect: false, explanation: 'Always pull to the right for emergency vehicles.' },
    ],
    correctExplanation: 'When an emergency vehicle approaches with lights and sirens, pull to the right side of the road and stop until it passes.',
    realWorldTip: 'Emergency vehicles need clear passage. Pulling right is standard procedure in most areas.',
    xp: 40,
  },
  {
    id: 'rw-005',
    category: 'right-of-way',
    level: 3,
    question: 'You\'re at a roundabout. Who has the right-of-way?',
    options: [
      { text: 'You do, entering the roundabout', isCorrect: false, explanation: 'Vehicles already in the roundabout have priority.' },
      { text: 'Traffic already in the roundabout', isCorrect: true },
      { text: 'The larger vehicle', isCorrect: false, explanation: 'Size doesn\'t matter in roundabouts.' },
      { text: 'Whoever is going faster', isCorrect: false, explanation: 'Speed doesn\'t determine right-of-way.' },
    ],
    correctExplanation: 'Vehicles already circulating in the roundabout have the right-of-way. Yield to traffic from the left before entering.',
    realWorldTip: 'Slow down, yield to traffic in the circle, and enter when there\'s a safe gap.',
    xp: 35,
  },

  // Additional Hazard Scenarios
  {
    id: 'hz-003',
    category: 'hazards',
    level: 2,
    question: 'You encounter fog that limits visibility. What should you do?',
    options: [
      { text: 'Use high beams', isCorrect: false, explanation: 'High beams reflect off fog and reduce visibility.' },
      { text: 'Use low beams and slow down', isCorrect: true },
      { text: 'Use hazard lights while driving', isCorrect: false, explanation: 'Hazard lights are for stopped vehicles.' },
      { text: 'Speed up to get through quickly', isCorrect: false, explanation: 'This is extremely dangerous in fog.' },
    ],
    correctExplanation: 'In fog, use low beams (not high beams) and reduce your speed. High beams reflect off fog and make visibility worse.',
    realWorldTip: 'If fog is too thick, pull off the road completely and wait for it to clear.',
    xp: 40,
  },
  {
    id: 'hz-004',
    category: 'hazards',
    level: 3,
    question: 'Your car starts to hydroplane on wet roads. What should you do?',
    options: [
      { text: 'Brake hard', isCorrect: false, explanation: 'Braking hard can make hydroplaning worse.' },
      { text: 'Ease off the gas and steer straight', isCorrect: true },
      { text: 'Accelerate to regain traction', isCorrect: false, explanation: 'Accelerating will make you lose more control.' },
      { text: 'Turn the wheel sharply', isCorrect: false, explanation: 'Sharp turns can cause you to spin out.' },
    ],
    correctExplanation: 'When hydroplaning, ease off the gas pedal and keep the steering wheel straight until you regain traction. Don\'t brake or turn sharply.',
    realWorldTip: 'Hydroplaning happens when water builds up between your tires and the road. Slow down in heavy rain to prevent it.',
    xp: 45,
  },
  {
    id: 'hz-005',
    category: 'hazards',
    level: 3,
    question: 'You\'re driving and a tire blows out. What should you do?',
    options: [
      { text: 'Brake immediately', isCorrect: false, explanation: 'Sudden braking can cause loss of control.' },
      { text: 'Grip the wheel firmly and slowly ease off the gas', isCorrect: true },
      { text: 'Accelerate to maintain control', isCorrect: false, explanation: 'Never accelerate during a blowout.' },
      { text: 'Pull the parking brake', isCorrect: false, explanation: 'This can cause the car to spin.' },
    ],
    correctExplanation: 'During a tire blowout, grip the steering wheel firmly, ease off the gas, and let the car slow down gradually before pulling over.',
    realWorldTip: 'Don\'t panic or make sudden movements. Keep the car going straight and slow down gradually.',
    xp: 45,
  },

  // Additional Parking Scenarios
  {
    id: 'pk-003',
    category: 'parking',
    level: 2,
    question: 'When parking downhill with a curb, which way should you turn your wheels?',
    options: [
      { text: 'Away from the curb', isCorrect: false, explanation: 'This is for uphill parking.' },
      { text: 'Toward the curb', isCorrect: true },
      { text: 'Straight ahead', isCorrect: false, explanation: 'Wheels should be turned for safety.' },
      { text: 'It doesn\'t matter', isCorrect: false, explanation: 'Proper wheel position prevents rolling.' },
    ],
    correctExplanation: 'When parking downhill with a curb, turn your wheels toward the curb. If the car rolls, the front tire will hit the curb and stop the car.',
    realWorldTip: 'Remember: Downhill = toward curb. Uphill = away from curb. Always engage parking brake on hills.',
    xp: 25,
  },
  {
    id: 'pk-004',
    category: 'parking',
    level: 2,
    question: 'How close can you legally park to a stop sign?',
    options: [
      { text: '10 feet', isCorrect: false, explanation: '10 feet is too close.' },
      { text: '20 feet', isCorrect: false, explanation: '20 feet is still too close.' },
      { text: '30 feet', isCorrect: true },
      { text: '50 feet', isCorrect: false, explanation: 'While safe, 30 feet is the legal minimum.' },
    ],
    correctExplanation: 'You must park at least 30 feet from a stop sign to ensure it remains visible to other drivers.',
    realWorldTip: 'Parking too close to signs or intersections can block visibility and cause accidents.',
    xp: 25,
  },
  {
    id: 'pk-005',
    category: 'parking',
    level: 3,
    question: 'You\'re parallel parking. What\'s the correct sequence?',
    options: [
      { text: 'Pull alongside, turn wheel left, back up', isCorrect: false, explanation: 'This sequence is incorrect for parallel parking.' },
      { text: 'Pull alongside, back up straight, then turn wheel', isCorrect: false, explanation: 'You need to turn the wheel while backing.' },
      { text: 'Pull alongside, turn wheel right, back up, straighten', isCorrect: true },
      { text: 'Just back straight into the space', isCorrect: false, explanation: 'You need to angle the car to fit.' },
    ],
    correctExplanation: 'Parallel parking: Pull alongside the front car, turn wheel fully right, back up at 45°, then straighten wheel and back in.',
    realWorldTip: 'Practice makes perfect. Use reference points like your side mirror lining up with the other car\'s bumper.',
    xp: 35,
  },
];

export const CATEGORY_INFO: Record<Category, { name: string; icon: string; description: string; color: string }> = {
  'traffic-lights': {
    name: 'Traffic Lights',
    icon: '🚦',
    description: 'Learn when to stop, yield, and go',
    color: '#ef4444',
  },
  'signs': {
    name: 'Road Signs',
    icon: '🛑',
    description: 'Master stop signs, yield signs, and more',
    color: '#f59e0b',
  },
  'pedestrians': {
    name: 'Pedestrian Safety',
    icon: '🚶',
    description: 'Protect vulnerable road users',
    color: '#3b82f6',
  },
  'right-of-way': {
    name: 'Right of Way',
    icon: '🔄',
    description: 'Know who goes first at intersections',
    color: '#8b5cf6',
  },
  'hazards': {
    name: 'Road Hazards',
    icon: '⚠️',
    description: 'Handle weather, animals, and obstacles',
    color: '#eab308',
  },
  'parking': {
    name: 'Parking Rules',
    icon: '🅿️',
    description: 'Learn safe and legal parking',
    color: '#06b6d4',
  },
};
