The directories...

RAILS_ROOT/
  hop/       -- The unzipped helma object publisher (hop) binary distribution, 
                as unchanged as possible to allow for easy upgrades.
                We've only changed the hop/*.properties files.
    apps/    -- The sample apps that came bundled with hop.
  hop.apps/  -- Where we keep our ee specific hop apps.
    spaces/  -- The main hop app for ee with url mountpoint of /spaces
