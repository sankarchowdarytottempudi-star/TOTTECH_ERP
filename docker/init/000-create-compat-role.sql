DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_roles WHERE rolname = 'schooladmin'
    ) THEN
        CREATE ROLE schooladmin;
    END IF;
END $$;
