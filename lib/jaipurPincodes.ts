// Jaipur city delivery pincodes (302xxx). Added once on live when no Jaipur
// pincodes exist yet; manage them afterwards in Admin → Pincodes.
// Area names are given only where well known — otherwise "Jaipur".
export const jaipurPincodes: { code: string; area: string }[] = [
  { code: '302001', area: 'Jaipur City (MI Road, C-Scheme)' },
  { code: '302002', area: 'Jaipur City (Johari Bazar, Ramganj)' },
  { code: '302003', area: 'Jaipur City (Chandpole, Kishanpole)' },
  { code: '302004', area: 'Adarsh Nagar, Raja Park, Jawahar Nagar' },
  { code: '302005', area: 'Jaipur' },
  { code: '302006', area: 'Sindhi Camp, Station Road' },
  { code: '302007', area: 'Jaipur' },
  { code: '302012', area: 'Jhotwara' },
  { code: '302013', area: 'Murlipura, VKI Area' },
  { code: '302015', area: 'Lal Kothi, Tonk Phatak' },
  { code: '302016', area: 'Shastri Nagar, Bani Park' },
  { code: '302017', area: 'Malviya Nagar' },
  { code: '302018', area: 'Durgapura, Tonk Road' },
  { code: '302019', area: 'Gopalpura' },
  { code: '302020', area: 'Mansarovar' },
  { code: '302021', area: 'Vaishali Nagar' },
  { code: '302022', area: 'Sitapura' },
  { code: '302023', area: 'Jaipur' },
  { code: '302025', area: 'Jaipur' },
  { code: '302026', area: 'Jaipur' },
  { code: '302027', area: 'Jaipur' },
  { code: '302028', area: 'Amer' },
  { code: '302029', area: 'Sanganer' },
  { code: '302031', area: 'Jaipur' },
  { code: '302033', area: 'Pratap Nagar' },
  { code: '302034', area: 'Jaipur' },
  { code: '302036', area: 'Jaipur' },
  { code: '302037', area: 'Jaipur' },
  { code: '302038', area: 'Jaipur' },
  { code: '302039', area: 'Vidhyadhar Nagar' },
]

// Delivery is free in all areas.
export const JAIPUR_DELIVERY_CHARGE = 0
