# Data structure

## Mapbox

**NOTE:** _for MB Style requirements_, view the README.

These are the MB Tileset layer names:

- **mb-data:** language points
- **puma:** census PUMA polygons
- **tract:** census tract polygons
- **counties:** NYC metro county and borough polygons
- **neighborhoods:** NYC neighborhood polygons

Their names were set by uploading data as an MB Dataset first. Their config
(namely `source-id`s), is set in various files in _src/components/map_.

The naming is very important, especially for the polygon layers, as much of the
code involving them depends on those names as object keys in a fragile manner.

### Required fields

The allowed data values for many of these can be found in
_src/components/context/types.ts_.

#### Language points

This data is typically uploaded via the "For Map" Airtable view as a CSV export
and some conversion steps to GeoJSON, but it used to work as a CSV w/o the
intermediate steps.

- `id`: integer (MB uploads as string somehow) **unique**
- `Latitude`: float (MB uploads as string somehow)
- `Longitude`: float (MB uploads as string somehow)
- `Language`: string
- `Endonym`: string
- `World Region`: string
- `Size`: string
- `Status`: string

#### Polygons

- `GEOID`: string (for both census layers) **unique**
- `name`: string (for both non-census layers) **unique**

## Airtable

**IMPORTANT:** _most or all of the routes (URLs), many of which can be found at
`src/components/config/api.ts`, are dependent on the table names and column
names below._ The _field_ requirements are largely intact and are "typed" in
TypeScript in `src/components/context/types.ts`.

### Census

Lookup table and configuration for tract- and PUMA-level census data.

#### Fields

- `id` _text_: The original field from the census data source. MUST match the
  corresponding column name of the data it refers to (e.g. 2014-2018 PUMA or
  Tracts table).
- `pretty` _text_: What the user sees in the census dropdown of the UI.
- `complicated` _checkbox_: Instances with this value checked will receive an
  asterisk (\*) in the census dropdown of the UI to indicate \"Census Bureau
  category, component languages unclear\".
- `sort_order` _number_: The relative position this field will be displayed in
  within PUMA-level fields in the census dropdown of the UI."
  - **Requirements:** decimal, precision: 2, negatives prohibited
- `scope` _select_
  - **Choices:** `puma`, `tract`
- `Language` _Link to another table_

### Country Flags

### Country

### County

### Data

### Descriptions

### Fonts

### Language Descriptions

### Language Family

### Language Profiles

### Language

### Macrocommunity

### Neighborhood

### Schema

### Size

### Status

### Town

### UI Text

### World Region
