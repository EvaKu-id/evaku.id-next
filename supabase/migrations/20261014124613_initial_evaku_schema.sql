-- 1. Ekstensi PostGIS
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- 2. ENUMS
CREATE TYPE run_type AS ENUM ('radar', 'forecast', 'simulation');
CREATE TYPE run_status AS ENUM ('draft', 'published');
CREATE TYPE facility_type AS ENUM ('Puskesmas', 'rumah sakit', 'sekolah', 'tempat ibadah', 'kantor desa', 'lapangan');
CREATE TYPE location_source AS ENUM ('osm', 'bpbd');
CREATE TYPE village_access_status AS ENUM ('reachable', 'partially_isolated', 'fully_isolated');
CREATE TYPE road_condition AS ENUM ('aman', 'terbatas', 'putus', 'belum diketahui');

-- 3. KELOMPOK 1: DATA STATIS
CREATE TABLE villages (
    village_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    regency TEXT NOT NULL,
    population INT,
    children_under5 INT,
    elderly INT,
    geom extensions.geometry(MultiPolygon, 4326) NOT NULL
);
CREATE INDEX villages_geom_idx ON villages USING GIST (geom);

CREATE TABLE road_segments (
    edge_id INT PRIMARY KEY,
    u BIGINT NOT NULL,
    v BIGINT NOT NULL,
    highway_type TEXT,
    is_bridge BOOLEAN NOT NULL DEFAULT FALSE,
    length_m REAL NOT NULL,
    hand_min REAL,
    geom extensions.geometry(LineString, 4326) NOT NULL
);
CREATE INDEX road_segments_geom_idx ON road_segments USING GIST (geom);

CREATE TABLE facilities (
    id BIGSERIAL PRIMARY KEY,
    type facility_type NOT NULL,
    name TEXT,
    village_id TEXT REFERENCES villages(village_id),
    hand REAL,
    capacity INT,
    source location_source NOT NULL DEFAULT 'osm',
    geom extensions.geometry(Point, 4326) NOT NULL
);
CREATE INDEX facilities_geom_idx ON facilities USING GIST (geom);

CREATE TABLE logistics_hubs (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    geom extensions.geometry(Point, 4326) NOT NULL
);
CREATE INDEX logistics_hubs_geom_idx ON logistics_hubs USING GIST (geom);

CREATE TABLE rivers (
    river_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    glofas_point extensions.geometry(Point, 4326),
    calib_a REAL,
    calib_b REAL,
    discharge_min REAL,
    discharge_max REAL,
    geom extensions.geometry(MultiLineString, 4326)
);
CREATE INDEX rivers_geom_idx ON rivers USING GIST (geom);

-- 4. KELOMPOK 2: HASIL PER RUN
CREATE TABLE runs (
    run_id TEXT PRIMARY KEY,
    type run_type NOT NULL,
    data_time TIMESTAMPTZ NOT NULL,
    horizon_hours INT,
    source TEXT,
    status run_status NOT NULL DEFAULT 'draft',
    meta JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX runs_type_status_time_idx ON runs (type, status, data_time);

CREATE TABLE road_status (
    run_id TEXT PRIMARY KEY REFERENCES runs(run_id),
    status SMALLINT[] NOT NULL,
    depth_cm SMALLINT[]
);

CREATE TABLE village_status (
    run_id TEXT REFERENCES runs(run_id),
    village_id TEXT REFERENCES villages(village_id),
    status village_access_status NOT NULL,
    isolated_population INT NOT NULL DEFAULT 0,
    flooded_population INT NOT NULL DEFAULT 0,
    priority_score REAL,
    score_breakdown JSONB,
    route JSONB,
    boat_point JSONB,
    PRIMARY KEY (run_id, village_id)
);
CREATE INDEX village_status_score_idx ON village_status (run_id, priority_score);

CREATE TABLE village_forecasts (
    run_id TEXT REFERENCES runs(run_id),
    village_id TEXT REFERENCES villages(village_id),
    horizon_hours INT,
    probability REAL NOT NULL,
    cutoff_hour INT,
    PRIMARY KEY (run_id, village_id, horizon_hours)
);

CREATE TABLE village_evacuations (
    run_id TEXT REFERENCES runs(run_id),
    village_id TEXT REFERENCES villages(village_id),
    rank SMALLINT,
    facility_id BIGINT NOT NULL REFERENCES facilities(id),
    distance_m REAL,
    walk_minutes REAL,
    drive_minutes REAL,
    leave_before_hour INT,
    route JSONB,
    PRIMARY KEY (run_id, village_id, rank)
);

CREATE TABLE metrics (
    id BIGSERIAL PRIMARY KEY,
    model_version TEXT NOT NULL,
    model TEXT NOT NULL,
    name TEXT NOT NULL,
    value REAL NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX metrics_unique_idx ON metrics (model_version, model, name);

-- 5. KELOMPOK 3: TABEL APLIKASI WEB
CREATE TABLE simulation_cache (
    param_hash TEXT PRIMARY KEY,
    params JSONB NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rate_limits (
    ip TEXT,
    endpoint TEXT,
    window_start TIMESTAMPTZ,
    count INT NOT NULL DEFAULT 0,
    PRIMARY KEY (ip, endpoint, window_start)
);

CREATE TABLE subscriptions (
    chat_id BIGINT,
    village_id TEXT REFERENCES villages(village_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (chat_id, village_id)
);

CREATE TABLE road_corrections (
    id BIGSERIAL PRIMARY KEY,
    edge_id INT NOT NULL REFERENCES road_segments(edge_id),
    status road_condition NOT NULL,
    created_by UUID,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);