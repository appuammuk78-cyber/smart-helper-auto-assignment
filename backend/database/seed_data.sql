-- Insert Team
INSERT INTO teams(name) VALUES ('Support Team');

-- Insert Skills
INSERT INTO skills(name) VALUES ('Python');
INSERT INTO skills(name) VALUES ('Database');

-- Insert Users
INSERT INTO users(team_id, name, email, role)
VALUES 
(1,'Rahul','rahul@mail.com','helper'),
(1,'Aman','aman@mail.com','helper'),
(1,'Client1','client@mail.com','requester');

-- Insert User Skills
INSERT INTO user_skills(user_id, skill_id, level)
VALUES
(1,1,5),
(2,1,3);

-- Insert Availability
INSERT INTO availability(user_id, status)
VALUES
(1,'available'),
(2,'available');

-- Insert Request
INSERT INTO requests(requester_id, title, description, required_skill_id)
VALUES
(3,'Fix Backend Issue','API not working',1);
