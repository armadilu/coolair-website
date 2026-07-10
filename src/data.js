// Mock data for CoolAir Co. — swap for Supabase queries later (see blueprint §8-9)

export const SERVICES = [
  {
    slug: "repair",
    name: "AC Repair",
    icon: "🔧",
    short: "Same-day diagnosis and repair for all major brands.",
    description:
      "Our NATE-certified technicians diagnose and fix compressors, capacitors, refrigerant leaks, thermostats and more — usually the same day you call. Every repair comes with a 1-year parts & labor warranty.",
    basePrice: 89,
    priceNote: "Diagnostic fee, waived with repair",
    bullets: [
      "Same-day service in most zip codes",
      "Upfront flat-rate pricing before work begins",
      "1-year parts & labor warranty",
      "All major brands: Carrier, Trane, Lennox, Goodman, Rheem",
    ],
  },
  {
    slug: "installation",
    name: "Installation & Replacement",
    icon: "❄️",
    short: "New high-SEER systems, installed right, with financing.",
    description:
      "From load calculation to permit to final inspection, we handle full system replacement and new installs. Bundle a unit from our Shop with installation and save.",
    basePrice: 4900,
    priceNote: "Typical installed system, financing from $89/mo",
    bullets: [
      "Free in-home estimate with load calculation",
      "0% APR financing available for 12 months",
      "10-year manufacturer warranty registration included",
      "Old unit haul-away and eco disposal",
    ],
  },
  {
    slug: "maintenance",
    name: "Maintenance Plans",
    icon: "📅",
    short: "Twice-yearly tune-ups that prevent breakdowns.",
    description:
      "Our CoolCare plan includes two seasonal tune-ups per year, priority scheduling, 15% off repairs, and no overtime charges — the cheapest insurance your AC can have.",
    basePrice: 14,
    priceNote: "per month, CoolCare plan",
    bullets: [
      "2 precision tune-ups per year (spring + fall)",
      "Priority same-day scheduling",
      "15% discount on all repairs",
      "No overtime or emergency fees, ever",
    ],
  },
  {
    slug: "duct-cleaning",
    name: "Duct Cleaning",
    icon: "🌀",
    short: "Remove years of dust, allergens and buildup.",
    description:
      "Whole-home duct cleaning with before/after camera inspection. Improves airflow, cuts energy waste, and reduces allergens circulating through your home.",
    basePrice: 349,
    priceNote: "Whole home, up to 12 vents",
    bullets: [
      "Before/after camera inspection footage",
      "HEPA-filtered negative-pressure equipment",
      "Sanitizing fog treatment available",
      "Improves airflow up to 30%",
    ],
  },
  {
    slug: "air-quality",
    name: "Indoor Air Quality",
    icon: "🌿",
    short: "Purifiers, humidity control and filtration upgrades.",
    description:
      "Whole-home air purifiers, UV lights, media filters and humidity control — measured and matched to your home's actual air quality readings.",
    basePrice: 299,
    priceNote: "IAQ assessment + starter filtration",
    bullets: [
      "Free air quality reading with any service",
      "Whole-home purifiers and UV germicidal lights",
      "Humidity balancing for comfort and health",
      "Great for allergy and asthma households",
    ],
  },
];

// Product images live in public/products/ — filename must match the `image` path.
export const PRODUCTS = [
  { id: 1, brand: "Carrier", model: "Comfort 15", seer: 15.2, tons: 2.5, price: 3450, stock: 6, tag: "Best value", image: "/products/carrier-comfort-15.jpg" },
  { id: 2, brand: "Trane", model: "XR16", seer: 16.2, tons: 3, price: 4200, stock: 4, tag: "Most popular", image: "/products/trane-xr16.jpg" },
  { id: 3, brand: "Lennox", model: "EL22XPV", seer: 22.0, tons: 3, price: 6800, stock: 2, tag: "Max efficiency", image: "/products/lennox-el22xpv.jpg" },
  { id: 4, brand: "Goodman", model: "GSXN4", seer: 14.3, tons: 2, price: 2750, stock: 9, tag: "Budget pick", image: "/products/goodman-gsxn4.jpg" },
  { id: 5, brand: "Rheem", model: "RA17", seer: 17.0, tons: 3.5, price: 4950, stock: 3, tag: "Quiet operation", image: "/products/rheem-ra17.jpg" },
  { id: 6, brand: "Carrier", model: "Infinity 26", seer: 26.0, tons: 4, price: 8900, stock: 1, tag: "Flagship", image: "/products/carrier-infinity-26.jpg" },
];

export const REVIEWS = [
  { name: "Maria G.", rating: 5, date: "3 days ago", text: "AC died at 2pm on the hottest day of July — tech was here by 5pm and had it running by 6. Price matched the quote exactly." },
  { name: "James T.", rating: 5, date: "1 week ago", text: "Used the online quote tool, got a range instantly, booked for next morning. Whole experience felt like 2026, not 1996." },
  { name: "Priya S.", rating: 5, date: "2 weeks ago", text: "They installed our new Trane in one day and hauled the old unit away. Financing approval took 5 minutes." },
  { name: "Dan R.", rating: 4, date: "3 weeks ago", text: "Great maintenance plan. They text me before showing up, and the tech showed me photos of everything he checked." },
  { name: "Aisha K.", rating: 5, date: "1 month ago", text: "The chat assistant correctly guessed it was my capacitor before anyone came out. Repair was done in 40 minutes." },
];

export const SERVICE_AREAS = [
  { zone: "Central Metro", zips: ["75001", "75002", "75006", "75010"], response: "Same day" },
  { zone: "North Suburbs", zips: ["75023", "75024", "75025", "75093"], response: "Same day" },
  { zone: "East County", zips: ["75040", "75041", "75043", "75088"], response: "Next day" },
  { zone: "West County", zips: ["75019", "75038", "75061", "75062"], response: "Next day" },
];

export const COMPARISON = [
  { feature: "Response time", us: "Same-day in most areas", them: "2–5 business days" },
  { feature: "Pricing", us: "Instant online quote range", them: "“We'll call you back”" },
  { feature: "Warranty", us: "1 yr parts & labor on repairs", them: "30–90 days" },
  { feature: "Financing", us: "0% APR for 12 months", them: "Rarely offered" },
  { feature: "Booking", us: "Real-time online scheduling", them: "Phone tag" },
];

// Demo accounts for the role-based login (blueprint §7)
export const DEMO_USERS = [
  { email: "customer@demo.com", password: "demo123", name: "Casey Customer", role: "customer" },
  { email: "admin@demo.com", password: "demo123", name: "Alex Admin", role: "admin" },
  { email: "tech@demo.com", password: "demo123", name: "Terry Tech", role: "technician" },
];

export const MOCK_BOOKINGS = [
  { id: "BK-1041", customer: "Casey Customer", service: "AC Repair", tech: "Terry Tech", date: "2026-07-12 09:00", status: "Scheduled", address: "412 Maple Dr" },
  { id: "BK-1038", customer: "Maria Gonzalez", service: "Maintenance Tune-up", tech: "Terry Tech", date: "2026-07-11 13:00", status: "In progress", address: "88 Sunset Blvd" },
  { id: "BK-1032", customer: "Casey Customer", service: "Duct Cleaning", tech: "Jordan P.", date: "2026-06-28 10:00", status: "Completed", address: "412 Maple Dr" },
  { id: "BK-1029", customer: "James Turner", service: "Installation", tech: "Unassigned", date: "2026-07-14 08:00", status: "Needs assignment", address: "1500 Oak Ln" },
];

export const MOCK_INVOICES = [
  { id: "INV-2207", booking: "BK-1032", amount: 349, status: "Paid", date: "2026-06-28" },
  { id: "INV-2168", booking: "BK-0991", amount: 189, status: "Paid", date: "2026-05-14" },
];
