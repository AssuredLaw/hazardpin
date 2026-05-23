import{useState,useEffect,useRef}from"react";
import{AlertTriangle,FileText,CheckCircle,BookOpen,Phone,Shield,Users,Target,Camera,Bell,Globe,Printer,Share2}from"lucide-react";

const C={black:"#0a0a0a",card:"#111111",border:"#222222",muted:"#2a2a2a",cyan:"#00b4e4",cyanDim:"rgba(0,180,228,0.12)",cyanBorder:"rgba(0,180,228,0.35)",light:"#f0f2f4",lightCard:"#ffffff",lightBorder:"#dde0e4",white:"#ffffff",textMuted:"#888888",textDim:"#555555",dark:"#0d0d0d",textDark:"#111111",textDarkMuted:"#555555",red:"#ff3838",orange:"#ff7a00",green:"#00cc77",yellow:"#ffc800"};

const HAZARDS=[
  {id:1,type:"trip",  title:"Broken Sidewalk Curb",        address:"742 S Main St",             status:"active",   severity:"high",    lat:36.1699,lng:-115.1420,date:"2025-11-15",notified:true, owner:"City of Las Vegas"},
  {id:2,type:"fall",  title:"Loose Guardrail on Staircase",address:"Riverside Park, N Steps",   status:"active",   severity:"critical",lat:36.1715,lng:-115.1380,date:"2025-11-20",notified:true, owner:"Parks Department"},
  {id:3,type:"slip",  title:"Wet Floor — No Warning Sign", address:"Mario's Ristorante, 4th St",status:"active",   severity:"medium",  lat:36.1680,lng:-115.1455,date:"2025-12-01",notified:false,owner:"Private Business"},
  {id:4,type:"play",  title:"Broken Swing Chain",          address:"Jefferson Elem. Playground",status:"corrected",severity:"high",    lat:36.1662,lng:-115.1392,date:"2025-10-10",notified:true, owner:"School District"},
  {id:5,type:"tree",  title:"Low-Hanging Branch Over Walk",address:"1200 Oak Boulevard",        status:"active",   severity:"medium",  lat:36.1725,lng:-115.1415,date:"2025-12-05",notified:false,owner:"City of Las Vegas"},
  {id:6,type:"stairs",title:"Cracked Entrance Step",       address:"City Hall, Main Entrance",  status:"active",   severity:"high",    lat:36.1692,lng:-115.1363,date:"2025-11-28",notified:true, owner:"City of Las Vegas"},
  {id:7,type:"park",  title:"Unmarked Pothole — Lot B",    address:"West Side Mall Parking",    status:"corrected",severity:"medium",  lat:36.1670,lng:-115.1472,date:"2025-10-22",notified:true, owner:"West Side Mall Inc."},
  {id:8,type:"ramp",  title:"Deteriorated Wheelchair Ramp",address:"500 Commerce Drive",        status:"active",   severity:"critical",lat:36.1740,lng:-115.1405,date:"2025-12-08",notified:false,owner:"Private Property"},
];
const TYPES=["Trip / Fall — Broken Pavement","Stairs / Steps — Cracked or Uneven","Guardrail / Handrail — Loose or Missing","Slip Hazard — Wet or Slippery Floor","Playground Equipment — Damaged","Tree / Branch — Fallen or Hanging","Parking Lot — Pothole or Unmarked Hazard","Wheelchair Ramp — Damaged / Non-ADA","Poor Lighting / Visibility","Other"];
const SEVERITY=["Critical — Immediate Danger","High — Significant Risk","Medium — Moderate Risk","Low — Minor Concern"];
const FIX_METHODS=["Repaired by property owner","Repaired by licensed contractor","Repaired by city / municipality","Temporary barrier placed pending full repair","Hazard removed entirely","Other"];

const GALLERY=[
  {url:"https://images.unsplash.com/photo-1508175800969-525c72a047dd?w=600&h=400&fit=crop&auto=format",icon:"\u{1F6E3}",caption:"Broken Pavement",   color:"#3a6a9a"},
  {url:"https://images.unsplash.com/photo-1581244277943-fe4a9c777540?w=600&h=400&fit=crop&auto=format",icon:"\u{1F4A7}",caption:"Slip Hazard",        color:"#2a8aaa"},
  {url:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&auto=format",  icon:"\u{1FA9C}",caption:"Damaged Stairway",   color:"#5a7a5a"},
  {url:"https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=600&h=400&fit=crop&auto=format",icon:"\u{1F17F}",caption:"Parking Lot Hazard", color:"#7a6a3a"},
  {url:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&auto=format",icon:"\u{2699}",caption:"Loose Guardrail",    color:"#8a5a4a"},
  {url:"https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=600&h=400&fit=crop&auto=format",icon:"\u{1F6DD}",caption:"Playground Danger",  color:"#6a5a8a"},
];

const HAZARD_PAGES=[
  {
    id:"broken-pavement",
    caption:"Broken Pavement",
    heroUrl:"https://images.unsplash.com/photo-1508175800969-525c72a047dd?w=1200&h=500&fit=crop&auto=format",
    seoTitle:"Broken Pavement & Trip and Fall Injury Attorney | HazardPin",
    seoDesc:"Injured on broken, cracked, or uneven pavement? You may have a premises liability claim. Free consultation. No fee unless we win.",
    keywords:["trip and fall on broken sidewalk","fell on cracked pavement","uneven sidewalk injury","tripped on raised curb","broken concrete injury lawyer","sidewalk trip and fall attorney","fell on public sidewalk","city sidewalk injury claim","municipality negligence broken pavement","pothole trip and fall"],
    photos:[
      {url:"https://images.unsplash.com/photo-1508175800969-525c72a047dd?w=700&h=460&fit=crop&auto=format",cap:"Severely cracked urban sidewalk"},
      {url:"https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=700&h=460&fit=crop&auto=format",cap:"Raised concrete lip — common trip hazard"},
      {url:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&h=460&fit=crop&auto=format",cap:"Broken asphalt walkway"},
      {url:"https://images.unsplash.com/photo-1563204204-40d47d5d2ed8?w=700&h=460&fit=crop&auto=format",cap:"Heaved pavement near building entrance"},
    ],
    h1:"Broken Pavement & Trip and Fall Injuries",
    intro:"Every year, hundreds of thousands of Americans are injured when they trip and fall on broken, cracked, or uneven pavement. Whether it's a raised sidewalk lip, a pothole, a crumbling curb cut, or a heaved concrete slab — these hazards are preventable, and the property owner or government entity responsible for maintaining that surface may be legally liable for your injuries.",
    sections:[
      {h:"What Qualifies as a Broken Pavement Claim?",body:"A broken pavement premises liability claim arises when a dangerous surface condition — such as a cracked sidewalk, heaved concrete, missing pavement, or raised curb edge — causes a person to trip, stumble, or fall and suffer an injury. The condition does not need to be dramatic to be legally actionable. Courts have consistently found that even a one-inch height differential in pavement can be sufficient to establish liability when the owner knew or should have known about the defect."},
      {h:"Who Is Responsible for Broken Pavement?",body:"Responsibility depends on where the pavement is located. City and municipal sidewalks fall under government jurisdiction — these claims require strict notice procedures and tight deadlines (often as short as 6 months). Pavement on private commercial property, parking lots, and walkways leading to businesses is the responsibility of the property owner or tenant in control. Apartment complexes and residential properties have similar obligations. In all cases, the owner or controller of the property has a duty to inspect, identify, and repair or warn of dangerous pavement conditions."},
      {h:"Common Broken Pavement Injuries We Handle",body:"Trip and fall accidents on broken pavement cause some of the most serious injury patterns in premises liability law. We regularly handle claims involving: broken wrists and arms (from outstretched hands during falls), knee injuries including torn ACL and meniscus damage, hip fractures (especially in elderly victims), traumatic brain injuries and concussions from striking the ground, facial injuries and dental damage, shoulder injuries including rotator cuff tears, and spinal injuries from awkward landing positions."},
      {h:"What You Need to Prove — and How HazardPin Helps",body:"To succeed in a broken pavement trip and fall case, you generally need to prove: (1) the dangerous condition existed, (2) the owner knew or should have known about it, and (3) the condition caused your injury. HazardPin's timestamped, geolocated hazard documentation is specifically designed to establish points 1 and 2. When we formally notify a property owner of a documented hazard and they fail to repair it — and someone is then injured — that notification record becomes powerful evidence of constructive notice and negligence."},
      {h:"Government Property: Special Rules Apply",body:"If you were injured on a public sidewalk, city street, park path, or other government-owned surface, special rules apply. Most states require that you file a formal Notice of Claim against the government entity within 6 months (or less) of your injury. Missing this deadline can permanently bar your claim — even if you later file a lawsuit within the general statute of limitations. Contact our office immediately if you were injured on government-owned pavement."},
    ],
    searches:["I tripped on a broken sidewalk","fell on cracked pavement near a store","uneven sidewalk trip and fall settlement","city sidewalk injury lawsuit","can I sue the city for a sidewalk injury","broken curb trip and fall","fell on cracked parking lot","what to do after tripping on broken pavement","tripped in a pothole injury","sidewalk height differential injury claim"],
  },
  {
    id:"slip-hazard",
    caption:"Slip Hazard",
    heroUrl:"https://images.unsplash.com/photo-1581244277943-fe4a9c777540?w=1200&h=500&fit=crop&auto=format",
    seoTitle:"Slip and Fall Injury Attorney | Wet Floor, Spill & Slip Hazard Claims | HazardPin",
    seoDesc:"Slipped on a wet floor, unmarked spill, or slippery surface? You may have a slip and fall injury claim. Free consultation. No fee unless we win.",
    keywords:["slip and fall attorney","wet floor injury claim","slipped in grocery store","fell on wet floor no sign","restaurant slip and fall","slip and fall on ice","unmarked wet floor injury","spill slip and fall lawsuit","slip and fall settlement","premises liability wet floor"],
    photos:[
      {url:"https://images.unsplash.com/photo-1581244277943-fe4a9c777540?w=700&h=460&fit=crop&auto=format",cap:"Wet tile floor — classic slip hazard"},
      {url:"https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=700&h=460&fit=crop&auto=format",cap:"Spilled liquid without warning cone"},
      {url:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=460&fit=crop&auto=format",cap:"Recently mopped floor with no signage"},
      {url:"https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=700&h=460&fit=crop&auto=format",cap:"Grocery store aisle spill"},
    ],
    h1:"Slip and Fall Injuries on Wet & Slippery Floors",
    intro:"Slip and fall accidents on wet, slippery, or unmarked floors are among the most common — and most preventable — premises liability injuries in America. Whether you slipped on a spilled drink at a restaurant, a freshly mopped tile floor at a grocery store, or a leaking refrigeration unit at a big-box retailer, the property owner may be legally responsible for the injuries you suffered. The absence of a warning cone or 'Wet Floor' sign is not just a safety failure — it is evidence of negligence.",
    sections:[
      {h:"What Makes a Wet Floor Legally Dangerous?",body:"Not every slippery floor creates legal liability — but many do. The key legal questions are: (1) Did the owner create the dangerous condition? (2) Did the owner know about the spill or wet floor and fail to address it? (3) Should the owner have discovered it through reasonable inspection? The longer a spill sits unaddressed, the stronger the argument that the owner had 'constructive notice' — meaning they reasonably should have known about it. Many successful cases are built on security camera footage showing exactly how long a spill was present before the fall."},
      {h:"Common Locations for Slip and Fall Injuries",body:"We handle slip and fall cases at: grocery stores and supermarkets (the most common location), restaurants and fast food establishments, hotel lobbies and hallways, retail stores and shopping centers, hospital and medical facility corridors, apartment building common areas, swimming pool decks, and workplace environments. Each of these locations carries its own duty of care standards, inspection requirements, and liability rules."},
      {h:"The 'Notice' Issue — and Why It Matters",body:"In most slip and fall cases, the central legal fight is over notice: what did the owner know, and when did they know it? Owners who created the dangerous condition (e.g., mopped the floor) are presumed to have known about it. Owners who did not create it must be proven to have had actual or constructive notice. Constructive notice is established by showing the condition existed long enough that a reasonable inspection would have discovered it. Security footage, employee logs, cleaning schedules, and prior incident reports are all critical evidence."},
      {h:"Injuries Commonly Caused by Slip and Falls",body:"Slip and fall accidents on hard floors typically cause serious injuries because the victim falls backward or sideways with no warning. Common injuries include: hip fractures (among the most serious, especially in older adults), tailbone and coccyx fractures, knee ligament tears, back and spinal injuries, wrist fractures from catching a fall, head injuries and concussions, and shoulder injuries from impact or catching the fall."},
      {h:"What to Do After a Slip and Fall",body:"Your actions in the minutes and hours after a slip and fall directly impact your legal case. First, photograph the floor, the spill, any absence of warning signs, and your injuries — before you leave the scene. Report the incident to the manager and request a copy of the incident report. Identify and collect contact information from any witnesses. Seek immediate medical attention, even for seemingly minor pain. Do not give a recorded statement to insurance representatives before consulting an attorney."},
    ],
    searches:["I slipped in a grocery store","fell on wet floor at restaurant","slip and fall no wet floor sign","slipped on freshly mopped floor","slipped in Walmart","wet floor injury settlement amount","how to file a slip and fall claim","can I sue a restaurant for slipping","slip and fall on ice in parking lot","grocery store slip and fall lawyer"],
  },
  {
    id:"damaged-stairway",
    caption:"Damaged Stairway",
    heroUrl:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=500&fit=crop&auto=format",
    seoTitle:"Stair Fall Injury Attorney | Broken Steps, Loose Handrail & Staircase Accident Claims | HazardPin",
    seoDesc:"Fell down stairs due to broken steps, a loose handrail, or poor lighting? You may have a legal claim. Free consultation. No fee unless we win.",
    keywords:["fell down stairs injury","broken stair injury attorney","loose handrail fall injury","stair fall lawsuit","fell on broken step","loose railing injury","staircase accident lawyer","fell down apartment stairs","broken banister injury","stair fall settlement"],
    photos:[
      {url:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=700&h=460&fit=crop&auto=format",cap:"Crumbling exterior staircase"},
      {url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=460&fit=crop&auto=format",cap:"Loose and deteriorated handrail"},
      {url:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&h=460&fit=crop&auto=format",cap:"Uneven risers — classic stair hazard"},
      {url:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=460&fit=crop&auto=format",cap:"Dimly lit interior stairwell"},
    ],
    h1:"Staircase Fall Injuries: Broken Steps, Loose Rails & Stair Accidents",
    intro:"Falls on dangerous staircases are one of the leading causes of serious injury in premises liability law. A broken step, a loose or missing handrail, inadequate lighting, uneven risers, a slippery surface, or a missing non-slip strip — any of these defects can transform a routine trip up or down stairs into a catastrophic fall. Property owners have a legal obligation to maintain their staircases in a safe condition and to repair or warn of any known defects.",
    sections:[
      {h:"Common Staircase Defects That Cause Falls",body:"The most legally actionable staircase defects include: broken or cracked steps with loose pieces, uneven riser heights that disrupt a person's natural stride, missing or damaged non-slip treads, handrails that are loose, wobbly, or improperly secured, missing handrails where code requires them, banisters with gaps or sharp edges, inadequate lighting in stairwells making defects invisible, and steps that are wet, icy, or slippery without warning. Building codes specify exact requirements for riser height, tread depth, handrail height, and lighting — violations of these codes are strong evidence of negligence."},
      {h:"I Fell Down the Stairs — Do I Have a Case?",body:"If you fell on someone else's staircase due to a defect the owner knew or should have known about, you likely have a viable premises liability claim. The most important factors are: (1) Was there a defect? (2) Did the owner know about it or should they have? (3) Was the defect what caused your fall? Property owners often argue you were distracted, wearing improper footwear, or carrying items. An experienced premises liability attorney can counter these defenses with building code evidence, maintenance records, and prior incident reports."},
      {h:"Loose Handrail and Missing Banister Injuries",body:"Handrail and banister injuries are some of the most severe in staircase cases because a person who reaches for a rail during a stumble — and finds it loose, missing, or collapsing — often falls the entire length of the staircase. Property owners are required by building codes to install, maintain, and inspect handrails. A wobbling rail that has been reported to management and not fixed is one of the strongest liability scenarios in premises law."},
      {h:"Apartment and Rental Property Stair Falls",body:"Residential landlords have a clear legal duty to maintain common-area staircases in safe condition. If you fell on a shared staircase in your apartment building — even if you have lived there for years — the landlord may be liable for failing to repair a known defect. Prior written complaints about a staircase defect create strong evidence of notice. Even without written complaints, a defect that has visibly existed for an extended period establishes constructive notice."},
      {h:"Business and Commercial Staircase Falls",body:"Customers who fall on defective staircases in retail stores, restaurants, hotels, office buildings, and other commercial properties are invitees — the category of visitor owed the highest duty of care. The commercial owner must actively inspect, maintain, and repair all staircases on their property, and must warn visitors of any known dangers. Code-compliant lighting, secure handrails, intact treads, and uniform riser heights are non-negotiable minimum requirements."},
    ],
    searches:["I fell down stairs at an apartment","loose handrail injury claim","fell on broken step at work","stair fall settlement amount","broken step injury lawsuit","can I sue my landlord for falling down stairs","fell on stairs at a restaurant","missing handrail injury","stairwell accident attorney","stair fall injury compensation"],
  },
  {
    id:"parking-lot-hazard",
    caption:"Parking Lot Hazard",
    heroUrl:"https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=1200&h=500&fit=crop&auto=format",
    seoTitle:"Parking Lot Injury Attorney | Pothole, Trip and Fall & Parking Lot Accident Claims | HazardPin",
    seoDesc:"Injured in a parking lot due to a pothole, unmarked hazard, or dangerous condition? You may have a legal claim. Free consultation. No fee unless we win.",
    keywords:["parking lot injury attorney","fell in parking lot","pothole injury claim","tripped in parking lot","parking lot trip and fall","fell on speed bump","parking lot slip and fall","parking lot accident injury","shopping mall parking lot injury","parking lot pothole lawsuit"],
    photos:[
      {url:"https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=700&h=460&fit=crop&auto=format",cap:"Severely deteriorated parking lot surface"},
      {url:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&h=460&fit=crop&auto=format",cap:"Large pothole — unmarked and unfilled"},
      {url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=460&fit=crop&auto=format",cap:"Crumbling asphalt near business entrance"},
      {url:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&h=460&fit=crop&auto=format",cap:"Parking lot at night with poor lighting"},
    ],
    h1:"Parking Lot Injuries: Potholes, Trip Hazards & Dangerous Conditions",
    intro:"Parking lots are among the most dangerous pedestrian environments in America — yet they are also among the most frequently neglected. Potholes, crumbling asphalt, missing wheel stops, faded line markings, cracked curbs, poor lighting, and abrupt grade changes send thousands of people to the emergency room every year. The businesses and property owners who control parking lots have a clear legal duty to maintain them in a reasonably safe condition for customers and visitors.",
    sections:[
      {h:"Who Is Responsible for a Parking Lot Injury?",body:"Responsibility depends on who owns or controls the parking lot. If the lot serves a business, the business and property owner are likely responsible. Shopping centers and strip malls may have a separate property management company. Parking garages operated by municipalities may require a government tort claim. In cases involving shared lots or leased commercial space, liability may be shared. An attorney can quickly identify the responsible parties and determine who carries insurance for the hazard."},
      {h:"Common Parking Lot Hazards That Cause Injuries",body:"We handle parking lot injury claims involving: deep potholes and alligator cracking in asphalt, abrupt grade changes and pavement drop-offs, broken or missing wheel stops (parking curbs), deteriorated concrete bumpers, cracked and sunken pavement near drain areas, faded or missing pedestrian crossing markings, standing water that freezes or creates slippery surfaces, inadequate lighting in lots and garages, shopping cart corrals with protruding metal, and improperly placed construction materials or barriers."},
      {h:"The Pothole Problem: When Does It Become Negligence?",body:"Not every pothole creates legal liability — but many do. A pothole that has existed for months, that has been reported to the property owner, that has caused prior incidents, or that is large enough to pose a clear danger to a walking pedestrian typically meets the threshold for premises liability. The property owner's maintenance records, prior repair orders, and any prior complaints about the same hazard are all critical evidence. HazardPin's documentation system creates a dated, verifiable record of when a hazard was first identified and when the owner was formally notified."},
      {h:"Parking Lot Falls in the Dark: Lighting Negligence",body:"Poor lighting in parking lots is a contributing factor in a significant percentage of parking lot injuries — both trip and fall accidents and criminal assault claims. When a pothole, grade change, or surface defect is invisible due to inadequate lighting, the property owner's failure to maintain proper illumination becomes an independent basis for liability. Building and fire codes specify minimum lighting levels for commercial parking areas."},
      {h:"Injuries from Parking Lot Falls",body:"Parking lot falls are often severe because victims trip unexpectedly on an uneven surface, with no warning, and fall onto hard asphalt or concrete. Common injuries include: hip fractures, wrist and arm fractures from attempting to catch a fall, knee ligament tears, shoulder dislocations and rotator cuff injuries, head injuries and traumatic brain injuries, facial injuries from striking the pavement, and spinal injuries from awkward landing positions."},
    ],
    searches:["fell in a parking lot injury","tripped on pothole in parking lot","parking lot trip and fall settlement","can I sue a store for a parking lot injury","fell on cracked parking lot asphalt","parking lot injury at Walmart","slipped in parking lot ice","parking lot fall injury lawyer","who is responsible for a parking lot injury","dark parking lot injury claim"],
  },
  {
    id:"loose-guardrail",
    caption:"Loose Guardrail",
    heroUrl:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=500&fit=crop&auto=format",
    seoTitle:"Guardrail & Railing Failure Injury Attorney | Fell Over Railing Claims | HazardPin",
    seoDesc:"Injured because a guardrail, balcony railing, or safety barrier failed or was missing? You may have a serious premises liability claim. Free consultation.",
    keywords:["fell over guardrail injury","railing collapse injury","balcony railing failure","loose guardrail injury attorney","fell over balcony railing","railing gave way injury","deck railing collapse","missing guardrail fall","railing failure lawsuit","guard rail injury claim"],
    photos:[
      {url:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&h=460&fit=crop&auto=format",cap:"Deteriorated metal guardrail"},
      {url:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&h=460&fit=crop&auto=format",cap:"Rusted and loose balcony railing"},
      {url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=460&fit=crop&auto=format",cap:"Inadequate barrier at elevation change"},
      {url:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&h=460&fit=crop&auto=format",cap:"Missing railing section on exterior walkway"},
    ],
    h1:"Guardrail & Railing Failure Injuries: When Safety Barriers Fail",
    intro:"Guardrails, handrails, balcony railings, and safety barriers exist for one reason: to prevent people from falling. When these critical safety systems are loose, corroded, improperly installed, missing entirely, or otherwise defective, the consequences can be catastrophic — including falls from significant heights, permanent disability, and death. Property owners have a non-negotiable duty to maintain all railings and barriers in compliance with building codes.",
    sections:[
      {h:"Types of Railing and Guardrail Failures",body:"Railing and guardrail failures take many forms, all of which can be the basis of a premises liability claim: loose posts or balusters that give way under pressure, corroded or rusted metal connections that snap under normal loading, wooden railings with rot or insect damage that appear solid but are not, improperly welded or bolted connections that fail, railings set at insufficient height to prevent an adult from going over, gaps between balusters that allow a person to fall through, missing sections where a railing has been removed and not replaced, and recently installed railings that do not meet code specifications."},
      {h:"Building Code Requirements for Railings",body:"Building codes across the United States specify precise requirements for guardrails and handrails: minimum height of 42 inches for guardrails protecting elevated areas, maximum 4-inch opening between balusters (to prevent passage of a 4-inch sphere), structural requirements to withstand a minimum 200-pound point load, and specific requirements for grip shape and continuity of handrails. When a railing fails to meet any of these code standards and that failure causes an injury, the code violation itself is powerful evidence of negligence."},
      {h:"Balcony and Deck Railing Collapses",body:"Balcony and deck railing collapses are among the most devastating premises liability scenarios because they often involve falls from significant heights. These incidents are tragically common at rental properties, hotels, bars and nightclubs, apartment complexes, and older residential buildings where railings have not been inspected or maintained. When a person leans against or grabs a railing for support — a completely reasonable action — and the railing fails, the property owner is almost always liable."},
      {h:"Who Is Responsible When a Railing Fails?",body:"The property owner is the primary responsible party when a railing or guardrail fails. If the property is leased to a commercial tenant who controls the space, the tenant may share liability. If the railing failure results from a manufacturing defect, the manufacturer may be liable under product liability law. Contractors who improperly installed or repaired a railing may also be liable. An experienced attorney will identify all potentially responsible parties and pursue the full scope of available insurance coverage."},
      {h:"Railing Failure Injuries and Damages",body:"Falls from elevation due to railing failures are among the highest-severity injuries in premises liability law. Common results include: traumatic brain injury, spinal cord injuries including paralysis, internal organ damage, multiple fractures, severe lacerations, and wrongful death. Cases involving these injuries often result in substantial settlements and verdicts. Documenting the failed railing immediately after the incident — before it is repaired or replaced — is critical evidence. If you or a family member was injured in a railing failure, contact our office immediately."},
    ],
    searches:["railing gave way and I fell","balcony railing collapse injury","fell off balcony due to loose railing","guardrail failure injury attorney","deck railing collapse lawsuit","fell over railing at restaurant","leaned on railing and it broke","railing not to code injury claim","can I sue for railing collapse","second floor railing fall injury"],
  },
  {
    id:"playground-danger",
    caption:"Playground Danger",
    heroUrl:"https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=1200&h=500&fit=crop&auto=format",
    seoTitle:"Playground Injury Attorney | Child Injured on Defective Playground Equipment | HazardPin",
    seoDesc:"Was your child injured on a broken swing, defective slide, or unsafe playground? You may have a premises liability claim. Free consultation. No fee unless we win.",
    keywords:["child injured on playground","defective playground equipment injury","broken swing injury","playground fall injury attorney","child fell off playground equipment","playground injury lawsuit","unsafe playground injury claim","my child was hurt at a park","broken playground slide injury","school playground injury attorney"],
    photos:[
      {url:"https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=700&h=460&fit=crop&auto=format",cap:"Deteriorated playground structure"},
      {url:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&h=460&fit=crop&auto=format",cap:"Broken swing chain — active hazard"},
      {url:"https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=700&h=460&fit=crop&auto=format",cap:"Rusted and sharp playground equipment"},
      {url:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&h=460&fit=crop&auto=format",cap:"Inadequate fall zone surfacing"},
    ],
    h1:"Playground Injuries: Defective Equipment & Unsafe Play Areas",
    intro:"Playgrounds should be places of joy and development — not danger. But when property owners fail to inspect, maintain, and repair playground equipment, children are put at serious risk. Broken swings, corroded climbing structures, sharp exposed hardware, inadequate impact-absorbing surfaces, entrapment hazards, and improperly anchored equipment cause tens of thousands of emergency room visits in the United States each year. When a child is injured on defective playground equipment, the property owner — whether a school, city park, apartment complex, or private business — may be legally liable.",
    sections:[
      {h:"Common Playground Hazards That Injure Children",body:"The most frequently reported playground hazards that lead to legal claims include: broken or disconnected swing chains and seats, exposed bolts, screws, and sharp metal edges, S-hooks that have opened and can catch clothing, entrapment hazards in railings and openings, deteriorated or missing impact-absorbing surface material under equipment, improperly anchored equipment that shifts or tips, rotted or structurally compromised wooden structures, inadequate spacing between equipment and hard surfaces, protrusions that catch clothing creating strangulation risk, and equipment that is not age-appropriate for the children using it."},
      {h:"Who Is Responsible for a Playground Injury?",body:"Responsibility for a playground injury depends on who owns and controls the equipment. School district playgrounds: the school district and potentially the local government are responsible. City and public park playgrounds: the municipality is responsible — note that special government claim notice requirements apply. Apartment complex and HOA playgrounds: the property management company or HOA is responsible. Day care and private school playgrounds: the facility operator is responsible. Fast food restaurant playgrounds: the corporate franchise or local owner is responsible. In all cases, the responsible party has a duty to regularly inspect equipment, document inspections, promptly repair defects, and remove equipment from service when it cannot be immediately repaired."},
      {h:"What Maintenance Should Property Owners Perform?",body:"The Consumer Product Safety Commission (CPSC) and ASTM International publish detailed safety guidelines for public playground equipment. Responsible property owners should: conduct visual inspections at least weekly, perform operational inspections at least monthly, perform comprehensive annual inspections by a Certified Playground Safety Inspector (CPSI), keep written records of all inspections and repairs, immediately cordon off and remove from service any equipment with identified hazards, and maintain impact-absorbing surface material at the required depth throughout the fall zone."},
      {h:"Injuries Children Suffer on Defective Playgrounds",body:"Playground injuries range from minor to catastrophic. The most serious injuries we handle include: fractures and broken bones from falls, traumatic brain injuries from head strikes on hard surfaces or equipment, strangulation and entrapment injuries from clothing caught on protrusions, lacerations and puncture wounds from exposed hardware, soft tissue injuries and dislocations, and in rare but tragic cases, wrongful death. The severity of playground injuries is significantly increased when the impact-absorbing surface beneath equipment is missing, compacted, or insufficient."},
      {h:"The Attractive Nuisance Doctrine and Playgrounds",body:"Playgrounds are a classic example of an attractive nuisance — a condition that is likely to attract children who may not appreciate the danger. Even children who enter a property without permission may have legal protection if they were injured on or near playground equipment. Property owners who have playground equipment visible from a public area must take reasonable steps to ensure it is safe — not just for authorized users, but because the equipment will inevitably attract children regardless of permission."},
    ],
    searches:["my child was hurt on a playground","broken swing injury at school","playground equipment injury lawsuit","child fell off slide injury","defective playground injury attorney","park playground injury claim","can I sue the school for playground injury","broken playground equipment child hurt","playground surface injury child","city park playground injury attorney"],
  },
];

const VISITOR_TYPES=[
  {type:"Invitee",sub:"Highest duty of care",col:"#00b4e4",bg:"rgba(0,180,228,0.06)",br:"rgba(0,180,228,0.28)",desc:"A person invited onto property for the owner's benefit — customers, event guests, or members of the public using public facilities.",duties:["Must actively inspect for hidden dangers","Must repair known hazards or provide adequate warning","Maintain property in a reasonably safe condition","Regular maintenance and inspection schedule required"],ex:"Grocery shoppers, restaurant diners, hotel guests, amusement park visitors, bank customers."},
  {type:"Licensee",sub:"Moderate duty of care",col:"#7eaacc",bg:"rgba(126,170,204,0.06)",br:"rgba(126,170,204,0.28)",desc:"A person entering with the owner's consent but not for the owner's commercial benefit — a social guest, neighbor, or salesperson.",duties:["Must warn of known hidden dangers","No duty to inspect for undiscovered dangers","Must not create new unexpected hazards","Refrain from willful or wanton conduct"],ex:"Social guests at a private home, neighbors with permission, door-to-door salespeople, postal workers."},
  {type:"Trespasser",sub:"Limited duty of care",col:"#8896a8",bg:"rgba(136,150,168,0.06)",br:"rgba(136,150,168,0.28)",desc:"A person entering without any right or permission. Very limited protection, with crucial exceptions for children under the attractive nuisance doctrine.",duties:["Must not set intentional traps or spring guns","Warn of known artificial dangers if discovered","Attractive nuisance doctrine — higher duty to children","No general duty to inspect or repair"],ex:"Attractive nuisance: pools, trampolines, construction sites, and heavy machinery that attract children."},
];
const OWNER_TYPES=[
  {type:"City & Government Property",desc:"Sidewalks, parks, municipal buildings, public facilities",items:["Sovereign immunity may limit claims — strict notice deadlines apply","Must file a government tort claim notice (often within 6 months)","Damages may be capped by state statute","Written notice usually required before a lawsuit can be filed","Includes parks, sidewalks, public buildings, and municipal pools"]},
  {type:"Private Residences",desc:"Homeowners and residential landlords",items:["Social guests are licensees — warn of known hazards, no duty to inspect","Landlords owe invitee-level duty to tenants in common areas","Homeowners insurance generally covers premises liability","Pools, trampolines, playground equipment trigger elevated duty","Dog bite liability varies by state (strict liability vs. one-bite rule)"]},
  {type:"Businesses — Restaurants & Grocery Stores",desc:"Retail stores, restaurants, service businesses, commercial offices",items:["All customers are invitees — HIGHEST duty of care applies","Must inspect regularly and remedy all known or discoverable hazards","Spills, wet floors, poor lighting, and uneven surfaces are common claims","Required to use adequate warning signage while cleaning","Must address foreseeable criminal activity in high-crime areas","Notice question: how long was the hazard present before the incident?"]},
  {type:"Amusement Parks & Entertainment",desc:"Theme parks, water parks, sports venues, entertainment centers",items:["Extremely high duty of care — all patrons are invitees in a commercial setting","Must follow manufacturer inspection schedules for all rides","Staff must be trained to identify and immediately respond to hazards","Liability waivers are often unenforceable for standard negligence","State and federal regulations govern ride inspections and safety","Known dangerous conditions require immediate closure and remediation"]},
];

const FAQS=[
  {q:"How long does a premises liability case take?",a:"Every case is different. Simple cases with clear liability can settle in 3-6 months. Cases involving serious injuries, government property, or disputed fault may take 1-3 years. The vast majority of premises liability cases settle before going to trial."},
  {q:"What is my case worth?",a:"Case value depends on severity of your injuries, medical expenses (past and future), lost wages, pain and suffering, and whether the property owner acted with gross negligence. An attorney can give a realistic estimate after reviewing your specific facts."},
  {q:"What if I was partially at fault for the accident?",a:"Most states use comparative negligence rules. You may still recover damages even if you were partially at fault — your compensation is reduced by your percentage of fault. For example, if you were 20% at fault and damages are $100,000, you may recover $80,000. A few states use contributory negligence, which can bar recovery if you were at all at fault."},
  {q:"What if I signed a liability waiver?",a:"Waivers are often unenforceable, especially for ordinary negligence on commercial property. Courts routinely void waivers that are too broad, were not clearly presented, or involve gross negligence. Never assume a waiver eliminates your claim — consult an attorney."},
  {q:"What should I do immediately after a slip and fall?",a:"(1) Photograph the hazard and your injuries immediately. (2) Report the incident to the property manager and get a written copy. (3) Collect witness names and contact information. (4) Seek medical attention even if you feel minor pain. (5) Do not give a recorded statement to an insurance company before consulting an attorney. (6) Pin the incident here to begin documentation."},
  {q:"Is there a deadline to file a claim?",a:"Yes — statutes of limitations vary by state, typically 2-3 years from the date of injury. Government property claims are shorter, sometimes requiring formal notice within 6 months of the incident. Missing a deadline can permanently bar your claim, so act promptly."},
  {q:"What if the property owner says they did not know about the hazard?",a:"Owners are responsible for hazards they knew about AND hazards they reasonably should have discovered through proper inspection. Pinning a hazard on HazardPin creates a timestamped, geolocated record that can establish the owner had constructive notice — meaning they had reason to know even if they claim they did not."},
  {q:"What damages can I recover?",a:"You may be entitled to: medical expenses (past and future), lost income and reduced earning capacity, pain and suffering, emotional distress, loss of enjoyment of life, and in cases of gross negligence, punitive damages."},
  {q:"How does pinning a hazard help my legal case?",a:"Every pin creates a timestamped, geolocated, documented record of the hazard's existence. When we notify the property owner, that notification becomes evidence of constructive notice. If the owner fails to correct the hazard and someone is injured, that inaction is powerful evidence of negligence."},
  {q:"Does HazardPin operate in all 50 states?",a:"We are actively expanding to all 50 states with licensed attorney representation in each state. The map, documentation, and notification features are available nationwide now. If your state representation is not yet live, your pin is still recorded and our team will connect you with qualified local counsel."},
];

const ARTICLES=[
  {id:1,tag:"SAFETY GUIDE",title:"Top 10 Most Dangerous Premises Liability Hazards in America",date:"December 12, 2025",excerpt:"From wet grocery store floors to crumbling parking lot pavement, these are the hazards most likely to send someone to the emergency room — and the ones property owners most often ignore.",body:"Premises liability injuries affect millions of Americans every year.\n\n**1. Wet and Slippery Floors** — The classic slip-and-fall. Spills without warning signs, recently mopped tile, and leaking refrigeration units are leading causes of serious injuries in retail settings. Property owners are required to clean spills promptly and post visible warnings.\n\n**2. Broken and Uneven Pavement** — Cracked sidewalks, heaved concrete, and unmarked pavement drops cause thousands of trip-and-fall injuries annually. Cities and municipalities face significant liability when public walkways are left in disrepair.\n\n**3. Inadequate Lighting** — Poor lighting in parking garages, stairwells, and building entrances contributes to both fall injuries and criminal assault claims. Owners who fail to maintain adequate lighting may be liable for both types of harm.\n\n**4. Defective Stairs and Handrails** — Loose banisters, broken steps, and stairs without adequate grip strips send people to emergency rooms every day. These hazards are especially dangerous for elderly visitors.\n\n**5. Unmarked Hazards During Construction** — Property owners conducting renovations must adequately warn visitors of all construction-zone hazards. Missing barriers, open holes, and low-hanging obstacles are all preventable. If you see any of these hazards on someone else's property, pin it immediately."},
  {id:2,tag:"LEGAL GUIDE",title:"What to Do Immediately After a Slip and Fall",date:"November 28, 2025",excerpt:"The first 24 hours after a premises liability injury are the most critical for your legal case. Here is exactly what you should and should not do.",body:"A slip, trip, or fall on someone else's property can happen in an instant. What you do in the hours and days afterward can make or break your legal claim.\n\n**Do This Immediately**\n\nFirst, photograph everything before you leave — the hazard itself, your injuries, your surroundings, and any warning signs that were (or were not) present. Time-stamped photos from your phone are powerful evidence. If witnesses are present, get their names and contact information.\n\nReport the incident to the property manager or store manager before you leave. Ask for a copy of any incident report they complete. Seek medical attention even if your pain seems minor. Many injuries — especially soft tissue injuries, concussions, and back trauma — worsen significantly within 24-72 hours.\n\n**What Not to Do**\n\nDo not give a recorded statement to an insurance adjuster or property representative before consulting an attorney. Do not post about the incident on social media. Defense attorneys routinely search social media for evidence to contradict injury claims. Do not accept an early settlement offer without legal advice.\n\n**Pin the Incident on HazardPin**\n\nCreating a pin documents the hazard's existence with a timestamp and location. If we have already notified the property owner of this hazard and they failed to correct it, that notification becomes critical evidence of negligence."},
  {id:3,tag:"EDUCATION",title:"Understanding Attractive Nuisance: When Trespassers Deserve Protection",date:"November 5, 2025",excerpt:"The law generally provides limited protection to trespassers — but when a property feature is likely to attract children, the rules change significantly.",body:"Property owners generally owe very little duty to trespassers. But there is a powerful exception that every property owner and parent should understand: the attractive nuisance doctrine.\n\n**What Is Attractive Nuisance?**\n\nAn attractive nuisance is any artificial condition on a property that is likely to attract children who may not appreciate the danger it poses. Classic examples include swimming pools, trampolines, abandoned vehicles, construction equipment, and unlocked buildings.\n\nThe law recognizes that young children cannot be expected to fully appreciate dangers. When a property feature is likely to draw curious children onto the property, the owner has a heightened duty of care even toward those children.\n\n**What Must a Property Owner Do?**\n\nTo avoid liability, a property owner must take reasonable steps to eliminate the danger or protect children from it. For a swimming pool, this typically means a locked fence of adequate height. For a trampoline, it means securing or removing it when not in use. For construction sites, it means proper fencing and locked equipment.\n\n**Why This Matters for HazardPin**\n\nPlaygrounds, pool areas, and construction zones are among the most commonly pinned hazard types on our platform. When these hazards are documented and the owner notified, it creates a clear record that the owner was aware of the risk. Property owners who fail to act after notification face significantly elevated exposure in any subsequent injury claim."},
];

const TESTIMONIALS=[
  {quote:"I slipped on an unmarked wet floor at a grocery store. I had no idea what to do. HazardPin helped me document everything within minutes of the fall, and the attorney they connected me with handled the entire case.",name:"M.R.",loc:"Las Vegas, NV",result:"Settled"},
  {quote:"My daughter was injured on broken playground equipment at a city park. The pin I created that day — with photos and a timestamp — became a key piece of evidence in our case.",name:"T.K.",loc:"Phoenix, AZ",result:"Verdict for plaintiff"},
  {quote:"A pothole in a poorly lit parking lot sent me to the ER. I never would have thought to document it the way HazardPin walks you through. The owner had ignored that hazard for months.",name:"D.W.",loc:"Henderson, NV",result:"Settled"},
  {quote:"The owner notification feature is what sets this apart. When the property manager received the formal notice and still did nothing for three weeks — and then I fell — that inaction told the whole story.",name:"R.A.",loc:"Reno, NV",result:"Settled"},
];

const EMERGENCY=[
  {label:"Emergency",          number:"911",             desc:"Life-threatening emergency",          col:"#ff3838"},
  {label:"LVMPD Non-Emergency",number:"(702) 828-3111",  desc:"Non-urgent police matter",            col:"#ff7a00"},
  {label:"Code Enforcement",   number:"(702) 229-6357",  desc:"Las Vegas property code violations",  col:"#ffc800"},
  {label:"Clark County",       number:"(702) 455-3455",  desc:"Unincorporated county hazards",       col:"#00b4e4"},
  {label:"Nevada DOT",         number:"1-877-687-6237",  desc:"State highway and road hazards",      col:"#7eaacc"},
];

const STRINGS={
  en:{h1a:"Protecting Your Community,",h1b:"One Pin at a Time.",sub:"Map hazardous property conditions, formally notify owners of their legal duty of care, and track every hazard through to correction.",block1t:"PIN A",block1b:"HAZARD",block2t:"PIN AN",block2b:"INJURY",block3t:"SEE PINNED",block3b:"HAZARDS",block4t:"HAZARDS",block4b:"RESOLVED"},
  es:{h1a:"Protegiendo Tu Comunidad,",h1b:"Un Pin a la Vez.",sub:"Documenta condiciones peligrosas, notifica a los propietarios de su deber legal, y rastrea cada peligro hasta su correccion.",block1t:"MARCAR",block1b:"PELIGRO",block2t:"REPORTAR",block2b:"LESION",block3t:"VER",block3b:"PELIGROS",block4t:"PELIGROS",block4b:"RESUELTOS"},
};

function pinColor(h){return h.status==="corrected"?C.green:h.severity==="critical"?C.red:h.severity==="high"?C.orange:C.cyan;}

function Badge({status,severity}){
  if(status==="corrected") return <span style={{background:"rgba(0,204,119,0.12)",color:C.green,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,border:"1px solid rgba(0,204,119,0.3)"}}>CORRECTED</span>;
  const m={critical:["rgba(255,56,56,0.12)",C.red,"rgba(255,56,56,0.3)"],high:["rgba(255,122,0,0.12)",C.orange,"rgba(255,122,0,0.3)"],medium:["rgba(255,200,0,0.12)",C.yellow,"rgba(255,200,0,0.3)"]};
  const[bg,col,br]=m[severity]||["rgba(0,180,228,0.1)",C.cyan,C.cyanBorder];
  return <span style={{background:bg,color:col,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,border:`1px solid ${br}`}}>{severity?.toUpperCase()}</span>;
}

function HazardTimeline({h}){
  const steps=[{label:"PINNED",done:true},{label:"NOTIFIED",done:h.notified},{label:"RESPONSE",done:false},{label:"CORRECTED",done:h.status==="corrected"}];
  return(
    <div style={{display:"flex",gap:0,flex:1}}>
      {steps.map((s,i)=>(
        <div key={s.label} style={{flex:1,position:"relative"}}>
          {i<steps.length-1&&<div style={{position:"absolute",top:5,left:"50%",right:"-50%",height:2,background:s.done&&steps[i+1]?.done?C.cyan:C.border,zIndex:0}}/>}
          <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{width:11,height:11,borderRadius:"50%",background:s.done?C.cyan:C.border}}/>
            <div style={{fontSize:8,fontWeight:800,color:s.done?C.white:C.textDim,letterSpacing:"0.03em",textAlign:"center"}}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShareBtn({hazard}){
  const[copied,setCopied]=useState(false);
  const share=()=>{
    const txt=`Hazard pinned at ${hazard.address}: ${hazard.title} — hazardpin.com`;
    if(navigator.share){navigator.share({title:"HazardPin",text:txt,url:window.location.href}).catch(()=>{});}
    else{navigator.clipboard?.writeText(txt).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});}
  };
  return <button onClick={share} style={{background:"transparent",border:`1px solid ${C.border}`,color:copied?C.cyan:C.textDim,padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:"0.04em",transition:"color 0.2s"}}>{copied?"COPIED":"SHARE"}</button>;
}

function PhotoUpload({photos,onAdd,onRemove}){
  const[drag,setDrag]=useState(false);
  const handle=(files)=>{Array.from(files).forEach(f=>{if(!f.type.startsWith("image/"))return;const r=new FileReader();r.onload=e=>onAdd({name:f.name,url:e.target.result});r.readAsDataURL(f);});};
  return(
    <div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:12,fontWeight:700,color:C.textMuted,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>Photos <span style={{color:"#555",fontWeight:400,textTransform:"none",letterSpacing:0}}>— strongly recommended as evidence</span></label>
      <label onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files);}}
        style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,padding:"22px",background:drag?C.cyanDim:C.muted,border:`1.5px dashed ${drag?C.cyan:C.border}`,borderRadius:10,cursor:"pointer",transition:"all 0.2s"}}>
        <input type="file" accept="image/*" multiple onChange={e=>handle(e.target.files)} style={{display:"none"}}/>
        <Camera size={22} color={drag?C.cyan:C.textDim}/>
        <div style={{fontSize:13,color:drag?C.cyan:C.textDim,fontWeight:600}}>Click to add photos or drag and drop</div>
        <div style={{fontSize:11,color:C.textDim}}>JPG, PNG, HEIC — multiple files accepted</div>
      </label>
      {photos.length>0&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
          {photos.map((p,i)=>(
            <div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",border:`1px solid ${C.border}`}}>
              <img src={p.url} alt={p.name} style={{width:80,height:80,objectFit:"cover",display:"block"}}/>
              <button onClick={()=>onRemove(i)} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,0.75)",border:"none",color:"white",width:20,height:20,borderRadius:"50%",cursor:"pointer",fontSize:12,lineHeight:"20px",textAlign:"center",padding:0}}>x</button>
            </div>
          ))}
          <label style={{width:80,height:80,borderRadius:8,border:`1.5px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.textDim,fontSize:24}}>
            <input type="file" accept="image/*" multiple onChange={e=>handle(e.target.files)} style={{display:"none"}}/>+
          </label>
        </div>
      )}
    </div>
  );
}

function NotifyCheck({label,checked,onChange}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:C.muted,borderRadius:8,marginBottom:16,cursor:"pointer"}} onClick={()=>onChange(!checked)}>
      <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${checked?C.cyan:C.border}`,background:checked?C.cyan:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
        {checked&&<span style={{color:C.black,fontSize:11,fontWeight:900}}>v</span>}
      </div>
      <Bell size={14} color={checked?C.cyan:C.textDim}/>
      <span style={{fontSize:13,color:checked?C.white:C.textMuted}}>{label}</span>
    </div>
  );
}

function Lbl({children,req}){return <label style={{display:"block",fontSize:12,fontWeight:700,color:C.textMuted,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>{children}{req&&<span style={{color:C.cyan}}> *</span>}</label>;}
function Inp({label,type="text",value,onChange,placeholder,req,span2}){
  return(
    <div style={{marginBottom:15,gridColumn:span2?"1/-1":"auto"}}>
      <Lbl req={req}>{label}</Lbl>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"10px 14px",background:C.muted,border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,color:C.white,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}
        onFocus={e=>e.target.style.borderColor=C.cyan} onBlur={e=>e.target.style.borderColor=C.border}/>
    </div>
  );
}
function Sel({label,value,onChange,options,req}){
  return(
    <div style={{marginBottom:15}}>
      <Lbl req={req}>{label}</Lbl>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",background:C.muted,border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,color:value?C.white:C.textDim,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}>
        <option value="" style={{color:C.textDim}}>Select...</option>
        {options.map(o=><option key={o} value={o} style={{color:C.white,background:C.card}}>{o}</option>)}
      </select>
    </div>
  );
}
function Txt({label,value,onChange,placeholder,req,rows=4}){
  return(
    <div style={{marginBottom:15}}>
      <Lbl req={req}>{label}</Lbl>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{width:"100%",padding:"10px 14px",background:C.muted,border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,color:C.white,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}
        onFocus={e=>e.target.style.borderColor=C.cyan} onBlur={e=>e.target.style.borderColor=C.border}/>
    </div>
  );
}
function CyanBtn({onClick,disabled,children,color}){
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#1c1c1c":(color||C.cyan),color:disabled?C.textDim:C.black,border:"none",padding:"13px 32px",borderRadius:8,fontSize:13,fontWeight:900,cursor:disabled?"default":"pointer",width:"100%",letterSpacing:"0.05em"}}>{children}</button>;
}
function Success({title,body,onReset,showPrint}){
  return(
    <div style={{background:"rgba(0,204,119,0.06)",border:"1px solid rgba(0,204,119,0.3)",borderRadius:12,padding:32,textAlign:"center",marginTop:8}}>
      <div style={{width:60,height:60,background:C.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:26,color:C.black,fontWeight:900}}>v</div>
      <h3 style={{margin:"0 0 8px",color:C.green,fontSize:22,fontWeight:800}}>{title}</h3>
      <p style={{margin:"0 0 24px",color:C.textMuted,fontSize:14,lineHeight:1.7}}>{body}</p>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={onReset} style={{background:"transparent",color:C.green,border:"1px solid rgba(0,204,119,0.4)",padding:"10px 24px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>Submit Another</button>
        {showPrint&&<button onClick={()=>window.print()} style={{background:"transparent",color:C.textMuted,border:`1px solid ${C.border}`,padding:"10px 24px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>Print / Save PDF</button>}
      </div>
    </div>
  );
}
function SectionWrap({title,subtitle,Icon,children}){
  return(
    <div style={{background:C.black,padding:"0 0 60px",minHeight:"80vh"}}>
      <div style={{maxWidth:780,margin:"0 auto",padding:"40px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
          <div style={{width:38,height:38,background:C.cyanDim,border:`1px solid ${C.cyanBorder}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.cyan,flexShrink:0}}><Icon size={18}/></div>
          <h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.white,letterSpacing:"-0.02em"}}>{title}</h2>
        </div>
        {subtitle&&<p style={{margin:"0 0 28px",fontSize:15,color:C.textMuted,lineHeight:1.6,paddingLeft:50}}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function HazardImg({url,icon,caption,color}){
  const[hov,setHov]=useState(false);
  const[err,setErr]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:8,overflow:"hidden",position:"relative",cursor:"pointer",background:C.card,border:`1px solid ${hov?C.cyanBorder:C.border}`,transition:"border 0.3s"}}>
      {!err?(
        <img src={url} alt={caption} onError={()=>setErr(true)}
          style={{width:"100%",height:190,objectFit:"cover",display:"block",filter:hov?"grayscale(0%) contrast(1.05)":"grayscale(100%) contrast(1.15) brightness(0.75)",transition:"filter 0.5s ease, transform 0.6s ease",transform:hov?"scale(1.07)":"scale(1.0)"}}/>
      ):(
        <div style={{width:"100%",height:190,background:hov?`linear-gradient(145deg,${color}55,${color}22)`:"linear-gradient(145deg,#1c1c1c,#141414)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,transition:"background 0.5s"}}>
          <div style={{fontSize:42,filter:hov?"none":"grayscale(1)",transition:"filter 0.5s"}}>{icon}</div>
          <div style={{width:48,height:2,background:hov?color:C.border,transition:"background 0.5s",borderRadius:2}}/>
        </div>
      )}
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.88))",padding:"28px 12px 12px"}}>
        <div style={{fontSize:11,fontWeight:800,color:hov?C.cyan:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",transition:"color 0.3s"}}>{caption}</div>
      </div>
      <div style={{position:"absolute",top:10,right:10,background:hov?C.cyan:"transparent",color:C.black,fontSize:10,fontWeight:800,padding:hov?"3px 8px":"0",borderRadius:4,letterSpacing:"0.07em",transition:"all 0.25s",opacity:hov?1:0}}>HAZARD</div>
    </div>
  );
}

function BlockBtn({icon,count,top,bot,sub,accent,onClick}){
  const[hov,setHov]=useState(false);
  return(
    <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}
      style={{background:hov?"#1c1c1c":"#141414",border:"none",padding:"26px 20px 24px",cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",transition:"background 0.18s",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:hov?accent:"transparent",transition:"background 0.2s"}}/>
      {/* Either a large count number or an emoji icon */}
      {count!=null
        ? <div style={{fontSize:38,fontWeight:900,color:hov?accent:C.white,letterSpacing:"-0.04em",lineHeight:1,marginBottom:10,transition:"color 0.2s"}}>{count}</div>
        : <div style={{fontSize:28,marginBottom:14,lineHeight:1}}>{icon}</div>
      }
      <div style={{fontSize:11,fontWeight:800,color:C.textMuted,letterSpacing:"0.1em",marginBottom:2}}>{top}</div>
      <div style={{fontSize:22,fontWeight:900,color:hov?accent:C.white,letterSpacing:"-0.03em",lineHeight:1.1,transition:"color 0.2s",marginBottom:10}}>{bot}</div>
      <div style={{fontSize:12,color:C.textMuted,lineHeight:1.5,marginTop:"auto"}}>{sub}</div>
      <div style={{position:"absolute",bottom:20,right:20,fontSize:18,color:hov?accent:C.border,transition:"color 0.2s, transform 0.2s",transform:hov?"translate(3px,-3px)":"translate(0,0)"}}>&#8594;</div>
    </button>
  );
}

function EmergencyWidget(){
  const[open,setOpen]=useState(false);
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:16}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:"none",border:"none",padding:"12px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.red,flexShrink:0}}/>
          <span style={{fontSize:12,fontWeight:800,letterSpacing:"0.06em",color:C.textMuted}}>EMERGENCY CONTACTS</span>
          <span style={{fontSize:11,color:C.textDim}}>— 911 for life-threatening emergencies</span>
        </div>
        <span style={{fontSize:16,color:C.textDim}}>{open?"−":"+"}</span>
      </button>
      {open&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 18px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {EMERGENCY.map(e=>(
            <div key={e.label} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.muted,borderRadius:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:e.col,flexShrink:0}}/>
              <div>
                <div style={{fontSize:11,fontWeight:800,color:C.white}}>{e.label}</div>
                <div style={{fontSize:13,fontWeight:700,color:e.col}}>{e.number}</div>
                <div style={{fontSize:10,color:C.textDim}}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickPin({go}){
  const[open,setOpen]=useState(false);
  const[q,setQ]=useState({address:"",type:"",photo:null});
  const[done,setDone]=useState(false);
  const ok=q.address&&q.type;
  if(done) return(
    <div style={{background:"rgba(0,180,228,0.08)",border:`1px solid ${C.cyanBorder}`,borderRadius:10,padding:"16px 20px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:28,height:28,background:C.cyan,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.black,fontWeight:900}}>&#10003;</div>
        <div><div style={{fontSize:13,fontWeight:700,color:C.cyan}}>Quick pin submitted!</div><div style={{fontSize:12,color:C.textMuted}}>Add more detail anytime from Pin a Hazard.</div></div>
      </div>
      <button onClick={()=>{setDone(false);setQ({address:"",type:"",photo:null});setOpen(false);}} style={{background:"transparent",border:`1px solid ${C.cyanBorder}`,color:C.cyan,padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer"}}>NEW PIN</button>
    </div>
  );
  return(
    <div style={{background:open?"rgba(0,180,228,0.06)":C.card,border:`1px solid ${open?C.cyanBorder:C.border}`,borderRadius:10,overflow:"hidden",marginBottom:16,transition:"border 0.2s,background 0.2s"}}>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>&#9889;</span>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:C.white}}>Quick Pin <span style={{color:C.cyan}}>— pin a hazard in 30 seconds</span></div>
            <div style={{fontSize:12,color:C.textDim}}>3 fields. Photo optional. Full details can be added later.</div>
          </div>
        </div>
        <span style={{fontSize:13,fontWeight:800,color:open?C.cyan:C.textMuted,letterSpacing:"0.06em"}}>{open?"CANCEL":"START →"}</span>
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"16px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <div style={{gridColumn:"1/-1",marginBottom:12}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:5,letterSpacing:"0.06em"}}>LOCATION / ADDRESS *</label>
              <input value={q.address} onChange={e=>setQ(p=>({...p,address:e.target.value}))} placeholder="Where is the hazard? Street address or intersection"
                style={{width:"100%",padding:"10px 14px",background:C.muted,border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,color:C.white,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
            </div>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:5,letterSpacing:"0.06em"}}>HAZARD TYPE *</label>
              <select value={q.type} onChange={e=>setQ(p=>({...p,type:e.target.value}))} style={{width:"100%",padding:"10px 14px",background:C.muted,border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:q.type?C.white:C.textDim,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}>
                <option value="">Select...</option>
                {TYPES.map(t=><option key={t} value={t} style={{background:C.card}}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMuted,marginBottom:5,letterSpacing:"0.06em"}}>PHOTO</label>
              <label style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:C.muted,border:`1.5px dashed ${q.photo?C.cyan:C.border}`,borderRadius:8,cursor:"pointer",color:q.photo?C.cyan:C.textDim,fontSize:13,fontWeight:600}}>
                <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setQ(p=>({...p,photo:ev.target.result}));r.readAsDataURL(f);}} style={{display:"none"}}/>
                <Camera size={16}/>{q.photo?"Photo added":"Add photo (optional)"}
              </label>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button onClick={()=>ok&&setDone(true)} style={{flex:1,background:ok?C.cyan:"#222",color:ok?C.black:C.textDim,border:"none",padding:"11px",borderRadius:8,fontSize:13,fontWeight:900,cursor:ok?"pointer":"default",letterSpacing:"0.05em"}}>SUBMIT QUICK PIN →</button>
            <button onClick={()=>go("report")} style={{background:"transparent",color:C.textMuted,border:`1px solid ${C.border}`,padding:"11px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>Full Form</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MapAddressSearch({onFly}){
  const[q,setQ]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const search=async()=>{
    if(!q.trim())return;
    setLoading(true);setErr("");
    try{
      const res=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`);
      const data=await res.json();
      if(data[0]){onFly(parseFloat(data[0].lat),parseFloat(data[0].lon));}
      else{setErr("Location not found — try a more specific address");}
    }catch(e){setErr("Search unavailable — check your connection");}
    setLoading(false);
  };
  return(
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",gap:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
          placeholder="Jump to any address or city on the map..."
          style={{flex:1,padding:"10px 16px",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,color:C.white,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor=C.cyan} onBlur={e=>e.target.style.borderColor=C.border}/>
        <button onClick={search} style={{background:C.cyan,color:C.black,border:"none",padding:"10px 20px",borderRadius:8,fontWeight:900,cursor:"pointer",fontSize:12,letterSpacing:"0.06em",minWidth:80}}>{loading?"...":"SEARCH"}</button>
      </div>
      {err&&<div style={{fontSize:12,color:C.orange,marginTop:6,paddingLeft:4}}>{err}</div>}
    </div>
  );
}

function LeafletMap({hazards,filter,onMapReady}){
  const divRef=useRef(null);
  const[status,setStatus]=useState("loading");
  useEffect(()=>{
    if(!divRef.current)return;
    let map=null;
    const go=()=>{
      if(!divRef.current||!window.L)return;
      const L=window.L;
      try{map=L.map(divRef.current,{center:[36.1699,-115.1398],zoom:14});}catch(e){return;}
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:19}).addTo(map);
      if(!document.getElementById("hp-popup-css")){
        const s=document.createElement("style");s.id="hp-popup-css";
        s.textContent=".leaflet-popup-content-wrapper{background:#111;border:1px solid #222;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.6)}.leaflet-popup-content{margin:0}.leaflet-popup-tip{background:#111}.leaflet-control-zoom a{background:#111;color:#fff;border-color:#333}.leaflet-control-attribution{background:rgba(10,10,10,0.8)!important;color:#555;font-size:10px}.leaflet-control-attribution a{color:#00b4e4}";
        document.head.appendChild(s);
      }
      hazards.filter(h=>filter==="all"||h.status===filter).forEach(h=>{
        const col=pinColor(h);
        const icon=L.divIcon({className:"",html:`<div style="width:24px;height:24px;background:${col};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid rgba(255,255,255,0.9);box-shadow:0 3px 12px rgba(0,0,0,0.5)"></div>`,iconSize:[24,24],iconAnchor:[12,24],popupAnchor:[0,-26]});
        const tl=["PINNED","NOTIFIED","RESPONSE","CORRECTED"].map((s,i)=>{const done=i===0||(i===1&&h.notified)||(i===3&&h.status==="corrected");return `<div style="flex:1;text-align:center"><div style="width:10px;height:10px;border-radius:50%;background:${done?"#00b4e4":"#333"};margin:0 auto 3px"></div><div style="font-size:8px;color:${done?"#fff":"#555"};font-weight:700">${s}</div></div>`;}).join("");
        const nb=h.notified?`<span style="background:rgba(0,180,228,0.15);color:#00b4e4;border:1px solid rgba(0,180,228,0.3);padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700">NOTIFIED</span>`:"";
        const sb=h.status==="corrected"?`<span style="color:#00cc77;font-size:10px;font-weight:700">CORRECTED</span>`:`<span style="color:${col};font-size:10px;font-weight:700">${h.severity?h.severity.toUpperCase():""}</span>`;
        const resolveBtn=h.status!=="corrected"?`<button onclick="window._hpResolve(${h.id})" style="margin-top:10px;width:100%;background:#00b4e4;color:#000;border:none;padding:8px 0;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;letter-spacing:.05em">&#10003; REPORT HAZARD RESOLVED</button>`:`<div style="margin-top:10px;padding:6px 0;text-align:center;font-size:11px;font-weight:800;color:#00cc77;letter-spacing:.05em">&#10003; RESOLVED</div>`;
        L.marker([h.lat,h.lng],{icon}).addTo(map).bindPopup(`<div style="font-family:-apple-system,sans-serif;padding:14px 16px;min-width:230px"><div style="font-size:10px;font-weight:700;color:#666;letter-spacing:.07em;margin-bottom:5px">HAZARD #${h.id}</div><div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:3px">${h.title}</div><div style="font-size:12px;color:#888;margin-bottom:8px">${h.address}</div><div style="display:flex;gap:6px;margin-bottom:10px">${sb} ${nb}</div><div style="display:flex;gap:0;margin-bottom:8px">${tl}</div><div style="font-size:11px;color:#555;margin-bottom:2px">Reported: ${h.date} &middot; ${h.owner}</div>${resolveBtn}</div>`);
      });
      if(typeof onMapReady==="function")onMapReady((lat,lng)=>map.flyTo([lat,lng],16));
      setStatus("ready");
    };
    if(window.L){go();}
    else{
      if(!document.getElementById("leaflet-css")){const lnk=document.createElement("link");lnk.id="leaflet-css";lnk.rel="stylesheet";lnk.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";document.head.appendChild(lnk);}
      const scr=document.createElement("script");scr.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";scr.onload=go;document.head.appendChild(scr);
    }
    return()=>{try{if(map)map.remove();}catch(e){}};
  },[filter]);
  return(
    <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:`1px solid ${C.border}`,boxShadow:"0 8px 40px rgba(0,0,0,0.5)"}}>
      {status==="loading"&&<div style={{position:"absolute",inset:0,background:C.card,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:10,gap:16}}><div style={{width:40,height:40,border:`3px solid ${C.border}`,borderTopColor:C.cyan,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><span style={{color:C.textMuted,fontSize:13,fontWeight:600,letterSpacing:"0.05em"}}>LOADING MAP</span><style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style></div>}
      <div ref={divRef} style={{width:"100%",height:520}}/>
    </div>
  );
}

function ReportHazard(){
  const[f,setF]=useState({name:"",email:"",phone:"",address:"",type:"",severity:"",desc:"",photos:[],notify:false});
  const[done,setDone]=useState(false);
  const s=k=>v=>setF(p=>({...p,[k]:v}));
  const ok=f.name&&f.email&&f.address&&f.type&&f.severity&&f.desc;
  const blank={name:"",email:"",phone:"",address:"",type:"",severity:"",desc:"",photos:[],notify:false};
  if(done)return(<SectionWrap title="Pin a Hazard" Icon={AlertTriangle}><Success title="Hazard Pinned Successfully" body="We will review your pin, add it to the live map, and formally notify the responsible property owner of their legal duty of care. A confirmation email will follow within 24 hours." onReset={()=>{setDone(false);setF(blank);}} showPrint/></SectionWrap>);
  return(
    <SectionWrap title="Pin a Hazard" subtitle="Document a dangerous condition on someone's property. We will notify the owner and track every pin through to correction." Icon={AlertTriangle}>
      <div style={{background:"rgba(255,200,0,0.06)",border:"1px solid rgba(255,200,0,0.2)",borderRadius:10,padding:"12px 16px",marginBottom:22,fontSize:13,color:C.yellow,lineHeight:1.5}}>
        <strong>Emergency?</strong> If someone is in immediate danger, call <strong>911</strong> first.
      </div>
      <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"28px 32px"}}>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>YOUR INFORMATION</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
          <Inp label="Full Name" value={f.name} onChange={s("name")} placeholder="Jane Smith" req/>
          <Inp label="Email Address" type="email" value={f.email} onChange={s("email")} placeholder="jane@email.com" req/>
          <Inp label="Phone Number" type="tel" value={f.phone} onChange={s("phone")} placeholder="(555) 000-0000"/>
        </div>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",margin:"4px 0 18px",paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>HAZARD DETAILS</div>
        <Inp label="Hazard Location / Address" value={f.address} onChange={s("address")} placeholder="1234 Main Street, or cross-street intersection" req span2/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
          <Sel label="Hazard Type" value={f.type} onChange={s("type")} options={TYPES} req/>
          <Sel label="Severity Level" value={f.severity} onChange={s("severity")} options={SEVERITY} req/>
        </div>
        <Txt label="Describe the Hazard in Detail" value={f.desc} onChange={s("desc")} placeholder="How long has this existed? Prior incidents? Visibility conditions, contributing factors..." req rows={4}/>
        <PhotoUpload photos={f.photos} onAdd={p=>setF(prev=>({...prev,photos:[...prev.photos,p]}))} onRemove={i=>setF(prev=>({...prev,photos:prev.photos.filter((_,j)=>j!==i)}))}/>
        <NotifyCheck label="Notify me by email when this hazard status changes or is corrected" checked={f.notify} onChange={s("notify")}/>
        <CyanBtn onClick={()=>ok&&setDone(true)} disabled={!ok}>PIN THIS HAZARD →</CyanBtn>
        {!ok&&<p style={{textAlign:"center",fontSize:12,color:C.textDim,margin:"8px 0 0"}}>Complete all required fields to submit</p>}
      </div>
    </SectionWrap>
  );
}

function InjuryReport(){
  const[f,setF]=useState({name:"",email:"",phone:"",date:"",address:"",incident:"",injuries:"",medical:"",witnesses:"",hazardId:"",photos:[],notify:false});
  const[done,setDone]=useState(false);
  const s=k=>v=>setF(p=>({...p,[k]:v}));
  const ok=f.name&&f.email&&f.phone&&f.date&&f.address&&f.incident&&f.injuries;
  const blank={name:"",email:"",phone:"",date:"",address:"",incident:"",injuries:"",medical:"",witnesses:"",hazardId:"",photos:[],notify:false};
  if(done)return(<SectionWrap title="Pin an Injury" Icon={FileText}><Success title="Injury Pinned — We Will Be in Touch" body="An attorney from our office will contact you within one business day to discuss your claim and next steps. Preserve all evidence — photos, medical records, clothing worn — in the meantime." onReset={()=>{setDone(false);setF(blank);}} showPrint/></SectionWrap>);
  return(
    <SectionWrap title="Pin an Injury" subtitle="Were you hurt on someone's property due to a dangerous condition? Pin your injury for a free, confidential case review." Icon={FileText}>
      <div style={{background:"rgba(255,56,56,0.06)",border:"1px solid rgba(255,56,56,0.2)",borderRadius:10,padding:"14px 18px",marginBottom:22}}>
        <div style={{fontSize:12,fontWeight:800,color:C.red,letterSpacing:"0.06em",marginBottom:6}}>IMPORTANT LEGAL NOTICE</div>
        <p style={{margin:0,fontSize:13,color:"#cc9999",lineHeight:1.6}}>Submission of this form does not create an attorney-client relationship. A relationship is established only upon a signed engagement agreement. Do not submit time-sensitive legal matters without first contacting our office directly.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:22}}>
        {[["&#128172;","Free Consultation","No charge to review your case"],["&#9878;","No Fee Unless We Win","Contingency-based"],["&#128274;","Confidential","Protected by privilege"]].map(([ico,t,d])=>(
          <div key={t} style={{background:C.card,border:`1px solid ${C.cyanBorder}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:22,marginBottom:8}} dangerouslySetInnerHTML={{__html:ico}}/>
            <div style={{fontSize:13,fontWeight:800,color:C.white,marginBottom:3}}>{t}</div>
            <div style={{fontSize:12,color:C.textMuted,lineHeight:1.4}}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:22,flexWrap:"wrap"}}>
        {[["5 stars","Avvo Rating","10.0 Superb"],["A+","BBB Rating","Accredited Business"],["5 stars","Martindale","AV Preeminent"]].map(([r,src,sub])=>(
          <div key={src} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,fontWeight:900,color:C.yellow}}>{r}</span>
            <div><div style={{fontSize:11,fontWeight:800,color:C.white}}>{src}</div><div style={{fontSize:10,color:C.textDim}}>{sub}</div></div>
          </div>
        ))}
      </div>
      <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"28px 32px"}}>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>YOUR CONTACT INFORMATION</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
          <Inp label="Full Name" value={f.name} onChange={s("name")} placeholder="Jane Smith" req/>
          <Inp label="Email Address" type="email" value={f.email} onChange={s("email")} placeholder="jane@email.com" req/>
          <Inp label="Phone Number" type="tel" value={f.phone} onChange={s("phone")} placeholder="(555) 000-0000" req/>
          <Inp label="Date of Incident" type="date" value={f.date} onChange={s("date")} req/>
        </div>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",margin:"4px 0 18px",paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>INCIDENT DETAILS</div>
        <Inp label="Where Did the Incident Occur?" value={f.address} onChange={s("address")} placeholder="Full address or business name and location" req span2/>
        <Txt label="Describe What Happened" value={f.incident} onChange={s("incident")} placeholder="The hazard that caused your injury, what you were doing, time of day, weather conditions, who was present..." rows={4} req/>
        <Txt label="Describe Your Injuries" value={f.injuries} onChange={s("injuries")} placeholder="Fractures, lacerations, concussion, back injuries, shoulder injuries, etc." rows={3} req/>
        <Txt label="Medical Treatment Received" value={f.medical} onChange={s("medical")} placeholder="Emergency room, surgeries, doctor follow-ups, physical therapy, medications..." rows={3}/>
        <Inp label="Witnesses (names and contact info, if any)" value={f.witnesses} onChange={s("witnesses")} placeholder="Witness name, phone, or relationship" span2/>
        <Sel label="Is This Related to a Mapped Hazard?" value={f.hazardId} onChange={s("hazardId")} options={HAZARDS.map(h=>`#${h.id} — ${h.title} (${h.address})`)}/>
        <PhotoUpload photos={f.photos} onAdd={p=>setF(prev=>({...prev,photos:[...prev.photos,p]}))} onRemove={i=>setF(prev=>({...prev,photos:prev.photos.filter((_,j)=>j!==i)}))}/>
        <NotifyCheck label="Notify me when an attorney has reviewed my submission" checked={f.notify} onChange={s("notify")}/>
        <CyanBtn onClick={()=>ok&&setDone(true)} disabled={!ok}>PIN MY INJURY — FREE CASE REVIEW →</CyanBtn>
        {!ok&&<p style={{textAlign:"center",fontSize:12,color:C.textDim,margin:"8px 0 0"}}>Complete all required fields to submit</p>}
      </div>
    </SectionWrap>
  );
}

function CorrectionReport(){
  const[f,setF]=useState({hazardId:"",who:"",date:"",method:"",notes:""});
  const[done,setDone]=useState(false);
  const[query,setQuery]=useState("");
  const[selected,setSelected]=useState(null);
  const[showR,setShowR]=useState(false);
  const searchRef=useRef(null);
  const s=k=>v=>setF(p=>({...p,[k]:v}));
  const ok=f.hazardId&&f.who&&f.date&&f.method;
  const q=query.trim().toLowerCase();
  const results=q.length<2?[]:HAZARDS.filter(h=>{if(h.status==="corrected")return false;return q.replace("#","")===`${h.id}`||h.address.toLowerCase().includes(q)||h.title.toLowerCase().includes(q)||h.owner.toLowerCase().includes(q);}).slice(0,8);
  const pick=(h)=>{setSelected(h);setQuery(`#${h.id} — ${h.title}`);setShowR(false);s("hazardId")(`${h.id}`);};
  const clear=()=>{setSelected(null);setQuery("");s("hazardId")("");setShowR(false);setTimeout(()=>searchRef.current&&searchRef.current.focus(),50);};
  if(done)return(<SectionWrap title="Report a Correction" Icon={CheckCircle}><Success title="Correction Reported — Thank You!" body="The hazard will be updated on the live map as corrected. Our team will verify the remediation and close the official record." onReset={()=>{setDone(false);setF({hazardId:"",who:"",date:"",method:"",notes:""});setSelected(null);setQuery("");}} showPrint/></SectionWrap>);
  return(
    <SectionWrap title="Report a Corrected Hazard" subtitle="Has a previously pinned hazard been fixed? Search by hazard number or address, then submit the correction details." Icon={CheckCircle}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:12}}>FIND THE HAZARD</div>
        <div style={{position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",background:selected?"rgba(0,204,119,0.06)":C.card,border:`1.5px solid ${selected?C.green:showR&&results.length?C.cyan:C.border}`,borderRadius:selected?10:showR&&results.length?"10px 10px 0 0":10,overflow:"hidden",transition:"border 0.2s"}}>
            <div style={{padding:"0 14px",color:selected?C.green:C.textDim,fontSize:18,flexShrink:0}}>{selected?"✓":"🔍"}</div>
            <input ref={searchRef} value={query} onChange={e=>{setQuery(e.target.value);setShowR(true);if(selected)clear();}} onFocus={()=>setShowR(true)} onBlur={()=>setTimeout(()=>setShowR(false),180)} placeholder='Search by hazard # (e.g. "#42") or address / street name...'
              style={{flex:1,padding:"16px 0",background:"transparent",border:"none",outline:"none",fontSize:15,color:selected?C.green:C.white,fontFamily:"inherit",fontWeight:selected?700:400}}/>
            {query&&<button onClick={clear} style={{padding:"0 16px",background:"none",border:"none",color:C.textMuted,fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>}
            {!query&&<div style={{padding:"0 16px",display:"flex",gap:6}}>{["#123","address","street"].map(h=><span key={h} style={{background:C.muted,color:C.textDim,fontSize:10,fontWeight:700,padding:"3px 7px",borderRadius:4}}>{h}</span>)}</div>}
          </div>
          {showR&&query.length>=2&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1.5px solid ${C.cyan}`,borderTop:"none",borderRadius:"0 0 10px 10px",zIndex:40,maxHeight:320,overflowY:"auto"}}>
              {results.length===0
                ?<div style={{padding:"18px 20px",color:C.textMuted,fontSize:14,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>🔎</span><div><div style={{fontWeight:700,color:C.white,marginBottom:3}}>No active hazards found</div><div style={{fontSize:12}}>Try a street name, business, or hazard # like "#2"</div></div></div>
                :results.map((h,i)=>(
                  <div key={h.id} onMouseDown={()=>pick(h)} style={{padding:"13px 18px",cursor:"pointer",borderTop:i>0?`1px solid ${C.border}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,180,228,0.06)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:32,height:32,borderRadius:8,background:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:C.cyan,flexShrink:0}}>#{h.id}</div>
                      <div><div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:2}}>{h.title}</div><div style={{fontSize:12,color:C.textMuted}}>{h.address}</div></div>
                    </div>
                    <div style={{flexShrink:0,marginLeft:12}}><Badge status={h.status} severity={h.severity}/></div>
                  </div>
                ))}
              <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,fontSize:11,color:C.textDim}}>Active hazards only · {results.length} result{results.length!==1?"s":""} for "{query}"</div>
            </div>
          )}
        </div>
        <div style={{marginTop:10,fontSize:12,color:C.textDim,display:"flex",gap:16,flexWrap:"wrap"}}>
          <span>💡 Type 2+ characters to search</span><span>·</span><span>Use "#" + number for hazard ID</span><span>·</span><span>Only active hazards shown</span>
        </div>
      </div>
      {selected&&(
        <div style={{background:"rgba(0,204,119,0.04)",border:"1px solid rgba(0,204,119,0.3)",borderRadius:12,padding:"18px 22px",marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:800,color:C.green,letterSpacing:"0.1em",marginBottom:6}}>SELECTED HAZARD</div>
            <div style={{fontSize:16,fontWeight:800,color:C.white,marginBottom:4}}>{selected.title}</div>
            <div style={{fontSize:13,color:C.textMuted,marginBottom:10}}>{selected.address}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              <Badge status={selected.status} severity={selected.severity}/>
              {selected.notified&&<span style={{background:"rgba(0,180,228,0.08)",color:C.cyan,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,border:`1px solid ${C.cyanBorder}`}}>NOTIFIED</span>}
              <span style={{background:C.muted,color:C.textMuted,padding:"2px 8px",borderRadius:20,fontSize:11}}>Reported {selected.date}</span>
            </div>
            <HazardTimeline h={selected}/>
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:20}}>
            <div style={{fontSize:11,color:C.textDim,marginBottom:6}}>{selected.owner}</div>
            <button onClick={clear} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.textMuted,padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer"}}>CHANGE</button>
          </div>
        </div>
      )}
      {selected&&(
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"28px 32px"}}>
          <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>CORRECTION DETAILS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
            <Inp label="Your Name" value={f.who} onChange={s("who")} placeholder="Person reporting the correction" req/>
            <Inp label="Date Corrected" type="date" value={f.date} onChange={s("date")} req/>
          </div>
          <Sel label="How Was the Hazard Corrected?" value={f.method} onChange={s("method")} options={FIX_METHODS} req/>
          <Txt label="Additional Notes" value={f.notes} onChange={s("notes")} placeholder="Did the owner respond promptly? Contractor used? Any remaining concerns?" rows={3}/>
          <CyanBtn onClick={()=>ok&&setDone(true)} disabled={!ok} color={ok?C.green:undefined}>MARK HAZARD AS CORRECTED →</CyanBtn>
          {!ok&&<p style={{textAlign:"center",fontSize:12,color:C.textDim,margin:"8px 0 0"}}>Select a hazard and complete all required fields</p>}
        </div>
      )}
      {!selected&&<div style={{background:C.card,borderRadius:12,border:`1px dashed ${C.border}`,padding:"40px 32px",textAlign:"center"}}><div style={{fontSize:40,marginBottom:16}}>🔍</div><div style={{fontSize:15,fontWeight:700,color:C.textMuted,marginBottom:6}}>Search for a hazard above to continue</div><div style={{fontSize:13,color:C.textDim}}>Once you select a hazard, the correction form will appear here.</div></div>}
    </SectionWrap>
  );
}

function Education(){
  const[open,setOpen]=useState(null);
  return(
    <div style={{background:C.black,minHeight:"100vh",paddingBottom:60}}>
      <div style={{maxWidth:780,margin:"0 auto",padding:"40px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}><div style={{width:38,height:38,background:C.cyanDim,border:`1px solid ${C.cyanBorder}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.cyan,flexShrink:0}}><BookOpen size={18}/></div><h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.white,letterSpacing:"-0.02em"}}>Know Your Rights</h2></div>
        <p style={{margin:"0 0 40px",fontSize:15,color:C.textMuted,lineHeight:1.7,paddingLeft:50}}>Premises liability law defines what duties property owners owe you — and that duty changes based on why you are on the property and who owns it.</p>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:18}}>VISITOR CLASSIFICATION</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:48}}>
          {VISITOR_TYPES.map(v=>(
            <div key={v.type} style={{background:v.bg,border:`1px solid ${v.br}`,borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"16px 18px 13px",borderBottom:`1px solid ${v.br}`}}><div style={{fontSize:18,fontWeight:900,color:v.col}}>{v.type}</div><div style={{fontSize:10,fontWeight:800,color:v.col,opacity:0.7,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:3}}>{v.sub}</div></div>
              <div style={{padding:"14px 18px"}}><p style={{margin:"0 0 14px",fontSize:13,color:"#aaa",lineHeight:1.65}}>{v.desc}</p><div style={{fontSize:11,fontWeight:800,color:v.col,marginBottom:8,letterSpacing:"0.06em"}}>DUTIES OWED:</div>{v.duties.map(d=><div key={d} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}><span style={{color:v.col,fontSize:14,lineHeight:"18px",flexShrink:0}}>›</span><span style={{fontSize:12,color:"#888",lineHeight:1.6}}>{d}</span></div>)}<div style={{marginTop:12,padding:"9px 12px",background:"rgba(255,255,255,0.04)",borderRadius:8,border:`1px solid ${v.br}`}}><div style={{fontSize:10,fontWeight:800,color:v.col,marginBottom:4,letterSpacing:"0.06em"}}>EXAMPLES</div><div style={{fontSize:12,color:"#777",lineHeight:1.5}}>{v.ex}</div></div></div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:18}}>DUTIES BY PROPERTY TYPE</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:48}}>
          {OWNER_TYPES.map((o,i)=>(
            <div key={o.type} style={{background:C.card,border:`1px solid ${open===i?C.cyanBorder:C.border}`,borderRadius:12,overflow:"hidden",transition:"border 0.2s"}}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"18px 22px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",textAlign:"left"}}>
                <div><div style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:3}}>{o.type}</div><div style={{fontSize:13,color:C.textMuted}}>{o.desc}</div></div>
                <span style={{color:open===i?C.cyan:C.textMuted,fontSize:24,fontWeight:200,flexShrink:0,marginLeft:20,lineHeight:1,transition:"color 0.2s"}}>{open===i?"−":"+"}</span>
              </button>
              {open===i&&<div style={{padding:"0 22px 20px",borderTop:`1px solid ${C.border}`}}>{o.items.map(item=><div key={item} style={{display:"flex",gap:12,marginTop:12,alignItems:"flex-start"}}><div style={{width:6,height:6,borderRadius:"50%",background:C.cyan,marginTop:7,flexShrink:0}}/><span style={{fontSize:14,color:"#999",lineHeight:1.7}}>{item}</span></div>)}</div>}
            </div>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:14,padding:"32px 36px",border:`1px solid ${C.cyanBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:20}}>
          <div><div style={{fontSize:21,fontWeight:900,color:C.white,marginBottom:7,letterSpacing:"-0.02em"}}>Were You Injured on Someone's Property?</div><div style={{fontSize:14,color:C.textMuted,lineHeight:1.5}}>Free, confidential consultations. No fee unless we win your case.</div></div>
          <button style={{background:C.cyan,color:C.black,border:"none",padding:"14px 26px",borderRadius:8,fontSize:14,fontWeight:900,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,letterSpacing:"0.04em"}}>PIN AN INJURY →</button>
        </div>
      </div>
    </div>
  );
}

function About(){
  return(
    <div style={{background:C.black,minHeight:"100vh",paddingBottom:60}}>
      <div style={{display:"flex",minHeight:440}}>
        <div style={{width:"42%",background:"#050505",padding:"60px 48px",display:"flex",flexDirection:"column",justifyContent:"space-between",borderRight:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",bottom:-40,right:-30,fontSize:200,fontWeight:900,color:"rgba(255,255,255,0.02)",lineHeight:1,userSelect:"none"}}>HP</div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:36}}><div style={{width:38,height:38,background:C.cyan,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📍</div><div><span style={{fontSize:22,fontWeight:900,color:C.white}}>Hazard</span><span style={{fontSize:22,fontWeight:900,color:C.cyan}}>Pin</span></div></div>
            <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.15em",marginBottom:16}}>OUR MISSION</div>
            <h2 style={{fontSize:28,fontWeight:900,color:C.white,lineHeight:1.25,letterSpacing:"-0.03em",margin:"0 0 20px"}}>Making the world safer,<br/><span style={{color:C.cyan}}>one pin at a time.</span></h2>
            <p style={{fontSize:14,color:C.textMuted,lineHeight:1.7,margin:0}}>Built for communities. Built for accountability. Built for you.</p>
          </div>
          <div style={{display:"flex",gap:28,marginTop:40}}>
            {[[HAZARDS.filter(h=>h.status==="active").length,"Active"],[HAZARDS.filter(h=>h.status==="corrected").length,"Corrected"],[HAZARDS.filter(h=>h.notified).length,"Notified"]].map(([n,l])=>(
              <div key={l}><div style={{fontSize:28,fontWeight:900,color:C.cyan}}>{n}</div><div style={{fontSize:11,color:C.textMuted,fontWeight:600}}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{flex:1,background:"#f0f2f4",padding:"60px 48px",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",bottom:-20,right:-40,fontSize:280,fontWeight:900,color:"rgba(0,0,0,0.04)",lineHeight:1,userSelect:"none"}}>HP</div>
          <div style={{fontSize:11,fontWeight:800,color:"#0090bc",letterSpacing:"0.15em",marginBottom:16}}>ABOUT US</div>
          <p style={{fontSize:17,color:"#1a1a1a",lineHeight:1.8,margin:"0 0 24px",maxWidth:440}}><strong>HazardPin was built and dedicated to helping make the world a better place</strong> — by educating property owners of the hazards on their premises and protecting injured people when those property owners fail in their duties.</p>
          <p style={{fontSize:15,color:"#555",lineHeight:1.8,margin:"0 0 32px",maxWidth:440}}>We believe accountability starts with documentation. When dangerous conditions are mapped, shared, and formally reported, property owners cannot claim ignorance — and injured people have a clearer path to justice.</p>
          <div style={{display:"flex",gap:12}}><div style={{background:"#0a0a0a",color:"white",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:700}}>EST. 2024</div><div style={{background:"rgba(0,180,228,0.1)",color:"#0090bc",border:"1px solid rgba(0,180,228,0.4)",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:700}}>50 STATES</div></div>
        </div>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"60px 24px 0"}}>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.15em",marginBottom:28,textAlign:"center"}}>WHAT WE STAND FOR</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:48}}>
          {[{icon:<Shield size={26}/>,title:"Accountability",body:"Property owners have a legal duty to maintain safe conditions. We formalize that duty with documented notifications and tracked outcomes."},{icon:<Users size={26}/>,title:"Community Safety",body:"Every pinned hazard is a community act. When neighbors document and share dangers, everyone is better protected."},{icon:<Target size={26}/>,title:"Justice for the Injured",body:"When property owners ignore their obligations and someone gets hurt, we fight for the injured party's right to fair compensation."}].map(v=>(
            <div key={v.title} style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"28px 24px"}}><div style={{color:C.cyan,marginBottom:14}}>{v.icon}</div><div style={{fontSize:16,fontWeight:800,color:C.white,marginBottom:10}}>{v.title}</div><div style={{fontSize:14,color:C.textMuted,lineHeight:1.7}}>{v.body}</div></div>
          ))}
        </div>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.15em",marginBottom:24,textAlign:"center"}}>HOW IT WORKS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:48}}>
          {[["01","Pin It","A hazard is documented and pinned on the live map."],["02","Notify","We formally notify the property owner of their legal duty."],["03","Track","The hazard is monitored until corrected."],["04","Protect","If someone is injured, we fight for full compensation."]].map(([n,t,d])=>(
            <div key={n} style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"22px 20px"}}><div style={{fontSize:36,fontWeight:900,color:"rgba(0,180,228,0.6)",marginBottom:8}}>{n}</div><div style={{fontSize:14,fontWeight:800,color:C.white,marginBottom:8}}>{t}</div><div style={{fontSize:13,color:C.textMuted,lineHeight:1.6}}>{d}</div></div>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:14,padding:"32px 36px",border:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"center"}}>
          <div><div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.12em",marginBottom:12}}>GET IN TOUCH</div><div style={{fontSize:20,fontWeight:900,color:C.white,marginBottom:8}}>We're Here to Help</div><div style={{fontSize:14,color:C.textMuted,lineHeight:1.6}}>Whether you've spotted a hazard, been injured, or want to report a correction — our team is ready.</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>{[["📞","Phone","1-800-HAZARD-1"],["📧","Email","info@hazardpin.com"],["📍","Office","50 States and Growing"]].map(([ico,l,v])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:18}}>{ico}</span><div><div style={{fontSize:11,color:C.textDim,fontWeight:700,letterSpacing:"0.06em"}}>{l}</div><div style={{fontSize:14,color:C.white,fontWeight:600}}>{v}</div></div></div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

function FAQ(){
  const[open,setOpen]=useState(null);
  return(
    <div style={{background:C.black,minHeight:"100vh",paddingBottom:60}}>
      <div style={{maxWidth:760,margin:"0 auto",padding:"40px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}><div style={{width:38,height:38,background:C.cyanDim,border:`1px solid ${C.cyanBorder}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.cyan,fontWeight:900,fontSize:18}}>?</div><h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.white}}>Frequently Asked Questions</h2></div>
        <p style={{margin:"0 0 36px",fontSize:15,color:C.textMuted,lineHeight:1.7,paddingLeft:50}}>Answers to the most common questions about premises liability claims, the HazardPin platform, and how we can help you.</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {FAQS.map((fq,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${open===i?C.cyanBorder:C.border}`,borderRadius:12,overflow:"hidden",transition:"border 0.2s"}}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"18px 22px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",textAlign:"left",gap:16}}>
                <span style={{fontSize:15,fontWeight:700,color:open===i?C.cyan:C.white,lineHeight:1.4,transition:"color 0.2s"}}>{fq.q}</span>
                <span style={{fontSize:22,fontWeight:200,color:open===i?C.cyan:C.textMuted,flexShrink:0,lineHeight:1,transition:"color 0.2s"}}>{open===i?"−":"+"}</span>
              </button>
              {open===i&&<div style={{padding:"0 22px 20px",borderTop:`1px solid ${C.border}`}}><p style={{margin:"14px 0 0",fontSize:14,color:"#999",lineHeight:1.8}}>{fq.a}</p></div>}
            </div>
          ))}
        </div>
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.cyanBorder}`,padding:"28px 32px",marginTop:36,textAlign:"center"}}>
          <div style={{fontSize:16,fontWeight:800,color:C.white,marginBottom:8}}>Still have questions?</div>
          <div style={{fontSize:14,color:C.textMuted,marginBottom:18}}>Our team is available to discuss your specific situation at no charge.</div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <div style={{background:C.cyan,color:C.black,padding:"11px 24px",borderRadius:8,fontSize:13,fontWeight:900,letterSpacing:"0.05em"}}>📞 1-800-HAZARD-1</div>
            <div style={{background:C.muted,color:C.textMuted,padding:"11px 24px",borderRadius:8,fontSize:13,fontWeight:700}}>info@hazardpin.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Blog(){
  const[reading,setReading]=useState(null);
  if(reading!==null){
    const a=ARTICLES[reading];
    return(
      <div style={{background:C.black,minHeight:"100vh",paddingBottom:60}}>
        <div style={{maxWidth:720,margin:"0 auto",padding:"40px 20px 0"}}>
          <button onClick={()=>setReading(null)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.textMuted,padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:28,letterSpacing:"0.05em"}}>← BACK TO BLOG</button>
          <div style={{background:C.cyanDim,border:`1px solid ${C.cyanBorder}`,color:C.cyan,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:800,letterSpacing:"0.08em",display:"inline-block",marginBottom:16}}>{a.tag}</div>
          <h1 style={{fontSize:30,fontWeight:900,color:C.white,letterSpacing:"-0.03em",margin:"0 0 12px",lineHeight:1.2}}>{a.title}</h1>
          <div style={{fontSize:13,color:C.textDim,marginBottom:32,paddingBottom:24,borderBottom:`1px solid ${C.border}`}}>{a.date}</div>
          <div style={{fontSize:15,color:"#aaa",lineHeight:1.9}}>
            {a.body.split("\n\n").map((para,i)=>{
              if(para.startsWith("**")&&para.indexOf("**",2)>0){
                const end=para.indexOf("**",2);
                return <div key={i} style={{marginBottom:20}}><span style={{fontSize:16,fontWeight:800,color:C.white}}>{para.slice(2,end)}</span><span>{para.slice(end+2)}</span></div>;
              }
              return <p key={i} style={{margin:"0 0 20px"}}>{para}</p>;
            })}
          </div>
          <div style={{marginTop:40,padding:"24px 28px",background:C.card,borderRadius:12,border:`1px solid ${C.cyanBorder}`,textAlign:"center"}}>
            <div style={{fontSize:16,fontWeight:800,color:C.white,marginBottom:8}}>Have you been injured on someone's property?</div>
            <div style={{fontSize:14,color:C.textMuted,marginBottom:16}}>Pin your injury now for a free, confidential case review.</div>
            <div style={{background:C.cyan,color:C.black,padding:"11px 24px",borderRadius:8,fontSize:13,fontWeight:900,display:"inline-block",cursor:"pointer",letterSpacing:"0.05em"}}>PIN AN INJURY →</div>
          </div>
        </div>
      </div>
    );
  }
  return(
    <div style={{background:C.black,minHeight:"100vh",paddingBottom:60}}>
      <div style={{maxWidth:780,margin:"0 auto",padding:"40px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}><div style={{width:38,height:38,background:C.cyanDim,border:`1px solid ${C.cyanBorder}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.cyan,fontWeight:900,fontSize:16}}>✍</div><h2 style={{margin:0,fontSize:26,fontWeight:900,color:C.white}}>HazardPin Blog</h2></div>
        <p style={{margin:"0 0 36px",fontSize:15,color:C.textMuted,lineHeight:1.7,paddingLeft:50}}>Safety guides, legal education, and news about premises liability across America.</p>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {ARTICLES.map((a,i)=>(
            <div key={a.id} onClick={()=>setReading(i)} style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"26px 28px",cursor:"pointer",transition:"border 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.cyanBorder} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:20}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                    <span style={{background:C.cyanDim,border:`1px solid ${C.cyanBorder}`,color:C.cyan,padding:"2px 10px",borderRadius:20,fontSize:10,fontWeight:800,letterSpacing:"0.08em"}}>{a.tag}</span>
                    <span style={{fontSize:12,color:C.textDim}}>{a.date}</span>
                  </div>
                  <h3 style={{margin:"0 0 10px",fontSize:18,fontWeight:800,color:C.white,lineHeight:1.3}}>{a.title}</h3>
                  <p style={{margin:0,fontSize:14,color:C.textMuted,lineHeight:1.6}}>{a.excerpt}</p>
                </div>
                <div style={{fontSize:24,color:C.border,flexShrink:0,marginTop:4}}>→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OwnerPortal(){
  const[step,setStep]=useState("search");
  const[query,setQuery]=useState("");
  const[showR,setShowR]=useState(false);
  const[selected,setSelected]=useState(null);
  const[f,setF]=useState({contact:"",action:"",timeline:"",notes:""});
  const[done,setDone]=useState(false);
  const s=k=>v=>setF(p=>({...p,[k]:v}));
  const q=query.trim().toLowerCase();
  const results=q.length<2?[]:HAZARDS.filter(h=>h.address.toLowerCase().includes(q)||h.owner.toLowerCase().includes(q)||q.replace("#","")===`${h.id}`).slice(0,6);
  const pick=(h)=>{setSelected(h);setQuery(`#${h.id} — ${h.title}, ${h.address}`);setShowR(false);setStep("notice");};
  const ok=f.contact&&f.action&&f.timeline;
  if(done)return(<SectionWrap title="Property Owner Portal" Icon={Shield}><Success title="Acknowledgment Received" body="Your response has been recorded. We will update the hazard record with your action plan and monitor the property for correction. Taking prompt action significantly reduces your legal exposure." onReset={()=>{setDone(false);setSelected(null);setQuery("");setF({contact:"",action:"",timeline:"",notes:""});setStep("search");}}/></SectionWrap>);
  return(
    <SectionWrap title="Property Owner Portal" subtitle="Received a notice about a hazard on your property? Acknowledge it here, submit your action plan, and reduce your legal exposure." Icon={Shield}>
      <div style={{background:"rgba(0,180,228,0.06)",border:`1px solid ${C.cyanBorder}`,borderRadius:10,padding:"14px 18px",marginBottom:24}}>
        <div style={{fontSize:12,fontWeight:800,color:C.cyan,marginBottom:6,letterSpacing:"0.06em"}}>WHY RESPOND PROMPTLY?</div>
        <p style={{margin:0,fontSize:13,color:C.textMuted,lineHeight:1.6}}>Acknowledging a hazard notice and submitting a correction plan creates a documented record of good faith effort. Failure to act after formal notification significantly increases liability exposure if someone is subsequently injured.</p>
      </div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:12}}>STEP 1 — FIND YOUR PROPERTY'S HAZARD PIN</div>
        <div style={{position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",background:selected?"rgba(0,180,228,0.06)":C.card,border:`1.5px solid ${selected?C.cyan:showR&&results.length?C.cyan:C.border}`,borderRadius:selected?10:showR&&results.length?"10px 10px 0 0":10,overflow:"hidden"}}>
            <div style={{padding:"0 14px",color:C.textDim,fontSize:18,flexShrink:0}}>🏢</div>
            <input value={query} onChange={e=>{setQuery(e.target.value);setShowR(true);if(selected){setSelected(null);setStep("search");}}} onFocus={()=>setShowR(true)} onBlur={()=>setTimeout(()=>setShowR(false),180)} placeholder="Search by your property address, business name, or hazard number..."
              style={{flex:1,padding:"16px 0",background:"transparent",border:"none",outline:"none",fontSize:14,color:selected?C.cyan:C.white,fontFamily:"inherit"}}/>
            {query&&<button onClick={()=>{setQuery("");setSelected(null);setStep("search");}} style={{padding:"0 16px",background:"none",border:"none",color:C.textMuted,fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>}
          </div>
          {showR&&query.length>=2&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1.5px solid ${C.cyan}`,borderTop:"none",borderRadius:"0 0 10px 10px",zIndex:40}}>
              {results.length===0
                ?<div style={{padding:"16px 20px",color:C.textMuted,fontSize:14}}>No hazards found for this property. If you received a notice, check the hazard number on the letter.</div>
                :results.map((h,i)=>(
                  <div key={h.id} onMouseDown={()=>pick(h)} style={{padding:"13px 18px",cursor:"pointer",borderTop:i>0?`1px solid ${C.border}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,180,228,0.06)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div><div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:2}}>#{h.id} — {h.title}</div><div style={{fontSize:12,color:C.textMuted}}>{h.address} · Owner: {h.owner}</div></div>
                    <Badge status={h.status} severity={h.severity}/>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      {selected&&step==="notice"&&(
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:14}}>STEP 2 — REVIEW THE FORMAL NOTICE</div>
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"28px 32px"}}>
            <div style={{textAlign:"center",marginBottom:24,paddingBottom:20,borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:13,fontWeight:800,color:C.textMuted,letterSpacing:"0.1em",marginBottom:6}}>FORMAL NOTICE OF PREMISES LIABILITY HAZARD</div>
              <div style={{fontSize:11,color:C.textDim}}>HazardPin Platform · Ref: HP-{String(selected.id).padStart(6,"0")}</div>
            </div>
            <p style={{fontSize:14,color:"#bbb",lineHeight:1.9,margin:"0 0 16px"}}>This notice formally informs <strong style={{color:C.white}}>{selected.owner}</strong> that a hazardous condition has been documented at:</p>
            <div style={{background:C.muted,borderRadius:8,padding:"16px 20px",marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:800,color:C.cyan,marginBottom:8,letterSpacing:"0.06em"}}>HAZARD DETAILS</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13}}>
                {[["Hazard ID",`HP-${String(selected.id).padStart(6,"0")}`],["Type",selected.type],["Location",selected.address],["Severity",(selected.severity||"").toUpperCase()],["Date Pinned",selected.date],["Status",(selected.status||"").toUpperCase()]].map(([l,v])=>(
                  <div key={l}><span style={{color:C.textDim}}>{l}: </span><span style={{color:C.white,fontWeight:600}}>{v}</span></div>
                ))}
              </div>
            </div>
            <p style={{fontSize:13,color:"#999",lineHeight:1.8,margin:"0 0 20px"}}>As the property owner or occupier, you have a legal duty of care to persons who enter your property. This documented hazard creates constructive notice of the condition. Failure to remediate may result in significant legal liability should a person be injured.</p>
            <button onClick={()=>setStep("respond")} style={{background:C.cyan,color:C.black,border:"none",padding:"12px 28px",borderRadius:8,fontSize:13,fontWeight:900,cursor:"pointer",letterSpacing:"0.05em"}}>ACKNOWLEDGE AND RESPOND →</button>
          </div>
        </div>
      )}
      {selected&&step==="respond"&&(
        <div>
          <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:14}}>STEP 3 — SUBMIT YOUR RESPONSE AND ACTION PLAN</div>
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"28px 32px"}}>
            <Inp label="Your Name and Title" value={f.contact} onChange={s("contact")} placeholder="John Smith, Property Manager / Owner" req span2/>
            <Sel label="Intended Action" value={f.action} onChange={s("action")} options={["Will repair immediately (within 48 hours)","Contractor scheduled — repair within 1 week","Repair planned — within 30 days","Temporary barrier placed while repair is scheduled","Dispute — hazard does not exist or has been misidentified","Other"]} req/>
            <Inp label="Estimated Completion Date" type="date" value={f.timeline} onChange={s("timeline")} req/>
            <Txt label="Additional Notes / Response" value={f.notes} onChange={s("notes")} placeholder="Describe your remediation plan, any mitigating measures already in place, or your response to the notification..." rows={4}/>
            <CyanBtn onClick={()=>ok&&setDone(true)} disabled={!ok}>SUBMIT ACKNOWLEDGMENT AND ACTION PLAN →</CyanBtn>
          </div>
        </div>
      )}
      {!selected&&<div style={{background:C.card,borderRadius:12,border:`1px dashed ${C.border}`,padding:"40px",textAlign:"center"}}><div style={{fontSize:40,marginBottom:16}}>🏢</div><div style={{fontSize:15,fontWeight:700,color:C.textMuted,marginBottom:6}}>Search for your property above</div><div style={{fontSize:13,color:C.textDim}}>Use your property address, business name, or the hazard number from your notice letter.</div></div>}
    </SectionWrap>
  );
}


function HazardDetailPage({pageId,go}){
  const[activePhoto,setActivePhoto]=useState(0);
  const page=HAZARD_PAGES.find(p=>p.id===pageId);
  if(!page) return null;

  const allPages=HAZARD_PAGES.filter(p=>p.id!==pageId);

  return(
    <div style={{background:C.black,minHeight:"100vh",paddingBottom:80}}>

      {/* Breadcrumb */}
      <div style={{background:"#050505",borderBottom:`1px solid ${C.border}`,padding:"10px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.textDim}}>
          <span style={{cursor:"pointer",color:C.cyan}} onClick={()=>go("home")}>HazardPin</span>
          <span>›</span>
          <span style={{cursor:"pointer",color:C.cyan}} onClick={()=>go("home")}>Hazard Types</span>
          <span>›</span>
          <span style={{color:C.textMuted}}>{page.caption}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div style={{position:"relative",height:420,overflow:"hidden"}}>
        <img src={page.heroUrl} alt={page.h1}
          style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.35)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, transparent 30%, #0a0a0a 100%)"}}>
          <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",height:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",paddingBottom:48}}>
            {/* SEO keywords as tag pills */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
              {page.keywords.slice(0,5).map(k=>(
                <span key={k} style={{background:"rgba(0,180,228,0.15)",border:`1px solid ${C.cyanBorder}`,color:C.cyan,padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:"0.05em"}}>{k}</span>
              ))}
            </div>
            <h1 style={{margin:"0 0 16px",fontSize:38,fontWeight:900,color:C.white,letterSpacing:"-0.03em",lineHeight:1.15}}>{page.h1}</h1>
            <p style={{margin:0,fontSize:16,color:"#aaa",lineHeight:1.7,maxWidth:680}}>{page.intro}</p>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px 0",display:"grid",gridTemplateColumns:"1fr 360px",gap:40,alignItems:"start"}}>

        {/* ── MAIN CONTENT ── */}
        <div>

          {/* Photo gallery */}
          <div style={{marginBottom:40}}>
            <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.12em",marginBottom:14}}>PHOTO EXAMPLES</div>
            <div style={{borderRadius:12,overflow:"hidden",marginBottom:10,border:`1px solid ${C.border}`}}>
              <img src={page.photos[activePhoto].url} alt={page.photos[activePhoto].cap}
                style={{width:"100%",height:340,objectFit:"cover",display:"block",transition:"opacity 0.3s"}}/>
              <div style={{padding:"12px 16px",background:C.card,borderTop:`1px solid ${C.border}`}}>
                <div style={{fontSize:13,color:C.textMuted}}>{page.photos[activePhoto].cap}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {page.photos.map((ph,i)=>(
                <div key={i} onClick={()=>setActivePhoto(i)} style={{borderRadius:8,overflow:"hidden",cursor:"pointer",border:`2px solid ${i===activePhoto?C.cyan:"transparent"}`,transition:"border 0.2s"}}>
                  <img src={ph.url} alt={ph.cap} style={{width:"100%",height:80,objectFit:"cover",display:"block",filter:i===activePhoto?"none":"brightness(0.55)",transition:"filter 0.2s"}}/>
                </div>
              ))}
            </div>
          </div>

          {/* Article sections */}
          {page.sections.map((sec,i)=>(
            <div key={i} style={{marginBottom:36}}>
              <h2 style={{fontSize:20,fontWeight:800,color:C.white,margin:"0 0 12px",letterSpacing:"-0.01em",lineHeight:1.3}}>{sec.h}</h2>
              <p style={{margin:0,fontSize:15,color:"#999",lineHeight:1.85}}>{sec.body}</p>
              {i<page.sections.length-1&&<div style={{height:1,background:C.border,marginTop:28}}/>}
            </div>
          ))}

          {/* People also search for — SEO keyword cloud */}
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"24px 28px",marginBottom:40}}>
            <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.12em",marginBottom:16}}>PEOPLE ALSO SEARCH FOR</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {page.searches.map(s=>(
                <span key={s} style={{background:C.muted,color:C.textMuted,padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,border:`1px solid ${C.border}`}}>{s}</span>
              ))}
            </div>
          </div>

          {/* Related hazard pages */}
          <div style={{marginBottom:40}}>
            <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.12em",marginBottom:16}}>OTHER HAZARD TYPES</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {allPages.slice(0,4).map(p=>(
                <div key={p.id} onClick={()=>go("hazard:"+p.id)} style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,overflow:"hidden",cursor:"pointer",transition:"border 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.cyanBorder} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <img src={p.heroUrl} alt={p.caption} style={{width:"100%",height:90,objectFit:"cover",display:"block",filter:"brightness(0.5) grayscale(0.5)"}}/>
                  <div style={{padding:"10px 14px"}}><div style={{fontSize:13,fontWeight:700,color:C.white}}>{p.caption}</div><div style={{fontSize:11,color:C.textDim,marginTop:2}}>View hazard guide →</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STICKY SIDEBAR ── */}
        <div style={{position:"sticky",top:80,display:"flex",flexDirection:"column",gap:14}}>

          {/* Primary CTA */}
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.cyanBorder}`,padding:"24px 22px"}}>
            <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:10}}>INJURED? GET HELP NOW</div>
            <p style={{margin:"0 0 18px",fontSize:14,color:"#aaa",lineHeight:1.6}}>If you were hurt due to a {page.caption.toLowerCase()} hazard, you may be entitled to compensation. Free, confidential consultation.</p>
            <button onClick={()=>go("injury")} style={{width:"100%",background:C.cyan,color:C.black,border:"none",padding:"13px",borderRadius:8,fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:"0.04em",marginBottom:10}}>PIN MY INJURY →</button>
            <div style={{textAlign:"center",fontSize:12,color:C.textDim}}>No fee unless we win your case</div>
          </div>

          {/* Pin Hazard CTA */}
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"20px 22px"}}>
            <div style={{fontSize:11,fontWeight:800,color:C.textMuted,letterSpacing:"0.1em",marginBottom:10}}>SEE A HAZARD LIKE THIS?</div>
            <p style={{margin:"0 0 14px",fontSize:13,color:C.textDim,lineHeight:1.6}}>Document it, notify the owner, and protect others in your community.</p>
            <button onClick={()=>go("report")} style={{width:"100%",background:C.muted,color:C.white,border:`1px solid ${C.border}`,padding:"11px",borderRadius:8,fontSize:13,fontWeight:800,cursor:"pointer",letterSpacing:"0.04em"}}>📍 PIN THIS HAZARD</button>
          </div>

          {/* Phone CTA */}
          <div style={{background:"#050505",borderRadius:12,border:`1px solid ${C.border}`,padding:"18px 22px",textAlign:"center"}}>
            <div style={{fontSize:11,color:C.textDim,fontWeight:700,letterSpacing:"0.08em",marginBottom:6}}>CALL NOW — FREE CONSULTATION</div>
            <div style={{fontSize:22,fontWeight:900,color:C.cyan,letterSpacing:"-0.02em"}}>1-800-HAZARD-1</div>
            <div style={{fontSize:12,color:C.textDim,marginTop:4}}>Available 24/7 · All 50 States</div>
          </div>

          {/* Quick stats */}
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"18px 22px"}}>
            <div style={{fontSize:11,fontWeight:800,color:C.textMuted,letterSpacing:"0.1em",marginBottom:12}}>BY THE NUMBERS</div>
            {[["800K+","Emergency visits from falls annually"],["$50B+","Annual cost of fall injuries in the U.S."],["#1","Most common premises liability claim type"],["No Fee","Unless we win your case"]].map(([n,l])=>(
              <div key={l} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                <div style={{fontSize:16,fontWeight:900,color:C.cyan,flexShrink:0,minWidth:50}}>{n}</div>
                <div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResolveModal({hazard,onClose}){
  const[f,setF]=useState({who:"",date:"",method:"",notes:""});
  const[done,setDone]=useState(false);
  const s=k=>v=>setF(p=>({...p,[k]:v}));
  const ok=f.who&&f.date&&f.method;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,width:"100%",maxWidth:520,boxShadow:"0 24px 80px rgba(0,0,0,0.7)",overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"20px 24px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.1em",marginBottom:5}}>REPORT HAZARD RESOLVED</div>
            <div style={{fontSize:16,fontWeight:800,color:C.white,marginBottom:3}}>{hazard.title}</div>
            <div style={{fontSize:12,color:C.textMuted}}>{hazard.address}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.textMuted,fontSize:22,cursor:"pointer",lineHeight:1,padding:"0 0 0 16px",flexShrink:0}}>×</button>
        </div>
        {/* Body */}
        <div style={{padding:"20px 24px"}}>
          {done?(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{width:52,height:52,background:C.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:22,color:C.black,fontWeight:900}}>✓</div>
              <div style={{fontSize:17,fontWeight:800,color:C.green,marginBottom:8}}>Resolution Submitted</div>
              <div style={{fontSize:13,color:C.textMuted,lineHeight:1.6,marginBottom:20}}>Our team will verify the correction and update the map. Thank you for keeping the community safe.</div>
              <button onClick={onClose} style={{background:C.green,color:C.black,border:"none",padding:"10px 28px",borderRadius:8,fontSize:13,fontWeight:800,cursor:"pointer"}}>Close</button>
            </div>
          ):(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                <Inp label="Your Name" value={f.who} onChange={s("who")} placeholder="Name of person reporting" req/>
                <Inp label="Date Corrected" type="date" value={f.date} onChange={s("date")} req/>
              </div>
              <Sel label="How Was the Hazard Corrected?" value={f.method} onChange={s("method")} options={FIX_METHODS} req/>
              <Txt label="Additional Notes (optional)" value={f.notes} onChange={s("notes")} placeholder="Contractor used? Owner responded? Any remaining concerns?" rows={3}/>
              <div style={{display:"flex",gap:10,marginTop:4}}>
                <button onClick={onClose} style={{flex:"0 0 auto",background:"transparent",border:`1px solid ${C.border}`,color:C.textMuted,padding:"11px 20px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>Cancel</button>
                <CyanBtn onClick={()=>ok&&setDone(true)} disabled={!ok} color={ok?C.green:undefined}>SUBMIT RESOLUTION →</CyanBtn>
              </div>
              {!ok&&<p style={{textAlign:"center",fontSize:12,color:C.textDim,margin:"8px 0 0"}}>Complete all required fields to submit</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const NAV=[
  {key:"home",   label:"HAZARD MAP"},
  {key:"about",  label:"ABOUT"},
  {key:"report", label:"PIN A HAZARD"},
  {key:"injury", label:"PIN AN INJURY"},
  {key:"owner",  label:"OWNER PORTAL"},
  {key:"edu",    label:"KNOW YOUR RIGHTS"},
  {key:"faq",    label:"FAQ"},
  {key:"blog",   label:"BLOG"},
];

export default function App(){
  const[sec,setSec]=useState("home");
  const[hazardPage,setHazardPage]=useState(null);
  const[filter,setFilter]=useState("all");
  const[lang,setLang]=useState("en");
  const[resolveTarget,setResolveTarget]=useState(null);
  const mapFlyRef=useRef(null);
  const go=(s)=>{
    if(s.startsWith("hazard:")){setHazardPage(s.slice(7));setSec("hazard");}
    else{setSec(s);setHazardPage(null);}
  };
  // expose globally so Leaflet popup HTML button can call it
  useEffect(()=>{
    window._hpResolve=(id)=>{
      const h=HAZARDS.find(x=>x.id===id);
      if(h) setResolveTarget(h);
    };
    return()=>{delete window._hpResolve;};
  },[]);
  const t=k=>STRINGS[lang][k]||STRINGS.en[k];
  const stats={active:HAZARDS.filter(h=>h.status==="active").length,corrected:HAZARDS.filter(h=>h.status==="corrected").length,notified:HAZARDS.filter(h=>h.notified).length};
  useEffect(()=>{document.title=`${stats.active} Active Hazards — HazardPin`;},[]);
  return(
    <div style={{fontFamily:"-apple-system,'Segoe UI','Helvetica Neue',sans-serif",background:C.black,minHeight:"100vh",color:C.white}}>
      <div style={{background:"#050505",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100,padding:"0 12px"}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div onClick={()=>go("home")} style={{display:"flex",alignItems:"center",gap:9,padding:"12px 0",cursor:"pointer",flexShrink:0}}>
            <div style={{width:30,height:30,background:C.cyan,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📍</div>
            <span style={{fontSize:19,fontWeight:900,letterSpacing:"-0.03em"}}><span style={{color:C.white}}>Hazard</span><span style={{color:C.cyan}}>Pin</span></span>
          </div>
          <nav style={{display:"flex",overflowX:"auto"}}>
            {NAV.map(n=>(
              <button key={n.key} onClick={()=>go(n.key)} style={{background:"transparent",color:sec===n.key?C.cyan:"#999",border:"none",borderBottom:sec===n.key?`2px solid ${C.cyan}`:"2px solid transparent",padding:"13px 9px",cursor:"pointer",fontSize:10,fontWeight:800,letterSpacing:"0.06em",transition:"color 0.15s",whiteSpace:"nowrap"}}>{n.label}</button>
            ))}
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <button onClick={()=>setLang(l=>l==="en"?"es":"en")} style={{background:C.muted,border:`1px solid ${C.border}`,color:C.textMuted,padding:"5px 10px",borderRadius:6,fontSize:11,fontWeight:800,cursor:"pointer",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}><Globe size={12}/>{lang==="en"?"ES":"EN"}</button>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:600}}><Phone size={12} color={C.cyan}/><span style={{color:C.white}}>1-800-HAZARD-1</span></div>
          </div>
        </div>
      </div>

      {sec==="home"&&(
        <>
          <div style={{background:"#050505",borderBottom:`1px solid ${C.border}`,padding:"0 16px 28px"}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <div style={{paddingTop:36,marginBottom:28}}>
                <h1 style={{fontSize:40,fontWeight:900,letterSpacing:"-0.04em",margin:"0 0 12px",lineHeight:1.1}}>{t("h1a")}<br/><span style={{color:C.cyan}}>{t("h1b")}</span></h1>
                <p style={{fontSize:15,color:C.textMuted,margin:0,lineHeight:1.7,maxWidth:560}}>{t("sub")}</p>
              </div>
              <QuickPin go={go}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:3,marginBottom:20,background:C.border,borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
                <BlockBtn icon="✅" top={t("block1t")} bot={t("block1b")} sub="Document a dangerous condition" accent={C.cyan} onClick={()=>go("report")}/>
                <BlockBtn icon="🩹" top={t("block2t")} bot={t("block2b")} sub="I was hurt on someone's property" accent={C.white} onClick={()=>go("injury")}/>
                <BlockBtn icon="🗺️" top={t("block3t")} bot={t("block3b")} sub={`${stats.active} active in your area`} accent={C.cyan} onClick={()=>setFilter("active")}/>
                <BlockBtn icon={null} count={stats.corrected} top={t("block4t")} bot={t("block4b")} sub="hazards resolved so far" accent={C.green} onClick={()=>go("fix")}/>
              </div>
              <MapAddressSearch onFly={(lat,lng)=>{if(mapFlyRef.current)mapFlyRef.current(lat,lng);}}/>
              <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
                {["all","active","corrected"].map(f=>(
                  <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 18px",borderRadius:20,fontSize:11,fontWeight:800,letterSpacing:"0.06em",border:"none",cursor:"pointer",textTransform:"uppercase",background:filter===f?C.cyan:C.muted,color:filter===f?C.black:C.textMuted,transition:"all 0.15s"}}>
                    {f==="all"?`All (${HAZARDS.length})`:f==="active"?`Active (${stats.active})`:`Corrected (${stats.corrected})`}
                  </button>
                ))}
                <div style={{marginLeft:"auto",fontSize:12,color:C.textDim}}>Click any pin for details</div>
              </div>
              <LeafletMap key={filter} hazards={HAZARDS} filter={filter} onMapReady={fn=>{mapFlyRef.current=fn;}}/>
            </div>
          </div>
          <div style={{background:C.black,padding:"36px 16px",borderBottom:`1px solid ${C.border}`}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.15em"}}>COMMON HAZARD TYPES</div></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>
                {GALLERY.map(g=>(
                  <div key={g.caption} onClick={()=>go("hazard:"+HAZARD_PAGES.find(p=>p.caption===g.caption)?.id)} style={{cursor:"pointer"}}>
                    <HazardImg url={g.url} icon={g.icon} caption={g.caption} color={g.color}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{background:"#080808",padding:"36px 16px 56px"}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:800,color:C.cyan,letterSpacing:"0.15em"}}>RECENTLY PINNED HAZARDS</div>
                <button onClick={()=>go("report")} style={{background:"transparent",color:C.cyan,border:`1px solid ${C.cyanBorder}`,padding:"7px 16px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:"0.05em"}}>+ PIN NEW HAZARD</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {HAZARDS.slice(0,6).map(h=>(
                  <div key={h.id} style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:"16px 18px",transition:"border 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.cyanBorder} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:3}}>{h.title}</div>
                        <div style={{fontSize:12,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.address}</div>
                      </div>
                      <div style={{fontSize:11,color:C.textDim,textAlign:"right",flexShrink:0,marginLeft:12}}><div>{h.date}</div><div style={{fontWeight:800,color:C.border}}>#{h.id}</div></div>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                      <Badge status={h.status} severity={h.severity}/>
                      {h.notified&&<span style={{background:"rgba(0,180,228,0.08)",color:C.cyan,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,border:`1px solid ${C.cyanBorder}`}}>NOTIFIED</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <HazardTimeline h={h}/>
                      <ShareBtn hazard={h}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {resolveTarget&&<ResolveModal hazard={resolveTarget} onClose={()=>setResolveTarget(null)}/>}
      {sec==="hazard"&&hazardPage&&<HazardDetailPage pageId={hazardPage} go={go}/>}
      {sec==="about"&&<About/>}
      {sec==="report"&&<ReportHazard/>}
      {sec==="injury"&&<InjuryReport/>}
      {sec==="owner"&&<OwnerPortal/>}
      {sec==="edu"&&<Education/>}
      {sec==="faq"&&<FAQ/>}
      {sec==="blog"&&<Blog/>}

      <div style={{background:"#030303",borderTop:`1px solid ${C.border}`,padding:"32px 16px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:24}}>
          <div><div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4}}><span style={{color:C.white}}>Hazard</span><span style={{color:C.cyan}}>Pin</span></div><div style={{fontSize:11,color:C.textDim,fontWeight:700,letterSpacing:"0.06em",marginBottom:3}}>PREMISES LIABILITY · PERSONAL INJURY LAW</div><div style={{fontSize:12,color:C.textDim}}>50 States · info@hazardpin.com</div></div>
          <div style={{fontSize:12,color:C.textDim,textAlign:"right"}}><div>1-800-HAZARD-1</div><div style={{marginTop:3}}>info@hazardpin.com</div></div>
        </div>
        <div style={{maxWidth:1200,margin:"14px auto 0",paddingTop:14,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:24,flexWrap:"wrap"}}>
          <p style={{margin:0,fontSize:11,color:"#334155",lineHeight:1.7,flex:1,maxWidth:700}}><strong style={{color:"#444"}}>Disclaimer:</strong> The information on this website is for general informational purposes only and does not constitute legal advice. Submission of a hazard or injury report does not create an attorney-client relationship. An attorney-client relationship is only established upon a signed engagement agreement. Results vary and past outcomes do not guarantee future results.</p>
          <div style={{fontSize:11,color:"#334155",flexShrink:0,textAlign:"right",minWidth:180}}><div style={{fontWeight:700,color:"#444",marginBottom:3}}>ADA ACCESSIBILITY</div><div>This site is committed to digital accessibility.</div><div>Contact us for accommodation assistance.</div></div>
        </div>
      </div>
    </div>
  );
}
