export const parkingSpots = [
  {
    id: 1,
    name: "Neon Plaza Parking",
    location: "Downtown, Metro City",
    price: 5.50,
    distance: "0.8 km",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400",
    availableSpots: 12,
    totalSpots: 50,
    type: "Indoor",
    amenities: ["CCTV", "EV Charging", "Disabled Access"]
  },
  {
    id: 2,
    name: "Cyber Tower Garage",
    location: "Tech District",
    price: 3.20,
    distance: "1.2 km",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=400",
    availableSpots: 5,
    totalSpots: 30,
    type: "Underground",
    amenities: ["CCTV", "Valet"]
  },
  {
    id: 3,
    name: "Blue Horizon Lot",
    location: "Harbor Side",
    price: 4.00,
    distance: "2.5 km",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=400",
    availableSpots: 20,
    totalSpots: 100,
    type: "Open Space",
    amenities: ["CCTV", "24/7 Access"]
  }
];

export const bookings = [
  {
    id: "BK-7821",
    spotName: "Neon Plaza Parking",
    date: "2024-03-25",
    time: "14:00 - 16:00",
    amount: 11.00,
    status: "Active",
    type: "Indoor"
  },
  {
    id: "BK-6542",
    spotName: "Cyber Tower Garage",
    date: "2024-03-22",
    time: "10:00 - 12:00",
    amount: 6.40,
    status: "Completed",
    type: "Underground"
  }
];

export const transactions = [
  { id: "TX-9901", type: "Add Money", amount: 50.00, date: "2024-03-20", status: "Success" },
  { id: "TX-9852", type: "Booking Payment", amount: -11.00, date: "2024-03-25", status: "Success" },
];
