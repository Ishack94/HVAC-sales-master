// Symptoms available per furnace type
export const SYMPTOMS = {
  shared: [
    { id: 'no-heat', label: 'No heat at all', desc: "Furnace won't start — no sounds, no fan, nothing happening" },
    { id: 'blower-no-heat', label: 'Blower runs but no heat', desc: "Fan is blowing air but it's not warm" },
    { id: 'short-cycling', label: 'Starts then shuts off', desc: 'Furnace lights but shuts down after a few minutes' },
    { id: 'no-ignition', label: "Won't ignite", desc: 'Inducer runs but burners never light' },
    { id: 'loud-noise', label: 'Loud or unusual noise', desc: 'Banging, squealing, rattling, or rumbling' },
    { id: 'error-code', label: 'Error code flashing', desc: 'LED on control board is blinking a pattern' },
    { id: 'thermostat', label: 'Thermostat not responding', desc: 'Display is blank or not calling for heat' },
  ],
  '90-only': [
    { id: 'leaking-water', label: 'Leaking water', desc: 'Water pooling around or under the furnace' },
  ],
}

// Questions and diagnosis endpoints
// Each question: { text, helper, yes, no }
// yes/no values are either another question ID or a diagnosis ID (starts with 'dx-')
export const QUESTIONS = {
  // ── NO HEAT ──
  'no-heat-q1': {
    text: 'Is the thermostat set to Heat and above the current room temperature?',
    helper: 'The most common reason a furnace won\'t start is a thermostat that\'s set wrong or has dead batteries.',
    yes: 'no-heat-q2',
    no: 'dx-thermostat-setting',
  },
  'no-heat-q2': {
    text: 'Is the furnace power switch turned on?',
    helper: 'There\'s usually a light switch on or near the furnace. It looks like a regular wall switch and gets bumped off accidentally.',
    yes: 'no-heat-q3',
    no: 'dx-power-switch',
  },
  'no-heat-q3': {
    text: 'Is the furnace filter clean (or at least not completely clogged)?',
    helper: 'A severely clogged filter can cause the furnace to shut down on safety limits before it ever produces usable heat.',
    yes: 'no-heat-q4',
    no: 'dx-clogged-filter',
  },
  'no-heat-q4': {
    text: 'When you turn up the thermostat, do you hear the inducer motor start within 60 seconds?',
    helper: 'The inducer is a small motor that starts before the burners. It sounds like a low hum or whir.',
    yes: 'no-heat-q5',
    no: 'dx-no-inducer',
  },
  'no-heat-q5': {
    text: 'After the inducer starts, do the burners light within 30–60 seconds?',
    helper: 'You should see a glow from the igniter, then hear the gas valve click and burners light.',
    yes: 'dx-blower-issue',
    no: 'dx-ignition-failure',
  },

  // ── BLOWER NO HEAT ──
  'blower-no-heat-q1': {
    text: 'Is the fan switch on the thermostat set to AUTO (not ON)?',
    helper: 'When the fan is set to ON, the blower runs continuously even when the furnace isn\'t heating. This blows cold air between heating cycles.',
    yes: 'blower-no-heat-q2',
    no: 'dx-fan-on-setting',
  },
  'blower-no-heat-q2': {
    text: 'Does the furnace start a heat cycle at all (inducer starts, burners light)?',
    helper: 'Listen for the sequence: inducer hum → igniter glow → gas valve click → burner flame.',
    yes: 'blower-no-heat-q3',
    no: 'dx-no-heat-call',
  },
  'blower-no-heat-q3': {
    text: 'Do the burners stay lit for at least 3 minutes before shutting off?',
    helper: 'If they light and immediately shut off, the furnace is tripping a safety. If they stay on but air is cool, the heat exchanger may not be transferring enough heat.',
    yes: 'dx-heat-exchanger-airflow',
    no: 'dx-flame-rollout-limit',
  },

  // ── SHORT CYCLING ──
  'short-cycling-q1': {
    text: 'Is the furnace filter clean?',
    helper: 'A dirty filter is the #1 cause of short cycling. It restricts airflow so the heat exchanger overheats and trips the high limit switch.',
    yes: 'short-cycling-q2',
    no: 'dx-dirty-filter-cycling',
  },
  'short-cycling-q2': {
    text: 'Are all the supply registers in the house open?',
    helper: 'Closing too many registers restricts airflow across the heat exchanger, causing the same overheating problem as a dirty filter.',
    yes: 'short-cycling-q3',
    no: 'dx-closed-registers',
  },
  'short-cycling-q3': {
    text: 'Does the furnace run for at least 5–10 minutes before shutting off?',
    helper: 'Very short cycles (under 3 minutes) usually point to a safety limit. Longer cycles that still feel short may be a flame sensor issue.',
    yes: 'dx-oversized-system',
    no: 'short-cycling-q4',
  },
  'short-cycling-q4': {
    text: 'Can you see an orange or amber glow on the flame sensor rod while the burners are lit?',
    helper: 'The flame sensor is a thin metal rod that sits in the burner flame. If it can\'t detect flame, the gas valve shuts off as a safety measure.',
    yes: 'dx-high-limit-switch',
    no: 'dx-flame-sensor',
  },

  // ── NO IGNITION ──
  'no-ignition-q1': {
    text: 'Does the igniter glow bright orange before the gas valve tries to open?',
    helper: 'The hot surface igniter should glow bright orange/white for 15–30 seconds. If it doesn\'t glow at all or barely glows, it may be cracked or failed.',
    yes: 'no-ignition-q2',
    no: 'dx-bad-igniter',
  },
  'no-ignition-q2': {
    text: 'Do you hear the gas valve click open after the igniter glows?',
    helper: 'After the igniter heats up, the control board should energize the gas valve. You\'ll hear a distinct click.',
    yes: 'dx-gas-supply',
    no: 'dx-gas-valve-board',
  },

  // ── LOUD NOISE ──
  'loud-noise-q1': {
    text: 'Is the noise a loud bang or boom when the burners light?',
    helper: 'A bang at startup means delayed ignition — gas builds up before the igniter lights it, causing a small explosion in the heat exchanger.',
    yes: 'dx-delayed-ignition',
    no: 'loud-noise-q2',
  },
  'loud-noise-q2': {
    text: 'Is it a high-pitched squeal or screech?',
    helper: 'Squealing usually comes from a failing blower motor bearing or a loose/worn belt on older belt-drive blowers.',
    yes: 'dx-blower-bearing',
    no: 'loud-noise-q3',
  },
  'loud-noise-q3': {
    text: 'Is it a rattling or vibrating sound?',
    helper: 'Rattling can be loose ductwork, a loose blower wheel, or panels that aren\'t secured properly.',
    yes: 'dx-loose-components',
    no: 'dx-unusual-noise-general',
  },

  // ── ERROR CODE ──
  'error-code-q1': {
    text: 'Is the LED blinking a steady, repeating pattern (not random)?',
    helper: 'Most furnace control boards use a blinking LED to report error codes. Count the number of blinks, then the pause, then count again.',
    yes: 'error-code-q2',
    no: 'dx-board-failure',
  },
  'error-code-q2': {
    text: 'Can you find the error code chart on the inside of the furnace panel door?',
    helper: 'Almost every furnace has a sticker on the inside of the front panel that translates the blink codes into plain language.',
    yes: 'dx-check-code-chart',
    no: 'dx-lookup-model',
  },

  // ── THERMOSTAT ──
  'thermostat-q1': {
    text: 'Is the thermostat display showing anything at all?',
    helper: 'A completely blank display usually means no power — either dead batteries or a wiring/transformer issue.',
    yes: 'thermostat-q2',
    no: 'dx-thermostat-power',
  },
  'thermostat-q2': {
    text: 'When you set it to Heat and raise the temperature above room temp, does it say "Heating" or show a flame icon?',
    helper: 'If the thermostat shows it\'s calling for heat but the furnace doesn\'t respond, the problem is between the thermostat and the furnace — not the thermostat itself.',
    yes: 'dx-wiring-or-board',
    no: 'dx-thermostat-config',
  },

  // ── LEAKING WATER (90%+ only) ──
  'leaking-water-q1': {
    text: 'Is the water coming from the condensate drain line or trap?',
    helper: 'High-efficiency furnaces produce water (condensation) during normal operation. This drains through a PVC trap and drain line. If the drain is clogged, water backs up.',
    yes: 'dx-clogged-drain',
    no: 'leaking-water-q2',
  },
  'leaking-water-q2': {
    text: 'Is the water coming from the secondary heat exchanger area or exhaust connections?',
    helper: 'If water is leaking from the heat exchanger itself or the PVC exhaust joints, it could be a cracked heat exchanger or improperly sealed exhaust.',
    yes: 'dx-secondary-hx-leak',
    no: 'dx-humidifier-or-ac',
  },
}

// Map symptom IDs to their first question
export const SYMPTOM_FIRST_QUESTION = {
  'no-heat': 'no-heat-q1',
  'blower-no-heat': 'blower-no-heat-q1',
  'short-cycling': 'short-cycling-q1',
  'no-ignition': 'no-ignition-q1',
  'loud-noise': 'loud-noise-q1',
  'error-code': 'error-code-q1',
  'thermostat': 'thermostat-q1',
  'leaking-water': 'leaking-water-q1',
}

// Diagnoses
export const DIAGNOSES = {
  'dx-thermostat-setting': {
    title: 'Check Thermostat Settings',
    summary: 'The thermostat isn\'t calling for heat. Set it to Heat mode, raise the setpoint above the current room temperature, and wait 60 seconds.',
    notes: [
      'Replace batteries if applicable — low batteries can cause erratic behavior.',
      'Make sure no one switched it to Cool or Off.',
      'Some programmable thermostats have schedules that override manual settings.',
    ],
    customerText: 'Your thermostat wasn\'t set to call for heat. We adjusted the settings and the furnace should start running now. If it happens again, check that the mode is set to Heat and the temperature is set above what the room currently reads.',
  },
  'dx-power-switch': {
    title: 'Furnace Power Switch Off',
    summary: 'The furnace power switch was turned off. It looks like a regular light switch and is usually on the furnace or on the wall nearby. It gets bumped off accidentally.',
    notes: [
      'This is one of the most common "no heat" calls.',
      'Some furnaces also have a fuse or breaker — verify the breaker is on.',
    ],
    customerText: 'The power switch to your furnace was turned off — probably bumped by accident. We turned it back on and the furnace is running normally now.',
  },
  'dx-clogged-filter': {
    title: 'Severely Clogged Filter',
    summary: 'The filter is so restricted that the furnace can\'t pull enough air across the heat exchanger. It overheats and shuts down on safety limits before producing usable heat.',
    notes: [
      'Replace the filter immediately.',
      'With a clean filter, the furnace should resume normal operation.',
      'If it still shuts down after replacing the filter, the high limit switch may need to be manually reset.',
    ],
    customerText: 'Your furnace filter was completely clogged, which was blocking airflow and causing the furnace to overheat and shut itself off as a safety measure. We replaced the filter and the system is running normally now. Going forward, check it every 1–3 months.',
  },
  'dx-no-inducer': {
    title: 'Inducer Motor Not Starting',
    summary: 'The inducer motor should start within 60 seconds of a heat call. If it doesn\'t, the control board may not be sending the signal, the inducer motor may be failed, or there could be a pressure switch issue.',
    notes: [
      'Check for 120V at the inducer motor connector.',
      'If voltage is present but the motor doesn\'t run, the inducer motor has failed.',
      'If no voltage, the control board may not be initiating the heat sequence.',
      'Check for error codes on the control board LED.',
    ],
    customerText: 'The motor that starts the heating sequence isn\'t running. This could be the motor itself, a control board issue, or a safety switch. A technician will need to test the electrical components to pinpoint the exact cause.',
  },
  'dx-ignition-failure': {
    title: 'Probable Ignition Failure',
    summary: 'The inducer is running but the burners aren\'t lighting. This is typically a failed hot surface igniter, a gas valve issue, or a flame sensor problem.',
    notes: [
      'Hot surface igniters are fragile — they crack over time and stop glowing hot enough.',
      'Check igniter resistance: a good one reads 40–200 ohms.',
      'If the igniter glows but gas doesn\'t flow, check the gas valve and gas supply.',
    ],
    customerText: 'Your furnace is trying to start but the burners aren\'t lighting. The most common cause is a worn-out igniter — it\'s a part that wears out over time and is a straightforward replacement.',
  },
  'dx-blower-issue': {
    title: 'Blower Motor or Capacitor Issue',
    summary: 'The burners are lighting normally but the blower isn\'t distributing the heat. This could be a failed blower motor, bad run capacitor, or a control board issue not sending the blower signal.',
    notes: [
      'Check for voltage at the blower motor during a heat call.',
      'A humming motor that won\'t spin often means a bad capacitor.',
      'Some ECM motors have internal diagnostics — check for fault LEDs on the motor.',
    ],
    customerText: 'Your furnace is producing heat but the blower fan isn\'t pushing the warm air through your ducts. This is usually a blower motor or capacitor issue — both are repairable parts.',
  },
  'dx-fan-on-setting': {
    title: 'Fan Set to ON Instead of AUTO',
    summary: 'The thermostat fan switch is set to ON, which runs the blower continuously even when the furnace isn\'t in a heat cycle. Between cycles, it blows unheated air.',
    notes: ['Switch the fan setting from ON to AUTO.'],
    customerText: 'Your thermostat fan was set to ON, which makes the blower run all the time — even when the furnace isn\'t heating. We switched it to AUTO so it only runs during heating cycles.',
  },
  'dx-no-heat-call': {
    title: 'No Heat Call Reaching the Furnace',
    summary: 'The thermostat thinks it\'s calling for heat, but the furnace isn\'t receiving the signal. This is typically a wiring issue, a failed transformer, or a control board problem.',
    notes: [
      'Check for 24V between R and W at the furnace control board.',
      'If no voltage, trace the thermostat wiring for breaks or loose connections.',
      'A failed transformer will show 0V on the secondary side.',
    ],
    customerText: 'The signal from your thermostat isn\'t reaching the furnace. This could be a wiring connection issue or a part called the transformer. A tech can trace the wiring and find the break.',
  },
  'dx-heat-exchanger-airflow': {
    title: 'Possible Airflow Restriction or Heat Exchanger Issue',
    summary: 'Burners stay lit and the blower runs, but the air isn\'t getting warm. This could be restricted airflow (dirty filter, blocked ducts) or a heat exchanger that\'s not transferring heat efficiently.',
    notes: [
      'Verify filter is clean and all registers are open.',
      'Check static pressure — high static means airflow restriction.',
      'On older furnaces, a cracked heat exchanger can reduce efficiency significantly.',
    ],
    customerText: 'Your furnace is running but the air isn\'t getting as warm as it should. This usually means the airflow is restricted somewhere or the heat exchanger needs attention. Let\'s start by checking the filter and ductwork.',
  },
  'dx-flame-rollout-limit': {
    title: 'Flame Rollout or High Limit Safety Trip',
    summary: 'The burners light but the furnace shuts down quickly on a safety switch. A flame rollout switch trips when flames escape the heat exchanger. A high limit trips when the heat exchanger overheats.',
    notes: [
      'Flame rollout switches have a manual reset button — press to reset.',
      'If it trips repeatedly, suspect a cracked heat exchanger or blocked flue.',
      'A tripped high limit with a clean filter may indicate a blower speed issue.',
    ],
    customerText: 'Your furnace is shutting itself off as a safety precaution. There\'s a safety switch that trips when it detects the furnace is getting too hot or flames are going where they shouldn\'t. This needs professional diagnosis to determine the root cause.',
  },
  'dx-dirty-filter-cycling': {
    title: 'Dirty Filter Causing Short Cycling',
    summary: 'The most common cause of short cycling. The clogged filter restricts airflow, the heat exchanger overheats, and the high limit switch shuts off the burners to prevent damage.',
    notes: [
      'Replace the filter and the furnace should resume normal operation.',
      'Run the furnace through 2–3 complete cycles to confirm the issue is resolved.',
    ],
    customerText: 'Your furnace was shutting itself off because the filter was so dirty it was choking off airflow. The furnace was overheating as a result. We replaced the filter and it should run normally now.',
  },
  'dx-closed-registers': {
    title: 'Too Many Registers Closed',
    summary: 'Closing supply registers increases static pressure and reduces airflow across the heat exchanger, causing it to overheat and trip the high limit switch.',
    notes: [
      'Open all registers, even in unused rooms.',
      'The system was designed with all registers open — closing them doesn\'t save energy.',
    ],
    customerText: 'Several of your vents were closed, which was restricting airflow and causing your furnace to overheat. We opened them up and the furnace should run normally. It\'s best to keep all vents open, even in rooms you don\'t use much.',
  },
  'dx-oversized-system': {
    title: 'Possibly Oversized System',
    summary: 'The furnace runs long enough to satisfy the thermostat quickly, then shuts off. If the house reaches temperature too fast and the furnace cycles frequently, the system may be oversized for the space.',
    notes: [
      'This is a design issue, not a malfunction.',
      'Two-stage or modulating furnaces handle this better than single-stage.',
    ],
    customerText: 'Your furnace is working correctly — it\'s just heating the house so quickly that it cycles on and off more than ideal. This can happen when the furnace is a bit larger than the space needs.',
  },
  'dx-flame-sensor': {
    title: 'Probable Flame Sensor Issue',
    summary: 'The flame sensor rod isn\'t detecting the burner flame, so the gas valve shuts off as a safety measure after a few seconds. The sensor may be dirty or failed.',
    notes: [
      'Clean the flame sensor with light sandpaper or a Scotch-Brite pad.',
      'Check microamp reading: should be 1.5–6 µA in flame.',
      'If cleaning doesn\'t fix it, replace the sensor.',
    ],
    customerText: 'There\'s a small sensor that sits in the flame and tells the furnace it\'s safe to keep the gas flowing. Yours was dirty and couldn\'t detect the flame, so the furnace kept shutting off. We cleaned it and it should be good now.',
  },
  'dx-high-limit-switch': {
    title: 'High Limit Switch Tripping',
    summary: 'The furnace runs for several minutes then shuts off when the heat exchanger reaches its safety temperature. This usually means insufficient airflow even with a clean filter.',
    notes: [
      'Check blower speed — it may be set too low for the system.',
      'Verify ductwork isn\'t collapsed or disconnected.',
      'Check evaporator coil for blockage if there\'s an AC system.',
    ],
    customerText: 'Your furnace is overheating and shutting itself off as a safety measure. Even though the filter is clean, something else is restricting airflow — possibly the blower speed setting or a ductwork issue. A technician can measure the airflow and find the restriction.',
  },
  'dx-bad-igniter': {
    title: 'Failed Hot Surface Igniter',
    summary: 'The igniter isn\'t glowing, which means it can\'t reach the temperature needed to light the gas. Hot surface igniters are wear items — they crack and fail over time.',
    notes: [
      'Check igniter resistance: good = 40–200Ω, open = failed.',
      'Silicon carbide igniters are fragile — never touch with bare hands.',
      'Silicon nitride igniters are more durable but still fail eventually.',
    ],
    customerText: 'The igniter in your furnace has worn out — it\'s the part that glows red-hot to light the gas. It\'s a normal wear item, like a light bulb. Replacing it is straightforward and should get you back up and running.',
  },
  'dx-gas-supply': {
    title: 'Gas Supply Issue',
    summary: 'The igniter is working and the gas valve opens, but the burners aren\'t lighting. This could be low gas pressure, a partially closed gas supply valve, or air in the gas line.',
    notes: [
      'Verify the manual gas shutoff valve on the gas line is fully open.',
      'Check gas pressure at the furnace manifold: should be 3.5" WC for natural gas.',
      'If no other gas appliances work, contact the utility company.',
    ],
    customerText: 'Your furnace is trying to light but isn\'t getting enough gas. This could be a valve that\'s not fully open or a gas pressure issue. We\'ll check the gas supply to find out what\'s going on.',
  },
  'dx-gas-valve-board': {
    title: 'Gas Valve or Control Board Issue',
    summary: 'The igniter glows but the gas valve never opens. Either the control board isn\'t sending voltage to the gas valve, or the gas valve itself has failed.',
    notes: [
      'Check for 24V at the gas valve terminals during ignition sequence.',
      'If voltage present but valve doesn\'t open — replace gas valve.',
      'If no voltage — likely control board issue.',
    ],
    customerText: 'Your furnace igniter is working, but the gas valve isn\'t opening to let fuel through. This is either the gas valve itself or the electronic control board that tells it to open. A technician can test both to determine which one needs replacement.',
  },
  'dx-delayed-ignition': {
    title: 'Delayed Ignition',
    summary: 'Gas is building up in the heat exchanger before igniting, causing a bang or boom. This is typically caused by a dirty or weak igniter, dirty burners, or low gas pressure.',
    notes: [
      'Clean the burners — dust and debris cause uneven ignition.',
      'Check igniter strength — a weak igniter takes too long to light the gas.',
      'This can also indicate a cracked heat exchanger — inspect carefully.',
    ],
    customerText: 'The banging sound is caused by gas building up before it ignites — basically a small delayed ignition. This is usually fixable by cleaning the burners and checking the igniter. It\'s important to address it because it stresses the heat exchanger.',
  },
  'dx-blower-bearing': {
    title: 'Blower Motor Bearing Failure',
    summary: 'The high-pitched squealing or screeching is coming from the blower motor bearings wearing out. The motor may need lubrication or replacement.',
    notes: [
      'Some motors have oil ports — a few drops of SAE 20 may help temporarily.',
      'If the motor is hot to the touch and squealing, it\'s close to failure.',
      'Replace before it seizes completely and takes out the capacitor or board.',
    ],
    customerText: 'The squealing sound is the blower motor — the bearings inside are wearing out. It still works for now, but it\'s headed toward failure. Replacing it before it seizes completely will prevent a more expensive repair.',
  },
  'dx-loose-components': {
    title: 'Loose Components or Ductwork',
    summary: 'Rattling and vibrating usually means something is loose — a blower wheel set screw, a panel that isn\'t latched, or a duct connection that\'s come apart.',
    notes: [
      'Check the blower wheel set screw — this is the most common rattle source.',
      'Make sure all furnace panels are secured properly.',
      'Inspect visible ductwork for disconnected joints.',
    ],
    customerText: 'The rattling noise is something loose — most likely a component inside the furnace or a duct connection. We\'ll tighten things up and it should quiet down.',
  },
  'dx-unusual-noise-general': {
    title: 'Unusual Noise — Further Investigation Needed',
    summary: 'The noise doesn\'t match the common patterns. This could be anything from a failing inducer motor to a draft issue to an object in the ductwork.',
    notes: [
      'Try to isolate where the noise is coming from — inducer, blower, or ductwork.',
      'A failing inducer motor often makes a grinding or whining sound.',
      'Ductwork can make popping sounds from thermal expansion.',
    ],
    customerText: 'There\'s a noise coming from your heating system that needs a closer look. It could be a few different things. A technician can listen to it running and pinpoint exactly what\'s causing it.',
  },
  'dx-board-failure': {
    title: 'Possible Control Board Failure',
    summary: 'If the LED on the control board is not blinking in any recognizable pattern (or not lit at all), the board itself may have failed.',
    notes: [
      'No LED at all may mean no power to the board — check the breaker and fuse.',
      'Some boards have a 3A fuse on-board that can blow.',
      'Erratic blinking with no pattern usually indicates a board malfunction.',
    ],
    customerText: 'The electronic control board in your furnace may have failed. It\'s the brain of the system — when it goes, nothing runs properly. A technician can test it and replace it if needed.',
  },
  'dx-check-code-chart': {
    title: 'Read the Error Code Chart',
    summary: 'Count the number of blinks, then look it up on the chart inside the furnace panel door. Each manufacturer uses different codes. The chart will tell you exactly what the furnace is reporting.',
    notes: [
      'Common codes: 1 blink = normal, 2 = external lockout, 3 = pressure switch, 4 = high limit.',
      'Write down the code before resetting — you\'ll need it for the tech.',
      'Some boards need a power cycle to clear the code.',
    ],
    customerText: 'Your furnace is reporting an error code through the blinking light on the control board. We\'ll look up what that code means and determine the next step.',
  },
  'dx-lookup-model': {
    title: 'Look Up Model Number for Error Codes',
    summary: 'Without the code chart visible, you\'ll need to look up the furnace model number online to find the manufacturer\'s error code reference.',
    notes: [
      'The model number is on the furnace nameplate — usually inside the blower compartment.',
      'Search "[manufacturer] [model] error codes" to find the blink code chart.',
    ],
    customerText: 'Your furnace is flashing an error code but we need to look up what it means for your specific model. The model number is on the furnace nameplate.',
  },
  'dx-thermostat-power': {
    title: 'Thermostat Has No Power',
    summary: 'A blank thermostat display means no power. For battery-powered models, replace the batteries. For hardwired models, check the furnace transformer and wiring.',
    notes: [
      'Try fresh AA or AAA batteries first.',
      'If hardwired, check the R and C terminals at the furnace for 24V.',
      'A blown 3A fuse on the furnace control board is a common cause.',
    ],
    customerText: 'Your thermostat doesn\'t have power. If it uses batteries, replacing them should fix it. If it\'s wired, there may be a blown fuse at the furnace or a wiring issue.',
  },
  'dx-wiring-or-board': {
    title: 'Signal Not Reaching Furnace',
    summary: 'The thermostat is calling for heat but the furnace isn\'t responding. The signal isn\'t making it from the thermostat to the furnace control board.',
    notes: [
      'Check for 24V between R and W at the furnace terminals.',
      'Inspect thermostat wire for damage, especially in attics where rodents chew wiring.',
      'Try jumping R to W at the furnace to test — if the furnace starts, the problem is in the thermostat or wiring.',
    ],
    customerText: 'Your thermostat is trying to tell the furnace to turn on, but the signal isn\'t getting through. This is usually a wiring issue or a control board problem at the furnace.',
  },
  'dx-thermostat-config': {
    title: 'Thermostat Configuration Issue',
    summary: 'The thermostat is powered but isn\'t calling for heat. It may be in the wrong mode, the schedule may be overriding, or it may need to be reconfigured.',
    notes: [
      'Check that it\'s set to Heat, not Cool or Auto.',
      'Verify the setpoint is above the current room temperature.',
      'Some smart thermostats have "learning" features that can override manual settings.',
    ],
    customerText: 'Your thermostat is working but wasn\'t configured correctly to call for heat. We adjusted the settings and it should be working now.',
  },
  'dx-clogged-drain': {
    title: 'Clogged Condensate Drain',
    summary: 'The condensate drain line or trap is clogged, causing water to back up and pool around the furnace. High-efficiency furnaces produce a lot of condensation during normal operation.',
    notes: [
      'Clear the drain line with a wet/dry vac or compressed air.',
      'Clean the trap — it often collects sludge and algae.',
      'Some furnaces have a pressure switch that shuts down the furnace if the drain backs up.',
    ],
    customerText: 'Your furnace produces water during normal operation, and the drain that carries that water away was clogged. We cleared it out and the water should drain properly now. This is maintenance that should be checked once a year.',
  },
  'dx-secondary-hx-leak': {
    title: 'Secondary Heat Exchanger or Exhaust Leak',
    summary: 'Water is leaking from the secondary heat exchanger or the PVC exhaust connections. This could indicate a cracked heat exchanger (serious) or loose/improperly sealed exhaust joints (fixable).',
    notes: [
      'Check all PVC exhaust joints for proper cement and sealing.',
      'A cracked secondary heat exchanger requires replacement — this is a major repair.',
      'If the furnace is over 15 years old and the secondary HX is cracked, replacement may be more cost-effective than repair.',
    ],
    customerText: 'There\'s water leaking from the heat exchanger area of your furnace. This needs professional inspection — it could be a simple seal issue or it could indicate a cracked heat exchanger, which is a bigger repair.',
  },
  'dx-humidifier-or-ac': {
    title: 'Water from Humidifier or AC Coil',
    summary: 'The water may not be from the furnace at all. A whole-house humidifier mounted on the furnace or a leaking AC evaporator coil above the furnace can drip water that looks like it\'s coming from the furnace.',
    notes: [
      'Check the humidifier water supply line and solenoid valve.',
      'In cooling season, check the AC evaporator coil drain pan.',
      'Condensation on cold refrigerant lines can also drip.',
    ],
    customerText: 'The water doesn\'t appear to be coming from the furnace itself — it\'s likely from the humidifier or AC components mounted near or above the furnace. We\'ll check those components to find the source.',
  },
}
