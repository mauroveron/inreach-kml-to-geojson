# InReach KML to GeoJson lambda

This is a simple AWS Lambda function that converts InReach KML feed to GeoJson and
filters out sensitive data. It's useful if you want to just use this GeoJSON on
a public map.


## Secrets

The values for the lambda function's env vars are fetched from SSM, so you'll
need to create three secrets on the SSM parameter store:

- `/inreach-feed-geojson/garmin_mapshare_url` - the url to the MapShare KML feed
- `/inreach-feed-geojson/garmin_mapshare_username` - the username of your MapShare (it's your e-mail)
- `/inreach-feed-geojson/garmin_mapshare_password` - the password you set for your mapshare

