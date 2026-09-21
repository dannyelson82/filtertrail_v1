CREATE TABLE IF NOT EXISTS vehicle_types (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon_key VARCHAR(64) NOT NULL DEFAULT 'vehicle',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_vehicle_types_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE vehicles
    ADD COLUMN vehicle_type_id INT NULL AFTER type;

ALTER TABLE vehicles
    ADD CONSTRAINT fk_vehicles_vehicle_type
        FOREIGN KEY (vehicle_type_id)
        REFERENCES vehicle_types(id)
        ON DELETE SET NULL;

CREATE INDEX ix_vehicles_vehicle_type_id
    ON vehicles (vehicle_type_id);
