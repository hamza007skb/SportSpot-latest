CREATE TABLE Users(
	email VARCHAR(255) PRIMARY KEY,
	hashed_password VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Admins(
	email VARCHAR(255) PRIMARY KEY,
	hashed_password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Owners(
	email VARCHAR(255) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	hashed_password VARCHAR(255) NOT NULL,
	phone_no VARCHAR(255) NOT NULL,
	verified_by VARCHAR(255) REFERENCES Admins(email) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE OwnerImage(
	id SERIAL PRIMARY KEY,
	owner_email VARCHAR(255) REFERENCES Owners(email) ON DELETE CASCADE,
	image_data BYTEA NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Grounds(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	phone_no VARCHAR(255) NOT NULL,
	latitude VARCHAR(255) NOT NULL,
	longitude VARCHAR(255) NOT NULL,
	city VARCHAR(255) NOT NULL,
	country VARCHAR(255) NOT NULL,
	address VARCHAR(255) NOT NULL,
	description VARCHAR(255) NOT NULL,
	rating FLOAT,
	total_ratings INT,
	verified_by VARCHAR(255) REFERENCES Admins(email) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE GroundImages(
    id SERIAL PRIMARY KEY,
    ground_id INT REFERENCES Grounds(id) ON DELETE CASCADE,
    image_data BYTEA NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Pitches(
	ground_id INT REFERENCES Grounds(id),
	name VARCHAR(255) NOT NULL UNIQUE,
	description TEXT NOT NULL,
	length VARCHAR(255) NOT NULL,
	width VARCHAR(255) NOT NULL,
	game_type VARCHAR(255) NOT NULL CHECK (game_type in ('Cricket', 'Football', 'Badminton', 'Volleyball')),
	price_per_60mins VARCHAR(255) NOT NULL,
	price_per_90mins VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (ground_id, name)
);
CREATE TABLE Bookings(
	id SERIAL PRIMARY KEY,
	pitch_name VARCHAR(255) REFERENCES Pitches(name),
	ground_id INT REFERENCES Grounds(id),
	user_email VARCHAR(255) REFERENCES Users(email),
	user_contact_no VARCHAR(255) NOT NULL,
	start_time TIMESTAMP NOT NULL,		--assumed UTC
	duration INTERVAL NOT NULL CHECK (duration = '60 minutes' OR duration = '90 minutes'),
	end_time TIMESTAMP GENERATED ALWAYS AS (start_time + duration) STORED,
	payment_status VARCHAR(255) CHECK (payment_status IN ('pending', 'paid')) DEFAULT 'pending',
	booking_date DATE NOT NULL,
	UNIQUE (pitch_name, user_email, start_time)
);

CREATE TABLE GroundOwners(
	ground_id INT REFERENCES Grounds(id) ON DELETE CASCADE,
	owner_email VARCHAR(255) REFERENCES Owners(email) ON DELETE CASCADE,
	PRIMARY KEY (ground_id, owner_email)
);
CREATE TABLE AdminLogs (
    id SERIAL PRIMARY KEY,
    admin_email VARCHAR(255) REFERENCES Admins(email) ON DELETE CASCADE, 
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45), -- Stores the IP address, IPv4 or IPv6 compatible
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE OwnerLogs (
    id SERIAL PRIMARY KEY,
    owner_email VARCHAR(255) REFERENCES Owners(email) ON DELETE CASCADE,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45), -- Stores the IP address, IPv4 or IPv6 compatible
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE UserLogs (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) REFERENCES Users(email) ON DELETE CASCADE,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45), -- Stores the IP address, IPv4 or IPv6 compatible
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE OwnerSignUpRequest(
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone_no VARCHAR(255) NOT NULL,
	stadium_name VARCHAR(255) NOT NULL,
	stadium_address VARCHAR(255) NOT NULL,
	aim_to_join VARCHAR(255) NOT NULL,
	verified BOOLEAN NOT NULL
);
CREATE TABLE UserReviews(
	user_id VARCHAR(255) REFERENCES Users(email) ON DELETE CASCADE NOT NULL,
	rating FLOAT NOT NULL,
	ground_id INT REFERENCES Grounds(id) ON DELETE CASCADE NOT NULL,
	comment VARCHAR(255),
	PRIMARY KEY (user_id, booking)
);

-- Step 1: Create the trigger function to update the average rating and total ratings in the Grounds table
CREATE OR REPLACE FUNCTION update_ground_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the Grounds table with the new average rating and total ratings count
    UPDATE Grounds
    SET 
        rating = (
            SELECT AVG(rating)::FLOAT
            FROM UserReviews
            WHERE ground_id = NEW.ground_id
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM UserReviews
            WHERE ground_id = NEW.ground_id
        )
    WHERE id = NEW.ground_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create a trigger on the UserReviews table for INSERT operations
CREATE TRIGGER update_rating_trigger
AFTER INSERT ON UserReviews
FOR EACH ROW
EXECUTE FUNCTION update_ground_rating();


INSERT INTO Admins (email, hashed_password)
VALUES 
('hamza@gmail.com', 'pass1');

INSERT INTO GroundOwners (ground_id, owner_email) VALUES 
(1, 'syedali@gmail.com');

INSERT INTO Pitches (ground_id, name, description, length, width, game_type, price_per_60mins, price_per_90mins) VALUES 
(1, 'Greenfield Cricket Pitch', 'A high-quality cricket pitch', '60m', '30m', 'Cricket', '50', '70');

INSERT INTO Bookings (pitch_name, ground_id, user_email, user_contact_no, start_time, duration, booking_date, payment_status) VALUES 
('Greenfield Cricket Pitch', 1, 'hamza@gmail.com', '1234567890', '2024-11-28 10:00:00', '60 minutes', '2024-11-28', 'paid');

INSERT INTO Bookings (pitch_name, ground_id, user_email, user_contact_no, start_time, duration, booking_date, payment_status) VALUES 
('Greenfield Cricket Pitch', 1, 'hamza@gmail.com', '1234567890', '2024-12-28 11:00:00', '60 minutes', '2024-12-28', 'pending');

INSERT INTO Bookings (pitch_name, ground_id, user_email, user_contact_no, start_time, duration, booking_date, payment_status) VALUES 
('Greenfield Cricket Pitch', 1, 'hamza@gmail.com', '1234567890', '2024-12-28 14:00:00', '60 minutes', '2024-12-28', 'pending');

select * from bookings

select * from ownerimage

INSERT INTO Grounds (name, phone_no, latitude, longitude, city, country, address, description, rating, total_ratings, verified_by) VALUES 
('Greenfield Ground', '1234567890', '37.7749', '-122.4194', 'San Francisco', 'USA', '123 Main St', 'A beautiful ground for sports', 4.5, 10, 'hamza@gmail.com');