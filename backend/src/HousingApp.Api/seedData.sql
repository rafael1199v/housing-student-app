-- ============================================
-- MOCK DATA FOR STUDENT HOUSING DATABASE
-- ============================================

-- Insert Room Statuses
INSERT INTO rooms_statuses (name, created_at, is_deleted)
VALUES 
    ('Available', NOW(), false),
    ('Unavailable', NOW(), false),
    ('Booked', NOW(), false);

-- Insert Booking Statuses
INSERT INTO booking_statuses (name, created_at, is_deleted)
VALUES 
    ('Pending', NOW(), false),
    ('Confirmed', NOW(), false),
    ('Cancelled', NOW(), false),
    ('Completed', NOW(), false),
    ('No Show', NOW(), false);

-- Borrar las líneas de la tabla para asegurar un UUID estático
DELETE FROM "AspNetRoles"

INSERT INTO public."AspNetRoles"
(id, "name", normalized_name, concurrency_stamp)
VALUES('ed106456-d8ae-4328-b452-eca73c6ceaaf', 'Admin', 'ADMIN', 'af7783b3-d3f0-4c55-82d9-330136cff004'),
('aa921c2b-5259-42db-8bd6-56f28e0f176b', 'Student', 'STUDENT', 'f28b8d52-0112-4ad3-a5b4-cda2a9456e37'),
('d1eb3aa7-73e8-47a0-86ef-7c4664f6a56e', 'Householder', 'HOUSEHOLDER', 'd1dcc1fb-4b7e-4f5b-99a1-7972d37f9054');

-- ============================================
-- INSERT USERS
-- ============================================
INSERT INTO public."AspNetUsers"
(id, user_name, normalized_user_name, email, normalized_email, email_confirmed, password_hash, security_stamp, concurrency_stamp, phone_number, phone_number_confirmed, two_factor_enabled, lockout_end, lockout_enabled, access_failed_count)
VALUES('119f044e-4651-4e1f-b54d-d95f9f0fe426', 'juan.perez@example16.com', 'JUAN.PEREZ@EXAMPLE16.COM', 'juan.perez@example16.com', 'JUAN.PEREZ@EXAMPLE16.COM', false, 'AQAAAAIAAYagAAAAEK/P399tB43MenoSAom0/PK0Al7yrr1gtamxcOoJAwg0R+yPs8a/+M9H09b517AZyg==', '3AFYXELKIRHCCNKTDHARFUQW5QYOTPTI', '470956d4-9439-431c-9e5f-91b0c3e95d22', NULL, false, false, NULL, true, 0),
('7d31a992-a28a-47d8-ab4e-5ae4090a7917', 'rafael.perez@example16.com', 'RAFAEL.PEREZ@EXAMPLE16.COM', 'rafael.perez@example16.com', 'RAFAEL.PEREZ@EXAMPLE16.COM', false, 'AQAAAAIAAYagAAAAEOe5rovQLsPLzRWrac4+4n+oEqOb4E4+2nfuGwKkDNL1ORguGb6XiwIpDoVFxjINrQ==', '6ZJ5TVPIYLZ72JHNUIC7HXSNEBA4Z3VW', 'b50f3a14-c81e-47df-a07f-1ed1f412df49', NULL, false, false, NULL, true, 0);

INSERT INTO public.persons
(user_id, first_name, last_name, email, phone_number, nationality, age, gender, image_url, birth_date, is_deleted, created_at, updated_at, deleted_at)
VALUES('119f044e-4651-4e1f-b54d-d95f9f0fe426', 'Juan', 'Pérez', 'juan.perez@example16.com', '+541122334455', 'Argentina', 30, 'Masculino', 'https://api.housingapp.com/images/profiles/juan-perez.jpg', '1994-03-08', false, '2026-03-13 17:54:39.167', NULL, NULL),
('7d31a992-a28a-47d8-ab4e-5ae4090a7917', 'Rafael', 'Andres', 'rafael.perez@example16.com', '+541122334455', 'Argentina', 30, 'Masculino', 'https://api.housingapp.com/images/profiles/juan-perez.jpg', '1994-03-08', false, '2026-03-13 17:57:29.206', NULL, NULL);

INSERT INTO public."AspNetUserRoles"
(user_id, role_id)
VALUES('119f044e-4651-4e1f-b54d-d95f9f0fe426', 'd1eb3aa7-73e8-47a0-86ef-7c4664f6a56e'),
('7d31a992-a28a-47d8-ab4e-5ae4090a7917', 'aa921c2b-5259-42db-8bd6-56f28e0f176b');

-- ============================================
-- INSERT ROOMS (for Juan Perez - Landlord 1)
-- ============================================
INSERT INTO rooms (name, latitude, longitude, description, price, person_id, room_status_id, created_at, is_deleted)
VALUES 
    ('Cozy Studio Near University', 40.4168, -3.7038, 'Bright studio apartment with modern furniture, WiFi included. Perfect for a single student. Walking distance to campus.', 550.00, '119f044e-4651-4e1f-b54d-d95f9f0fe426', 2, NOW(), false),
    ('Double Room with Balcony', 40.4200, -3.7050, 'Spacious double room with a private balcony overlooking the city. Includes heating and utilities. Great location near metro station.', 750.00, '119f044e-4651-4e1f-b54d-d95f9f0fe426', 1, NOW(), false),
    ('Shared Apartment - Room A', 40.4180, -3.7020, 'Bright room in a shared apartment with kitchen and living room. Perfect for roommates. All utilities included except electricity.', 480.00, '119f044e-4651-4e1f-b54d-d95f9f0fe426', 1, NOW(), false);

-- ============================================
-- INSERT ROOM IMAGES
-- ============================================
-- Images for Juan Perez rooms (rooms 1-3)
INSERT INTO room_images (image_url, room_id, created_at, is_deleted)
VALUES 
    ('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1, NOW(), false),
    ('https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1, NOW(), false),
    ('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1, NOW(), false),
    ('https://plus.unsplash.com/premium_photo-1674676471104-3c4017645e6f?q=80&w=670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 2, NOW(), false),
    ('https://plus.unsplash.com/premium_photo-1674676471104-3c4017645e6f?q=80&w=670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 2, NOW(), false),
    ('https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 3, NOW(), false),
    ('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 3, NOW(), false);

-- ============================================
-- INSERT SAMPLE BOOKINGS -- TODO: REVISAR DIFERENCIA ENTRE booker_id y booker_user_id
-- ============================================
INSERT INTO bookings (booker_user_id, room_id, booking_status_id, created_at, is_deleted)
VALUES 
    ('7d31a992-a28a-47d8-ab4e-5ae4090a7917', 1, 2, NOW() - INTERVAL '30 days', false);

-- ============================================
-- VERIFICATION QUERIES (Run these to verify data)
-- ============================================
-- SELECT * FROM rooms;
-- SELECT * FROM room_images;
-- SELECT * FROM persons WHERE user_id LIKE 'user-landlord-%';
-- SELECT * FROM persons WHERE user_id LIKE 'user-student-%';
-- SELECT r.name, r.price, p.first_name, p.last_name FROM rooms r 
-- JOIN persons p ON r.person_id = p.user_id;
-- SELECT * FROM bookings;
