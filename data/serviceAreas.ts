import type { ServiceArea } from "@/types";

/**
 * Service areas.
 *
 * Each entry generates a local landing page at /locations/[slug] with its own
 * title, description, H1, and neighborhood list. Adding a town — or a whole new
 * city as Pawside expands — means adding one object here. Nothing is hardcoded
 * to a single municipality anywhere else in the codebase.
 */
export const serviceAreas: ServiceArea[] = [
  {
    slug: "easthampton",
    name: "Easthampton",
    state: "MA",
    neighborhoods: ["Downtown", "Pleasant Street", "Nashawannuck Pond", "Mount Tom", "Park Hill"],
    blurb:
      "Pawside's home base. Most Easthampton visits are within ten minutes of the door, which means tighter arrival windows and easier last-minute coverage.",
    status: "core",
    travelTime: "5 min",
    coords: { lat: 42.2668, lng: -72.669 },
    labelAnchor: "end",
    labelOffset: { x: -18, y: 5 },
  },
  {
    slug: "northampton",
    name: "Northampton",
    state: "MA",
    neighborhoods: ["Downtown", "Florence", "Bay State", "Leeds", "Baystate Village"],
    blurb:
      "Regular walk and drop-in routes through Florence and downtown Northampton, including apartments and condos with entry codes or lockboxes.",
    status: "core",
    travelTime: "10 min",
    coords: { lat: 42.3251, lng: -72.6412 },
    labelAnchor: "end",
    labelOffset: { x: -18, y: 5 },
  },
  {
    slug: "southampton",
    name: "Southampton",
    state: "MA",
    neighborhoods: ["Center", "College Highway", "Fomer Road", "Russellville"],
    blurb:
      "Rural properties and longer driveways are normal here. We're used to gates, fenced acreage, and dogs with a lot of yard to cover.",
    status: "core",
    travelTime: "12 min",
    coords: { lat: 42.2298, lng: -72.7301 },
    labelAnchor: "middle",
    labelOffset: { x: 0, y: 30 },
  },
  {
    slug: "westhampton",
    name: "Westhampton",
    state: "MA",
    neighborhoods: ["Center", "Northwest District", "Chesterfield Road"],
    blurb:
      "Quiet roads and space to walk. Good fit for recurring midday visits where a dog would otherwise be alone all day.",
    status: "nearby",
    travelTime: "18 min",
    coords: { lat: 42.302, lng: -72.7712 },
    labelAnchor: "start",
    labelOffset: { x: 18, y: 5 },
  },
  {
    slug: "holyoke",
    name: "Holyoke",
    state: "MA",
    neighborhoods: ["Highlands", "Elmwood", "Smiths Ferry", "Downtown"],
    blurb:
      "Walks around the Highlands and Elmwood, plus drop-ins for cats in downtown apartments.",
    status: "nearby",
    travelTime: "20 min",
    coords: { lat: 42.2043, lng: -72.6162 },
    labelAnchor: "start",
    labelOffset: { x: 18, y: 5 },
  },
  {
    slug: "hadley",
    name: "Hadley",
    state: "MA",
    neighborhoods: ["North Hadley", "Russell Street", "Mill Valley"],
    blurb:
      "Farm properties, family homes, and multi-pet households between Northampton and Amherst.",
    status: "nearby",
    travelTime: "18 min",
    coords: { lat: 42.3418, lng: -72.5912 },
    labelAnchor: "start",
    labelOffset: { x: 18, y: 5 },
  },
  {
    slug: "amherst",
    name: "Amherst",
    state: "MA",
    neighborhoods: ["Downtown", "North Amherst", "South Amherst", "Cushman"],
    blurb:
      "Overnight care and vacation coverage for Amherst households, including academic-calendar travel.",
    status: "nearby",
    travelTime: "22 min",
    coords: { lat: 42.3732, lng: -72.5199 },
    labelAnchor: "end",
    labelOffset: { x: -18, y: 5 },
  },
  {
    slug: "west-springfield",
    name: "West Springfield",
    state: "MA",
    neighborhoods: ["Merrick", "Mittineague", "Tatham"],
    blurb:
      "Currently a waitlist area. Add your name and we'll reach out as soon as we have consistent coverage nearby.",
    status: "waitlist",
    travelTime: "28 min",
    coords: { lat: 42.107, lng: -72.6203 },
    labelAnchor: "start",
    labelOffset: { x: 18, y: 5 },
  },
];

export function getServiceArea(slug: string): ServiceArea | undefined {
  return serviceAreas.find((area) => area.slug === slug);
}

export const bookableServiceAreas = serviceAreas.filter((area) => area.status !== "waitlist");

export const areaSlugs = serviceAreas.map((area) => area.slug);
