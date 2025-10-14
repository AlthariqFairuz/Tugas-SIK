-- Seed data for patients table
-- Insert 5 sample Indonesian patients

INSERT INTO patients (
  family_name, given_name, gender, birth_date, phone, email, address, city, postal_code, country
) VALUES
('Pratama', 'Andi', 'male', '1995-04-12', '081234567890', 'andi.pratama@example.com', 'Jl. Merdeka No. 10', 'Bandung', '40123', 'Indonesia'),
('Sari', 'Dewi', 'female', '1998-09-25', '081298765432', 'dewi.sari@example.com', 'Jl. Sudirman No. 22', 'Jakarta', '10210', 'Indonesia'),
('Wijaya', 'Budi', 'male', '1987-01-08', '082133445566', 'budi.wijaya@example.com', 'Jl. Diponegoro No. 45', 'Surabaya', '60234', 'Indonesia'),
('Putri', 'Lestari', 'female', '1993-11-15', '085212345678', 'lestari.putri@example.com', 'Jl. Malioboro No. 7', 'Yogyakarta', '55212', 'Indonesia'),
('Santoso', 'Rizky', 'male', '2000-06-02', '083845612345', 'rizky.santoso@example.com', 'Jl. Gajah Mada No. 18', 'Semarang', '50133', 'Indonesia');
