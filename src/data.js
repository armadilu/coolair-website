// Mock data for CoolAir Co. — swap for Supabase queries later (see blueprint §8-9)

export const SERVICES = [
  {
    slug: "repair",
    name: "AC Repair",
    icon: "🔧",
    short: "Same-day diagnosis and repair for all major brands.",
    description:
      "Our NATE-certified technicians diagnose and fix compressors, capacitors, refrigerant leaks, thermostats and more — usually the same day you call. Every repair comes with a 1-year parts & labor warranty.",
    basePrice: 335,
    priceNote: "Callout fee, waived with repair",
    bullets: [
      "Same-day service across most Riyadh districts",
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
    basePrice: 18000,
    priceNote: "Typical installed system, from SAR 375/mo",
    bullets: [
      "Free on-site estimate with load calculation",
      "0% profit-rate instalments over 12 months",
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
    basePrice: 55,
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
      "Whole-villa duct cleaning with before/after camera inspection. Improves airflow, cuts energy waste, and reduces allergens circulating through your home.",
    basePrice: 1300,
    priceNote: "Whole villa, up to 12 outlets",
    bullets: [
      "Before/after camera inspection footage",
      "HEPA-filtered negative-pressure equipment",
      "Sanitizing fog treatment available",
      "Clears construction and sand dust from ducts",
    ],
  },
  {
    slug: "air-quality",
    name: "Indoor Air Quality",
    icon: "🌿",
    short: "Purifiers, humidity control and filtration upgrades.",
    description:
      "Whole-villa air purifiers, UV lights, media filters and humidity control — measured and matched to your home's actual air quality readings.",
    basePrice: 1120,
    priceNote: "IAQ assessment + starter filtration",
    bullets: [
      "Free air quality reading with any service",
      "Whole-villa purifiers and UV germicidal lights",
      "Humidity balancing for comfort and health",
      "Built for dust-season Riyadh households",
    ],
  },
];

// Product images live in public/products/ — filename must match the `image` path.
export const PRODUCTS = [
  { id: 1, brand: "Carrier", model: "Comfort 15", seer: 15.2, tons: 2.5, price: 12900, stock: 6, tag: "Best value", image: "/products/carrier-comfort-15.jpg" },
  { id: 2, brand: "Trane", model: "XR16", seer: 16.2, tons: 3, price: 15750, stock: 4, tag: "Most popular", image: "/products/trane-xr16.jpg" },
  { id: 3, brand: "Lennox", model: "EL22XPV", seer: 22.0, tons: 3, price: 25500, stock: 2, tag: "Max efficiency", image: "/products/lennox-el22xpv.jpg" },
  { id: 4, brand: "Goodman", model: "GSXN4", seer: 14.3, tons: 2, price: 10300, stock: 9, tag: "Budget pick", image: "/products/goodman-gsxn4.jpg" },
  { id: 5, brand: "Rheem", model: "RA17", seer: 17.0, tons: 3.5, price: 18500, stock: 3, tag: "Quiet operation", image: "/products/rheem-ra17.jpg" },
  { id: 6, brand: "Carrier", model: "Infinity 26", seer: 26.0, tons: 4, price: 33400, stock: 1, tag: "Flagship", image: "/products/carrier-infinity-26.jpg" },
];

export const REVIEWS = [
  { name: "Nouf A.", rating: 5, date: "3 days ago", text: "Split unit died during a 46-degree afternoon in Al Olaya. Technician arrived within three hours and the price matched the quote exactly." },
  { name: "Faisal M.", rating: 5, date: "1 week ago", text: "Got a real price range online, booked for the next morning in Al Narjis. No waiting for a callback." },
  { name: "Reem S.", rating: 5, date: "2 weeks ago", text: "Two new units installed in one day and the old ones taken away. Financing approval took five minutes." },
  { name: "Abdullah K.", rating: 4, date: "3 weeks ago", text: "Maintenance plan is worth it before summer. They message before arriving and show photos of everything checked." },
  { name: "Layla H.", rating: 5, date: "1 month ago", text: "The online tool guessed the capacitor before anyone came out. Repair took forty minutes." },
];

export const SLOTS = ["Today 4–6 PM", "Today 6–8 PM", "Tomorrow 9–11 AM", "Tomorrow 11–1 PM", "Tomorrow 4–6 PM"];

export const SERVICE_AREAS = [
  { zone: "Al Olaya & Al Muruj", zips: ["12211", "12241", "12271", "12313"], response: "Same day" },
  { zone: "Al Malaz & Al Rawdah", zips: ["11439", "12831", "13213", "13241"], response: "Same day" },
  { zone: "Al Narjis & Al Yasmin", zips: ["13322", "13325", "13241", "13315"], response: "Same day" },
  { zone: "Diriyah & Irqah", zips: ["13711", "13721", "12571", "12584"], response: "Next day" },
];

export const COMPARISON = [
  { feature: "Response time", us: "Same-day in most areas", them: "2–5 business days" },
  { feature: "Pricing", us: "Instant online quote range", them: "“We'll call you back”" },
  { feature: "Warranty", us: "1 yr parts & labor on repairs", them: "30–90 days" },
  { feature: "Financing", us: "0% instalments for 12 months", them: "Rarely offered" },
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
