CREATE TABLE hotel_chain
(
    chain_name character varying NOT NULL,
    chain_slug character varying NOT NULL,
    phone_numbers character varying[] NOT NULL,
    email_addresses character varying[] NOT NULL,
    central_address character varying NOT NULL,
    number_hotels integer NOT NULL DEFAULT 0,
    PRIMARY KEY (chain_slug),
    UNIQUE (central_address)
);

CREATE TABLE hotel
(
    hotel_name character varying NOT NULL,
    hotel_slug character varying NOT NULL,
    chain_slug character varying NOT NULL,
    phone_numbers character varying[] NOT NULL,
    email_addresses character varying[] NOT NULL,
    address character varying NOT NULL,
    rating integer NOT NULL,
    number_rooms integer NOT NULL DEFAULT 0,
    PRIMARY KEY (hotel_slug),
    UNIQUE (address),
    FOREIGN KEY (chain_slug)
        REFERENCES hotel_chain (chain_slug) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

CREATE TABLE hotel_room
(
    room_number integer NOT NULL,
    hotel_slug character varying NOT NULL,
    price double precision NOT NULL,
    damages character varying[],
    amenities character varying[],
    extended boolean NOT NULL,
    capacity character varying NOT NULL,
    view character varying NOT NULL,
    FOREIGN KEY (hotel_slug)
        REFERENCES hotel (hotel_slug) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

CREATE TABLE customer
(
    full_name character varying NOT NULL,
    address character varying NOT NULL,
    sin character varying NOT NULL,
    date_registered date NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (sin)
);

CREATE TABLE employee
(
    full_name character varying NOT NULL,
    sin character varying NOT NULL,
    address character varying NOT NULL,
    role character varying NOT NULL,
    hotel_slug character varying NOT NULL,
    PRIMARY KEY (sin),
    FOREIGN KEY (hotel_slug)
        REFERENCES hotel (hotel_slug) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);


CREATE TABLE booking
(
    booking_id character varying NOT NULL,
    customer_sin character varying NOT NULL,
    hotel_slug character varying NOT NULL,
    room_number integer NOT NULL,
    check_in date NOT NULL,
    check_out date NOT NULL,
    total_cost double precision NOT NULL,
    is_renting boolean NOT NULL,
    PRIMARY KEY (booking_id)
);

CREATE FUNCTION increment_number_rooms() RETURNS TRIGGER AS $$
BEGIN
    UPDATE hotel
    SET number_rooms = number_rooms + 1
    WHERE hotel_slug = NEW.hotel_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hotel_room_insert_trigger
AFTER INSERT ON hotel_room
FOR EACH ROW
EXECUTE FUNCTION increment_number_rooms();

CREATE FUNCTION increment_number_hotels() RETURNS TRIGGER AS $$
BEGIN
    UPDATE hotel_chain
    SET number_hotels = number_hotels + 1
    WHERE chain_slug = NEW.chain_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION update_price() RETURNS TRIGGER AS $$
BEGIN
  NEW.price = (1 + (
    CASE
      WHEN array_length(NEW.amenities, 1) > 2 THEN 0.05 * (array_length(NEW.amenities, 1) - 2)
      ELSE 0
    END
  ) - (
    CASE
      WHEN NEW.damages IS NOT NULL THEN 0.1
      ELSE 0
    END
  )) * NEW.price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_price_trigger
BEFORE INSERT OR UPDATE ON hotel_room
FOR EACH ROW
EXECUTE FUNCTION update_price();

CREATE TRIGGER hotel_insert_trigger
AFTER INSERT ON hotel
FOR EACH ROW
EXECUTE FUNCTION increment_number_hotels();

CREATE FUNCTION decrement_number_hotels() RETURNS TRIGGER AS $$
BEGIN
    UPDATE hotel_chain
    SET number_hotels = number_hotels - 1
    WHERE chain_slug = OLD.chain_slug;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hotel_delete_trigger
AFTER DELETE ON hotel
FOR EACH ROW
EXECUTE FUNCTION decrement_number_hotels();

CREATE FUNCTION decrement_number_rooms() RETURNS TRIGGER AS $$
BEGIN
    UPDATE hotel
    SET number_rooms = number_rooms - 1
    WHERE hotel_slug = OLD.hotel_slug;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hotel_room_delete_trigger
AFTER DELETE ON hotel_room
FOR EACH ROW
EXECUTE FUNCTION decrement_number_rooms();

CREATE VIEW available_rooms_by_rating AS
 SELECT h.rating,
    count(hr.room_number) AS count
   FROM hotel h
     JOIN hotel_room hr ON h.hotel_slug = hr.hotel_slug
  WHERE NOT (EXISTS ( SELECT 1
           FROM booking b
          WHERE b.hotel_slug = hr.hotel_slug AND b.room_number = hr.room_number AND CURRENT_DATE >= b.check_in AND CURRENT_DATE <= b.check_out))
  GROUP BY h.rating;

CREATE VIEW hotel_capacity AS
SELECT h.hotel_name, SUM(
  CASE hr.capacity
    WHEN 'single' THEN 2
    WHEN 'double' THEN 4
    WHEN 'suite' THEN 8
    ELSE 0
  END
) AS total_capacity
FROM hotel h
JOIN hotel_room hr ON h.hotel_slug = hr.hotel_slug
GROUP BY h.hotel_name;

CREATE INDEX idx_hotel_room_hotel_slug ON hotel_room(hotel_slug);

CREATE INDEX idx_booking_hotel_room_dates ON booking(hotel_slug, room_number, check_in, check_out);

CREATE INDEX idx_hotel_rating ON hotel(rating);