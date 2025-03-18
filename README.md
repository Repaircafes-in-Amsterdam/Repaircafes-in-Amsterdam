This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data

### Repair Café data

We have a Google Spreadsheet that stores the Repair Cafés data. In the future we hope to move this into a database and make it editable by the Repair Café organizers using their own logins.
[Example spreadsheet](https://docs.google.com/spreadsheets/d/1Jm1jFasNHkmciVD3OYLXgb0SqZuI_2GF7tIlcbyOQKw/edit?gid=0#gid=0).
It contains the columns mentioned in the `RC` type (see [Types](https://github.com/Repaircafes-in-Amsterdam/Repaircafes-in-Amsterdam/blob/main/app/types.ts)) + the ones that are put nested under links see LINK_COLUMNS in [update-data](https://github.com/Repaircafes-in-Amsterdam/Repaircafes-in-Amsterdam/blob/main/data/update-data.mjs). The `slug` is automatically generated. The `MultilingualData` columns are prefixed by locales like `en:` and `nl:`.
We export it's data, combine it with the sources below and save it into a json file by running:

```bash
npm run update-data
```

For this to work you'll need to create a service account, duplicate `.env.local.example` to `.env.local` fill in `GOOGLE_PRIVATE_KEY` `GOOGLE_PRIVATE_KEY` and give the the service account access to your spreadsheet.  
More info: https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication

### Festivals data

Similar to Repair Cafés data we have a sheet in our Google Spreadsheet with Festivals data. These are events that happen only once.
[Example spreadsheet](https://docs.google.com/spreadsheets/d/1Jm1jFasNHkmciVD3OYLXgb0SqZuI_2GF7tIlcbyOQKw/edit?gid=22042023#gid=22042023).
It contains the columns mentioned in the `Festival` type (see [Types](https://github.com/Repaircafes-in-Amsterdam/Repaircafes-in-Amsterdam/blob/main/app/types.ts)).
We export it's data and save it into a json file by running:

```bash
npm run update-festivals
```

### Holidays data

We use openholidaysapi.org to retrieve accurate dates on public and school holidays. We download it to a json to prevent being directly dependant on it for the function of the website. It enables downloading 3 years into the future, so ones in a while we need to run the update data script. To update the data run:

```bash
npm run update-holidays-data
```

### Ramadan data

We use api.aladhan.com to retrieve Ramadan dates. We download it to a json to prevent being directly dependant on it for the function of the website. It enables downloading 5 years into the future, so ones in a while we need to run the update data script. To update the data run:

```bash
npm run update-ramadan-data
```

### Repaircafe.org map data

We use the [repair.org API](https://www.repaircafe.org/api/) to pull in the coordinates they know. We download it to a json to prevent being directly dependant on it for the function of the website. To update that data run:

```bash
npm run update-map-data
```

### Manual map data

For the Repair Cafés that are not on [repair.org](https://www.repaircafe.org/) or for when we want to override their coordinates we can store the coordinates in `manual-map-data.json`. When the `update-data` is run it first checks `manual-map-data.json`, if none are found it checks the Repair Cafés map data and when it still can't find coordinates it will add an entry to `manual-map-data.json` so it can be filed in.  
A site like https://www.latlong.net/ can be used to find coordinates.

## Other scripts

- `dev` Start in development mode.
- `build` Build for production usage.
- `build:analyze` Build for production usage and analyze the bundle.
- `start` Start a Next.js production server, using build code.
- `test` Execute unit tests.
- `test:watch` Watching test files to automatically run unit tests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
