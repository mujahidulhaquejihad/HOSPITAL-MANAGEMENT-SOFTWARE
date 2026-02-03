

const FIRST_NAMES = [
  'Mohammad', 'Abdul', 'Hasan', 'Rahim', 'Karim', 'Jamal', 'Rafiq', 'Sohel', 'Kamal', 'Nasir',
  'Fatima', 'Ayesha', 'Nasrin', 'Shabnam', 'Rupa', 'Jahanara', 'Sharmin', 'Tahmina', 'Nargis', 'Salma',
  'Tariq', 'Imran', 'Shafiq', 'Mahmud', 'Rashid', 'Akram', 'Habib', 'Sultan', 'Faruk', 'Jahangir',
  'Rokeya', 'Kulsum', 'Ferdousi', 'Shirin', 'Morsheda', 'Razia', 'Laila', 'Hasina', 'Shahnaz', 'Rehana',
];

const SURNAMES = [
  'Ahmed', 'Khan', 'Rahman', 'Hossain', 'Islam', 'Ali', 'Siddique', 'Chowdhury', 'Haque', 'Uddin',
  'Miah', 'Sarker', 'Bhuiyan', 'Mollah', 'Mia', 'Akter', 'Begum', 'Alam', 'Hossain', 'Karim',
];

const CITIES = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Comilla', 'Gazipur', 'Narayanganj',
  'Rangpur', 'Mymensingh', 'Tangail', 'Jessore', 'Bogra', 'Dinajpur', 'Savar', 'Brahmanbaria', 'Kushtia', 'Noakhali', 'Faridpur',
];

const STORY_TEMPLATES = [
  { title: 'Successful treatment for spinal disc (PLID)', summary: (n, c) => `${n} from ${c} came with severe lower back pain and leg numbness. Our orthopaedic team diagnosed prolapsed intervertebral disc (PLID) and performed a minimally invasive procedure. Recovery was smooth; ${n.split(' ')[0]} returned to daily activities within weeks and is grateful for the care.` },
  { title: 'Full recovery after head injury from road accident', summary: (n, c) => `${n} from ${c} was brought to Emergency after a road accident with significant head injury. Our neurosurgery and critical care teams worked together. After surgery and intensive care, the patient made a full recovery and was discharged with follow-up. The family thanked the hospital for saving a life.` },
  { title: "Child's congenital heart defect corrected", summary: (n, c) => `Young ${n} from ${c} had a congenital heart defect. Our Paediatric Cardiology unit provided comprehensive care and performed a corrective procedure. The child is now thriving with regular follow-ups. The parents expressed deep gratitude to the doctors and staff.` },
  { title: 'Knee replacement – pain-free mobility restored', summary: (n, c) => `${n} from ${c} had chronic knee pain and limited mobility. After knee replacement surgery at Meridian General, our orthopaedic team supported a smooth rehabilitation. The patient now walks without pain and has resumed normal activities.` },
  { title: 'Head injury treated successfully in Emergency', summary: (n, c) => `${n} from ${c} was stabilised in our Emergency after a head injury, then treated by our neurosurgery team. Timely intervention and post-operative care led to full recovery and discharge. The family praised the quick response and expertise.` },
  { title: 'Diabetes and heart care – life under control', summary: (n, c) => `${n} from ${c} came with uncontrolled diabetes and cardiac concerns. Our medicine and cardiology teams worked together on medication, lifestyle changes, and monitoring. Blood sugar and heart health are now well controlled.` },
  { title: 'Successful delivery and maternal care', summary: (n, c) => `Expectant mother ${n} from ${c} received full antenatal and delivery care at our Obstetrics unit. She had a safe delivery and healthy baby. She thanked the gynaecology and nursing teams for their support.` },
  { title: 'Stroke recovery with rehab and follow-up', summary: (n, c) => `${n} from ${c} was admitted with stroke symptoms. Our neurology team provided acute care and then rehabilitation. With physiotherapy and follow-up, the patient regained mobility and speech. Family appreciated the dedicated rehab team.` },
  { title: 'Gallbladder surgery – quick recovery', summary: (n, c) => `${n} from ${c} had symptomatic gallstones. Our general surgery team performed laparoscopic cholecystectomy. The patient recovered quickly and was discharged within days, pain-free.` },
  { title: 'Asthma and respiratory care under control', summary: (n, c) => `${n} from ${c} had recurrent asthma attacks. Our respiratory team adjusted medication and taught inhaler technique and trigger avoidance. Symptoms are now well controlled and emergency visits have stopped.` },
  { title: 'Cataract surgery – clear vision restored', summary: (n, c) => `${n} from ${c} had blurred vision from cataract. Our ophthalmology team performed cataract surgery. Vision improved significantly; the patient can read and move around confidently again.` },
  { title: 'Skin condition treated in Dermatology', summary: (n, c) => `${n} from ${c} had a persistent skin condition. Our dermatology team diagnosed and started targeted treatment. The condition cleared and the patient was advised on long-term skin care.` },
  { title: 'Fracture repair and orthopaedic follow-up', summary: (n, c) => `${n} from ${c} had a fracture from a fall. Our orthopaedic team set and fixed the fracture and planned rehabilitation. The bone healed well and the patient returned to work.` },
  { title: 'Kidney stone removal – pain relieved', summary: (n, c) => `${n} from ${c} had severe pain from kidney stones. Our urology team performed stone removal. The patient was pain-free after the procedure and recovered without complications.` },
  { title: 'Thyroid disorder managed with medication', summary: (n, c) => `${n} from ${c} had fatigue and weight changes due to thyroid disorder. Our medicine team started treatment and monitoring. Thyroid levels normalised and symptoms improved.` },
  { title: 'Child fever and infection – quick recovery', summary: (n, c) => `Young ${n} from ${c} was admitted with high fever and infection. Our paediatric team gave antibiotics and supportive care. The child recovered within days and was discharged healthy.` },
  { title: 'Hypertension and heart risk under control', summary: (n, c) => `${n} from ${c} had high blood pressure and heart risk. Our cardiology team prescribed medication and lifestyle changes. BP is now controlled and follow-up continues.` },
  { title: 'Appendicitis – emergency surgery success', summary: (n, c) => `${n} from ${c} came with acute abdominal pain. Our surgeons diagnosed appendicitis and performed emergency appendectomy. Recovery was smooth and the patient went home in a few days.` },
  { title: 'Anaemia treated with diet and supplements', summary: (n, c) => `${n} from ${c} had weakness and fatigue from anaemia. Our medicine team identified the cause and started iron and diet advice. Haemoglobin improved and energy levels returned.` },
  { title: 'ENT surgery for chronic sinus issue', summary: (n, c) => `${n} from ${c} had long-standing sinus and nasal complaints. Our ENT team performed surgery. Breathing and symptoms improved and the patient is satisfied with the outcome.` },
];

function pick(arr, i) {
  return arr[i % arr.length];
}

function randomDate(startYear, endYear, seed) {
  const year = startYear + (seed % (endYear - startYear + 1));
  const month = 1 + (seed % 12);
  const day = 1 + (seed % 28);
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month - 1]} ${year}`;
}

export function getPatientStories() {
  const stories = [];
  const usedIds = new Set();
  for (let i = 0; i < 100; i++) {
    const first = pick(FIRST_NAMES, i);
    const last = pick(SURNAMES, Math.floor(i / 2));
    const name = `${first} ${last}`;
    const city = pick(CITIES, i * 3);
    const tpl = pick(STORY_TEMPLATES, i * 7);
    const id = `story-${i + 1}`;
    if (usedIds.has(id)) continue;
    usedIds.add(id);
    stories.push({
      id,
      patientName: name,
      city,
      title: tpl.title,
      date: randomDate(2024, 2026, i),
      summary: typeof tpl.summary === 'function' ? tpl.summary(name, city) : tpl.summary,
    });
  }
  return stories;
}
