#!/bin/bash

curl -G "http://localhost:3000/tiles" \
  --data-urlencode "minLon=139.5" \
  --data-urlencode "minLat=35.5" \
  --data-urlencode "maxLon=140" \
  --data-urlencode "maxLat=36" \
  --data-urlencode "minZoom=5" \
  --data-urlencode "maxZoom=7" \
  --output tiles.zip