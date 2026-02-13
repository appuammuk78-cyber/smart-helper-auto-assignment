BEGIN;

-- =========================
-- ENUM TYPES
-- =========================

CREATE TYPE user_role AS ENUM ('requester', 'helper', 'admin');
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'offline');
CREATE TYPE request_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE request_status AS ENUM ('new', 'assigned', 'in_progress', 'resolved', 'closed');
CREATE TYPE assignment_status AS ENUM ('assigned', 'accepted', 'rejected', 'completed');

-- =========================
-- TEAMS
-- =========================

CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USERS
-- =========================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT REFERENCES teams(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SKILLS
-- =========================

CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_skills (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    level INT CHECK(level BETWEEN 1 AND 5),
    PRIMARY KEY(user_id, skill_id)
);

-- =========================
-- AVAILABILITY
-- =========================

CREATE TABLE availability (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    status availability_status DEFAULT 'offline'
);

-- =========================
-- REQUESTS
-- =========================

CREATE TABLE requests (
    id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority request_priority DEFAULT 'medium',
    status request_status DEFAULT 'new',
    required_skill_id BIGINT REFERENCES skills(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ASSIGNMENTS
-- =========================

CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT UNIQUE REFERENCES requests(id) ON DELETE CASCADE,
    assignee_id BIGINT REFERENCES users(id),
    status assignment_status DEFAULT 'assigned',
    score NUMERIC(5,2),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- AUTO ASSIGN FUNCTION
-- =========================

CREATE OR REPLACE FUNCTION auto_assign_request(p_request_id BIGINT)
RETURNS TABLE(
    assignment_id BIGINT,
    request_id BIGINT,
    assignee_id BIGINT,
    score NUMERIC
)
AS $$
DECLARE
    v_skill_id BIGINT;
    v_best RECORD;
BEGIN
    -- Get required skill
    SELECT required_skill_id INTO v_skill_id
    FROM requests
    WHERE id = p_request_id;

    -- Find best helper
    SELECT 
        u.id AS helper_id,
        (us.level * 10) - COALESCE(a_count.count,0) AS total_score
    INTO v_best
    FROM users u
    JOIN availability av ON av.user_id = u.id
    JOIN user_skills us ON us.user_id = u.id
    LEFT JOIN (
        SELECT assignee_id, COUNT(*) 
        FROM assignments 
        WHERE status IN ('assigned','accepted')
        GROUP BY assignee_id
    ) a_count ON a_count.assignee_id = u.id
    WHERE u.role = 'helper'
      AND u.is_active = TRUE
      AND av.status = 'available'
      AND us.skill_id = v_skill_id
    ORDER BY total_score DESC
    LIMIT 1;

    IF v_best.helper_id IS NULL THEN
        RAISE EXCEPTION 'No available helper found';
    END IF;

    -- Insert assignment
    INSERT INTO assignments(request_id, assignee_id, score)
    VALUES (p_request_id, v_best.helper_id, v_best.total_score)
    RETURNING id INTO assignment_id;

    -- Update request status
    UPDATE requests SET status = 'assigned'
    WHERE id = p_request_id;

    request_id := p_request_id;
    assignee_id := v_best.helper_id;
    score := v_best.total_score;

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

COMMIT;
