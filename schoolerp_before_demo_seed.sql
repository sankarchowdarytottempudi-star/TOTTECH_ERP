--
-- PostgreSQL database dump
--

\restrict UtCuDzTCn0YOUX6uk7wfFV5dTG5bzhRU0bcEsDgnOV61TJ0fcxJxkJTrMZoxKY3

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.academic_years (
    id integer NOT NULL,
    school_id integer,
    academic_year character varying(50),
    start_date date,
    end_date date,
    is_current boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.academic_years OWNER TO schooladmin;

--
-- Name: academic_years_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.academic_years_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_years_id_seq OWNER TO schooladmin;

--
-- Name: academic_years_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.academic_years_id_seq OWNED BY public.academic_years.id;


--
-- Name: admission_leads; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.admission_leads (
    id integer NOT NULL,
    school_id integer,
    parent_name character varying(255),
    student_name character varying(255),
    phone character varying(20),
    email character varying(255),
    interested_class character varying(50),
    status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admission_leads OWNER TO schooladmin;

--
-- Name: admission_leads_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.admission_leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admission_leads_id_seq OWNER TO schooladmin;

--
-- Name: admission_leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.admission_leads_id_seq OWNED BY public.admission_leads.id;


--
-- Name: ai_settings; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.ai_settings (
    id integer NOT NULL,
    enable_ai boolean DEFAULT true,
    enable_parent_advice boolean DEFAULT true,
    enable_teacher_advice boolean DEFAULT true,
    passing_percentage integer DEFAULT 35
);


ALTER TABLE public.ai_settings OWNER TO schooladmin;

--
-- Name: ai_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.ai_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_settings_id_seq OWNER TO schooladmin;

--
-- Name: ai_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.ai_settings_id_seq OWNED BY public.ai_settings.id;


--
-- Name: ai_student_analysis; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.ai_student_analysis (
    id integer NOT NULL,
    school_id integer,
    student_id integer,
    subject_id integer,
    weakness_area text,
    improvement_suggestion text,
    predicted_score numeric(5,2),
    risk_level character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ai_student_analysis OWNER TO schooladmin;

--
-- Name: ai_student_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.ai_student_analysis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_student_analysis_id_seq OWNER TO schooladmin;

--
-- Name: ai_student_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.ai_student_analysis_id_seq OWNED BY public.ai_student_analysis.id;


--
-- Name: attendance; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    school_id integer,
    student_id integer,
    attendance_date date NOT NULL,
    status character varying(20),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance OWNER TO schooladmin;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO schooladmin;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: attendance_master; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.attendance_master (
    id integer NOT NULL,
    school_id integer,
    class_id integer,
    section_id integer,
    student_id integer,
    attendance_date date,
    status character varying(20),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance_master OWNER TO schooladmin;

--
-- Name: attendance_master_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.attendance_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_master_id_seq OWNER TO schooladmin;

--
-- Name: attendance_master_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.attendance_master_id_seq OWNED BY public.attendance_master.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    school_id integer,
    user_id integer,
    action_type character varying(100),
    action_details text,
    ip_address character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO schooladmin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO schooladmin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: classes; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    school_id integer,
    class_name character varying(100) NOT NULL,
    class_teacher_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.classes OWNER TO schooladmin;

--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classes_id_seq OWNER TO schooladmin;

--
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- Name: communication_logs; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.communication_logs (
    id integer NOT NULL,
    student_id integer,
    message_type character varying(50),
    recipient character varying(255),
    message text,
    status character varying(50),
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.communication_logs OWNER TO schooladmin;

--
-- Name: communication_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.communication_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.communication_logs_id_seq OWNER TO schooladmin;

--
-- Name: communication_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.communication_logs_id_seq OWNED BY public.communication_logs.id;


--
-- Name: exam_schedule; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.exam_schedule (
    id integer NOT NULL,
    exam_type_id integer,
    question_paper_id integer,
    class_id integer,
    section_id integer,
    subject_id integer,
    exam_date date,
    start_time time without time zone,
    end_time time without time zone,
    room_no character varying(50),
    invigilator_teacher_id integer,
    status character varying(50) DEFAULT 'SCHEDULED'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exam_schedule OWNER TO schooladmin;

--
-- Name: exam_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.exam_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_schedule_id_seq OWNER TO schooladmin;

--
-- Name: exam_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.exam_schedule_id_seq OWNED BY public.exam_schedule.id;


--
-- Name: exam_types; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.exam_types (
    id integer NOT NULL,
    exam_name character varying(100),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exam_types OWNER TO schooladmin;

--
-- Name: exam_types_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.exam_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_types_id_seq OWNER TO schooladmin;

--
-- Name: exam_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.exam_types_id_seq OWNED BY public.exam_types.id;


--
-- Name: exams; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.exams (
    id integer NOT NULL,
    school_id integer,
    exam_name character varying(255),
    exam_type character varying(100),
    start_date date,
    end_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exams OWNER TO schooladmin;

--
-- Name: exams_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.exams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exams_id_seq OWNER TO schooladmin;

--
-- Name: exams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.exams_id_seq OWNED BY public.exams.id;


--
-- Name: fee_categories; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.fee_categories (
    id integer NOT NULL,
    school_id integer,
    fee_name character varying(255) NOT NULL,
    fee_code character varying(50),
    amount numeric(12,2) DEFAULT 0,
    frequency character varying(50),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fee_categories OWNER TO schooladmin;

--
-- Name: fee_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.fee_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fee_categories_id_seq OWNER TO schooladmin;

--
-- Name: fee_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.fee_categories_id_seq OWNED BY public.fee_categories.id;


--
-- Name: fee_payments; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.fee_payments (
    id integer NOT NULL,
    school_id integer,
    student_id integer,
    fee_id integer,
    paid_amount numeric(12,2),
    payment_date date,
    payment_mode character varying(50),
    transaction_id character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fee_payments OWNER TO schooladmin;

--
-- Name: fee_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.fee_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fee_payments_id_seq OWNER TO schooladmin;

--
-- Name: fee_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.fee_payments_id_seq OWNED BY public.fee_payments.id;


--
-- Name: fees; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.fees (
    id integer NOT NULL,
    school_id integer,
    class_id integer,
    fee_type character varying(100),
    amount numeric(12,2),
    due_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fees OWNER TO schooladmin;

--
-- Name: fees_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fees_id_seq OWNER TO schooladmin;

--
-- Name: fees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.fees_id_seq OWNED BY public.fees.id;


--
-- Name: hostel_allocations; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.hostel_allocations (
    id integer NOT NULL,
    school_id integer,
    student_id integer,
    hostel_id integer,
    room_id integer,
    bed_number character varying(20),
    allocation_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hostel_allocations OWNER TO schooladmin;

--
-- Name: hostel_allocations_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.hostel_allocations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostel_allocations_id_seq OWNER TO schooladmin;

--
-- Name: hostel_allocations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.hostel_allocations_id_seq OWNED BY public.hostel_allocations.id;


--
-- Name: hostel_rooms; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.hostel_rooms (
    id integer NOT NULL,
    school_id integer,
    room_number character varying(50),
    hostel_name character varying(255),
    capacity integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hostel_rooms OWNER TO schooladmin;

--
-- Name: hostel_rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.hostel_rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostel_rooms_id_seq OWNER TO schooladmin;

--
-- Name: hostel_rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.hostel_rooms_id_seq OWNED BY public.hostel_rooms.id;


--
-- Name: hostel_students; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.hostel_students (
    id integer NOT NULL,
    student_id integer,
    room_number character varying(50),
    bed_number character varying(50),
    joining_date date,
    status character varying(50) DEFAULT 'ACTIVE'::character varying
);


ALTER TABLE public.hostel_students OWNER TO schooladmin;

--
-- Name: hostel_students_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.hostel_students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostel_students_id_seq OWNER TO schooladmin;

--
-- Name: hostel_students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.hostel_students_id_seq OWNED BY public.hostel_students.id;


--
-- Name: hostel_wardens; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.hostel_wardens (
    id integer NOT NULL,
    name character varying(255),
    phone character varying(50),
    email character varying(255)
);


ALTER TABLE public.hostel_wardens OWNER TO schooladmin;

--
-- Name: hostel_wardens_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.hostel_wardens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostel_wardens_id_seq OWNER TO schooladmin;

--
-- Name: hostel_wardens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.hostel_wardens_id_seq OWNED BY public.hostel_wardens.id;


--
-- Name: hostels; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.hostels (
    id integer NOT NULL,
    school_id integer,
    hostel_name character varying(255),
    hostel_type character varying(50),
    warden_name character varying(255),
    warden_phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hostels OWNER TO schooladmin;

--
-- Name: hostels_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.hostels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostels_id_seq OWNER TO schooladmin;

--
-- Name: hostels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.hostels_id_seq OWNED BY public.hostels.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    invoice_number character varying(100),
    student_id integer,
    invoice_date date,
    due_date date,
    total_amount numeric(12,2),
    paid_amount numeric(12,2) DEFAULT 0,
    balance_amount numeric(12,2),
    status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoices OWNER TO schooladmin;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO schooladmin;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: lead_followups; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.lead_followups (
    id integer NOT NULL,
    lead_id integer,
    followup_date date,
    remarks text,
    status character varying(50)
);


ALTER TABLE public.lead_followups OWNER TO schooladmin;

--
-- Name: lead_followups_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.lead_followups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lead_followups_id_seq OWNER TO schooladmin;

--
-- Name: lead_followups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.lead_followups_id_seq OWNED BY public.lead_followups.id;


--
-- Name: marks; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.marks (
    id integer NOT NULL,
    school_id integer,
    student_id integer,
    subject_id integer,
    exam_id integer,
    total_marks numeric(5,2),
    obtained_marks numeric(5,2),
    grade character varying(10),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.marks OWNER TO schooladmin;

--
-- Name: marks_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marks_id_seq OWNER TO schooladmin;

--
-- Name: marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.marks_id_seq OWNED BY public.marks.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    school_id integer,
    student_id integer,
    notification_type character varying(100),
    message text,
    sent_status boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO schooladmin;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO schooladmin;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: payment_receipts; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.payment_receipts (
    id integer NOT NULL,
    receipt_number character varying(100),
    payment_id integer,
    receipt_date date,
    amount numeric(12,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payment_receipts OWNER TO schooladmin;

--
-- Name: payment_receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.payment_receipts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_receipts_id_seq OWNER TO schooladmin;

--
-- Name: payment_receipts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.payment_receipts_id_seq OWNED BY public.payment_receipts.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    invoice_id integer,
    student_id integer,
    payment_date date,
    payment_method character varying(50),
    amount numeric(12,2),
    reference_number character varying(255),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO schooladmin;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO schooladmin;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    module_name character varying(100),
    action_name character varying(100)
);


ALTER TABLE public.permissions OWNER TO schooladmin;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO schooladmin;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: question_bank; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.question_bank (
    id integer NOT NULL,
    subject_id integer,
    chapter_name character varying(255),
    topic_name character varying(255),
    learning_outcome character varying(255),
    difficulty_level character varying(50),
    bloom_level character varying(100),
    question_type character varying(50),
    question_text text,
    max_marks integer,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.question_bank OWNER TO schooladmin;

--
-- Name: question_bank_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.question_bank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.question_bank_id_seq OWNER TO schooladmin;

--
-- Name: question_bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.question_bank_id_seq OWNED BY public.question_bank.id;


--
-- Name: question_paper_questions; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.question_paper_questions (
    id integer NOT NULL,
    question_paper_id integer,
    question_id integer,
    display_order integer,
    section_name character varying(100),
    question_marks integer,
    is_optional boolean DEFAULT false
);


ALTER TABLE public.question_paper_questions OWNER TO schooladmin;

--
-- Name: question_paper_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.question_paper_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.question_paper_questions_id_seq OWNER TO schooladmin;

--
-- Name: question_paper_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.question_paper_questions_id_seq OWNED BY public.question_paper_questions.id;


--
-- Name: question_papers; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.question_papers (
    id integer NOT NULL,
    exam_type_id integer,
    class_id integer,
    section_id integer,
    subject_id integer,
    paper_name character varying(255),
    total_marks integer,
    exam_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.question_papers OWNER TO schooladmin;

--
-- Name: question_papers_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.question_papers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.question_papers_id_seq OWNER TO schooladmin;

--
-- Name: question_papers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.question_papers_id_seq OWNED BY public.question_papers.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    role_id integer,
    permission_id integer
);


ALTER TABLE public.role_permissions OWNER TO schooladmin;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_permissions_id_seq OWNER TO schooladmin;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(100),
    description text
);


ALTER TABLE public.roles OWNER TO schooladmin;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO schooladmin;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: school_profile; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.school_profile (
    id integer NOT NULL,
    school_name character varying(255),
    school_code character varying(100),
    principal_name character varying(255),
    email character varying(255),
    phone character varying(50),
    website character varying(255),
    address text,
    city character varying(100),
    state character varying(100),
    country character varying(100),
    academic_year character varying(50),
    logo_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.school_profile OWNER TO schooladmin;

--
-- Name: school_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.school_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_profile_id_seq OWNER TO schooladmin;

--
-- Name: school_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.school_profile_id_seq OWNED BY public.school_profile.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.schools (
    id integer NOT NULL,
    school_name character varying(255) NOT NULL,
    school_code character varying(50) NOT NULL,
    email character varying(255),
    phone character varying(20),
    address text,
    principal_name character varying(255),
    subscription_plan character varying(50) DEFAULT 'BASIC'::character varying,
    max_students integer DEFAULT 500,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.schools OWNER TO schooladmin;

--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schools_id_seq OWNER TO schooladmin;

--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: sections; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    school_id integer,
    class_id integer,
    section_name character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sections OWNER TO schooladmin;

--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sections_id_seq OWNER TO schooladmin;

--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: smtp_settings; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.smtp_settings (
    id integer NOT NULL,
    host character varying(255),
    port integer,
    username character varying(255),
    password character varying(255),
    sender_email character varying(255),
    sender_name character varying(255)
);


ALTER TABLE public.smtp_settings OWNER TO schooladmin;

--
-- Name: smtp_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.smtp_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.smtp_settings_id_seq OWNER TO schooladmin;

--
-- Name: smtp_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.smtp_settings_id_seq OWNED BY public.smtp_settings.id;


--
-- Name: student_exam_analysis; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.student_exam_analysis (
    id integer NOT NULL,
    student_id integer,
    question_paper_id integer,
    strengths text,
    weaknesses text,
    ai_recommendations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_exam_analysis OWNER TO schooladmin;

--
-- Name: student_exam_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.student_exam_analysis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_exam_analysis_id_seq OWNER TO schooladmin;

--
-- Name: student_exam_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.student_exam_analysis_id_seq OWNED BY public.student_exam_analysis.id;


--
-- Name: student_exam_answers; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.student_exam_answers (
    id integer NOT NULL,
    student_id integer,
    question_paper_id integer,
    question_id integer,
    obtained_marks numeric(5,2),
    evaluator_comments text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_exam_answers OWNER TO schooladmin;

--
-- Name: student_exam_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.student_exam_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_exam_answers_id_seq OWNER TO schooladmin;

--
-- Name: student_exam_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.student_exam_answers_id_seq OWNED BY public.student_exam_answers.id;


--
-- Name: student_fee_assignments; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.student_fee_assignments (
    id integer NOT NULL,
    student_id integer,
    fee_category_id integer,
    assigned_amount numeric(12,2),
    discount_amount numeric(12,2) DEFAULT 0,
    academic_year character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_fee_assignments OWNER TO schooladmin;

--
-- Name: student_fee_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.student_fee_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_fee_assignments_id_seq OWNER TO schooladmin;

--
-- Name: student_fee_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.student_fee_assignments_id_seq OWNED BY public.student_fee_assignments.id;


--
-- Name: student_marks_entry; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.student_marks_entry (
    id integer NOT NULL,
    student_id integer,
    exam_schedule_id integer,
    question_paper_id integer,
    question_id integer,
    obtained_marks numeric(5,2),
    max_marks numeric(5,2),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_marks_entry OWNER TO schooladmin;

--
-- Name: student_marks_entry_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.student_marks_entry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_marks_entry_id_seq OWNER TO schooladmin;

--
-- Name: student_marks_entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.student_marks_entry_id_seq OWNED BY public.student_marks_entry.id;


--
-- Name: student_promotions; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.student_promotions (
    id integer NOT NULL,
    school_id integer,
    student_id integer,
    from_class_id integer,
    to_class_id integer,
    academic_year character varying(50),
    promoted_by character varying(255),
    promoted_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_promotions OWNER TO schooladmin;

--
-- Name: student_promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.student_promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_promotions_id_seq OWNER TO schooladmin;

--
-- Name: student_promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.student_promotions_id_seq OWNED BY public.student_promotions.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.students (
    id integer NOT NULL,
    enrollment_number character varying(100),
    admission_number character varying(100),
    name character varying(255),
    first_name character varying(100),
    middle_name character varying(100),
    last_name character varying(100),
    gender character varying(20),
    dob date,
    phone character varying(20),
    email character varying(255),
    address text,
    admission_date date,
    religion character varying(100),
    caste character varying(100),
    blood_group character varying(20),
    father_name character varying(255),
    mother_name character varying(255),
    father_phone character varying(20),
    mother_phone character varying(20),
    father_occupation character varying(255),
    mother_occupation character varying(255),
    roll_number character varying(100),
    section_id integer,
    session_id integer,
    is_active boolean DEFAULT true,
    city character varying(100),
    state character varying(100),
    country character varying(100),
    medium character varying(100),
    house character varying(100),
    category character varying(100),
    birth_place character varying(255),
    mother_tongue character varying(100),
    school_name character varying(255),
    school_address text,
    school_class character varying(100),
    pass_out_year character varying(20),
    pan character varying(100),
    student_type character varying(50),
    note text,
    survey character varying(255),
    pen character varying(255),
    apaar character varying(255),
    father_id_number character varying(255),
    mother_id_number character varying(255),
    is_suspended boolean DEFAULT false,
    suspend_start_date date,
    suspend_end_date date,
    suspend_message text,
    uid character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    school_id integer,
    academic_year character varying(50),
    transport_required boolean DEFAULT false,
    transport_route_id integer,
    hostel_required boolean DEFAULT false,
    hostel_room_id integer,
    photo_url text,
    student_username character varying(255),
    parent_username character varying(255),
    guardian_username character varying(255)
);


ALTER TABLE public.students OWNER TO schooladmin;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO schooladmin;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    school_id integer,
    subject_name character varying(255),
    subject_code character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subjects OWNER TO schooladmin;

--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subjects_id_seq OWNER TO schooladmin;

--
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- Name: teacher_attendance; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.teacher_attendance (
    id integer NOT NULL,
    teacher_id integer,
    attendance_date date,
    status character varying(20),
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.teacher_attendance OWNER TO schooladmin;

--
-- Name: teacher_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.teacher_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teacher_attendance_id_seq OWNER TO schooladmin;

--
-- Name: teacher_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.teacher_attendance_id_seq OWNED BY public.teacher_attendance.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.teachers (
    id integer NOT NULL,
    school_id integer,
    user_id integer,
    employee_id character varying(100),
    qualification character varying(255),
    experience_years integer,
    joining_date date,
    salary numeric(12,2),
    department character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    first_name character varying(100),
    last_name character varying(100),
    gender character varying(20),
    phone character varying(20),
    email character varying(255),
    designation character varying(100),
    address text,
    is_active boolean DEFAULT true,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.teachers OWNER TO schooladmin;

--
-- Name: teachers_backup; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.teachers_backup (
    id integer,
    school_id integer,
    employee_id character varying(50),
    first_name character varying(100),
    last_name character varying(100),
    gender character varying(20),
    phone character varying(20),
    email character varying(255),
    qualification character varying(255),
    experience_years integer,
    joining_date date,
    department character varying(100),
    designation character varying(100),
    salary numeric(12,2),
    address text,
    is_active boolean,
    created_at timestamp without time zone
);


ALTER TABLE public.teachers_backup OWNER TO schooladmin;

--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_id_seq OWNER TO schooladmin;

--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: transport_assignments; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.transport_assignments (
    id integer NOT NULL,
    student_id integer,
    route_id integer,
    pickup_point character varying(255),
    drop_point character varying(255)
);


ALTER TABLE public.transport_assignments OWNER TO schooladmin;

--
-- Name: transport_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.transport_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transport_assignments_id_seq OWNER TO schooladmin;

--
-- Name: transport_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.transport_assignments_id_seq OWNED BY public.transport_assignments.id;


--
-- Name: transport_routes; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.transport_routes (
    id integer NOT NULL,
    school_id integer,
    route_name character varying(255),
    vehicle_number character varying(100),
    driver_name character varying(255),
    driver_phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transport_routes OWNER TO schooladmin;

--
-- Name: transport_routes_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.transport_routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transport_routes_id_seq OWNER TO schooladmin;

--
-- Name: transport_routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.transport_routes_id_seq OWNED BY public.transport_routes.id;


--
-- Name: transport_stops; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.transport_stops (
    id integer NOT NULL,
    school_id integer,
    stop_name character varying(255),
    stop_time character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transport_stops OWNER TO schooladmin;

--
-- Name: transport_stops_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.transport_stops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transport_stops_id_seq OWNER TO schooladmin;

--
-- Name: transport_stops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.transport_stops_id_seq OWNED BY public.transport_stops.id;


--
-- Name: transport_vehicles; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.transport_vehicles (
    id integer NOT NULL,
    school_id integer,
    vehicle_number character varying(100),
    vehicle_type character varying(100),
    capacity integer,
    driver_name character varying(255),
    driver_phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transport_vehicles OWNER TO schooladmin;

--
-- Name: transport_vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.transport_vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transport_vehicles_id_seq OWNER TO schooladmin;

--
-- Name: transport_vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.transport_vehicles_id_seq OWNED BY public.transport_vehicles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: schooladmin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    school_id integer,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    password_hash text NOT NULL,
    role character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO schooladmin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: schooladmin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO schooladmin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schooladmin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: academic_years id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.academic_years ALTER COLUMN id SET DEFAULT nextval('public.academic_years_id_seq'::regclass);


--
-- Name: admission_leads id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.admission_leads ALTER COLUMN id SET DEFAULT nextval('public.admission_leads_id_seq'::regclass);


--
-- Name: ai_settings id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.ai_settings ALTER COLUMN id SET DEFAULT nextval('public.ai_settings_id_seq'::regclass);


--
-- Name: ai_student_analysis id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.ai_student_analysis ALTER COLUMN id SET DEFAULT nextval('public.ai_student_analysis_id_seq'::regclass);


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: attendance_master id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.attendance_master ALTER COLUMN id SET DEFAULT nextval('public.attendance_master_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- Name: communication_logs id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.communication_logs ALTER COLUMN id SET DEFAULT nextval('public.communication_logs_id_seq'::regclass);


--
-- Name: exam_schedule id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.exam_schedule ALTER COLUMN id SET DEFAULT nextval('public.exam_schedule_id_seq'::regclass);


--
-- Name: exam_types id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.exam_types ALTER COLUMN id SET DEFAULT nextval('public.exam_types_id_seq'::regclass);


--
-- Name: exams id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.exams ALTER COLUMN id SET DEFAULT nextval('public.exams_id_seq'::regclass);


--
-- Name: fee_categories id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fee_categories ALTER COLUMN id SET DEFAULT nextval('public.fee_categories_id_seq'::regclass);


--
-- Name: fee_payments id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fee_payments ALTER COLUMN id SET DEFAULT nextval('public.fee_payments_id_seq'::regclass);


--
-- Name: fees id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fees ALTER COLUMN id SET DEFAULT nextval('public.fees_id_seq'::regclass);


--
-- Name: hostel_allocations id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_allocations ALTER COLUMN id SET DEFAULT nextval('public.hostel_allocations_id_seq'::regclass);


--
-- Name: hostel_rooms id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_rooms ALTER COLUMN id SET DEFAULT nextval('public.hostel_rooms_id_seq'::regclass);


--
-- Name: hostel_students id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_students ALTER COLUMN id SET DEFAULT nextval('public.hostel_students_id_seq'::regclass);


--
-- Name: hostel_wardens id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_wardens ALTER COLUMN id SET DEFAULT nextval('public.hostel_wardens_id_seq'::regclass);


--
-- Name: hostels id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostels ALTER COLUMN id SET DEFAULT nextval('public.hostels_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: lead_followups id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.lead_followups ALTER COLUMN id SET DEFAULT nextval('public.lead_followups_id_seq'::regclass);


--
-- Name: marks id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.marks ALTER COLUMN id SET DEFAULT nextval('public.marks_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: payment_receipts id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.payment_receipts ALTER COLUMN id SET DEFAULT nextval('public.payment_receipts_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: question_bank id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.question_bank ALTER COLUMN id SET DEFAULT nextval('public.question_bank_id_seq'::regclass);


--
-- Name: question_paper_questions id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.question_paper_questions ALTER COLUMN id SET DEFAULT nextval('public.question_paper_questions_id_seq'::regclass);


--
-- Name: question_papers id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.question_papers ALTER COLUMN id SET DEFAULT nextval('public.question_papers_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: school_profile id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.school_profile ALTER COLUMN id SET DEFAULT nextval('public.school_profile_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Name: smtp_settings id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.smtp_settings ALTER COLUMN id SET DEFAULT nextval('public.smtp_settings_id_seq'::regclass);


--
-- Name: student_exam_analysis id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_exam_analysis ALTER COLUMN id SET DEFAULT nextval('public.student_exam_analysis_id_seq'::regclass);


--
-- Name: student_exam_answers id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_exam_answers ALTER COLUMN id SET DEFAULT nextval('public.student_exam_answers_id_seq'::regclass);


--
-- Name: student_fee_assignments id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_fee_assignments ALTER COLUMN id SET DEFAULT nextval('public.student_fee_assignments_id_seq'::regclass);


--
-- Name: student_marks_entry id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_marks_entry ALTER COLUMN id SET DEFAULT nextval('public.student_marks_entry_id_seq'::regclass);


--
-- Name: student_promotions id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_promotions ALTER COLUMN id SET DEFAULT nextval('public.student_promotions_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- Name: teacher_attendance id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.teacher_attendance ALTER COLUMN id SET DEFAULT nextval('public.teacher_attendance_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Name: transport_assignments id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_assignments ALTER COLUMN id SET DEFAULT nextval('public.transport_assignments_id_seq'::regclass);


--
-- Name: transport_routes id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_routes ALTER COLUMN id SET DEFAULT nextval('public.transport_routes_id_seq'::regclass);


--
-- Name: transport_stops id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_stops ALTER COLUMN id SET DEFAULT nextval('public.transport_stops_id_seq'::regclass);


--
-- Name: transport_vehicles id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_vehicles ALTER COLUMN id SET DEFAULT nextval('public.transport_vehicles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.academic_years (id, school_id, academic_year, start_date, end_date, is_current, created_at) FROM stdin;
1	1	2025-2026	2025-06-01	2026-04-30	t	2026-05-29 20:37:31.428537
2	1	2025-2026	2025-06-01	2026-04-30	t	2026-05-29 20:46:14.087998
\.


--
-- Data for Name: admission_leads; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.admission_leads (id, school_id, parent_name, student_name, phone, email, interested_class, status, created_at) FROM stdin;
1	1	Rajesh	Arjun	9876543210	\N	\N	NEW	2026-05-30 11:04:11.241193
\.


--
-- Data for Name: ai_settings; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.ai_settings (id, enable_ai, enable_parent_advice, enable_teacher_advice, passing_percentage) FROM stdin;
\.


--
-- Data for Name: ai_student_analysis; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.ai_student_analysis (id, school_id, student_id, subject_id, weakness_area, improvement_suggestion, predicted_score, risk_level, created_at) FROM stdin;
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.attendance (id, school_id, student_id, attendance_date, status, remarks, created_at) FROM stdin;
\.


--
-- Data for Name: attendance_master; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.attendance_master (id, school_id, class_id, section_id, student_id, attendance_date, status, remarks, created_at) FROM stdin;
1	1	1	1	1	2026-05-29	Half Day		2026-05-29 02:43:43.509
2	1	1	1	3	2026-05-29	Present		2026-05-29 17:19:27.445
3	1	1	1	994	2026-05-29	Present		2026-05-29 23:22:59.777
4	1	1	1	987	2026-05-30	Present		2026-05-30 00:36:14.031
5	1	1	1	987	2026-05-30	Present		2026-05-30 01:20:37.105
6	1	1	1	2	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
7	1	1	1	3	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
8	1	1	1	4	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
9	1	1	1	5	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
10	1	1	1	6	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
11	1	1	1	7	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
12	1	1	1	8	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
13	1	1	1	9	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
14	1	1	1	10	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
15	1	1	1	11	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
16	1	1	1	12	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
17	1	1	1	13	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
18	1	1	1	14	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
19	1	1	1	15	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
20	1	1	1	16	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
21	1	1	1	17	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
22	1	1	1	18	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
23	1	1	1	19	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
24	1	1	1	20	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
25	1	1	1	21	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
26	1	1	1	22	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
27	1	1	1	23	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
28	1	1	1	24	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
29	1	1	1	25	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
30	1	1	1	26	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
31	1	1	1	27	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
32	1	1	1	28	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
33	1	1	1	29	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
34	1	1	1	30	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
35	1	1	1	31	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
36	1	1	1	32	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
37	1	1	1	33	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
38	1	1	1	34	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
39	1	1	1	35	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
40	1	1	1	36	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
41	1	1	1	37	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
42	1	1	1	38	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
43	1	1	1	39	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
44	1	1	1	40	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
45	1	1	1	41	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
46	1	1	1	42	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
47	1	1	1	43	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
48	1	1	1	44	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
49	1	1	1	45	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
50	1	1	1	46	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
51	1	1	1	47	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
52	1	1	1	48	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
53	1	1	1	49	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
54	1	1	1	50	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
55	1	1	1	51	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
56	1	1	1	52	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
57	1	1	1	53	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
58	1	1	1	54	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
59	1	1	1	55	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
60	1	1	1	56	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
61	1	1	1	57	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
62	1	1	1	58	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
63	1	1	1	59	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
64	1	1	1	60	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
65	1	1	1	61	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
66	1	1	1	62	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
67	1	1	1	63	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
68	1	1	1	64	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
69	1	1	1	65	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
70	1	1	1	66	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
71	1	1	1	67	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
72	1	1	1	68	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
73	1	1	1	69	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
74	1	1	1	70	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
75	1	1	1	71	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
76	1	1	1	72	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
77	1	1	1	73	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
78	1	1	1	74	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
79	1	1	1	75	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
80	1	1	1	76	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
81	1	1	1	77	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
82	1	1	1	78	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
83	1	1	1	79	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
84	1	1	1	80	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
85	1	1	1	81	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
86	1	1	1	82	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
87	1	1	1	83	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
88	1	1	1	84	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
89	1	1	1	85	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
90	1	1	1	86	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
91	1	1	1	87	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
92	1	1	1	88	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
93	1	1	1	89	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
94	1	1	1	90	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
95	1	1	1	91	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
96	1	1	1	92	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
97	1	1	1	93	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
98	1	1	1	94	2026-05-30	ABSENT		2026-05-30 05:29:48.056376
99	1	1	1	95	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
100	1	1	1	96	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
101	1	1	1	97	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
102	1	1	1	98	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
103	1	1	1	99	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
104	1	1	1	100	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
105	1	1	1	101	2026-05-30	PRESENT		2026-05-30 05:29:48.056376
106	1	1	1	2	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
107	1	1	1	3	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
108	1	1	1	4	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
109	1	1	1	5	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
110	1	1	1	6	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
111	1	1	1	7	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
112	1	1	1	8	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
113	1	1	1	9	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
114	1	1	1	10	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
115	1	1	1	11	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
116	1	1	1	12	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
117	1	1	1	13	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
118	1	1	1	14	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
119	1	1	1	15	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
120	1	1	1	16	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
121	1	1	1	17	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
122	1	1	1	18	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
123	1	1	1	19	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
124	1	1	1	20	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
125	1	1	1	21	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
126	1	1	1	22	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
127	1	1	1	23	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
128	1	1	1	24	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
129	1	1	1	25	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
130	1	1	1	26	2026-05-30	ABSENT		2026-05-30 06:14:45.326777
131	1	1	1	27	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
132	1	1	1	28	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
133	1	1	1	29	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
134	1	1	1	30	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
135	1	1	1	31	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
136	1	1	1	32	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
137	1	1	1	33	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
138	1	1	1	34	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
139	1	1	1	35	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
140	1	1	1	36	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
141	1	1	1	37	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
142	1	1	1	38	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
143	1	1	1	39	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
144	1	1	1	40	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
145	1	1	1	41	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
146	1	1	1	42	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
147	1	1	1	43	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
148	1	1	1	44	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
149	1	1	1	45	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
150	1	1	1	46	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
151	1	1	1	47	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
152	1	1	1	48	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
153	1	1	1	49	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
154	1	1	1	50	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
155	1	1	1	51	2026-05-30	ABSENT		2026-05-30 06:14:45.326777
156	1	1	1	52	2026-05-30	ABSENT		2026-05-30 06:14:45.326777
157	1	1	1	53	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
158	1	1	1	54	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
159	1	1	1	55	2026-05-30	ABSENT		2026-05-30 06:14:45.326777
160	1	1	1	56	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
161	1	1	1	57	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
162	1	1	1	58	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
163	1	1	1	59	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
164	1	1	1	60	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
165	1	1	1	61	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
166	1	1	1	62	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
167	1	1	1	63	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
168	1	1	1	64	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
169	1	1	1	65	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
170	1	1	1	66	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
171	1	1	1	67	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
172	1	1	1	68	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
173	1	1	1	69	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
174	1	1	1	70	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
175	1	1	1	71	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
176	1	1	1	72	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
177	1	1	1	73	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
178	1	1	1	74	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
179	1	1	1	75	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
180	1	1	1	76	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
181	1	1	1	77	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
182	1	1	1	78	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
183	1	1	1	79	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
184	1	1	1	80	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
185	1	1	1	81	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
186	1	1	1	82	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
187	1	1	1	83	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
188	1	1	1	84	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
189	1	1	1	85	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
190	1	1	1	86	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
191	1	1	1	87	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
192	1	1	1	88	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
193	1	1	1	89	2026-05-30	ABSENT		2026-05-30 06:14:45.326777
194	1	1	1	90	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
195	1	1	1	91	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
196	1	1	1	92	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
197	1	1	1	93	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
198	1	1	1	94	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
199	1	1	1	95	2026-05-30	ABSENT		2026-05-30 06:14:45.326777
200	1	1	1	96	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
201	1	1	1	97	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
202	1	1	1	98	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
203	1	1	1	99	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
204	1	1	1	100	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
205	1	1	1	101	2026-05-30	PRESENT		2026-05-30 06:14:45.326777
206	1	1	1	1000	2026-05-30	Present		2026-05-30 12:22:55.124
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.audit_logs (id, school_id, user_id, action_type, action_details, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.classes (id, school_id, class_name, class_teacher_id, created_at) FROM stdin;
1	1	1	\N	2026-05-28 23:55:44.14
2	1	1	\N	2026-05-29 20:28:30.388164
3	1	2	\N	2026-05-29 20:28:30.388164
4	1	3	\N	2026-05-29 20:28:30.388164
5	1	4	\N	2026-05-29 20:28:30.388164
6	1	5	\N	2026-05-29 20:28:30.388164
7	1	6	\N	2026-05-29 20:28:30.388164
8	1	7	\N	2026-05-29 20:28:30.388164
9	1	8	\N	2026-05-29 20:28:30.388164
10	1	9	\N	2026-05-29 20:28:30.388164
11	1	10	\N	2026-05-29 20:28:30.388164
12	1	2	\N	2026-05-29 20:29:42.708169
13	1	3	\N	2026-05-29 20:29:42.708169
14	1	4	\N	2026-05-29 20:29:42.708169
15	1	5	\N	2026-05-29 20:29:42.708169
16	1	6	\N	2026-05-29 20:29:42.708169
17	1	7	\N	2026-05-29 20:29:42.708169
18	1	8	\N	2026-05-29 20:29:42.708169
19	1	9	\N	2026-05-29 20:29:42.708169
20	1	10	\N	2026-05-29 20:29:42.708169
\.


--
-- Data for Name: communication_logs; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.communication_logs (id, student_id, message_type, recipient, message, status, sent_at) FROM stdin;
\.


--
-- Data for Name: exam_schedule; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.exam_schedule (id, exam_type_id, question_paper_id, class_id, section_id, subject_id, exam_date, start_time, end_time, room_no, invigilator_teacher_id, status, created_at) FROM stdin;
1	4	1	1	1	1	2026-06-01	09:00:00	12:00:00	101	\N	SCHEDULED	2026-05-29 05:15:48.80616
\.


--
-- Data for Name: exam_types; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.exam_types (id, exam_name, description, is_active, created_at) FROM stdin;
1	Unit Test	\N	t	2026-05-29 03:53:33.235119
2	Weekly Test	\N	t	2026-05-29 03:53:33.235119
3	Monthly Test	\N	t	2026-05-29 03:53:33.235119
4	Quarterly Exam	\N	t	2026-05-29 03:53:33.235119
5	Half Yearly	\N	t	2026-05-29 03:53:33.235119
6	Annual Exam	\N	t	2026-05-29 03:53:33.235119
7	Board Exam	\N	t	2026-05-29 03:53:33.235119
\.


--
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.exams (id, school_id, exam_name, exam_type, start_date, end_date, created_at) FROM stdin;
1	1	Unit Test 1	UNIT_TEST	2026-05-30	2026-05-30	2026-05-30 10:39:00.850772
2	1	Unit Test 2	UNIT_TEST	2026-05-30	2026-05-30	2026-05-30 10:39:00.850772
3	1	Quarterly Exam	QUARTERLY	2026-05-30	2026-05-30	2026-05-30 10:39:00.850772
\.


--
-- Data for Name: fee_categories; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.fee_categories (id, school_id, fee_name, fee_code, amount, frequency, description, is_active, created_at) FROM stdin;
1	\N	Tuition Fee	TUITION	20000.00	YEARLY	\N	t	2026-05-29 03:28:12.549632
2	\N	Transport Fee	TRANSPORT	5000.00	YEARLY	\N	t	2026-05-29 03:28:12.549632
3	\N	Hostel Fee	HOSTEL	30000.00	YEARLY	\N	t	2026-05-29 03:28:12.549632
4	\N	Mess Fee	MESS	15000.00	YEARLY	\N	t	2026-05-29 03:28:12.549632
5	\N	Exam Fee	EXAM	1000.00	YEARLY	\N	t	2026-05-29 03:28:12.549632
6	\N	Library Fee	LIBRARY	500.00	YEARLY	\N	t	2026-05-29 03:28:12.549632
8	\N	Admission Fee	ADF	5000.00	ONE_TIME	\N	t	2026-05-29 03:32:05.551
9	1	Tuition Fee	\N	45000.00	\N	\N	t	2026-05-30 11:04:11.238974
\.


--
-- Data for Name: fee_payments; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.fee_payments (id, school_id, student_id, fee_id, paid_amount, payment_date, payment_mode, transaction_id, created_at) FROM stdin;
1	1	2	1	15000.00	2026-05-29	UPI	TXN10001	2026-05-29 19:22:26.449347
2	1	3	1	10000.00	2026-05-29	CASH	TXN10002	2026-05-29 19:22:26.449347
\.


--
-- Data for Name: fees; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.fees (id, school_id, class_id, fee_type, amount, due_date, created_at) FROM stdin;
1	1	1	Tuition Fee	20000.00	2026-06-30	2026-05-29 19:22:05.319526
2	1	1	Transport Fee	5000.00	2026-06-30	2026-05-29 19:22:05.319526
3	1	1	Exam Fee	1000.00	2026-06-30	2026-05-29 19:22:05.319526
4	1	1	Library Fee	500.00	2026-06-30	2026-05-29 19:22:05.319526
\.


--
-- Data for Name: hostel_allocations; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.hostel_allocations (id, school_id, student_id, hostel_id, room_id, bed_number, allocation_date, created_at) FROM stdin;
\.


--
-- Data for Name: hostel_rooms; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.hostel_rooms (id, school_id, room_number, hostel_name, capacity, created_at) FROM stdin;
1	1	101	Boys Hostel	4	2026-05-30 11:04:11.233001
\.


--
-- Data for Name: hostel_students; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.hostel_students (id, student_id, room_number, bed_number, joining_date, status) FROM stdin;
\.


--
-- Data for Name: hostel_wardens; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.hostel_wardens (id, name, phone, email) FROM stdin;
\.


--
-- Data for Name: hostels; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.hostels (id, school_id, hostel_name, hostel_type, warden_name, warden_phone, created_at) FROM stdin;
1	1	Boys Hostel	Boys	Prakash	\N	2026-05-30 11:04:11.230363
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.invoices (id, invoice_number, student_id, invoice_date, due_date, total_amount, paid_amount, balance_amount, status, created_at) FROM stdin;
\.


--
-- Data for Name: lead_followups; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.lead_followups (id, lead_id, followup_date, remarks, status) FROM stdin;
\.


--
-- Data for Name: marks; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.marks (id, school_id, student_id, subject_id, exam_id, total_marks, obtained_marks, grade, remarks, created_at) FROM stdin;
1	1	4	1	1	100.00	72.00	B	\N	2026-05-30 10:39:18.588239
2	1	4	1	2	100.00	80.00	A	\N	2026-05-30 10:39:18.588239
3	1	4	1	3	100.00	88.00	A	\N	2026-05-30 10:39:18.588239
4	1	4	2	1	100.00	68.00	B	\N	2026-05-30 10:39:18.588239
5	1	4	2	2	100.00	74.00	B	\N	2026-05-30 10:39:18.588239
6	1	4	2	3	100.00	82.00	A	\N	2026-05-30 10:39:18.588239
7	1	4	3	1	100.00	70.00	B	\N	2026-05-30 10:39:18.588239
8	1	4	3	2	100.00	75.00	B	\N	2026-05-30 10:39:18.588239
9	1	4	3	3	100.00	84.00	A	\N	2026-05-30 10:39:18.588239
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.notifications (id, school_id, student_id, notification_type, message, sent_status, created_at) FROM stdin;
\.


--
-- Data for Name: payment_receipts; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.payment_receipts (id, receipt_number, payment_id, receipt_date, amount, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.payments (id, invoice_id, student_id, payment_date, payment_method, amount, reference_number, remarks, created_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.permissions (id, module_name, action_name) FROM stdin;
1	DASHBOARD	VIEW
2	STUDENTS	CREATE
3	STUDENTS	READ
4	STUDENTS	UPDATE
5	STUDENTS	DELETE
6	TEACHERS	CREATE
7	TEACHERS	READ
8	TEACHERS	UPDATE
9	TEACHERS	DELETE
10	ATTENDANCE	CREATE
11	ATTENDANCE	READ
12	ATTENDANCE	UPDATE
13	FEES	CREATE
14	FEES	READ
15	FEES	UPDATE
16	FEES	DELETE
17	HOSTEL	CREATE
18	HOSTEL	READ
19	HOSTEL	UPDATE
20	HOSTEL	DELETE
21	DINING	CREATE
22	DINING	READ
23	DINING	UPDATE
24	INVENTORY	CREATE
25	INVENTORY	READ
26	INVENTORY	UPDATE
27	INVENTORY	ISSUE
28	INVENTORY	PURCHASE
29	LIBRARY	CREATE
30	LIBRARY	READ
31	LIBRARY	ISSUE
32	TRANSPORT	CREATE
33	TRANSPORT	READ
34	TRANSPORT	UPDATE
35	DASHBOARD	VIEW
36	STUDENTS	CREATE
37	STUDENTS	READ
38	STUDENTS	UPDATE
39	STUDENTS	DELETE
40	TEACHERS	CREATE
41	TEACHERS	READ
42	TEACHERS	UPDATE
43	TEACHERS	DELETE
44	ATTENDANCE	CREATE
45	ATTENDANCE	READ
46	ATTENDANCE	UPDATE
47	FEES	CREATE
48	FEES	READ
49	FEES	UPDATE
50	FEES	DELETE
51	HOSTEL	CREATE
52	HOSTEL	READ
53	HOSTEL	UPDATE
54	HOSTEL	DELETE
55	DINING	CREATE
56	DINING	READ
57	DINING	UPDATE
58	INVENTORY	CREATE
59	INVENTORY	READ
60	INVENTORY	UPDATE
61	INVENTORY	ISSUE
62	INVENTORY	PURCHASE
63	LIBRARY	CREATE
64	LIBRARY	READ
65	LIBRARY	ISSUE
66	TRANSPORT	CREATE
67	TRANSPORT	READ
68	TRANSPORT	UPDATE
\.


--
-- Data for Name: question_bank; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.question_bank (id, subject_id, chapter_name, topic_name, learning_outcome, difficulty_level, bloom_level, question_type, question_text, max_marks, created_by, created_at) FROM stdin;
1	1	Algebra	Quadratic Equations	Equation Solving	Medium	Apply	Short Answer	Solve x²+5x+6=0	5	\N	2026-05-29 03:54:22.908838
2	1	Geometry	Triangles	Area Calculation	Easy	Understand	Short Answer	Find area of triangle	5	\N	2026-05-29 03:54:22.908838
3	1	Trigonometry	Sin Cos Tan	Problem Solving	Hard	Analyze	Long Answer	Solve trigonometric expression	10	\N	2026-05-29 03:54:22.908838
4	1	Test	test	test	Medium	Evaluate	Short Answer	TEstTEstTest	10	\N	2026-05-29 04:51:53.33
\.


--
-- Data for Name: question_paper_questions; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.question_paper_questions (id, question_paper_id, question_id, display_order, section_name, question_marks, is_optional) FROM stdin;
1	1	1	1	Section A	5	f
2	1	2	2	Section A	5	f
3	1	3	3	Section B	10	f
4	1	4	4	Section B	10	f
\.


--
-- Data for Name: question_papers; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.question_papers (id, exam_type_id, class_id, section_id, subject_id, paper_name, total_marks, exam_date, created_at) FROM stdin;
1	4	1	1	1	Quarterly Mathematics	50	2026-06-01	2026-05-29 08:43:56.263015
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.role_permissions (id, role_id, permission_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	1	6
7	1	7
8	1	8
9	1	9
10	1	10
11	1	11
12	1	12
13	1	13
14	1	14
15	1	15
16	1	16
17	1	17
18	1	18
19	1	19
20	1	20
21	1	21
22	1	22
23	1	23
24	1	24
25	1	25
26	1	26
27	1	27
28	1	28
29	1	29
30	1	30
31	1	31
32	1	32
33	1	33
34	1	34
35	1	35
36	1	36
37	1	37
38	1	38
39	1	39
40	1	40
41	1	41
42	1	42
43	1	43
44	1	44
45	1	45
46	1	46
47	1	47
48	1	48
49	1	49
50	1	50
51	1	51
52	1	52
53	1	53
54	1	54
55	1	55
56	1	56
57	1	57
58	1	58
59	1	59
60	1	60
61	1	61
62	1	62
63	1	63
64	1	64
65	1	65
66	1	66
67	1	67
68	1	68
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.roles (id, role_name, description) FROM stdin;
1	SUPER_ADMIN	Full System Access
2	SCHOOL_ADMIN	School Administrator
3	PRINCIPAL	Principal
4	VICE_PRINCIPAL	Vice Principal
5	ACCOUNTANT	Fee & Finance
6	TEACHER	Teacher Access
7	HOSTEL_WARDEN	Hostel Management
8	MESS_MANAGER	Dining Management
9	LIBRARIAN	Library
10	STORE_MANAGER	Inventory
11	PARENT	Parent Portal
12	STUDENT	Student Portal
\.


--
-- Data for Name: school_profile; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.school_profile (id, school_name, school_code, principal_name, email, phone, website, address, city, state, country, academic_year, logo_url, created_at) FROM stdin;
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.schools (id, school_name, school_code, email, phone, address, principal_name, subscription_plan, max_students, is_active, created_at) FROM stdin;
1	Kakatheeya	KVS	kakatheeya2000@yahoo.com	9493442344		Tvk Rao	BASIC	500	t	2026-05-28 23:52:43.432
2	GR Junior College	GRJC	kakatheeya2000@yahoo.com	9493442344		Venkata Koteswara Rao	BASIC	500	t	2026-05-29 16:29:11.317
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.sections (id, school_id, class_id, section_name, created_at) FROM stdin;
1	1	1	A	2026-05-28 23:58:51.16
2	1	1	A	2026-05-29 20:28:30.390256
3	1	2	A	2026-05-29 20:28:30.390256
4	1	3	A	2026-05-29 20:28:30.390256
5	1	4	A	2026-05-29 20:28:30.390256
6	1	5	A	2026-05-29 20:28:30.390256
7	1	6	A	2026-05-29 20:28:30.390256
8	1	7	A	2026-05-29 20:28:30.390256
9	1	8	A	2026-05-29 20:28:30.390256
10	1	9	A	2026-05-29 20:28:30.390256
11	1	10	A	2026-05-29 20:28:30.390256
12	1	11	A	2026-05-29 20:28:30.390256
13	1	1	B	2026-05-29 20:28:30.391946
14	1	2	B	2026-05-29 20:28:30.391946
15	1	3	B	2026-05-29 20:28:30.391946
16	1	4	B	2026-05-29 20:28:30.391946
17	1	5	B	2026-05-29 20:28:30.391946
18	1	6	B	2026-05-29 20:28:30.391946
19	1	7	B	2026-05-29 20:28:30.391946
20	1	8	B	2026-05-29 20:28:30.391946
21	1	9	B	2026-05-29 20:28:30.391946
22	1	10	B	2026-05-29 20:28:30.391946
23	1	11	B	2026-05-29 20:28:30.391946
24	1	2	A	2026-05-29 20:29:47.893459
25	1	3	A	2026-05-29 20:29:47.893459
26	1	4	A	2026-05-29 20:29:47.893459
27	1	5	A	2026-05-29 20:29:47.893459
28	1	6	A	2026-05-29 20:29:47.893459
29	1	7	A	2026-05-29 20:29:47.893459
30	1	8	A	2026-05-29 20:29:47.893459
31	1	9	A	2026-05-29 20:29:47.893459
32	1	10	A	2026-05-29 20:29:47.893459
33	1	11	A	2026-05-29 20:29:47.893459
34	1	12	A	2026-05-29 20:29:47.893459
35	1	13	A	2026-05-29 20:29:47.893459
36	1	14	A	2026-05-29 20:29:47.893459
37	1	15	A	2026-05-29 20:29:47.893459
38	1	16	A	2026-05-29 20:29:47.893459
39	1	17	A	2026-05-29 20:29:47.893459
40	1	18	A	2026-05-29 20:29:47.893459
41	1	19	A	2026-05-29 20:29:47.893459
42	1	20	A	2026-05-29 20:29:47.893459
43	1	2	B	2026-05-29 20:29:47.895334
44	1	3	B	2026-05-29 20:29:47.895334
45	1	4	B	2026-05-29 20:29:47.895334
46	1	5	B	2026-05-29 20:29:47.895334
47	1	6	B	2026-05-29 20:29:47.895334
48	1	7	B	2026-05-29 20:29:47.895334
49	1	8	B	2026-05-29 20:29:47.895334
50	1	9	B	2026-05-29 20:29:47.895334
51	1	10	B	2026-05-29 20:29:47.895334
52	1	11	B	2026-05-29 20:29:47.895334
53	1	12	B	2026-05-29 20:29:47.895334
54	1	13	B	2026-05-29 20:29:47.895334
55	1	14	B	2026-05-29 20:29:47.895334
56	1	15	B	2026-05-29 20:29:47.895334
57	1	16	B	2026-05-29 20:29:47.895334
58	1	17	B	2026-05-29 20:29:47.895334
59	1	18	B	2026-05-29 20:29:47.895334
60	1	19	B	2026-05-29 20:29:47.895334
61	1	20	B	2026-05-29 20:29:47.895334
\.


--
-- Data for Name: smtp_settings; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.smtp_settings (id, host, port, username, password, sender_email, sender_name) FROM stdin;
\.


--
-- Data for Name: student_exam_analysis; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.student_exam_analysis (id, student_id, question_paper_id, strengths, weaknesses, ai_recommendations, created_at) FROM stdin;
\.


--
-- Data for Name: student_exam_answers; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.student_exam_answers (id, student_id, question_paper_id, question_id, obtained_marks, evaluator_comments, created_at) FROM stdin;
\.


--
-- Data for Name: student_fee_assignments; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.student_fee_assignments (id, student_id, fee_category_id, assigned_amount, discount_amount, academic_year, created_at) FROM stdin;
\.


--
-- Data for Name: student_marks_entry; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.student_marks_entry (id, student_id, exam_schedule_id, question_paper_id, question_id, obtained_marks, max_marks, remarks, created_at) FROM stdin;
\.


--
-- Data for Name: student_promotions; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.student_promotions (id, school_id, student_id, from_class_id, to_class_id, academic_year, promoted_by, promoted_on) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.students (id, enrollment_number, admission_number, name, first_name, middle_name, last_name, gender, dob, phone, email, address, admission_date, religion, caste, blood_group, father_name, mother_name, father_phone, mother_phone, father_occupation, mother_occupation, roll_number, section_id, session_id, is_active, city, state, country, medium, house, category, birth_place, mother_tongue, school_name, school_address, school_class, pass_out_year, pan, student_type, note, survey, pen, apaar, father_id_number, mother_id_number, is_suspended, suspend_start_date, suspend_end_date, suspend_message, uid, created_at, updated_at, school_id, academic_year, transport_required, transport_route_id, hostel_required, hostel_room_id, photo_url, student_username, parent_username, guardian_username) FROM stdin;
2	\N	\N	John Doe	John	\N	Doe	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	1	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 08:46:43.687266	2026-05-29 08:46:43.687266	1	\N	f	\N	f	\N	\N	\N	\N	\N
3	\N	\N	Mary Jane	Mary	\N	Jane	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	1	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 08:46:43.687266	2026-05-29 08:46:43.687266	1	\N	f	\N	f	\N	\N	\N	\N	\N
4	KVS26001	KVS26001	\N	Leela Sankar Chowdary	\N	Tottempudi	Male	\N	8179618819	sankarchowdary.tottempudi@gmail.com	\N	\N	\N	\N	\N	Venkata Koteswara Rao	Bhagya Lakshmi	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:01:50.808	2026-05-29 20:01:50.808	1	\N	f	\N	f	\N	\N	\N	\N	\N
5	ENR1	ADM1	Student 1	Bhavya	\N	Reddy	Male	\N	9807145394	student1@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9928756360	9874706748	\N	\N	1	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
6	ENR2	ADM2	Student 2	Lokesh	\N	Kumar	Female	\N	9107471136	student2@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9462807456	9410453779	\N	\N	2	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
7	ENR3	ADM3	Student 3	Navya	\N	Rao	Female	\N	9791935821	student3@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9381996593	9554930231	\N	\N	3	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
8	ENR4	ADM4	Student 4	Harsha	\N	Varma	Female	\N	9706207446	student4@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9732962208	9803838719	\N	\N	4	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
9	ENR5	ADM5	Student 5	Keerthana	\N	Naidu	Male	\N	9310895031	student5@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9282049930	9199779521	\N	\N	5	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
10	ENR6	ADM6	Student 6	Sai Teja	\N	Varma	Female	\N	9401028334	student6@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9973828148	9227110193	\N	\N	6	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
11	ENR7	ADM7	Student 7	Manideep	\N	Rao	Male	\N	9748937743	student7@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9218059018	9924618754	\N	\N	7	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
12	ENR8	ADM8	Student 8	Harsha	\N	Murthy	Female	\N	9221469039	student8@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9630504454	9833354517	\N	\N	8	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
13	ENR9	ADM9	Student 9	Deepika	\N	Rao	Female	\N	9387779822	student9@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9709331258	9306147356	\N	\N	9	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
14	ENR10	ADM10	Student 10	Bhavya	\N	Kumar	Male	\N	9604773118	student10@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9195426463	9172661890	\N	\N	10	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
15	ENR11	ADM11	Student 11	Sindhu	\N	Naidu	Female	\N	9238712256	student11@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9374450052	9990028169	\N	\N	11	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
16	ENR12	ADM12	Student 12	Manideep	\N	Kumar	Male	\N	9472366317	student12@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9707568822	9458788503	\N	\N	12	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
17	ENR13	ADM13	Student 13	Navya	\N	Rao	Male	\N	9412253742	student13@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9318504175	9165670593	\N	\N	13	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
18	ENR14	ADM14	Student 14	Harsha	\N	Varma	Female	\N	9381430331	student14@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9867027740	9427915770	\N	\N	14	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
19	ENR15	ADM15	Student 15	Navya	\N	Kumar	Female	\N	9205816794	student15@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9574420395	9378118486	\N	\N	15	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
20	ENR16	ADM16	Student 16	Harsha	\N	Kumar	Male	\N	9652427235	student16@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9169747287	9586572506	\N	\N	16	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
21	ENR17	ADM17	Student 17	Lokesh	\N	Murthy	Male	\N	9522148200	student17@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9880218631	9792127118	\N	\N	17	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
22	ENR18	ADM18	Student 18	Keerthana	\N	Murthy	Male	\N	9617884336	student18@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9994129228	9726786055	\N	\N	18	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
23	ENR19	ADM19	Student 19	Sai Kiran	\N	Rao	Female	\N	9691632169	student19@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9296162118	9337025599	\N	\N	19	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
24	ENR20	ADM20	Student 20	Deepika	\N	Varma	Female	\N	9111711473	student20@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9347555801	9839060821	\N	\N	20	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
25	ENR21	ADM21	Student 21	Bhavya	\N	Varma	Female	\N	9165200601	student21@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9810199504	9339093764	\N	\N	21	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
26	ENR22	ADM22	Student 22	Manideep	\N	Rao	Female	\N	9920706684	student22@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9857791294	9973585743	\N	\N	22	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
27	ENR23	ADM23	Student 23	Praneeth	\N	Murthy	Female	\N	9751306237	student23@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9684555282	9497989790	\N	\N	23	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
28	ENR24	ADM24	Student 24	Sai Kiran	\N	Kumar	Male	\N	9213674840	student24@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9562401007	9846446396	\N	\N	24	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
29	ENR25	ADM25	Student 25	Manideep	\N	Kumar	Male	\N	9616443803	student25@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9873087527	9644708729	\N	\N	25	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
30	ENR26	ADM26	Student 26	Manideep	\N	Varma	Female	\N	9622137546	student26@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9618363543	9415706667	\N	\N	26	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
31	ENR27	ADM27	Student 27	Sindhu	\N	Murthy	Male	\N	9939407599	student27@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9765379058	9242630057	\N	\N	27	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
32	ENR28	ADM28	Student 28	Sravani	\N	Kumar	Female	\N	9290632575	student28@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9699945462	9417408623	\N	\N	28	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
33	ENR29	ADM29	Student 29	Keerthana	\N	Naidu	Male	\N	9487476673	student29@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9637975855	9627173110	\N	\N	29	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
34	ENR30	ADM30	Student 30	Lokesh	\N	Rao	Male	\N	9324782946	student30@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9210576929	9461782303	\N	\N	30	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
35	ENR31	ADM31	Student 31	Sai Teja	\N	Rao	Male	\N	9862022107	student31@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9390544106	9317302819	\N	\N	31	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
36	ENR32	ADM32	Student 32	Keerthana	\N	Naidu	Male	\N	9990277383	student32@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9863021591	9429850081	\N	\N	32	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
37	ENR33	ADM33	Student 33	Navya	\N	Rao	Female	\N	9947309137	student33@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9409037476	9534352800	\N	\N	33	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
38	ENR34	ADM34	Student 34	Navya	\N	Varma	Female	\N	9150944229	student34@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9330033604	9511784734	\N	\N	34	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
39	ENR35	ADM35	Student 35	Lokesh	\N	Rao	Female	\N	9908087550	student35@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9141724049	9980562955	\N	\N	35	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
40	ENR36	ADM36	Student 36	Sai Kiran	\N	Varma	Female	\N	9574398297	student36@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9880134192	9960120534	\N	\N	36	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
41	ENR37	ADM37	Student 37	Sai Kiran	\N	Rao	Female	\N	9458650863	student37@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9337287453	9525950223	\N	\N	37	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
42	ENR38	ADM38	Student 38	Lokesh	\N	Kumar	Male	\N	9797027514	student38@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9790119476	9307787696	\N	\N	38	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
43	ENR39	ADM39	Student 39	Bhavya	\N	Reddy	Female	\N	9590025089	student39@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9727785832	9420220963	\N	\N	39	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
44	ENR40	ADM40	Student 40	Sai Teja	\N	Rao	Female	\N	9513941109	student40@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9663976001	9706546818	\N	\N	40	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
45	ENR41	ADM41	Student 41	Sravani	\N	Reddy	Male	\N	9848226514	student41@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9878775473	9668951580	\N	\N	41	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
46	ENR42	ADM42	Student 42	Navya	\N	Varma	Female	\N	9124502273	student42@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9590693649	9587806253	\N	\N	42	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
47	ENR43	ADM43	Student 43	Manideep	\N	Kumar	Male	\N	9175077537	student43@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9135311510	9425757127	\N	\N	43	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
48	ENR44	ADM44	Student 44	Harsha	\N	Reddy	Male	\N	9310509532	student44@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9140109554	9131406880	\N	\N	44	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
49	ENR45	ADM45	Student 45	Sravani	\N	Reddy	Female	\N	9405404501	student45@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9239194391	9293827787	\N	\N	45	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
50	ENR46	ADM46	Student 46	Sindhu	\N	Reddy	Male	\N	9610691808	student46@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9362073837	9865127024	\N	\N	46	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
51	ENR47	ADM47	Student 47	Praneeth	\N	Varma	Male	\N	9374775175	student47@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9359338503	9881813305	\N	\N	47	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
52	ENR48	ADM48	Student 48	Deepika	\N	Murthy	Male	\N	9544276169	student48@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9313179402	9901858166	\N	\N	48	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
53	ENR49	ADM49	Student 49	Keerthana	\N	Rao	Female	\N	9294459060	student49@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9739322394	9682220045	\N	\N	49	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
54	ENR50	ADM50	Student 50	Sindhu	\N	Naidu	Female	\N	9752524866	student50@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9699889112	9696726594	\N	\N	50	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
55	ENR51	ADM51	Student 51	Sai Teja	\N	Varma	Male	\N	9132080207	student51@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9839741771	9683630777	\N	\N	51	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
56	ENR52	ADM52	Student 52	Lokesh	\N	Varma	Male	\N	9961792014	student52@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9629255771	9338227492	\N	\N	52	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
57	ENR53	ADM53	Student 53	Keerthana	\N	Kumar	Male	\N	9580409457	student53@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9468381437	9929929037	\N	\N	53	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
58	ENR54	ADM54	Student 54	Harsha	\N	Rao	Male	\N	9710671857	student54@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9647801266	9373628447	\N	\N	54	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
59	ENR55	ADM55	Student 55	Praneeth	\N	Naidu	Male	\N	9496947985	student55@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9246156589	9414342376	\N	\N	55	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
60	ENR56	ADM56	Student 56	Sindhu	\N	Rao	Male	\N	9763145396	student56@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9503813911	9660620399	\N	\N	56	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
61	ENR57	ADM57	Student 57	Praneeth	\N	Murthy	Male	\N	9336990516	student57@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9702226121	9904466618	\N	\N	57	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
62	ENR58	ADM58	Student 58	Lokesh	\N	Naidu	Female	\N	9104962107	student58@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9517064300	9121014403	\N	\N	58	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
63	ENR59	ADM59	Student 59	Praneeth	\N	Kumar	Female	\N	9726202676	student59@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9864904957	9596210732	\N	\N	59	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
64	ENR60	ADM60	Student 60	Sindhu	\N	Kumar	Female	\N	9837343927	student60@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9182578721	9125924786	\N	\N	60	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
65	ENR61	ADM61	Student 61	Sai Teja	\N	Rao	Male	\N	9947277958	student61@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9965930301	9964078195	\N	\N	61	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
66	ENR62	ADM62	Student 62	Manideep	\N	Naidu	Male	\N	9119334866	student62@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9185708414	9526751518	\N	\N	62	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
67	ENR63	ADM63	Student 63	Lokesh	\N	Rao	Female	\N	9444175412	student63@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9698285347	9389196313	\N	\N	63	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
68	ENR64	ADM64	Student 64	Sai Kiran	\N	Varma	Female	\N	9935451412	student64@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9660119509	9112301348	\N	\N	64	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
69	ENR65	ADM65	Student 65	Harsha	\N	Kumar	Male	\N	9878869579	student65@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9719471293	9960034041	\N	\N	65	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
70	ENR66	ADM66	Student 66	Deepika	\N	Naidu	Male	\N	9992082889	student66@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9835989291	9719873201	\N	\N	66	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
71	ENR67	ADM67	Student 67	Deepika	\N	Varma	Male	\N	9143922341	student67@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9285511315	9191405077	\N	\N	67	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
72	ENR68	ADM68	Student 68	Manideep	\N	Kumar	Female	\N	9518302532	student68@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9105354490	9759671338	\N	\N	68	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
73	ENR69	ADM69	Student 69	Sravani	\N	Murthy	Male	\N	9768899340	student69@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9580655760	9557623148	\N	\N	69	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
74	ENR70	ADM70	Student 70	Navya	\N	Naidu	Female	\N	9530854935	student70@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9659313920	9552194952	\N	\N	70	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
75	ENR71	ADM71	Student 71	Sai Teja	\N	Varma	Female	\N	9704198470	student71@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9641505814	9436445415	\N	\N	71	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
76	ENR72	ADM72	Student 72	Sindhu	\N	Reddy	Female	\N	9696626838	student72@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9921482080	9606110222	\N	\N	72	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
77	ENR73	ADM73	Student 73	Sravani	\N	Rao	Male	\N	9595771600	student73@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9913063130	9930505877	\N	\N	73	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
78	ENR74	ADM74	Student 74	Sravani	\N	Varma	Female	\N	9711878869	student74@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9239983028	9172751414	\N	\N	74	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
79	ENR75	ADM75	Student 75	Deepika	\N	Naidu	Female	\N	9618240233	student75@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9958671647	9970148647	\N	\N	75	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
80	ENR76	ADM76	Student 76	Bhavya	\N	Rao	Male	\N	9464706788	student76@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9949272300	9450568590	\N	\N	76	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
81	ENR77	ADM77	Student 77	Sindhu	\N	Murthy	Female	\N	9192857993	student77@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9911600119	9218789383	\N	\N	77	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
82	ENR78	ADM78	Student 78	Manideep	\N	Naidu	Male	\N	9473225656	student78@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9340209747	9530473690	\N	\N	78	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
83	ENR79	ADM79	Student 79	Keerthana	\N	Reddy	Male	\N	9552016339	student79@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9475741432	9667133530	\N	\N	79	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
84	ENR80	ADM80	Student 80	Keerthana	\N	Rao	Female	\N	9339025826	student80@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9753732903	9200199623	\N	\N	80	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
85	ENR81	ADM81	Student 81	Sai Teja	\N	Varma	Male	\N	9743009566	student81@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9333348170	9941235244	\N	\N	81	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
86	ENR82	ADM82	Student 82	Navya	\N	Naidu	Female	\N	9588669532	student82@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9747616079	9358982238	\N	\N	82	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
87	ENR83	ADM83	Student 83	Sai Kiran	\N	Reddy	Male	\N	9416473879	student83@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9399711239	9456139967	\N	\N	83	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
88	ENR84	ADM84	Student 84	Sravani	\N	Rao	Male	\N	9270177410	student84@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9748802908	9320826661	\N	\N	84	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
89	ENR85	ADM85	Student 85	Keerthana	\N	Murthy	Male	\N	9834964110	student85@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9962911110	9274669830	\N	\N	85	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
90	ENR86	ADM86	Student 86	Manideep	\N	Varma	Male	\N	9272616708	student86@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9411918167	9144232869	\N	\N	86	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
91	ENR87	ADM87	Student 87	Sindhu	\N	Murthy	Female	\N	9958263605	student87@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9112654528	9964437640	\N	\N	87	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
92	ENR88	ADM88	Student 88	Navya	\N	Varma	Female	\N	9613496990	student88@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9479060914	9376875697	\N	\N	88	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
93	ENR89	ADM89	Student 89	Sindhu	\N	Murthy	Male	\N	9424435785	student89@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9508452512	9713920178	\N	\N	89	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
94	ENR90	ADM90	Student 90	Lokesh	\N	Reddy	Female	\N	9701071309	student90@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9888765733	9840641995	\N	\N	90	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
95	ENR91	ADM91	Student 91	Praneeth	\N	Varma	Male	\N	9318285508	student91@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9887754719	9985804335	\N	\N	91	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
96	ENR92	ADM92	Student 92	Lokesh	\N	Varma	Male	\N	9155769277	student92@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9128395775	9700157338	\N	\N	92	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
97	ENR93	ADM93	Student 93	Sai Kiran	\N	Varma	Female	\N	9173585798	student93@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9387598357	9668870133	\N	\N	93	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
98	ENR94	ADM94	Student 94	Sindhu	\N	Naidu	Female	\N	9740999060	student94@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9234360258	9549207565	\N	\N	94	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
99	ENR95	ADM95	Student 95	Manideep	\N	Reddy	Female	\N	9676635274	student95@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9899155718	9813626614	\N	\N	95	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
100	ENR96	ADM96	Student 96	Navya	\N	Murthy	Male	\N	9646302694	student96@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9901227002	9321355513	\N	\N	96	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
101	ENR97	ADM97	Student 97	Harsha	\N	Murthy	Female	\N	9891846191	student97@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9331713177	9157282394	\N	\N	97	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
102	ENR98	ADM98	Student 98	Navya	\N	Murthy	Female	\N	9285903176	student98@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9747399399	9265713516	\N	\N	98	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
103	ENR99	ADM99	Student 99	Manideep	\N	Rao	Female	\N	9675262204	student99@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9103750537	9625229979	\N	\N	99	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
104	ENR100	ADM100	Student 100	Navya	\N	Reddy	Male	\N	9750490243	student100@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9977548362	9121508235	\N	\N	100	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
105	ENR101	ADM101	Student 101	Sai Kiran	\N	Reddy	Female	\N	9636527572	student101@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9183047106	9647778357	\N	\N	101	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
106	ENR102	ADM102	Student 102	Keerthana	\N	Reddy	Female	\N	9424777556	student102@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9198884085	9912150483	\N	\N	102	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
107	ENR103	ADM103	Student 103	Manideep	\N	Reddy	Female	\N	9644522275	student103@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9692713423	9149863453	\N	\N	103	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
108	ENR104	ADM104	Student 104	Deepika	\N	Kumar	Female	\N	9390727508	student104@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9995237495	9151494278	\N	\N	104	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
109	ENR105	ADM105	Student 105	Manideep	\N	Naidu	Male	\N	9708932057	student105@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9679868650	9544911764	\N	\N	105	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
110	ENR106	ADM106	Student 106	Lokesh	\N	Varma	Male	\N	9368033103	student106@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9252081657	9477724880	\N	\N	106	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
111	ENR107	ADM107	Student 107	Lokesh	\N	Murthy	Female	\N	9208165888	student107@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9409776824	9980717343	\N	\N	107	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
112	ENR108	ADM108	Student 108	Sindhu	\N	Reddy	Female	\N	9295257286	student108@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9702764773	9719915036	\N	\N	108	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
113	ENR109	ADM109	Student 109	Navya	\N	Varma	Male	\N	9153556485	student109@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9541455195	9471143819	\N	\N	109	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
114	ENR110	ADM110	Student 110	Praneeth	\N	Varma	Female	\N	9834470194	student110@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9378636770	9154563125	\N	\N	110	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
115	ENR111	ADM111	Student 111	Deepika	\N	Varma	Female	\N	9631800061	student111@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9375811252	9740511499	\N	\N	111	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
116	ENR112	ADM112	Student 112	Sai Teja	\N	Reddy	Male	\N	9407632564	student112@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9264196217	9949179099	\N	\N	112	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
117	ENR113	ADM113	Student 113	Deepika	\N	Murthy	Female	\N	9792036088	student113@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9910514740	9515298922	\N	\N	113	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
118	ENR114	ADM114	Student 114	Sravani	\N	Reddy	Male	\N	9449097002	student114@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9968793507	9991695261	\N	\N	114	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
119	ENR115	ADM115	Student 115	Manideep	\N	Varma	Female	\N	9792808442	student115@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9397289870	9928383927	\N	\N	115	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
120	ENR116	ADM116	Student 116	Keerthana	\N	Naidu	Male	\N	9151026335	student116@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9434644038	9392777684	\N	\N	116	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
121	ENR117	ADM117	Student 117	Sindhu	\N	Reddy	Male	\N	9744846417	student117@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9295119362	9767796910	\N	\N	117	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
122	ENR118	ADM118	Student 118	Sravani	\N	Naidu	Male	\N	9324200365	student118@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9127109895	9293598431	\N	\N	118	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
123	ENR119	ADM119	Student 119	Keerthana	\N	Rao	Female	\N	9335868943	student119@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9697905355	9400075003	\N	\N	119	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
124	ENR120	ADM120	Student 120	Lokesh	\N	Varma	Female	\N	9323498004	student120@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9145041013	9136362542	\N	\N	120	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
125	ENR121	ADM121	Student 121	Sindhu	\N	Rao	Male	\N	9195344970	student121@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9520654479	9915746369	\N	\N	121	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
126	ENR122	ADM122	Student 122	Sai Teja	\N	Murthy	Female	\N	9859156309	student122@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9677105445	9285766179	\N	\N	122	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
127	ENR123	ADM123	Student 123	Sai Teja	\N	Murthy	Male	\N	9516518720	student123@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9608687836	9341023648	\N	\N	123	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
128	ENR124	ADM124	Student 124	Sravani	\N	Kumar	Female	\N	9407880594	student124@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9709690691	9252029228	\N	\N	124	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
129	ENR125	ADM125	Student 125	Keerthana	\N	Kumar	Male	\N	9505351207	student125@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9127497296	9490062835	\N	\N	125	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
130	ENR126	ADM126	Student 126	Keerthana	\N	Rao	Female	\N	9435417204	student126@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9999497737	9106206832	\N	\N	126	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
131	ENR127	ADM127	Student 127	Manideep	\N	Naidu	Female	\N	9616922734	student127@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9655882619	9960877899	\N	\N	127	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
132	ENR128	ADM128	Student 128	Sai Teja	\N	Murthy	Female	\N	9204667567	student128@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9822580124	9140200242	\N	\N	128	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
133	ENR129	ADM129	Student 129	Harsha	\N	Kumar	Female	\N	9323031141	student129@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9986724828	9424743942	\N	\N	129	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
134	ENR130	ADM130	Student 130	Manideep	\N	Kumar	Male	\N	9126373078	student130@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9232227642	9240392047	\N	\N	130	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
135	ENR131	ADM131	Student 131	Manideep	\N	Naidu	Female	\N	9377735848	student131@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9207069552	9276518863	\N	\N	131	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
136	ENR132	ADM132	Student 132	Navya	\N	Naidu	Female	\N	9904118848	student132@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9972079201	9878923252	\N	\N	132	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
137	ENR133	ADM133	Student 133	Harsha	\N	Murthy	Female	\N	9764852604	student133@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9659625289	9783457165	\N	\N	133	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
138	ENR134	ADM134	Student 134	Praneeth	\N	Varma	Female	\N	9611299047	student134@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9970078808	9889314917	\N	\N	134	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
139	ENR135	ADM135	Student 135	Sindhu	\N	Reddy	Female	\N	9440807820	student135@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9778193886	9525026944	\N	\N	135	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
140	ENR136	ADM136	Student 136	Manideep	\N	Varma	Female	\N	9856800988	student136@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9657634043	9451260235	\N	\N	136	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
141	ENR137	ADM137	Student 137	Manideep	\N	Varma	Female	\N	9907622550	student137@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9981507242	9932881662	\N	\N	137	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
142	ENR138	ADM138	Student 138	Sravani	\N	Kumar	Female	\N	9263282755	student138@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9200936354	9690397746	\N	\N	138	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
143	ENR139	ADM139	Student 139	Lokesh	\N	Rao	Female	\N	9903594519	student139@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9848414218	9643058502	\N	\N	139	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
144	ENR140	ADM140	Student 140	Sai Teja	\N	Varma	Female	\N	9430533422	student140@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9811532980	9338618564	\N	\N	140	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
145	ENR141	ADM141	Student 141	Navya	\N	Rao	Female	\N	9464343722	student141@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9864438427	9258859818	\N	\N	141	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
146	ENR142	ADM142	Student 142	Manideep	\N	Kumar	Female	\N	9892048455	student142@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9310853778	9738655731	\N	\N	142	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
147	ENR143	ADM143	Student 143	Navya	\N	Varma	Male	\N	9197566143	student143@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9415079447	9258538140	\N	\N	143	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
148	ENR144	ADM144	Student 144	Bhavya	\N	Naidu	Female	\N	9200413744	student144@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9705783715	9927528392	\N	\N	144	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
149	ENR145	ADM145	Student 145	Deepika	\N	Kumar	Male	\N	9578613878	student145@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9789687406	9716412191	\N	\N	145	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
150	ENR146	ADM146	Student 146	Sai Kiran	\N	Kumar	Male	\N	9422780138	student146@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9236724934	9652224624	\N	\N	146	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
151	ENR147	ADM147	Student 147	Sravani	\N	Naidu	Male	\N	9975739242	student147@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9931095922	9351258837	\N	\N	147	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
152	ENR148	ADM148	Student 148	Manideep	\N	Reddy	Male	\N	9888239763	student148@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9454915419	9333748946	\N	\N	148	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
153	ENR149	ADM149	Student 149	Lokesh	\N	Varma	Female	\N	9951393666	student149@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9848672525	9479556025	\N	\N	149	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
154	ENR150	ADM150	Student 150	Sai Teja	\N	Rao	Male	\N	9873034212	student150@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9422623836	9995162236	\N	\N	150	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
155	ENR151	ADM151	Student 151	Sai Kiran	\N	Reddy	Female	\N	9863843016	student151@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9598292651	9146795633	\N	\N	151	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
156	ENR152	ADM152	Student 152	Keerthana	\N	Murthy	Female	\N	9787868957	student152@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9695695630	9482071014	\N	\N	152	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
157	ENR153	ADM153	Student 153	Navya	\N	Naidu	Male	\N	9985127359	student153@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9335791062	9510214006	\N	\N	153	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
158	ENR154	ADM154	Student 154	Bhavya	\N	Reddy	Male	\N	9221073350	student154@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9728622731	9776351478	\N	\N	154	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
159	ENR155	ADM155	Student 155	Navya	\N	Rao	Female	\N	9858659225	student155@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9731722536	9163398580	\N	\N	155	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
160	ENR156	ADM156	Student 156	Sai Kiran	\N	Murthy	Male	\N	9890832719	student156@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9444985396	9962742490	\N	\N	156	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
161	ENR157	ADM157	Student 157	Sravani	\N	Murthy	Female	\N	9593705487	student157@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9255052665	9102299723	\N	\N	157	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
162	ENR158	ADM158	Student 158	Manideep	\N	Reddy	Female	\N	9482404005	student158@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9427953795	9812863729	\N	\N	158	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
163	ENR159	ADM159	Student 159	Sravani	\N	Kumar	Female	\N	9209631266	student159@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9702479070	9231708648	\N	\N	159	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
164	ENR160	ADM160	Student 160	Navya	\N	Rao	Male	\N	9968413856	student160@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9355305233	9813498931	\N	\N	160	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
165	ENR161	ADM161	Student 161	Bhavya	\N	Kumar	Female	\N	9987996599	student161@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9925015272	9175471952	\N	\N	161	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
166	ENR162	ADM162	Student 162	Sravani	\N	Kumar	Female	\N	9905826208	student162@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9387546780	9915536375	\N	\N	162	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
167	ENR163	ADM163	Student 163	Navya	\N	Kumar	Female	\N	9612874677	student163@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9238090045	9116576616	\N	\N	163	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
168	ENR164	ADM164	Student 164	Sindhu	\N	Murthy	Female	\N	9819393307	student164@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9209668001	9244615828	\N	\N	164	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
169	ENR165	ADM165	Student 165	Navya	\N	Naidu	Male	\N	9361629252	student165@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9902279420	9935754068	\N	\N	165	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
170	ENR166	ADM166	Student 166	Deepika	\N	Reddy	Female	\N	9728196709	student166@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9656054830	9170638676	\N	\N	166	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
171	ENR167	ADM167	Student 167	Praneeth	\N	Murthy	Male	\N	9953274389	student167@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9247372415	9862496442	\N	\N	167	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
172	ENR168	ADM168	Student 168	Navya	\N	Reddy	Female	\N	9558713600	student168@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9160653019	9432766516	\N	\N	168	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
173	ENR169	ADM169	Student 169	Lokesh	\N	Kumar	Female	\N	9230324578	student169@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9659246159	9663638249	\N	\N	169	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
174	ENR170	ADM170	Student 170	Sravani	\N	Varma	Male	\N	9655423009	student170@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9294217710	9646611386	\N	\N	170	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
175	ENR171	ADM171	Student 171	Navya	\N	Kumar	Male	\N	9349429265	student171@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9207602677	9659588693	\N	\N	171	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
176	ENR172	ADM172	Student 172	Keerthana	\N	Naidu	Male	\N	9191539779	student172@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9440206983	9376656166	\N	\N	172	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
177	ENR173	ADM173	Student 173	Sravani	\N	Kumar	Male	\N	9757477859	student173@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9929277459	9157216502	\N	\N	173	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
178	ENR174	ADM174	Student 174	Sindhu	\N	Varma	Female	\N	9719217641	student174@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9848668730	9796253433	\N	\N	174	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
179	ENR175	ADM175	Student 175	Lokesh	\N	Varma	Female	\N	9204080691	student175@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9501631631	9748399296	\N	\N	175	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
180	ENR176	ADM176	Student 176	Manideep	\N	Varma	Male	\N	9831014982	student176@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9833180396	9374733955	\N	\N	176	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
181	ENR177	ADM177	Student 177	Keerthana	\N	Reddy	Male	\N	9332109022	student177@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9390687282	9162628300	\N	\N	177	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
182	ENR178	ADM178	Student 178	Sai Kiran	\N	Varma	Female	\N	9534923756	student178@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9940668982	9421984578	\N	\N	178	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
183	ENR179	ADM179	Student 179	Deepika	\N	Rao	Female	\N	9225878973	student179@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9288186248	9953972755	\N	\N	179	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
184	ENR180	ADM180	Student 180	Lokesh	\N	Varma	Female	\N	9314873524	student180@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9549400691	9961650309	\N	\N	180	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
185	ENR181	ADM181	Student 181	Sai Teja	\N	Murthy	Male	\N	9854147689	student181@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9744344214	9983022415	\N	\N	181	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
186	ENR182	ADM182	Student 182	Bhavya	\N	Rao	Male	\N	9956491437	student182@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9166873327	9907153138	\N	\N	182	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
187	ENR183	ADM183	Student 183	Praneeth	\N	Kumar	Male	\N	9341032829	student183@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9725620536	9698148543	\N	\N	183	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
188	ENR184	ADM184	Student 184	Praneeth	\N	Reddy	Male	\N	9577342948	student184@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9633736228	9815639688	\N	\N	184	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
189	ENR185	ADM185	Student 185	Sai Teja	\N	Varma	Male	\N	9180201569	student185@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9626918750	9328760277	\N	\N	185	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
190	ENR186	ADM186	Student 186	Sravani	\N	Naidu	Female	\N	9817957986	student186@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9489753472	9904350803	\N	\N	186	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
191	ENR187	ADM187	Student 187	Navya	\N	Murthy	Male	\N	9618206987	student187@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9611743731	9845563970	\N	\N	187	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
192	ENR188	ADM188	Student 188	Lokesh	\N	Reddy	Male	\N	9687791811	student188@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9886850830	9256799220	\N	\N	188	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
193	ENR189	ADM189	Student 189	Navya	\N	Murthy	Male	\N	9561761971	student189@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9312666706	9234064180	\N	\N	189	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
194	ENR190	ADM190	Student 190	Sai Teja	\N	Murthy	Male	\N	9240538313	student190@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9110266600	9160784426	\N	\N	190	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
195	ENR191	ADM191	Student 191	Bhavya	\N	Rao	Male	\N	9264042963	student191@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9975649074	9831676632	\N	\N	191	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
196	ENR192	ADM192	Student 192	Sindhu	\N	Reddy	Male	\N	9869867245	student192@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9399771092	9636396248	\N	\N	192	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
197	ENR193	ADM193	Student 193	Manideep	\N	Naidu	Male	\N	9541006111	student193@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9462079982	9796596103	\N	\N	193	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
198	ENR194	ADM194	Student 194	Lokesh	\N	Reddy	Female	\N	9880831050	student194@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9624906503	9503491024	\N	\N	194	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
199	ENR195	ADM195	Student 195	Harsha	\N	Reddy	Male	\N	9116467704	student195@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9870785769	9707610818	\N	\N	195	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
200	ENR196	ADM196	Student 196	Harsha	\N	Rao	Male	\N	9343339536	student196@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9554985996	9273840898	\N	\N	196	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
201	ENR197	ADM197	Student 197	Manideep	\N	Naidu	Male	\N	9619082036	student197@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9506408619	9284870939	\N	\N	197	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
202	ENR198	ADM198	Student 198	Harsha	\N	Kumar	Female	\N	9647871035	student198@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9546863166	9142758660	\N	\N	198	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
203	ENR199	ADM199	Student 199	Deepika	\N	Rao	Male	\N	9837434621	student199@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9107511529	9504852832	\N	\N	199	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
204	ENR200	ADM200	Student 200	Praneeth	\N	Varma	Male	\N	9734800496	student200@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9295961608	9570960374	\N	\N	200	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
205	ENR201	ADM201	Student 201	Deepika	\N	Murthy	Female	\N	9870987763	student201@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9274567328	9262743258	\N	\N	201	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
206	ENR202	ADM202	Student 202	Sai Kiran	\N	Rao	Female	\N	9894575338	student202@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9936708245	9420181003	\N	\N	202	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
207	ENR203	ADM203	Student 203	Sindhu	\N	Rao	Male	\N	9553358663	student203@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9816523432	9846918119	\N	\N	203	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
208	ENR204	ADM204	Student 204	Bhavya	\N	Reddy	Female	\N	9382049119	student204@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9104601256	9510004250	\N	\N	204	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
209	ENR205	ADM205	Student 205	Bhavya	\N	Rao	Female	\N	9295665745	student205@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9955407407	9423254078	\N	\N	205	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
210	ENR206	ADM206	Student 206	Keerthana	\N	Kumar	Male	\N	9612928919	student206@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9852565223	9540470786	\N	\N	206	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
211	ENR207	ADM207	Student 207	Lokesh	\N	Varma	Male	\N	9568718986	student207@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9770678808	9773383249	\N	\N	207	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
212	ENR208	ADM208	Student 208	Deepika	\N	Reddy	Male	\N	9588356733	student208@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9439386941	9492774429	\N	\N	208	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
213	ENR209	ADM209	Student 209	Sai Teja	\N	Reddy	Male	\N	9415761740	student209@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9177634058	9319400858	\N	\N	209	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
214	ENR210	ADM210	Student 210	Sravani	\N	Varma	Female	\N	9216622852	student210@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9857129994	9455963370	\N	\N	210	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
215	ENR211	ADM211	Student 211	Harsha	\N	Rao	Female	\N	9559478150	student211@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9442534886	9537661402	\N	\N	211	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
216	ENR212	ADM212	Student 212	Sindhu	\N	Naidu	Female	\N	9768739905	student212@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9387903305	9910086300	\N	\N	212	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
217	ENR213	ADM213	Student 213	Sravani	\N	Kumar	Male	\N	9157581752	student213@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9853117610	9503042087	\N	\N	213	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
218	ENR214	ADM214	Student 214	Manideep	\N	Varma	Female	\N	9793863649	student214@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9583080289	9880017314	\N	\N	214	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
219	ENR215	ADM215	Student 215	Navya	\N	Naidu	Male	\N	9787831196	student215@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9278074938	9807006344	\N	\N	215	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
220	ENR216	ADM216	Student 216	Harsha	\N	Murthy	Male	\N	9615315072	student216@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9491781839	9850966162	\N	\N	216	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
221	ENR217	ADM217	Student 217	Deepika	\N	Rao	Female	\N	9292568057	student217@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9409258995	9803693403	\N	\N	217	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
222	ENR218	ADM218	Student 218	Manideep	\N	Reddy	Female	\N	9555201530	student218@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9874458095	9402245491	\N	\N	218	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
223	ENR219	ADM219	Student 219	Sravani	\N	Reddy	Male	\N	9401209095	student219@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9764123067	9372382448	\N	\N	219	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
224	ENR220	ADM220	Student 220	Sai Kiran	\N	Rao	Female	\N	9913291658	student220@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9749324703	9664976751	\N	\N	220	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
225	ENR221	ADM221	Student 221	Manideep	\N	Naidu	Male	\N	9797888184	student221@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9229414292	9665589149	\N	\N	221	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
226	ENR222	ADM222	Student 222	Deepika	\N	Kumar	Male	\N	9325407711	student222@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9721206216	9257573157	\N	\N	222	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
227	ENR223	ADM223	Student 223	Praneeth	\N	Kumar	Female	\N	9537975136	student223@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9593894315	9124135290	\N	\N	223	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
228	ENR224	ADM224	Student 224	Praneeth	\N	Varma	Female	\N	9716785588	student224@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9371931006	9747139030	\N	\N	224	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
229	ENR225	ADM225	Student 225	Praneeth	\N	Kumar	Female	\N	9755466882	student225@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9866537578	9235462610	\N	\N	225	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
230	ENR226	ADM226	Student 226	Lokesh	\N	Kumar	Female	\N	9287934562	student226@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9618761372	9827915689	\N	\N	226	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
231	ENR227	ADM227	Student 227	Deepika	\N	Kumar	Female	\N	9482542431	student227@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9793318702	9906476092	\N	\N	227	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
232	ENR228	ADM228	Student 228	Harsha	\N	Murthy	Male	\N	9766838608	student228@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9155190566	9291370121	\N	\N	228	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
233	ENR229	ADM229	Student 229	Sai Teja	\N	Murthy	Female	\N	9449726741	student229@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9440708174	9344503097	\N	\N	229	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
234	ENR230	ADM230	Student 230	Bhavya	\N	Naidu	Female	\N	9773947276	student230@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9368131131	9367926815	\N	\N	230	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
235	ENR231	ADM231	Student 231	Praneeth	\N	Reddy	Male	\N	9239804794	student231@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9342284475	9788866305	\N	\N	231	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
236	ENR232	ADM232	Student 232	Navya	\N	Varma	Male	\N	9556939724	student232@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9591073947	9501212084	\N	\N	232	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
237	ENR233	ADM233	Student 233	Praneeth	\N	Kumar	Female	\N	9709545060	student233@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9306679962	9402636431	\N	\N	233	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
238	ENR234	ADM234	Student 234	Sai Teja	\N	Varma	Male	\N	9967517930	student234@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9143834495	9683043883	\N	\N	234	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
239	ENR235	ADM235	Student 235	Bhavya	\N	Reddy	Male	\N	9240963756	student235@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9515906944	9355415402	\N	\N	235	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
240	ENR236	ADM236	Student 236	Harsha	\N	Varma	Male	\N	9672355595	student236@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9521309731	9299890049	\N	\N	236	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
241	ENR237	ADM237	Student 237	Sai Teja	\N	Murthy	Female	\N	9444980265	student237@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9736799132	9628961476	\N	\N	237	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
242	ENR238	ADM238	Student 238	Sai Teja	\N	Reddy	Female	\N	9632278176	student238@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9353005536	9574853487	\N	\N	238	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
243	ENR239	ADM239	Student 239	Keerthana	\N	Naidu	Female	\N	9693834766	student239@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9828774806	9192850145	\N	\N	239	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
244	ENR240	ADM240	Student 240	Sai Teja	\N	Varma	Female	\N	9392494691	student240@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9383321586	9650157278	\N	\N	240	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
245	ENR241	ADM241	Student 241	Sravani	\N	Naidu	Female	\N	9747303941	student241@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9406316483	9773506150	\N	\N	241	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
246	ENR242	ADM242	Student 242	Sai Kiran	\N	Murthy	Male	\N	9352319024	student242@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9659562694	9163697983	\N	\N	242	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
247	ENR243	ADM243	Student 243	Sindhu	\N	Varma	Male	\N	9659997113	student243@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9690189999	9501140299	\N	\N	243	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
248	ENR244	ADM244	Student 244	Sai Teja	\N	Kumar	Male	\N	9295611033	student244@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9702869157	9851723650	\N	\N	244	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
249	ENR245	ADM245	Student 245	Navya	\N	Kumar	Male	\N	9452372802	student245@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9732398789	9476964088	\N	\N	245	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
250	ENR246	ADM246	Student 246	Sai Teja	\N	Rao	Male	\N	9648702195	student246@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9896142544	9945204528	\N	\N	246	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
251	ENR247	ADM247	Student 247	Harsha	\N	Rao	Male	\N	9819622144	student247@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9881755843	9989937636	\N	\N	247	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
252	ENR248	ADM248	Student 248	Praneeth	\N	Rao	Male	\N	9853581518	student248@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9297625320	9295092209	\N	\N	248	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
253	ENR249	ADM249	Student 249	Praneeth	\N	Kumar	Female	\N	9989709569	student249@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9463808858	9886480203	\N	\N	249	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
254	ENR250	ADM250	Student 250	Lokesh	\N	Rao	Female	\N	9890612940	student250@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9677754325	9803289442	\N	\N	250	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
255	ENR251	ADM251	Student 251	Sravani	\N	Rao	Female	\N	9255526977	student251@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9737052334	9368000945	\N	\N	251	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
256	ENR252	ADM252	Student 252	Sindhu	\N	Varma	Male	\N	9683852508	student252@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9184773025	9368399930	\N	\N	252	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
257	ENR253	ADM253	Student 253	Navya	\N	Kumar	Male	\N	9285610813	student253@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9266759153	9729031014	\N	\N	253	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
258	ENR254	ADM254	Student 254	Manideep	\N	Rao	Male	\N	9193853538	student254@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9373750630	9393762806	\N	\N	254	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
259	ENR255	ADM255	Student 255	Sindhu	\N	Naidu	Female	\N	9105385395	student255@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9234393520	9717170295	\N	\N	255	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
260	ENR256	ADM256	Student 256	Sravani	\N	Naidu	Male	\N	9509882407	student256@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9581178691	9535301012	\N	\N	256	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
261	ENR257	ADM257	Student 257	Praneeth	\N	Varma	Male	\N	9945120832	student257@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9733777883	9805408666	\N	\N	257	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
262	ENR258	ADM258	Student 258	Harsha	\N	Rao	Female	\N	9500660751	student258@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9434160932	9263331323	\N	\N	258	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
263	ENR259	ADM259	Student 259	Sravani	\N	Kumar	Female	\N	9640995952	student259@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9136515751	9834130104	\N	\N	259	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
264	ENR260	ADM260	Student 260	Harsha	\N	Naidu	Female	\N	9980805799	student260@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9642509274	9342348860	\N	\N	260	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
265	ENR261	ADM261	Student 261	Sai Kiran	\N	Kumar	Female	\N	9351536999	student261@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9982739417	9193400408	\N	\N	261	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
266	ENR262	ADM262	Student 262	Navya	\N	Kumar	Male	\N	9274235943	student262@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9461138326	9184743728	\N	\N	262	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
267	ENR263	ADM263	Student 263	Deepika	\N	Rao	Female	\N	9531898940	student263@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9390968708	9767833089	\N	\N	263	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
268	ENR264	ADM264	Student 264	Keerthana	\N	Kumar	Female	\N	9125295692	student264@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9239774324	9744421203	\N	\N	264	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
269	ENR265	ADM265	Student 265	Praneeth	\N	Kumar	Female	\N	9945931267	student265@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9645086380	9223699455	\N	\N	265	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
270	ENR266	ADM266	Student 266	Harsha	\N	Kumar	Male	\N	9211444876	student266@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9751212506	9120970615	\N	\N	266	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
271	ENR267	ADM267	Student 267	Harsha	\N	Rao	Female	\N	9383802013	student267@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9692413397	9402187841	\N	\N	267	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
272	ENR268	ADM268	Student 268	Sravani	\N	Murthy	Male	\N	9212174349	student268@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9699791185	9825047433	\N	\N	268	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
273	ENR269	ADM269	Student 269	Deepika	\N	Reddy	Male	\N	9173396832	student269@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9323613272	9689906531	\N	\N	269	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
274	ENR270	ADM270	Student 270	Navya	\N	Rao	Male	\N	9249787883	student270@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9150331151	9492725501	\N	\N	270	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
275	ENR271	ADM271	Student 271	Bhavya	\N	Reddy	Male	\N	9894197154	student271@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9260047637	9602400166	\N	\N	271	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
276	ENR272	ADM272	Student 272	Sindhu	\N	Rao	Male	\N	9642825330	student272@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9441480190	9488092967	\N	\N	272	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
277	ENR273	ADM273	Student 273	Praneeth	\N	Rao	Male	\N	9891718210	student273@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9699400689	9830146106	\N	\N	273	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
278	ENR274	ADM274	Student 274	Sai Kiran	\N	Varma	Male	\N	9921985283	student274@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9489562775	9203847952	\N	\N	274	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
279	ENR275	ADM275	Student 275	Bhavya	\N	Naidu	Male	\N	9740728209	student275@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9234160708	9712629283	\N	\N	275	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
280	ENR276	ADM276	Student 276	Manideep	\N	Rao	Female	\N	9333150298	student276@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9444488013	9466814811	\N	\N	276	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
281	ENR277	ADM277	Student 277	Lokesh	\N	Reddy	Male	\N	9580295858	student277@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9745985382	9705799573	\N	\N	277	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
282	ENR278	ADM278	Student 278	Praneeth	\N	Naidu	Female	\N	9109428647	student278@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9680751046	9711452150	\N	\N	278	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
283	ENR279	ADM279	Student 279	Navya	\N	Naidu	Male	\N	9694769187	student279@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9664826368	9903227172	\N	\N	279	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
284	ENR280	ADM280	Student 280	Bhavya	\N	Murthy	Male	\N	9411004809	student280@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9711520903	9255196878	\N	\N	280	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
285	ENR281	ADM281	Student 281	Navya	\N	Rao	Female	\N	9493570145	student281@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9736323525	9193414437	\N	\N	281	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
286	ENR282	ADM282	Student 282	Deepika	\N	Kumar	Male	\N	9964174610	student282@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9173451002	9126761850	\N	\N	282	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
287	ENR283	ADM283	Student 283	Manideep	\N	Kumar	Male	\N	9491099744	student283@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9741772632	9638073625	\N	\N	283	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
288	ENR284	ADM284	Student 284	Sravani	\N	Rao	Male	\N	9813608571	student284@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9438601895	9556984144	\N	\N	284	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
289	ENR285	ADM285	Student 285	Harsha	\N	Reddy	Male	\N	9934101430	student285@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9859289086	9599294543	\N	\N	285	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
290	ENR286	ADM286	Student 286	Sindhu	\N	Naidu	Female	\N	9586673572	student286@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9211400325	9953600518	\N	\N	286	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
291	ENR287	ADM287	Student 287	Lokesh	\N	Rao	Female	\N	9840780458	student287@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9256707149	9587512869	\N	\N	287	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
292	ENR288	ADM288	Student 288	Manideep	\N	Reddy	Male	\N	9610350069	student288@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9781907090	9315958404	\N	\N	288	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
293	ENR289	ADM289	Student 289	Bhavya	\N	Reddy	Male	\N	9543112932	student289@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9907508269	9901123682	\N	\N	289	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
294	ENR290	ADM290	Student 290	Keerthana	\N	Murthy	Female	\N	9957917063	student290@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9577014228	9188766250	\N	\N	290	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
295	ENR291	ADM291	Student 291	Lokesh	\N	Naidu	Female	\N	9634638337	student291@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9558657320	9207653476	\N	\N	291	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
296	ENR292	ADM292	Student 292	Harsha	\N	Murthy	Female	\N	9999052358	student292@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9380320397	9364830458	\N	\N	292	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
297	ENR293	ADM293	Student 293	Manideep	\N	Rao	Male	\N	9848979507	student293@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9614016689	9845279521	\N	\N	293	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
298	ENR294	ADM294	Student 294	Manideep	\N	Reddy	Female	\N	9771991161	student294@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9663768855	9487804783	\N	\N	294	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
299	ENR295	ADM295	Student 295	Bhavya	\N	Murthy	Male	\N	9660565953	student295@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9649687199	9592109925	\N	\N	295	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
300	ENR296	ADM296	Student 296	Sai Kiran	\N	Murthy	Male	\N	9677843963	student296@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9420853178	9879310102	\N	\N	296	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
301	ENR297	ADM297	Student 297	Bhavya	\N	Varma	Female	\N	9421595077	student297@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9755382306	9797715811	\N	\N	297	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
302	ENR298	ADM298	Student 298	Sai Teja	\N	Kumar	Male	\N	9216138474	student298@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9693327206	9626230939	\N	\N	298	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
303	ENR299	ADM299	Student 299	Bhavya	\N	Reddy	Male	\N	9991649413	student299@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9745562615	9402108995	\N	\N	299	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
304	ENR300	ADM300	Student 300	Navya	\N	Varma	Male	\N	9919364622	student300@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9943539951	9684414139	\N	\N	300	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
305	ENR301	ADM301	Student 301	Lokesh	\N	Kumar	Female	\N	9740784263	student301@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9962354725	9204866574	\N	\N	301	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
306	ENR302	ADM302	Student 302	Sindhu	\N	Naidu	Male	\N	9831683655	student302@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9613614479	9696953934	\N	\N	302	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
307	ENR303	ADM303	Student 303	Bhavya	\N	Murthy	Male	\N	9632706220	student303@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9166098526	9543688263	\N	\N	303	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
308	ENR304	ADM304	Student 304	Sai Teja	\N	Reddy	Female	\N	9409408537	student304@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9334670391	9476343855	\N	\N	304	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
309	ENR305	ADM305	Student 305	Praneeth	\N	Varma	Male	\N	9678035027	student305@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9340889163	9970805631	\N	\N	305	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
310	ENR306	ADM306	Student 306	Sindhu	\N	Rao	Male	\N	9550851686	student306@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9951899403	9337281587	\N	\N	306	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
311	ENR307	ADM307	Student 307	Harsha	\N	Murthy	Male	\N	9682830362	student307@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9858878585	9335008736	\N	\N	307	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
312	ENR308	ADM308	Student 308	Manideep	\N	Rao	Female	\N	9280260224	student308@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9615417004	9884420872	\N	\N	308	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
313	ENR309	ADM309	Student 309	Manideep	\N	Varma	Male	\N	9912836440	student309@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9341804119	9161252114	\N	\N	309	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
314	ENR310	ADM310	Student 310	Deepika	\N	Varma	Male	\N	9475993618	student310@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9384209798	9597121373	\N	\N	310	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
315	ENR311	ADM311	Student 311	Deepika	\N	Murthy	Female	\N	9601374771	student311@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9186575323	9250037446	\N	\N	311	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
316	ENR312	ADM312	Student 312	Sravani	\N	Murthy	Male	\N	9298467445	student312@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9364789918	9731895877	\N	\N	312	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
317	ENR313	ADM313	Student 313	Keerthana	\N	Kumar	Male	\N	9286721631	student313@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9912879258	9315145227	\N	\N	313	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
318	ENR314	ADM314	Student 314	Keerthana	\N	Varma	Male	\N	9986045710	student314@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9944247597	9816645866	\N	\N	314	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
319	ENR315	ADM315	Student 315	Sravani	\N	Kumar	Male	\N	9671478664	student315@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9160731278	9894070748	\N	\N	315	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
320	ENR316	ADM316	Student 316	Praneeth	\N	Kumar	Female	\N	9412151429	student316@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9121756783	9313753667	\N	\N	316	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
321	ENR317	ADM317	Student 317	Sindhu	\N	Varma	Male	\N	9375418837	student317@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9945694831	9242994868	\N	\N	317	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
322	ENR318	ADM318	Student 318	Navya	\N	Reddy	Female	\N	9289034165	student318@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9693942772	9845925567	\N	\N	318	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
323	ENR319	ADM319	Student 319	Navya	\N	Varma	Female	\N	9555762866	student319@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9370567048	9665002290	\N	\N	319	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
324	ENR320	ADM320	Student 320	Manideep	\N	Murthy	Female	\N	9590005410	student320@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9568105088	9592020918	\N	\N	320	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
325	ENR321	ADM321	Student 321	Navya	\N	Kumar	Male	\N	9444299819	student321@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9705414335	9918775501	\N	\N	321	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
326	ENR322	ADM322	Student 322	Navya	\N	Murthy	Male	\N	9589285546	student322@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9591163274	9734264927	\N	\N	322	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
327	ENR323	ADM323	Student 323	Bhavya	\N	Naidu	Female	\N	9178701481	student323@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9572552738	9514649421	\N	\N	323	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
328	ENR324	ADM324	Student 324	Sai Teja	\N	Naidu	Female	\N	9236920732	student324@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9409987828	9390876296	\N	\N	324	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
329	ENR325	ADM325	Student 325	Bhavya	\N	Murthy	Male	\N	9444380918	student325@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9705714552	9276350884	\N	\N	325	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
330	ENR326	ADM326	Student 326	Keerthana	\N	Kumar	Male	\N	9511726364	student326@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9475051782	9444291533	\N	\N	326	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
331	ENR327	ADM327	Student 327	Navya	\N	Reddy	Female	\N	9901744633	student327@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9843579573	9139526262	\N	\N	327	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
332	ENR328	ADM328	Student 328	Sindhu	\N	Rao	Male	\N	9340504982	student328@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9462905139	9370730585	\N	\N	328	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
333	ENR329	ADM329	Student 329	Sravani	\N	Naidu	Male	\N	9157779144	student329@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9632090020	9707984367	\N	\N	329	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
334	ENR330	ADM330	Student 330	Manideep	\N	Reddy	Female	\N	9786287267	student330@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9202297300	9363781261	\N	\N	330	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
335	ENR331	ADM331	Student 331	Navya	\N	Rao	Female	\N	9180037283	student331@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9413029647	9601313112	\N	\N	331	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
336	ENR332	ADM332	Student 332	Keerthana	\N	Rao	Female	\N	9644226238	student332@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9382743858	9677658890	\N	\N	332	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
337	ENR333	ADM333	Student 333	Navya	\N	Naidu	Female	\N	9565012435	student333@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9789992350	9280985968	\N	\N	333	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
338	ENR334	ADM334	Student 334	Bhavya	\N	Murthy	Male	\N	9798088644	student334@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9557909079	9252121516	\N	\N	334	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
339	ENR335	ADM335	Student 335	Sai Kiran	\N	Naidu	Male	\N	9491626729	student335@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9941011015	9931652275	\N	\N	335	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
340	ENR336	ADM336	Student 336	Navya	\N	Varma	Female	\N	9830590227	student336@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9293626553	9262066755	\N	\N	336	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
341	ENR337	ADM337	Student 337	Manideep	\N	Murthy	Male	\N	9728900412	student337@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9971159628	9945845481	\N	\N	337	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
342	ENR338	ADM338	Student 338	Sai Teja	\N	Murthy	Male	\N	9952914320	student338@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9676971393	9587026949	\N	\N	338	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
343	ENR339	ADM339	Student 339	Sai Teja	\N	Rao	Male	\N	9395376553	student339@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9775672626	9223485780	\N	\N	339	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
344	ENR340	ADM340	Student 340	Navya	\N	Naidu	Female	\N	9913326695	student340@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9255635626	9182010780	\N	\N	340	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
345	ENR341	ADM341	Student 341	Sravani	\N	Kumar	Male	\N	9143214498	student341@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9572472148	9779051067	\N	\N	341	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
346	ENR342	ADM342	Student 342	Sindhu	\N	Naidu	Female	\N	9261506616	student342@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9134314510	9599875021	\N	\N	342	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
347	ENR343	ADM343	Student 343	Navya	\N	Rao	Female	\N	9166495813	student343@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9576119540	9816934132	\N	\N	343	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
348	ENR344	ADM344	Student 344	Praneeth	\N	Reddy	Male	\N	9169506801	student344@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9162455911	9861820678	\N	\N	344	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
349	ENR345	ADM345	Student 345	Harsha	\N	Reddy	Female	\N	9702562973	student345@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9433306094	9541204721	\N	\N	345	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
350	ENR346	ADM346	Student 346	Sai Teja	\N	Reddy	Male	\N	9265212012	student346@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9751423739	9292228826	\N	\N	346	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
351	ENR347	ADM347	Student 347	Lokesh	\N	Kumar	Male	\N	9260408197	student347@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9299981229	9502500777	\N	\N	347	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
352	ENR348	ADM348	Student 348	Sai Teja	\N	Reddy	Male	\N	9650433189	student348@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9658561062	9480124932	\N	\N	348	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
353	ENR349	ADM349	Student 349	Manideep	\N	Reddy	Female	\N	9396600603	student349@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9210123314	9183239640	\N	\N	349	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
354	ENR350	ADM350	Student 350	Praneeth	\N	Kumar	Female	\N	9268451655	student350@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9278903616	9503314634	\N	\N	350	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
355	ENR351	ADM351	Student 351	Navya	\N	Murthy	Male	\N	9622291700	student351@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9791181949	9306916857	\N	\N	351	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
356	ENR352	ADM352	Student 352	Praneeth	\N	Murthy	Female	\N	9672353849	student352@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9917805854	9594799794	\N	\N	352	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
357	ENR353	ADM353	Student 353	Navya	\N	Reddy	Female	\N	9598635707	student353@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9218390118	9827087185	\N	\N	353	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
358	ENR354	ADM354	Student 354	Praneeth	\N	Murthy	Male	\N	9599823245	student354@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9664680833	9962224510	\N	\N	354	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
359	ENR355	ADM355	Student 355	Manideep	\N	Rao	Male	\N	9300194221	student355@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9173308861	9442427293	\N	\N	355	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
360	ENR356	ADM356	Student 356	Bhavya	\N	Rao	Female	\N	9684758665	student356@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9437143653	9202227610	\N	\N	356	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
361	ENR357	ADM357	Student 357	Navya	\N	Rao	Male	\N	9843544538	student357@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9698169193	9514344447	\N	\N	357	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
362	ENR358	ADM358	Student 358	Sai Teja	\N	Murthy	Male	\N	9218435075	student358@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9878816473	9691479977	\N	\N	358	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
363	ENR359	ADM359	Student 359	Deepika	\N	Naidu	Female	\N	9704788499	student359@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9294986362	9228004762	\N	\N	359	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
364	ENR360	ADM360	Student 360	Praneeth	\N	Kumar	Female	\N	9368944375	student360@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9894626745	9922552225	\N	\N	360	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
365	ENR361	ADM361	Student 361	Sindhu	\N	Reddy	Female	\N	9247522831	student361@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9392417701	9956206353	\N	\N	361	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
366	ENR362	ADM362	Student 362	Keerthana	\N	Reddy	Male	\N	9330064503	student362@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9306502424	9908417549	\N	\N	362	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
367	ENR363	ADM363	Student 363	Praneeth	\N	Naidu	Male	\N	9850282323	student363@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9852132080	9265043885	\N	\N	363	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
368	ENR364	ADM364	Student 364	Sai Teja	\N	Varma	Male	\N	9146169021	student364@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9428519022	9182684668	\N	\N	364	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
369	ENR365	ADM365	Student 365	Sravani	\N	Reddy	Female	\N	9617957764	student365@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9558558180	9846420855	\N	\N	365	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
370	ENR366	ADM366	Student 366	Sravani	\N	Reddy	Female	\N	9105483182	student366@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9420546218	9370905568	\N	\N	366	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
371	ENR367	ADM367	Student 367	Navya	\N	Rao	Female	\N	9564786888	student367@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9129719645	9771843746	\N	\N	367	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
372	ENR368	ADM368	Student 368	Praneeth	\N	Kumar	Female	\N	9622742642	student368@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9739905552	9605930715	\N	\N	368	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
373	ENR369	ADM369	Student 369	Harsha	\N	Murthy	Female	\N	9148908892	student369@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9816428327	9855059424	\N	\N	369	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
374	ENR370	ADM370	Student 370	Harsha	\N	Kumar	Male	\N	9492958960	student370@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9473854607	9605648530	\N	\N	370	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
375	ENR371	ADM371	Student 371	Sai Teja	\N	Rao	Male	\N	9543462179	student371@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9550180239	9636821096	\N	\N	371	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
376	ENR372	ADM372	Student 372	Bhavya	\N	Naidu	Male	\N	9582359830	student372@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9571466747	9544694595	\N	\N	372	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
377	ENR373	ADM373	Student 373	Harsha	\N	Murthy	Female	\N	9307001626	student373@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9176578782	9164921947	\N	\N	373	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
378	ENR374	ADM374	Student 374	Deepika	\N	Rao	Male	\N	9763925273	student374@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9881552764	9224660002	\N	\N	374	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
379	ENR375	ADM375	Student 375	Deepika	\N	Murthy	Male	\N	9478416603	student375@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9817354964	9406417937	\N	\N	375	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
380	ENR376	ADM376	Student 376	Lokesh	\N	Rao	Female	\N	9820103979	student376@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9668042894	9390337919	\N	\N	376	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
381	ENR377	ADM377	Student 377	Harsha	\N	Murthy	Female	\N	9712476938	student377@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9211740438	9944587125	\N	\N	377	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
382	ENR378	ADM378	Student 378	Praneeth	\N	Reddy	Female	\N	9536794301	student378@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9897410017	9375680243	\N	\N	378	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
383	ENR379	ADM379	Student 379	Navya	\N	Rao	Female	\N	9921969606	student379@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9559608491	9524886147	\N	\N	379	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
384	ENR380	ADM380	Student 380	Sai Kiran	\N	Reddy	Female	\N	9546797777	student380@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9314720654	9676981613	\N	\N	380	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
385	ENR381	ADM381	Student 381	Keerthana	\N	Varma	Female	\N	9747628735	student381@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9113988119	9104231616	\N	\N	381	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
386	ENR382	ADM382	Student 382	Sravani	\N	Reddy	Female	\N	9685366020	student382@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9855864538	9721036449	\N	\N	382	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
387	ENR383	ADM383	Student 383	Sai Teja	\N	Kumar	Female	\N	9104403776	student383@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9831035725	9864013846	\N	\N	383	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
388	ENR384	ADM384	Student 384	Sai Teja	\N	Kumar	Female	\N	9823133574	student384@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9373325659	9850773509	\N	\N	384	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
389	ENR385	ADM385	Student 385	Bhavya	\N	Naidu	Female	\N	9813309715	student385@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9428950511	9878708900	\N	\N	385	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
390	ENR386	ADM386	Student 386	Sai Teja	\N	Rao	Female	\N	9439960119	student386@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9331532078	9725479908	\N	\N	386	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
391	ENR387	ADM387	Student 387	Deepika	\N	Naidu	Female	\N	9582551701	student387@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9489298866	9819482307	\N	\N	387	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
392	ENR388	ADM388	Student 388	Keerthana	\N	Varma	Female	\N	9396942512	student388@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9158583250	9574462405	\N	\N	388	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
393	ENR389	ADM389	Student 389	Sai Teja	\N	Varma	Male	\N	9690495186	student389@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9608889926	9994459888	\N	\N	389	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
394	ENR390	ADM390	Student 390	Keerthana	\N	Murthy	Male	\N	9713575988	student390@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9311676247	9542955992	\N	\N	390	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
395	ENR391	ADM391	Student 391	Sravani	\N	Rao	Female	\N	9538247400	student391@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9227916174	9591025325	\N	\N	391	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
396	ENR392	ADM392	Student 392	Manideep	\N	Reddy	Male	\N	9514211078	student392@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9133352309	9410235173	\N	\N	392	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
397	ENR393	ADM393	Student 393	Praneeth	\N	Varma	Male	\N	9111904915	student393@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9262104125	9516819299	\N	\N	393	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
398	ENR394	ADM394	Student 394	Praneeth	\N	Naidu	Male	\N	9929768962	student394@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9222729669	9809703903	\N	\N	394	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
399	ENR395	ADM395	Student 395	Deepika	\N	Rao	Female	\N	9570226848	student395@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9351649053	9241570312	\N	\N	395	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
400	ENR396	ADM396	Student 396	Bhavya	\N	Naidu	Female	\N	9748702982	student396@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9415036092	9126665217	\N	\N	396	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
401	ENR397	ADM397	Student 397	Praneeth	\N	Rao	Male	\N	9808969633	student397@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9330072760	9866562241	\N	\N	397	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
402	ENR398	ADM398	Student 398	Sai Kiran	\N	Naidu	Female	\N	9671487113	student398@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9668676646	9176337661	\N	\N	398	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
403	ENR399	ADM399	Student 399	Deepika	\N	Rao	Female	\N	9774967239	student399@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9726469205	9878988256	\N	\N	399	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
404	ENR400	ADM400	Student 400	Sravani	\N	Kumar	Male	\N	9190787709	student400@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9279472633	9969359778	\N	\N	400	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
405	ENR401	ADM401	Student 401	Manideep	\N	Murthy	Male	\N	9746455886	student401@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9302214610	9554725978	\N	\N	401	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
406	ENR402	ADM402	Student 402	Keerthana	\N	Reddy	Male	\N	9924403053	student402@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9570989570	9372060974	\N	\N	402	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
407	ENR403	ADM403	Student 403	Lokesh	\N	Naidu	Male	\N	9735122527	student403@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9912348341	9471005697	\N	\N	403	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
408	ENR404	ADM404	Student 404	Sravani	\N	Varma	Male	\N	9415450822	student404@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9601360703	9923301298	\N	\N	404	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
409	ENR405	ADM405	Student 405	Sravani	\N	Varma	Female	\N	9771209424	student405@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9102630793	9462456001	\N	\N	405	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
410	ENR406	ADM406	Student 406	Deepika	\N	Reddy	Female	\N	9706851728	student406@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9986896307	9981063311	\N	\N	406	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
411	ENR407	ADM407	Student 407	Harsha	\N	Naidu	Female	\N	9582983221	student407@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9438323747	9967788388	\N	\N	407	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
412	ENR408	ADM408	Student 408	Praneeth	\N	Rao	Female	\N	9998354583	student408@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9853604641	9349148056	\N	\N	408	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
413	ENR409	ADM409	Student 409	Deepika	\N	Murthy	Male	\N	9899615959	student409@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9520096470	9395835571	\N	\N	409	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
414	ENR410	ADM410	Student 410	Sai Teja	\N	Murthy	Female	\N	9248077922	student410@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9936970183	9762576541	\N	\N	410	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
415	ENR411	ADM411	Student 411	Lokesh	\N	Varma	Female	\N	9406744187	student411@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9842133062	9730945001	\N	\N	411	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
416	ENR412	ADM412	Student 412	Deepika	\N	Rao	Male	\N	9336075890	student412@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9195398898	9733567112	\N	\N	412	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
417	ENR413	ADM413	Student 413	Lokesh	\N	Naidu	Female	\N	9400835292	student413@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9342742565	9622716905	\N	\N	413	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
418	ENR414	ADM414	Student 414	Sai Teja	\N	Murthy	Female	\N	9733057293	student414@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9712294425	9848805967	\N	\N	414	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
419	ENR415	ADM415	Student 415	Manideep	\N	Reddy	Male	\N	9110428740	student415@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9609992392	9570291139	\N	\N	415	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
420	ENR416	ADM416	Student 416	Keerthana	\N	Naidu	Female	\N	9607410275	student416@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9507458516	9265251430	\N	\N	416	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
421	ENR417	ADM417	Student 417	Praneeth	\N	Naidu	Male	\N	9325945383	student417@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9395014486	9348606591	\N	\N	417	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
422	ENR418	ADM418	Student 418	Navya	\N	Kumar	Male	\N	9315720784	student418@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9843000197	9449322582	\N	\N	418	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
423	ENR419	ADM419	Student 419	Sindhu	\N	Rao	Female	\N	9914097304	student419@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9296154146	9759759594	\N	\N	419	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
424	ENR420	ADM420	Student 420	Praneeth	\N	Murthy	Male	\N	9844883081	student420@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9473555876	9589824368	\N	\N	420	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
425	ENR421	ADM421	Student 421	Sai Teja	\N	Kumar	Female	\N	9557553753	student421@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9684815584	9566679993	\N	\N	421	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
426	ENR422	ADM422	Student 422	Navya	\N	Varma	Male	\N	9912953384	student422@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9580262555	9553780797	\N	\N	422	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
427	ENR423	ADM423	Student 423	Praneeth	\N	Reddy	Female	\N	9184892332	student423@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9635165510	9103153875	\N	\N	423	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
428	ENR424	ADM424	Student 424	Sai Teja	\N	Kumar	Male	\N	9647473000	student424@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9906095305	9249027547	\N	\N	424	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
429	ENR425	ADM425	Student 425	Keerthana	\N	Rao	Male	\N	9946389269	student425@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9210876056	9788672981	\N	\N	425	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
430	ENR426	ADM426	Student 426	Sai Kiran	\N	Reddy	Male	\N	9905134342	student426@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9855665735	9386765410	\N	\N	426	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
431	ENR427	ADM427	Student 427	Sravani	\N	Varma	Female	\N	9807325499	student427@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9697171608	9542240261	\N	\N	427	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
432	ENR428	ADM428	Student 428	Sai Kiran	\N	Rao	Male	\N	9767521728	student428@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9398331259	9830459520	\N	\N	428	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
433	ENR429	ADM429	Student 429	Manideep	\N	Kumar	Female	\N	9616319777	student429@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9611903723	9258333230	\N	\N	429	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
434	ENR430	ADM430	Student 430	Deepika	\N	Rao	Female	\N	9821173910	student430@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9956525588	9442160781	\N	\N	430	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
435	ENR431	ADM431	Student 431	Bhavya	\N	Kumar	Male	\N	9530968509	student431@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9434821021	9811736419	\N	\N	431	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
436	ENR432	ADM432	Student 432	Keerthana	\N	Kumar	Female	\N	9876511817	student432@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9939720668	9840407654	\N	\N	432	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
437	ENR433	ADM433	Student 433	Bhavya	\N	Reddy	Male	\N	9648903757	student433@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9498941396	9629663570	\N	\N	433	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
438	ENR434	ADM434	Student 434	Navya	\N	Varma	Female	\N	9156929059	student434@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9817817233	9672242030	\N	\N	434	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
439	ENR435	ADM435	Student 435	Bhavya	\N	Naidu	Female	\N	9556001827	student435@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9649836720	9141330768	\N	\N	435	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
440	ENR436	ADM436	Student 436	Bhavya	\N	Rao	Male	\N	9354082191	student436@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9624489834	9413179922	\N	\N	436	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
441	ENR437	ADM437	Student 437	Harsha	\N	Reddy	Female	\N	9523875427	student437@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9804667379	9935266084	\N	\N	437	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
442	ENR438	ADM438	Student 438	Praneeth	\N	Naidu	Female	\N	9764354304	student438@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9911271658	9358136852	\N	\N	438	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
443	ENR439	ADM439	Student 439	Sravani	\N	Varma	Male	\N	9912756344	student439@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9634153140	9878287899	\N	\N	439	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
444	ENR440	ADM440	Student 440	Deepika	\N	Reddy	Male	\N	9755639279	student440@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9189178199	9133281575	\N	\N	440	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
445	ENR441	ADM441	Student 441	Manideep	\N	Reddy	Male	\N	9654961231	student441@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9662287115	9775537196	\N	\N	441	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
446	ENR442	ADM442	Student 442	Navya	\N	Varma	Male	\N	9553727809	student442@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9873834374	9490219106	\N	\N	442	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
447	ENR443	ADM443	Student 443	Lokesh	\N	Varma	Male	\N	9854543003	student443@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9656294686	9410057372	\N	\N	443	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
448	ENR444	ADM444	Student 444	Sindhu	\N	Murthy	Male	\N	9293189262	student444@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9182049674	9287067996	\N	\N	444	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
449	ENR445	ADM445	Student 445	Sai Teja	\N	Reddy	Female	\N	9495568755	student445@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9785330675	9122205066	\N	\N	445	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
450	ENR446	ADM446	Student 446	Bhavya	\N	Kumar	Male	\N	9844353322	student446@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9385794299	9913001331	\N	\N	446	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
451	ENR447	ADM447	Student 447	Lokesh	\N	Reddy	Female	\N	9201553330	student447@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9579499009	9687524493	\N	\N	447	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
452	ENR448	ADM448	Student 448	Navya	\N	Kumar	Female	\N	9712942334	student448@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9442079284	9626751973	\N	\N	448	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
453	ENR449	ADM449	Student 449	Sravani	\N	Kumar	Male	\N	9231060302	student449@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9658600279	9394206502	\N	\N	449	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
454	ENR450	ADM450	Student 450	Lokesh	\N	Varma	Male	\N	9295710600	student450@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9471292312	9647783446	\N	\N	450	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
455	ENR451	ADM451	Student 451	Harsha	\N	Rao	Female	\N	9188095407	student451@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9420598134	9414290038	\N	\N	451	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
456	ENR452	ADM452	Student 452	Keerthana	\N	Rao	Male	\N	9367552840	student452@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9875142604	9535943593	\N	\N	452	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
457	ENR453	ADM453	Student 453	Bhavya	\N	Kumar	Female	\N	9569031069	student453@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9681218232	9227475005	\N	\N	453	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
458	ENR454	ADM454	Student 454	Harsha	\N	Reddy	Male	\N	9646457133	student454@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9730251138	9618323554	\N	\N	454	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
459	ENR455	ADM455	Student 455	Sai Kiran	\N	Reddy	Female	\N	9823879944	student455@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9522471496	9745068633	\N	\N	455	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
460	ENR456	ADM456	Student 456	Sai Kiran	\N	Rao	Female	\N	9280695720	student456@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9520744502	9845628055	\N	\N	456	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
461	ENR457	ADM457	Student 457	Sravani	\N	Reddy	Female	\N	9535351514	student457@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9394170480	9911722562	\N	\N	457	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
462	ENR458	ADM458	Student 458	Deepika	\N	Naidu	Female	\N	9936721531	student458@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9363545438	9103826154	\N	\N	458	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
463	ENR459	ADM459	Student 459	Sai Teja	\N	Rao	Male	\N	9928872649	student459@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9283714431	9135373172	\N	\N	459	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
464	ENR460	ADM460	Student 460	Keerthana	\N	Varma	Female	\N	9481034958	student460@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9311908384	9831903164	\N	\N	460	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
465	ENR461	ADM461	Student 461	Sravani	\N	Naidu	Female	\N	9200867846	student461@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9657256505	9614056700	\N	\N	461	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
466	ENR462	ADM462	Student 462	Manideep	\N	Rao	Female	\N	9663737803	student462@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9221112876	9447300640	\N	\N	462	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
467	ENR463	ADM463	Student 463	Praneeth	\N	Varma	Female	\N	9754994864	student463@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9990326047	9654351862	\N	\N	463	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
468	ENR464	ADM464	Student 464	Manideep	\N	Reddy	Male	\N	9829204335	student464@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9250444696	9245162544	\N	\N	464	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
469	ENR465	ADM465	Student 465	Praneeth	\N	Naidu	Male	\N	9279722221	student465@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9232142602	9352721192	\N	\N	465	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
470	ENR466	ADM466	Student 466	Bhavya	\N	Varma	Male	\N	9330671518	student466@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9791683392	9796072868	\N	\N	466	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
471	ENR467	ADM467	Student 467	Harsha	\N	Naidu	Male	\N	9954989560	student467@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9196199248	9297175888	\N	\N	467	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
472	ENR468	ADM468	Student 468	Harsha	\N	Varma	Female	\N	9734003930	student468@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9587145278	9556697404	\N	\N	468	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
473	ENR469	ADM469	Student 469	Navya	\N	Reddy	Female	\N	9591521882	student469@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9451707771	9236820414	\N	\N	469	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
474	ENR470	ADM470	Student 470	Lokesh	\N	Murthy	Male	\N	9512718417	student470@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9474754748	9194376387	\N	\N	470	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
475	ENR471	ADM471	Student 471	Manideep	\N	Rao	Male	\N	9196633951	student471@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9238825967	9962711054	\N	\N	471	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
476	ENR472	ADM472	Student 472	Sindhu	\N	Rao	Female	\N	9412812007	student472@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9650326131	9807213233	\N	\N	472	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
477	ENR473	ADM473	Student 473	Bhavya	\N	Reddy	Male	\N	9287796008	student473@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9216115590	9586507257	\N	\N	473	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
478	ENR474	ADM474	Student 474	Deepika	\N	Murthy	Female	\N	9742957787	student474@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9575648407	9292698534	\N	\N	474	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
479	ENR475	ADM475	Student 475	Sindhu	\N	Rao	Male	\N	9121922930	student475@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9368407509	9454385288	\N	\N	475	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
480	ENR476	ADM476	Student 476	Sai Teja	\N	Rao	Female	\N	9512074716	student476@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9434718101	9577784779	\N	\N	476	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
481	ENR477	ADM477	Student 477	Sai Kiran	\N	Naidu	Female	\N	9367476983	student477@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9938675757	9319568180	\N	\N	477	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
482	ENR478	ADM478	Student 478	Sai Kiran	\N	Naidu	Male	\N	9227345860	student478@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9472997092	9749629762	\N	\N	478	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
483	ENR479	ADM479	Student 479	Navya	\N	Naidu	Male	\N	9836094524	student479@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9710276190	9629296639	\N	\N	479	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
484	ENR480	ADM480	Student 480	Bhavya	\N	Rao	Male	\N	9913609497	student480@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9310372021	9299124997	\N	\N	480	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
485	ENR481	ADM481	Student 481	Sai Kiran	\N	Kumar	Female	\N	9259041584	student481@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9989688937	9645892318	\N	\N	481	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
486	ENR482	ADM482	Student 482	Sindhu	\N	Reddy	Male	\N	9476918602	student482@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9761052690	9596293745	\N	\N	482	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
487	ENR483	ADM483	Student 483	Navya	\N	Kumar	Female	\N	9939289169	student483@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9464363534	9542659760	\N	\N	483	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
488	ENR484	ADM484	Student 484	Harsha	\N	Reddy	Male	\N	9129670432	student484@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9919823310	9165457758	\N	\N	484	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
489	ENR485	ADM485	Student 485	Bhavya	\N	Naidu	Female	\N	9245675072	student485@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9229783974	9865351140	\N	\N	485	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
490	ENR486	ADM486	Student 486	Sindhu	\N	Murthy	Female	\N	9390687464	student486@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9790864352	9161316503	\N	\N	486	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
491	ENR487	ADM487	Student 487	Keerthana	\N	Varma	Male	\N	9406485562	student487@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9829791032	9226123795	\N	\N	487	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
492	ENR488	ADM488	Student 488	Deepika	\N	Kumar	Male	\N	9363723899	student488@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9619443943	9210437458	\N	\N	488	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
493	ENR489	ADM489	Student 489	Harsha	\N	Naidu	Male	\N	9810103077	student489@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9379686300	9101290957	\N	\N	489	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
494	ENR490	ADM490	Student 490	Keerthana	\N	Kumar	Male	\N	9123474301	student490@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9969984830	9413805662	\N	\N	490	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
495	ENR491	ADM491	Student 491	Manideep	\N	Varma	Female	\N	9837401167	student491@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9273034703	9493328040	\N	\N	491	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
496	ENR492	ADM492	Student 492	Keerthana	\N	Murthy	Male	\N	9248377996	student492@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9193570895	9279064207	\N	\N	492	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
497	ENR493	ADM493	Student 493	Sravani	\N	Naidu	Male	\N	9473461945	student493@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9803322092	9890376792	\N	\N	493	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
498	ENR494	ADM494	Student 494	Bhavya	\N	Reddy	Female	\N	9517933878	student494@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9895250461	9843421002	\N	\N	494	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
499	ENR495	ADM495	Student 495	Harsha	\N	Rao	Male	\N	9747838447	student495@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9829512553	9705578645	\N	\N	495	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
500	ENR496	ADM496	Student 496	Sai Kiran	\N	Rao	Female	\N	9575804531	student496@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9167917903	9829651441	\N	\N	496	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
501	ENR497	ADM497	Student 497	Manideep	\N	Kumar	Male	\N	9132674022	student497@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9114381759	9798849313	\N	\N	497	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
502	ENR498	ADM498	Student 498	Sindhu	\N	Varma	Male	\N	9652140706	student498@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9556196282	9168807439	\N	\N	498	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
503	ENR499	ADM499	Student 499	Sravani	\N	Murthy	Male	\N	9409735092	student499@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9785629089	9663306954	\N	\N	499	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
504	ENR500	ADM500	Student 500	Bhavya	\N	Naidu	Female	\N	9651447728	student500@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9498213896	9583075854	\N	\N	500	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
505	ENR501	ADM501	Student 501	Manideep	\N	Rao	Female	\N	9969702007	student501@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9151864459	9963934646	\N	\N	501	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
506	ENR502	ADM502	Student 502	Deepika	\N	Murthy	Male	\N	9286498051	student502@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9391494907	9230578195	\N	\N	502	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
507	ENR503	ADM503	Student 503	Sai Teja	\N	Reddy	Female	\N	9909491827	student503@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9771308426	9483021411	\N	\N	503	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
508	ENR504	ADM504	Student 504	Sai Kiran	\N	Kumar	Male	\N	9733770140	student504@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9595878490	9835903586	\N	\N	504	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
509	ENR505	ADM505	Student 505	Praneeth	\N	Naidu	Female	\N	9253823638	student505@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9975023990	9771883912	\N	\N	505	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
510	ENR506	ADM506	Student 506	Sindhu	\N	Naidu	Female	\N	9375319311	student506@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9307826855	9175487222	\N	\N	506	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
511	ENR507	ADM507	Student 507	Sravani	\N	Rao	Female	\N	9808133779	student507@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9593114339	9442574880	\N	\N	507	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
512	ENR508	ADM508	Student 508	Sravani	\N	Varma	Female	\N	9245082952	student508@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9619921132	9792234248	\N	\N	508	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
513	ENR509	ADM509	Student 509	Sai Teja	\N	Varma	Male	\N	9982911568	student509@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9280166046	9183385851	\N	\N	509	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
514	ENR510	ADM510	Student 510	Sai Teja	\N	Reddy	Female	\N	9359772178	student510@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9374684602	9638159333	\N	\N	510	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
515	ENR511	ADM511	Student 511	Sai Kiran	\N	Naidu	Male	\N	9195106765	student511@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9415175609	9922036537	\N	\N	511	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
516	ENR512	ADM512	Student 512	Bhavya	\N	Kumar	Female	\N	9551941856	student512@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9609565448	9107358527	\N	\N	512	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
517	ENR513	ADM513	Student 513	Praneeth	\N	Kumar	Female	\N	9643537388	student513@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9198994829	9702800304	\N	\N	513	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
518	ENR514	ADM514	Student 514	Lokesh	\N	Kumar	Male	\N	9954975980	student514@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9107652506	9431428135	\N	\N	514	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
519	ENR515	ADM515	Student 515	Lokesh	\N	Murthy	Male	\N	9370712063	student515@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9768913547	9665312994	\N	\N	515	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
520	ENR516	ADM516	Student 516	Praneeth	\N	Naidu	Male	\N	9606051953	student516@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9779932087	9190948530	\N	\N	516	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
521	ENR517	ADM517	Student 517	Keerthana	\N	Naidu	Female	\N	9845994528	student517@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9915993109	9563432182	\N	\N	517	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
522	ENR518	ADM518	Student 518	Praneeth	\N	Naidu	Female	\N	9433025290	student518@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9674245692	9175632530	\N	\N	518	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
523	ENR519	ADM519	Student 519	Navya	\N	Reddy	Female	\N	9478715060	student519@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9714990361	9798260445	\N	\N	519	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
524	ENR520	ADM520	Student 520	Praneeth	\N	Reddy	Male	\N	9989050909	student520@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9905184308	9596676232	\N	\N	520	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
525	ENR521	ADM521	Student 521	Sai Teja	\N	Kumar	Male	\N	9132796787	student521@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9363187546	9823149103	\N	\N	521	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
526	ENR522	ADM522	Student 522	Sravani	\N	Kumar	Male	\N	9977416416	student522@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9112967917	9343864422	\N	\N	522	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
527	ENR523	ADM523	Student 523	Deepika	\N	Kumar	Female	\N	9239675161	student523@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9451956978	9452199850	\N	\N	523	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
528	ENR524	ADM524	Student 524	Sindhu	\N	Naidu	Male	\N	9631476935	student524@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9240502413	9829404124	\N	\N	524	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
529	ENR525	ADM525	Student 525	Sai Teja	\N	Murthy	Female	\N	9194626302	student525@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9414684631	9893445102	\N	\N	525	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
530	ENR526	ADM526	Student 526	Deepika	\N	Rao	Male	\N	9375949923	student526@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9178485236	9734911972	\N	\N	526	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
531	ENR527	ADM527	Student 527	Praneeth	\N	Murthy	Female	\N	9311760971	student527@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9312734977	9316411275	\N	\N	527	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
532	ENR528	ADM528	Student 528	Sindhu	\N	Reddy	Male	\N	9463859361	student528@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9102438585	9503883502	\N	\N	528	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
533	ENR529	ADM529	Student 529	Lokesh	\N	Murthy	Male	\N	9937937833	student529@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9771555061	9686795768	\N	\N	529	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
534	ENR530	ADM530	Student 530	Sravani	\N	Kumar	Female	\N	9543579234	student530@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9695277207	9613331397	\N	\N	530	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
535	ENR531	ADM531	Student 531	Sindhu	\N	Kumar	Male	\N	9496113148	student531@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9782004506	9349441322	\N	\N	531	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
536	ENR532	ADM532	Student 532	Harsha	\N	Murthy	Female	\N	9426506580	student532@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9993888468	9294423733	\N	\N	532	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
537	ENR533	ADM533	Student 533	Sravani	\N	Naidu	Male	\N	9530305145	student533@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9473485075	9520873981	\N	\N	533	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
538	ENR534	ADM534	Student 534	Manideep	\N	Rao	Male	\N	9145839750	student534@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9421883093	9524564234	\N	\N	534	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
539	ENR535	ADM535	Student 535	Manideep	\N	Rao	Female	\N	9613328904	student535@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9685781121	9279716528	\N	\N	535	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
540	ENR536	ADM536	Student 536	Lokesh	\N	Varma	Female	\N	9448631263	student536@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9621200159	9172572330	\N	\N	536	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
541	ENR537	ADM537	Student 537	Bhavya	\N	Murthy	Male	\N	9467121626	student537@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9142713436	9613647429	\N	\N	537	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
542	ENR538	ADM538	Student 538	Sai Teja	\N	Varma	Female	\N	9859176823	student538@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9221950827	9880712143	\N	\N	538	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
543	ENR539	ADM539	Student 539	Sindhu	\N	Rao	Male	\N	9457555921	student539@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9207474077	9536775243	\N	\N	539	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
544	ENR540	ADM540	Student 540	Lokesh	\N	Naidu	Female	\N	9951658542	student540@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9239373049	9463732565	\N	\N	540	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
545	ENR541	ADM541	Student 541	Harsha	\N	Naidu	Female	\N	9136837035	student541@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9507144639	9615441813	\N	\N	541	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
546	ENR542	ADM542	Student 542	Sravani	\N	Varma	Male	\N	9893150995	student542@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9370210605	9146759720	\N	\N	542	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
547	ENR543	ADM543	Student 543	Sai Teja	\N	Murthy	Male	\N	9752467994	student543@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9405506668	9454694931	\N	\N	543	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
548	ENR544	ADM544	Student 544	Sai Kiran	\N	Kumar	Female	\N	9769786610	student544@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9736931318	9343155480	\N	\N	544	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
549	ENR545	ADM545	Student 545	Harsha	\N	Reddy	Male	\N	9575611792	student545@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9583161263	9741939653	\N	\N	545	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
550	ENR546	ADM546	Student 546	Deepika	\N	Kumar	Female	\N	9546989933	student546@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9747178941	9668977007	\N	\N	546	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
551	ENR547	ADM547	Student 547	Manideep	\N	Reddy	Male	\N	9322310762	student547@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9336992910	9307445431	\N	\N	547	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
552	ENR548	ADM548	Student 548	Praneeth	\N	Varma	Female	\N	9783084289	student548@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9225193714	9978365035	\N	\N	548	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
553	ENR549	ADM549	Student 549	Bhavya	\N	Varma	Female	\N	9432425058	student549@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9847420443	9233320501	\N	\N	549	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
554	ENR550	ADM550	Student 550	Harsha	\N	Murthy	Female	\N	9125418166	student550@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9760250404	9824655630	\N	\N	550	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
555	ENR551	ADM551	Student 551	Bhavya	\N	Reddy	Female	\N	9466378247	student551@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9821938734	9783659224	\N	\N	551	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
556	ENR552	ADM552	Student 552	Keerthana	\N	Reddy	Male	\N	9308070418	student552@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9791205773	9946521187	\N	\N	552	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
557	ENR553	ADM553	Student 553	Harsha	\N	Varma	Male	\N	9928817586	student553@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9294732913	9267630956	\N	\N	553	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
558	ENR554	ADM554	Student 554	Sravani	\N	Kumar	Female	\N	9664304327	student554@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9373150454	9407194638	\N	\N	554	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
559	ENR555	ADM555	Student 555	Keerthana	\N	Murthy	Female	\N	9628036965	student555@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9488096561	9875122547	\N	\N	555	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
560	ENR556	ADM556	Student 556	Manideep	\N	Kumar	Male	\N	9400561910	student556@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9693509863	9625990910	\N	\N	556	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
561	ENR557	ADM557	Student 557	Lokesh	\N	Varma	Female	\N	9767585345	student557@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9538093386	9855266319	\N	\N	557	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
562	ENR558	ADM558	Student 558	Sai Kiran	\N	Varma	Female	\N	9433916839	student558@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9689739713	9367061706	\N	\N	558	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
563	ENR559	ADM559	Student 559	Praneeth	\N	Reddy	Female	\N	9954726659	student559@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9280891463	9459282680	\N	\N	559	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
564	ENR560	ADM560	Student 560	Keerthana	\N	Murthy	Male	\N	9706817231	student560@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9250233669	9830673834	\N	\N	560	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
565	ENR561	ADM561	Student 561	Bhavya	\N	Reddy	Female	\N	9693854470	student561@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9844572750	9799958990	\N	\N	561	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
566	ENR562	ADM562	Student 562	Sindhu	\N	Murthy	Female	\N	9311697046	student562@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9149098611	9895689647	\N	\N	562	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
567	ENR563	ADM563	Student 563	Harsha	\N	Reddy	Male	\N	9361383231	student563@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9238596980	9487600820	\N	\N	563	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
568	ENR564	ADM564	Student 564	Navya	\N	Reddy	Female	\N	9736859079	student564@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9226315156	9508230363	\N	\N	564	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
569	ENR565	ADM565	Student 565	Lokesh	\N	Reddy	Male	\N	9338430649	student565@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9704038482	9473696168	\N	\N	565	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
570	ENR566	ADM566	Student 566	Sai Kiran	\N	Naidu	Male	\N	9818020068	student566@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9929742103	9712798701	\N	\N	566	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
571	ENR567	ADM567	Student 567	Harsha	\N	Murthy	Male	\N	9713844588	student567@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9700373184	9920980866	\N	\N	567	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
572	ENR568	ADM568	Student 568	Lokesh	\N	Murthy	Male	\N	9157699529	student568@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9255968297	9607724136	\N	\N	568	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
573	ENR569	ADM569	Student 569	Harsha	\N	Reddy	Male	\N	9449069441	student569@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9453388739	9809595746	\N	\N	569	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
574	ENR570	ADM570	Student 570	Lokesh	\N	Naidu	Female	\N	9521046226	student570@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9909082435	9924256373	\N	\N	570	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
575	ENR571	ADM571	Student 571	Praneeth	\N	Reddy	Female	\N	9715807024	student571@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9375436138	9655948793	\N	\N	571	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
576	ENR572	ADM572	Student 572	Lokesh	\N	Varma	Female	\N	9813396374	student572@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9969714250	9586674923	\N	\N	572	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
577	ENR573	ADM573	Student 573	Sravani	\N	Kumar	Male	\N	9958515003	student573@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9934972750	9161142493	\N	\N	573	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
578	ENR574	ADM574	Student 574	Lokesh	\N	Naidu	Female	\N	9569179724	student574@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9363915115	9547990677	\N	\N	574	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
579	ENR575	ADM575	Student 575	Sai Teja	\N	Naidu	Male	\N	9923426092	student575@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9469617214	9131932356	\N	\N	575	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
580	ENR576	ADM576	Student 576	Deepika	\N	Reddy	Female	\N	9381702948	student576@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9854961761	9500069590	\N	\N	576	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
581	ENR577	ADM577	Student 577	Bhavya	\N	Kumar	Male	\N	9152685534	student577@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9910108531	9243604656	\N	\N	577	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
582	ENR578	ADM578	Student 578	Sindhu	\N	Reddy	Male	\N	9487840469	student578@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9398326969	9503268445	\N	\N	578	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
583	ENR579	ADM579	Student 579	Sravani	\N	Murthy	Female	\N	9831772394	student579@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9824385522	9875568499	\N	\N	579	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
584	ENR580	ADM580	Student 580	Bhavya	\N	Naidu	Male	\N	9604425204	student580@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9698491439	9920318595	\N	\N	580	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
585	ENR581	ADM581	Student 581	Bhavya	\N	Reddy	Female	\N	9616197327	student581@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9294153968	9277161948	\N	\N	581	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
586	ENR582	ADM582	Student 582	Deepika	\N	Kumar	Female	\N	9337357854	student582@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9769537314	9500922322	\N	\N	582	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
587	ENR583	ADM583	Student 583	Keerthana	\N	Murthy	Male	\N	9950951757	student583@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9546629637	9298009170	\N	\N	583	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
588	ENR584	ADM584	Student 584	Sindhu	\N	Varma	Female	\N	9139254804	student584@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9500972249	9801100963	\N	\N	584	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
589	ENR585	ADM585	Student 585	Keerthana	\N	Reddy	Female	\N	9426072207	student585@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9383604940	9575559830	\N	\N	585	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
590	ENR586	ADM586	Student 586	Sai Kiran	\N	Kumar	Male	\N	9497857293	student586@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9356877776	9549488389	\N	\N	586	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
591	ENR587	ADM587	Student 587	Sai Teja	\N	Murthy	Female	\N	9341161021	student587@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9352345936	9552876180	\N	\N	587	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
592	ENR588	ADM588	Student 588	Harsha	\N	Kumar	Female	\N	9330633705	student588@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9371457267	9280480461	\N	\N	588	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
593	ENR589	ADM589	Student 589	Keerthana	\N	Varma	Female	\N	9980414061	student589@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9626355633	9411074612	\N	\N	589	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
594	ENR590	ADM590	Student 590	Sai Kiran	\N	Rao	Female	\N	9833050579	student590@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9647967615	9235906783	\N	\N	590	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
595	ENR591	ADM591	Student 591	Sravani	\N	Kumar	Male	\N	9647208011	student591@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9828853867	9416873480	\N	\N	591	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
596	ENR592	ADM592	Student 592	Harsha	\N	Reddy	Male	\N	9434466995	student592@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9508247265	9532730564	\N	\N	592	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
597	ENR593	ADM593	Student 593	Praneeth	\N	Murthy	Male	\N	9500909080	student593@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9117097196	9830403382	\N	\N	593	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
598	ENR594	ADM594	Student 594	Bhavya	\N	Varma	Male	\N	9241819178	student594@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9769876593	9121332983	\N	\N	594	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
599	ENR595	ADM595	Student 595	Sai Teja	\N	Rao	Female	\N	9985214421	student595@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9142580448	9871242505	\N	\N	595	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
600	ENR596	ADM596	Student 596	Keerthana	\N	Rao	Female	\N	9901313382	student596@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9599441718	9973291094	\N	\N	596	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
601	ENR597	ADM597	Student 597	Sindhu	\N	Kumar	Male	\N	9908049957	student597@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9608603756	9312084694	\N	\N	597	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
602	ENR598	ADM598	Student 598	Lokesh	\N	Varma	Male	\N	9142576853	student598@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9931310686	9541576054	\N	\N	598	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
603	ENR599	ADM599	Student 599	Harsha	\N	Rao	Male	\N	9391463264	student599@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9772891716	9500177294	\N	\N	599	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
604	ENR600	ADM600	Student 600	Sravani	\N	Murthy	Male	\N	9406056777	student600@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9584418075	9589194851	\N	\N	600	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
605	ENR601	ADM601	Student 601	Navya	\N	Kumar	Female	\N	9626468199	student601@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9520178061	9387661378	\N	\N	601	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
606	ENR602	ADM602	Student 602	Manideep	\N	Rao	Female	\N	9473472514	student602@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9600241448	9282727546	\N	\N	602	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
607	ENR603	ADM603	Student 603	Sravani	\N	Naidu	Male	\N	9711183188	student603@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9246681973	9664877012	\N	\N	603	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
608	ENR604	ADM604	Student 604	Praneeth	\N	Varma	Female	\N	9696021212	student604@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9727804927	9120006870	\N	\N	604	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
609	ENR605	ADM605	Student 605	Praneeth	\N	Rao	Male	\N	9134069487	student605@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9185657828	9605790846	\N	\N	605	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
610	ENR606	ADM606	Student 606	Deepika	\N	Kumar	Male	\N	9448332727	student606@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9118637201	9505987139	\N	\N	606	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
611	ENR607	ADM607	Student 607	Sindhu	\N	Rao	Female	\N	9568654086	student607@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9383430748	9633491809	\N	\N	607	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
612	ENR608	ADM608	Student 608	Keerthana	\N	Naidu	Female	\N	9264921706	student608@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9613155463	9727873376	\N	\N	608	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
613	ENR609	ADM609	Student 609	Deepika	\N	Murthy	Female	\N	9620138731	student609@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9518463456	9453829677	\N	\N	609	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
614	ENR610	ADM610	Student 610	Deepika	\N	Naidu	Male	\N	9302086510	student610@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9633933089	9358962561	\N	\N	610	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
615	ENR611	ADM611	Student 611	Lokesh	\N	Rao	Male	\N	9951427722	student611@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9645578244	9841767862	\N	\N	611	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
616	ENR612	ADM612	Student 612	Sindhu	\N	Kumar	Female	\N	9506275950	student612@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9526410898	9279075692	\N	\N	612	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
617	ENR613	ADM613	Student 613	Sravani	\N	Kumar	Female	\N	9564422617	student613@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9451286926	9913129011	\N	\N	613	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
618	ENR614	ADM614	Student 614	Keerthana	\N	Kumar	Female	\N	9897635577	student614@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9302047740	9911267959	\N	\N	614	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
619	ENR615	ADM615	Student 615	Sindhu	\N	Murthy	Male	\N	9671269590	student615@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9465658998	9864409735	\N	\N	615	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
620	ENR616	ADM616	Student 616	Sai Teja	\N	Naidu	Male	\N	9379122906	student616@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9684394337	9271974537	\N	\N	616	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
621	ENR617	ADM617	Student 617	Sindhu	\N	Varma	Female	\N	9277105738	student617@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9631622321	9797320858	\N	\N	617	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
622	ENR618	ADM618	Student 618	Navya	\N	Murthy	Male	\N	9674165516	student618@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9961620861	9839301871	\N	\N	618	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
623	ENR619	ADM619	Student 619	Harsha	\N	Varma	Male	\N	9716360962	student619@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9621330443	9586438362	\N	\N	619	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
624	ENR620	ADM620	Student 620	Sindhu	\N	Varma	Female	\N	9244869997	student620@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9175602180	9305634088	\N	\N	620	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
625	ENR621	ADM621	Student 621	Deepika	\N	Murthy	Female	\N	9864941845	student621@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9921769433	9895736736	\N	\N	621	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
626	ENR622	ADM622	Student 622	Navya	\N	Kumar	Male	\N	9455784770	student622@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9673531899	9107122603	\N	\N	622	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
627	ENR623	ADM623	Student 623	Sindhu	\N	Naidu	Female	\N	9242180117	student623@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9229565616	9774695968	\N	\N	623	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
628	ENR624	ADM624	Student 624	Sai Kiran	\N	Reddy	Male	\N	9914451668	student624@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9454736953	9498457805	\N	\N	624	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
629	ENR625	ADM625	Student 625	Navya	\N	Naidu	Male	\N	9124288480	student625@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9635369063	9218454513	\N	\N	625	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
630	ENR626	ADM626	Student 626	Praneeth	\N	Rao	Female	\N	9514497503	student626@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9196565016	9856885316	\N	\N	626	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
631	ENR627	ADM627	Student 627	Lokesh	\N	Naidu	Male	\N	9399420908	student627@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9998050395	9660916469	\N	\N	627	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
632	ENR628	ADM628	Student 628	Sravani	\N	Rao	Female	\N	9624068521	student628@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9227471799	9960537386	\N	\N	628	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
633	ENR629	ADM629	Student 629	Praneeth	\N	Rao	Female	\N	9844438252	student629@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9134503960	9827745276	\N	\N	629	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
634	ENR630	ADM630	Student 630	Harsha	\N	Varma	Female	\N	9496028507	student630@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9892400239	9599824913	\N	\N	630	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
635	ENR631	ADM631	Student 631	Bhavya	\N	Kumar	Female	\N	9518276621	student631@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9760521419	9833651840	\N	\N	631	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
636	ENR632	ADM632	Student 632	Manideep	\N	Rao	Female	\N	9429404995	student632@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9244953523	9108932208	\N	\N	632	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
637	ENR633	ADM633	Student 633	Praneeth	\N	Kumar	Female	\N	9960255468	student633@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9908958761	9338844646	\N	\N	633	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
638	ENR634	ADM634	Student 634	Sravani	\N	Naidu	Male	\N	9317697762	student634@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9846569574	9473777847	\N	\N	634	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
639	ENR635	ADM635	Student 635	Sravani	\N	Rao	Male	\N	9840335531	student635@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9488739609	9620827938	\N	\N	635	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
640	ENR636	ADM636	Student 636	Sindhu	\N	Varma	Female	\N	9164543422	student636@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9452874957	9446873942	\N	\N	636	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
641	ENR637	ADM637	Student 637	Bhavya	\N	Murthy	Male	\N	9760663407	student637@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9364003909	9235342111	\N	\N	637	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
642	ENR638	ADM638	Student 638	Harsha	\N	Naidu	Female	\N	9519827536	student638@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9445447945	9181233481	\N	\N	638	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
643	ENR639	ADM639	Student 639	Praneeth	\N	Rao	Female	\N	9149101035	student639@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9802834333	9893194388	\N	\N	639	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
644	ENR640	ADM640	Student 640	Keerthana	\N	Naidu	Male	\N	9773886743	student640@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9470255437	9368825515	\N	\N	640	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
645	ENR641	ADM641	Student 641	Harsha	\N	Reddy	Male	\N	9963644778	student641@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9192779773	9695973773	\N	\N	641	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
646	ENR642	ADM642	Student 642	Harsha	\N	Naidu	Male	\N	9698177673	student642@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9452305880	9889370304	\N	\N	642	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
647	ENR643	ADM643	Student 643	Sai Teja	\N	Murthy	Female	\N	9152503323	student643@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9635406002	9613802626	\N	\N	643	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
648	ENR644	ADM644	Student 644	Sravani	\N	Naidu	Female	\N	9338566072	student644@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9527887312	9113832664	\N	\N	644	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
649	ENR645	ADM645	Student 645	Navya	\N	Kumar	Male	\N	9159100179	student645@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9563573760	9420265589	\N	\N	645	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
650	ENR646	ADM646	Student 646	Sindhu	\N	Murthy	Male	\N	9797626061	student646@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9182435618	9893971871	\N	\N	646	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
651	ENR647	ADM647	Student 647	Lokesh	\N	Varma	Female	\N	9599376549	student647@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9344216344	9733606674	\N	\N	647	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
652	ENR648	ADM648	Student 648	Praneeth	\N	Murthy	Female	\N	9609733961	student648@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9919024690	9468051015	\N	\N	648	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
653	ENR649	ADM649	Student 649	Praneeth	\N	Rao	Female	\N	9546308704	student649@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9907718980	9442361498	\N	\N	649	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
654	ENR650	ADM650	Student 650	Navya	\N	Rao	Female	\N	9279385599	student650@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9728467511	9587350936	\N	\N	650	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
655	ENR651	ADM651	Student 651	Keerthana	\N	Murthy	Male	\N	9412734819	student651@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9362788884	9941648854	\N	\N	651	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
656	ENR652	ADM652	Student 652	Sravani	\N	Kumar	Male	\N	9800010761	student652@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9781256811	9100663517	\N	\N	652	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
657	ENR653	ADM653	Student 653	Sai Kiran	\N	Naidu	Male	\N	9607092831	student653@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9866313189	9668536559	\N	\N	653	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
658	ENR654	ADM654	Student 654	Keerthana	\N	Reddy	Male	\N	9388809914	student654@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9200544319	9124175736	\N	\N	654	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
659	ENR655	ADM655	Student 655	Lokesh	\N	Naidu	Female	\N	9831156017	student655@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9819437265	9263116778	\N	\N	655	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
660	ENR656	ADM656	Student 656	Lokesh	\N	Kumar	Female	\N	9234799106	student656@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9806455384	9968798488	\N	\N	656	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
661	ENR657	ADM657	Student 657	Lokesh	\N	Rao	Male	\N	9136481507	student657@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9462424292	9290229093	\N	\N	657	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
662	ENR658	ADM658	Student 658	Bhavya	\N	Kumar	Male	\N	9303454452	student658@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9975205838	9902867307	\N	\N	658	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
663	ENR659	ADM659	Student 659	Praneeth	\N	Kumar	Male	\N	9220683527	student659@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9732700288	9323791685	\N	\N	659	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
664	ENR660	ADM660	Student 660	Bhavya	\N	Reddy	Male	\N	9230145640	student660@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9438125809	9584324228	\N	\N	660	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
665	ENR661	ADM661	Student 661	Deepika	\N	Varma	Male	\N	9722672884	student661@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9803397470	9191135128	\N	\N	661	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
666	ENR662	ADM662	Student 662	Praneeth	\N	Naidu	Male	\N	9705830645	student662@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9982809372	9799628161	\N	\N	662	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
667	ENR663	ADM663	Student 663	Sai Kiran	\N	Varma	Female	\N	9603172651	student663@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9383430552	9802457596	\N	\N	663	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
668	ENR664	ADM664	Student 664	Sai Kiran	\N	Murthy	Female	\N	9264636913	student664@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9781631372	9412028979	\N	\N	664	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
669	ENR665	ADM665	Student 665	Sindhu	\N	Rao	Female	\N	9412511494	student665@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9339576283	9675839369	\N	\N	665	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
670	ENR666	ADM666	Student 666	Navya	\N	Rao	Female	\N	9831223420	student666@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9259280449	9380295113	\N	\N	666	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
671	ENR667	ADM667	Student 667	Navya	\N	Varma	Male	\N	9139079013	student667@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9798698133	9907120467	\N	\N	667	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
672	ENR668	ADM668	Student 668	Sravani	\N	Naidu	Male	\N	9214660477	student668@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9292769480	9591041074	\N	\N	668	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
673	ENR669	ADM669	Student 669	Manideep	\N	Reddy	Male	\N	9806288318	student669@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9527579852	9580852847	\N	\N	669	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
674	ENR670	ADM670	Student 670	Deepika	\N	Varma	Male	\N	9878412671	student670@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9502300250	9948119735	\N	\N	670	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
675	ENR671	ADM671	Student 671	Sravani	\N	Naidu	Female	\N	9762461210	student671@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9175990610	9534634094	\N	\N	671	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
676	ENR672	ADM672	Student 672	Navya	\N	Rao	Male	\N	9300353380	student672@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9643436523	9556316092	\N	\N	672	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
677	ENR673	ADM673	Student 673	Navya	\N	Kumar	Male	\N	9755965037	student673@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9978517419	9874492537	\N	\N	673	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
678	ENR674	ADM674	Student 674	Sindhu	\N	Naidu	Male	\N	9853633360	student674@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9724694585	9609447010	\N	\N	674	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
679	ENR675	ADM675	Student 675	Sai Kiran	\N	Varma	Male	\N	9904869048	student675@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9877134497	9263472370	\N	\N	675	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
680	ENR676	ADM676	Student 676	Lokesh	\N	Kumar	Female	\N	9229546198	student676@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9571077800	9902969959	\N	\N	676	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
681	ENR677	ADM677	Student 677	Sindhu	\N	Varma	Female	\N	9519971051	student677@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9470333852	9574034955	\N	\N	677	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
682	ENR678	ADM678	Student 678	Lokesh	\N	Reddy	Female	\N	9565765467	student678@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9990240820	9623585678	\N	\N	678	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
683	ENR679	ADM679	Student 679	Deepika	\N	Reddy	Female	\N	9521487236	student679@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9839300151	9940702959	\N	\N	679	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
684	ENR680	ADM680	Student 680	Manideep	\N	Kumar	Female	\N	9157640745	student680@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9484187690	9969810020	\N	\N	680	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
685	ENR681	ADM681	Student 681	Sai Kiran	\N	Rao	Male	\N	9236817739	student681@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9552595418	9767076500	\N	\N	681	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
686	ENR682	ADM682	Student 682	Praneeth	\N	Varma	Female	\N	9740851047	student682@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9136813762	9742351657	\N	\N	682	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
687	ENR683	ADM683	Student 683	Harsha	\N	Murthy	Male	\N	9501004994	student683@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9493979725	9338078126	\N	\N	683	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
688	ENR684	ADM684	Student 684	Navya	\N	Murthy	Male	\N	9621239613	student684@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9301749628	9455105775	\N	\N	684	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
689	ENR685	ADM685	Student 685	Sravani	\N	Reddy	Male	\N	9768961353	student685@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9549993397	9450083630	\N	\N	685	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
690	ENR686	ADM686	Student 686	Praneeth	\N	Reddy	Male	\N	9760765582	student686@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9870226899	9244812909	\N	\N	686	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
691	ENR687	ADM687	Student 687	Sindhu	\N	Varma	Female	\N	9105652310	student687@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9380088321	9147706545	\N	\N	687	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
692	ENR688	ADM688	Student 688	Praneeth	\N	Kumar	Female	\N	9147686190	student688@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9620936229	9683792759	\N	\N	688	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
693	ENR689	ADM689	Student 689	Praneeth	\N	Naidu	Male	\N	9212654114	student689@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9955420903	9842593163	\N	\N	689	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
694	ENR690	ADM690	Student 690	Navya	\N	Rao	Female	\N	9461303858	student690@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9711765869	9270496931	\N	\N	690	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
695	ENR691	ADM691	Student 691	Harsha	\N	Kumar	Female	\N	9598709883	student691@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9951620325	9922166982	\N	\N	691	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
696	ENR692	ADM692	Student 692	Harsha	\N	Kumar	Female	\N	9835952914	student692@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9787509035	9656875627	\N	\N	692	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
697	ENR693	ADM693	Student 693	Sai Kiran	\N	Kumar	Female	\N	9376651379	student693@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9156991861	9217508516	\N	\N	693	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
698	ENR694	ADM694	Student 694	Sai Kiran	\N	Varma	Male	\N	9117943492	student694@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9674286460	9993089129	\N	\N	694	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
699	ENR695	ADM695	Student 695	Sindhu	\N	Kumar	Female	\N	9786933845	student695@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9376478680	9487496846	\N	\N	695	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
700	ENR696	ADM696	Student 696	Manideep	\N	Murthy	Male	\N	9308193177	student696@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9822719296	9939535076	\N	\N	696	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
701	ENR697	ADM697	Student 697	Navya	\N	Naidu	Male	\N	9589051864	student697@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9868960465	9484563078	\N	\N	697	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
702	ENR698	ADM698	Student 698	Navya	\N	Naidu	Male	\N	9825342094	student698@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9268498372	9192787143	\N	\N	698	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
703	ENR699	ADM699	Student 699	Manideep	\N	Murthy	Male	\N	9305417472	student699@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9247295540	9245433973	\N	\N	699	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
704	ENR700	ADM700	Student 700	Sravani	\N	Kumar	Female	\N	9586131498	student700@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9532442383	9364428820	\N	\N	700	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
705	ENR701	ADM701	Student 701	Navya	\N	Naidu	Female	\N	9640356646	student701@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9886907768	9369563831	\N	\N	701	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
706	ENR702	ADM702	Student 702	Bhavya	\N	Varma	Female	\N	9936434675	student702@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9663854837	9166077723	\N	\N	702	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
707	ENR703	ADM703	Student 703	Navya	\N	Kumar	Male	\N	9890113646	student703@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9631101566	9170513692	\N	\N	703	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
708	ENR704	ADM704	Student 704	Navya	\N	Varma	Female	\N	9910738054	student704@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9636045221	9646756605	\N	\N	704	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
709	ENR705	ADM705	Student 705	Deepika	\N	Rao	Male	\N	9426823484	student705@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9663780328	9473595475	\N	\N	705	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
710	ENR706	ADM706	Student 706	Manideep	\N	Kumar	Male	\N	9754680303	student706@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9940461283	9108070607	\N	\N	706	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
711	ENR707	ADM707	Student 707	Deepika	\N	Naidu	Female	\N	9865537935	student707@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9663831818	9136264944	\N	\N	707	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
712	ENR708	ADM708	Student 708	Manideep	\N	Murthy	Male	\N	9821156182	student708@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9182668988	9467386333	\N	\N	708	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
713	ENR709	ADM709	Student 709	Harsha	\N	Varma	Female	\N	9187062479	student709@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9412293948	9165036469	\N	\N	709	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
714	ENR710	ADM710	Student 710	Harsha	\N	Naidu	Male	\N	9219471328	student710@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9852687685	9372239287	\N	\N	710	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
715	ENR711	ADM711	Student 711	Deepika	\N	Kumar	Female	\N	9881034830	student711@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9971787999	9606122856	\N	\N	711	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
716	ENR712	ADM712	Student 712	Lokesh	\N	Varma	Male	\N	9732510121	student712@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9526260857	9773600017	\N	\N	712	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
717	ENR713	ADM713	Student 713	Sai Kiran	\N	Varma	Female	\N	9325247688	student713@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9333425303	9910812557	\N	\N	713	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
718	ENR714	ADM714	Student 714	Praneeth	\N	Kumar	Female	\N	9936654497	student714@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9148630267	9999026281	\N	\N	714	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
719	ENR715	ADM715	Student 715	Harsha	\N	Kumar	Female	\N	9573422857	student715@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9213412135	9917788194	\N	\N	715	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
720	ENR716	ADM716	Student 716	Sindhu	\N	Rao	Female	\N	9892876323	student716@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9647788075	9669291337	\N	\N	716	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
721	ENR717	ADM717	Student 717	Bhavya	\N	Naidu	Female	\N	9834243476	student717@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9665199904	9392944911	\N	\N	717	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
722	ENR718	ADM718	Student 718	Deepika	\N	Reddy	Female	\N	9314134591	student718@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9544544514	9441821975	\N	\N	718	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
723	ENR719	ADM719	Student 719	Harsha	\N	Varma	Female	\N	9880629580	student719@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9845280189	9444292351	\N	\N	719	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
724	ENR720	ADM720	Student 720	Keerthana	\N	Kumar	Female	\N	9296166485	student720@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9105528781	9781018821	\N	\N	720	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
725	ENR721	ADM721	Student 721	Keerthana	\N	Rao	Male	\N	9441467243	student721@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9780582136	9463883725	\N	\N	721	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
726	ENR722	ADM722	Student 722	Harsha	\N	Reddy	Female	\N	9285644290	student722@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9728412482	9975263389	\N	\N	722	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
727	ENR723	ADM723	Student 723	Harsha	\N	Kumar	Male	\N	9683291004	student723@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9465743184	9293040984	\N	\N	723	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
728	ENR724	ADM724	Student 724	Sai Teja	\N	Murthy	Female	\N	9254868934	student724@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9916784409	9923640936	\N	\N	724	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
729	ENR725	ADM725	Student 725	Bhavya	\N	Kumar	Male	\N	9445567023	student725@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9486538862	9236518844	\N	\N	725	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
730	ENR726	ADM726	Student 726	Lokesh	\N	Murthy	Male	\N	9278431266	student726@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9625390253	9840795330	\N	\N	726	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
731	ENR727	ADM727	Student 727	Sai Teja	\N	Murthy	Male	\N	9850162981	student727@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9736108695	9266071020	\N	\N	727	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
732	ENR728	ADM728	Student 728	Keerthana	\N	Rao	Female	\N	9140077813	student728@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9910481281	9826979851	\N	\N	728	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
733	ENR729	ADM729	Student 729	Sravani	\N	Naidu	Male	\N	9112259697	student729@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9449883963	9841986290	\N	\N	729	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
734	ENR730	ADM730	Student 730	Harsha	\N	Reddy	Female	\N	9561748449	student730@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9883474553	9781148576	\N	\N	730	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
735	ENR731	ADM731	Student 731	Praneeth	\N	Murthy	Male	\N	9817560955	student731@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9399305948	9383559055	\N	\N	731	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
736	ENR732	ADM732	Student 732	Sai Kiran	\N	Reddy	Female	\N	9927874913	student732@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9900303629	9403805464	\N	\N	732	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
737	ENR733	ADM733	Student 733	Harsha	\N	Naidu	Female	\N	9240690904	student733@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9236046736	9466194248	\N	\N	733	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
738	ENR734	ADM734	Student 734	Harsha	\N	Varma	Female	\N	9653644293	student734@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9181556532	9477593340	\N	\N	734	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
739	ENR735	ADM735	Student 735	Sindhu	\N	Varma	Male	\N	9268457333	student735@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9760956774	9951175512	\N	\N	735	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
740	ENR736	ADM736	Student 736	Navya	\N	Reddy	Male	\N	9792871315	student736@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9630760434	9381025808	\N	\N	736	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
741	ENR737	ADM737	Student 737	Praneeth	\N	Naidu	Male	\N	9613806439	student737@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9298977256	9930097665	\N	\N	737	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
742	ENR738	ADM738	Student 738	Sravani	\N	Naidu	Female	\N	9939895283	student738@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9102362029	9526890696	\N	\N	738	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
743	ENR739	ADM739	Student 739	Sai Teja	\N	Rao	Male	\N	9322144298	student739@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9189700864	9368681344	\N	\N	739	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
744	ENR740	ADM740	Student 740	Bhavya	\N	Varma	Female	\N	9617475736	student740@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9209684758	9276754604	\N	\N	740	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
745	ENR741	ADM741	Student 741	Praneeth	\N	Varma	Male	\N	9905050989	student741@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9627857097	9758249288	\N	\N	741	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
746	ENR742	ADM742	Student 742	Deepika	\N	Varma	Male	\N	9734762519	student742@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9803371078	9888659028	\N	\N	742	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
747	ENR743	ADM743	Student 743	Praneeth	\N	Murthy	Male	\N	9228246849	student743@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9694237274	9461686612	\N	\N	743	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
748	ENR744	ADM744	Student 744	Praneeth	\N	Rao	Male	\N	9138221152	student744@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9755678688	9486494854	\N	\N	744	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
749	ENR745	ADM745	Student 745	Deepika	\N	Naidu	Female	\N	9163967463	student745@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9482595789	9508386000	\N	\N	745	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
750	ENR746	ADM746	Student 746	Bhavya	\N	Rao	Female	\N	9455268234	student746@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9187384878	9987301336	\N	\N	746	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
751	ENR747	ADM747	Student 747	Manideep	\N	Kumar	Female	\N	9554649537	student747@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9558395481	9740275264	\N	\N	747	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
752	ENR748	ADM748	Student 748	Lokesh	\N	Murthy	Male	\N	9698970446	student748@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9478441023	9262905086	\N	\N	748	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
753	ENR749	ADM749	Student 749	Sai Kiran	\N	Reddy	Male	\N	9802192098	student749@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9975586076	9902582383	\N	\N	749	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
754	ENR750	ADM750	Student 750	Deepika	\N	Naidu	Male	\N	9568247651	student750@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9972866780	9850164721	\N	\N	750	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
755	ENR751	ADM751	Student 751	Manideep	\N	Varma	Male	\N	9813684731	student751@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9361816338	9944642319	\N	\N	751	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
756	ENR752	ADM752	Student 752	Deepika	\N	Kumar	Male	\N	9957766846	student752@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9178285849	9956846165	\N	\N	752	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
757	ENR753	ADM753	Student 753	Sai Kiran	\N	Rao	Female	\N	9684670956	student753@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9908230117	9627455734	\N	\N	753	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
758	ENR754	ADM754	Student 754	Navya	\N	Murthy	Female	\N	9817014885	student754@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9317936521	9725192092	\N	\N	754	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
759	ENR755	ADM755	Student 755	Keerthana	\N	Reddy	Male	\N	9107051138	student755@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9973031141	9965900409	\N	\N	755	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
760	ENR756	ADM756	Student 756	Sravani	\N	Rao	Male	\N	9554578565	student756@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9621149864	9579851769	\N	\N	756	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
761	ENR757	ADM757	Student 757	Bhavya	\N	Murthy	Female	\N	9695997741	student757@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9598741108	9258760546	\N	\N	757	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
762	ENR758	ADM758	Student 758	Sai Teja	\N	Kumar	Female	\N	9840146250	student758@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9523726175	9621760536	\N	\N	758	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
763	ENR759	ADM759	Student 759	Sai Kiran	\N	Varma	Female	\N	9229166116	student759@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9415221454	9487387073	\N	\N	759	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
764	ENR760	ADM760	Student 760	Sindhu	\N	Naidu	Male	\N	9805755168	student760@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9267952051	9753743433	\N	\N	760	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
765	ENR761	ADM761	Student 761	Manideep	\N	Reddy	Male	\N	9323934411	student761@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9881878915	9232297206	\N	\N	761	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
766	ENR762	ADM762	Student 762	Lokesh	\N	Varma	Male	\N	9613443103	student762@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9477030905	9871410496	\N	\N	762	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
767	ENR763	ADM763	Student 763	Harsha	\N	Reddy	Male	\N	9224994859	student763@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9674716658	9787679354	\N	\N	763	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
768	ENR764	ADM764	Student 764	Keerthana	\N	Rao	Female	\N	9153491449	student764@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9578161352	9447886560	\N	\N	764	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
769	ENR765	ADM765	Student 765	Bhavya	\N	Murthy	Male	\N	9966689632	student765@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9808600599	9969584529	\N	\N	765	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
770	ENR766	ADM766	Student 766	Bhavya	\N	Kumar	Male	\N	9461570602	student766@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9541171409	9765988384	\N	\N	766	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
771	ENR767	ADM767	Student 767	Sravani	\N	Murthy	Male	\N	9692528273	student767@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9921137548	9556184433	\N	\N	767	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
772	ENR768	ADM768	Student 768	Sai Teja	\N	Kumar	Female	\N	9313059224	student768@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9304316907	9481058695	\N	\N	768	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
773	ENR769	ADM769	Student 769	Sai Kiran	\N	Naidu	Male	\N	9936124438	student769@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9188510254	9653146233	\N	\N	769	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
774	ENR770	ADM770	Student 770	Sai Kiran	\N	Naidu	Male	\N	9384890818	student770@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9181186011	9756366524	\N	\N	770	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
775	ENR771	ADM771	Student 771	Sai Kiran	\N	Naidu	Female	\N	9922957802	student771@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9468374488	9129441590	\N	\N	771	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
776	ENR772	ADM772	Student 772	Sindhu	\N	Naidu	Male	\N	9581539882	student772@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9711075347	9119734580	\N	\N	772	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
777	ENR773	ADM773	Student 773	Praneeth	\N	Kumar	Female	\N	9440112060	student773@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9347536122	9906257171	\N	\N	773	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
778	ENR774	ADM774	Student 774	Sravani	\N	Murthy	Male	\N	9742661043	student774@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9337671308	9954296801	\N	\N	774	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
779	ENR775	ADM775	Student 775	Keerthana	\N	Reddy	Male	\N	9153517944	student775@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9361534293	9311204429	\N	\N	775	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
780	ENR776	ADM776	Student 776	Deepika	\N	Naidu	Female	\N	9569549633	student776@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9362660836	9350936790	\N	\N	776	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
781	ENR777	ADM777	Student 777	Sindhu	\N	Murthy	Male	\N	9915990962	student777@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9379868419	9847308379	\N	\N	777	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
782	ENR778	ADM778	Student 778	Harsha	\N	Reddy	Male	\N	9143939224	student778@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9203729806	9326620613	\N	\N	778	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
783	ENR779	ADM779	Student 779	Praneeth	\N	Rao	Female	\N	9393739498	student779@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9860663921	9672547977	\N	\N	779	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
784	ENR780	ADM780	Student 780	Sindhu	\N	Naidu	Female	\N	9819643829	student780@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9128269082	9543939193	\N	\N	780	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
785	ENR781	ADM781	Student 781	Praneeth	\N	Naidu	Male	\N	9142939406	student781@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9688342078	9790940049	\N	\N	781	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
786	ENR782	ADM782	Student 782	Bhavya	\N	Reddy	Female	\N	9242127963	student782@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9842715934	9882563680	\N	\N	782	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
787	ENR783	ADM783	Student 783	Sai Teja	\N	Murthy	Female	\N	9267741870	student783@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9487947979	9636214010	\N	\N	783	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
788	ENR784	ADM784	Student 784	Lokesh	\N	Naidu	Male	\N	9467394271	student784@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9834847007	9558539068	\N	\N	784	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
789	ENR785	ADM785	Student 785	Sindhu	\N	Kumar	Male	\N	9391694753	student785@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9715028477	9400301199	\N	\N	785	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
790	ENR786	ADM786	Student 786	Sai Teja	\N	Reddy	Male	\N	9721698633	student786@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9593084613	9205142515	\N	\N	786	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
791	ENR787	ADM787	Student 787	Sai Kiran	\N	Rao	Male	\N	9341547810	student787@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9765668300	9333420064	\N	\N	787	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
792	ENR788	ADM788	Student 788	Navya	\N	Varma	Female	\N	9794588233	student788@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9627555112	9704294731	\N	\N	788	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
793	ENR789	ADM789	Student 789	Sravani	\N	Rao	Male	\N	9788824280	student789@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9315624767	9437681751	\N	\N	789	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
794	ENR790	ADM790	Student 790	Sai Teja	\N	Murthy	Female	\N	9822561396	student790@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9862724250	9100700982	\N	\N	790	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
795	ENR791	ADM791	Student 791	Lokesh	\N	Reddy	Female	\N	9453431609	student791@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9120354663	9462250481	\N	\N	791	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
796	ENR792	ADM792	Student 792	Sai Teja	\N	Rao	Male	\N	9611280840	student792@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9223565010	9193966825	\N	\N	792	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
797	ENR793	ADM793	Student 793	Lokesh	\N	Reddy	Male	\N	9389141891	student793@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9897127076	9958529666	\N	\N	793	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
798	ENR794	ADM794	Student 794	Sravani	\N	Kumar	Female	\N	9262645865	student794@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9796666503	9375858244	\N	\N	794	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
799	ENR795	ADM795	Student 795	Manideep	\N	Murthy	Male	\N	9700624596	student795@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9116197610	9716385790	\N	\N	795	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
800	ENR796	ADM796	Student 796	Harsha	\N	Reddy	Male	\N	9443233328	student796@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9632675709	9196141740	\N	\N	796	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
801	ENR797	ADM797	Student 797	Lokesh	\N	Kumar	Male	\N	9145001309	student797@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9443642011	9924997473	\N	\N	797	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
802	ENR798	ADM798	Student 798	Manideep	\N	Naidu	Female	\N	9101448373	student798@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9716242442	9855239325	\N	\N	798	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
803	ENR799	ADM799	Student 799	Sai Teja	\N	Murthy	Female	\N	9828576677	student799@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9561593777	9453136975	\N	\N	799	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
804	ENR800	ADM800	Student 800	Deepika	\N	Reddy	Male	\N	9764176717	student800@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9818302648	9564066612	\N	\N	800	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
805	ENR801	ADM801	Student 801	Bhavya	\N	Rao	Male	\N	9331128352	student801@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9859036749	9566344376	\N	\N	801	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
806	ENR802	ADM802	Student 802	Sravani	\N	Murthy	Male	\N	9105799630	student802@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9445819561	9244653840	\N	\N	802	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
807	ENR803	ADM803	Student 803	Bhavya	\N	Murthy	Male	\N	9850235756	student803@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9586669073	9424289247	\N	\N	803	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
808	ENR804	ADM804	Student 804	Lokesh	\N	Naidu	Female	\N	9203676192	student804@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9827202568	9480798343	\N	\N	804	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
809	ENR805	ADM805	Student 805	Bhavya	\N	Kumar	Female	\N	9266284061	student805@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9874738787	9320298114	\N	\N	805	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
810	ENR806	ADM806	Student 806	Deepika	\N	Rao	Female	\N	9523049068	student806@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9966993944	9744368818	\N	\N	806	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
811	ENR807	ADM807	Student 807	Lokesh	\N	Rao	Female	\N	9637349672	student807@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9130601656	9781348755	\N	\N	807	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
812	ENR808	ADM808	Student 808	Sindhu	\N	Naidu	Male	\N	9122296728	student808@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9464620828	9106697677	\N	\N	808	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
813	ENR809	ADM809	Student 809	Keerthana	\N	Rao	Male	\N	9206888371	student809@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9830695155	9148327013	\N	\N	809	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
814	ENR810	ADM810	Student 810	Keerthana	\N	Naidu	Female	\N	9743532689	student810@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9722554458	9692196874	\N	\N	810	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
815	ENR811	ADM811	Student 811	Bhavya	\N	Murthy	Male	\N	9543499070	student811@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9743746489	9592293656	\N	\N	811	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
816	ENR812	ADM812	Student 812	Lokesh	\N	Varma	Male	\N	9162390590	student812@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9328858191	9177704011	\N	\N	812	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
817	ENR813	ADM813	Student 813	Lokesh	\N	Kumar	Male	\N	9307309923	student813@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9304077397	9419178050	\N	\N	813	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
818	ENR814	ADM814	Student 814	Sai Kiran	\N	Kumar	Male	\N	9336245308	student814@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9421400180	9748997202	\N	\N	814	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
819	ENR815	ADM815	Student 815	Sindhu	\N	Rao	Male	\N	9179477839	student815@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9843227423	9153385112	\N	\N	815	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
820	ENR816	ADM816	Student 816	Navya	\N	Kumar	Male	\N	9591953161	student816@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9824374553	9690101462	\N	\N	816	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
821	ENR817	ADM817	Student 817	Sravani	\N	Kumar	Male	\N	9456984693	student817@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9154987924	9803138827	\N	\N	817	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
822	ENR818	ADM818	Student 818	Lokesh	\N	Naidu	Female	\N	9372494257	student818@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9700462139	9430145475	\N	\N	818	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
823	ENR819	ADM819	Student 819	Bhavya	\N	Kumar	Male	\N	9270445736	student819@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9687906913	9507712649	\N	\N	819	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
824	ENR820	ADM820	Student 820	Bhavya	\N	Rao	Male	\N	9722092202	student820@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9183542883	9377866545	\N	\N	820	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
825	ENR821	ADM821	Student 821	Navya	\N	Murthy	Female	\N	9392267515	student821@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9558702401	9268919234	\N	\N	821	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
826	ENR822	ADM822	Student 822	Sai Kiran	\N	Reddy	Male	\N	9320921262	student822@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9550708822	9943449197	\N	\N	822	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
827	ENR823	ADM823	Student 823	Manideep	\N	Varma	Male	\N	9529628374	student823@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9829824715	9231706184	\N	\N	823	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
828	ENR824	ADM824	Student 824	Bhavya	\N	Varma	Female	\N	9786155287	student824@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9418209292	9967563172	\N	\N	824	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
829	ENR825	ADM825	Student 825	Sravani	\N	Varma	Female	\N	9746946422	student825@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9221399847	9259252974	\N	\N	825	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
830	ENR826	ADM826	Student 826	Sindhu	\N	Varma	Male	\N	9645021229	student826@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9831179818	9602747434	\N	\N	826	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
831	ENR827	ADM827	Student 827	Lokesh	\N	Rao	Female	\N	9123990754	student827@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9161625080	9851422025	\N	\N	827	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
832	ENR828	ADM828	Student 828	Sai Kiran	\N	Naidu	Female	\N	9899869583	student828@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9460830315	9696804394	\N	\N	828	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
833	ENR829	ADM829	Student 829	Sravani	\N	Varma	Male	\N	9409679586	student829@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9705345408	9316491344	\N	\N	829	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
834	ENR830	ADM830	Student 830	Deepika	\N	Kumar	Female	\N	9391382408	student830@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9442726363	9696510387	\N	\N	830	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
835	ENR831	ADM831	Student 831	Keerthana	\N	Kumar	Female	\N	9917306962	student831@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9959532372	9111484203	\N	\N	831	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
836	ENR832	ADM832	Student 832	Praneeth	\N	Varma	Female	\N	9944270712	student832@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9714892351	9112122110	\N	\N	832	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
837	ENR833	ADM833	Student 833	Sai Kiran	\N	Naidu	Male	\N	9342413858	student833@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9460151821	9529154293	\N	\N	833	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
838	ENR834	ADM834	Student 834	Sai Teja	\N	Naidu	Male	\N	9341049630	student834@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9231606607	9484281302	\N	\N	834	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
839	ENR835	ADM835	Student 835	Harsha	\N	Rao	Female	\N	9126515732	student835@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9954919578	9992858098	\N	\N	835	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
840	ENR836	ADM836	Student 836	Sravani	\N	Kumar	Male	\N	9280918881	student836@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9350000526	9740330846	\N	\N	836	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
841	ENR837	ADM837	Student 837	Harsha	\N	Naidu	Male	\N	9967864040	student837@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9797038250	9644069041	\N	\N	837	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
842	ENR838	ADM838	Student 838	Bhavya	\N	Kumar	Female	\N	9721901275	student838@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9818504672	9937349150	\N	\N	838	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
843	ENR839	ADM839	Student 839	Keerthana	\N	Murthy	Male	\N	9954461827	student839@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9604813027	9827366709	\N	\N	839	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
844	ENR840	ADM840	Student 840	Harsha	\N	Rao	Female	\N	9935452935	student840@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9775703688	9309658741	\N	\N	840	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
845	ENR841	ADM841	Student 841	Sravani	\N	Reddy	Female	\N	9434427476	student841@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9694520063	9941013426	\N	\N	841	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
846	ENR842	ADM842	Student 842	Harsha	\N	Reddy	Male	\N	9461898370	student842@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9753272018	9848707473	\N	\N	842	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
847	ENR843	ADM843	Student 843	Deepika	\N	Reddy	Male	\N	9828601833	student843@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9952614546	9928066846	\N	\N	843	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
848	ENR844	ADM844	Student 844	Keerthana	\N	Murthy	Male	\N	9541433234	student844@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9181069897	9786453477	\N	\N	844	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
849	ENR845	ADM845	Student 845	Keerthana	\N	Rao	Male	\N	9925656884	student845@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9337201993	9867665686	\N	\N	845	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
850	ENR846	ADM846	Student 846	Praneeth	\N	Murthy	Female	\N	9180964491	student846@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9403973930	9522817753	\N	\N	846	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
851	ENR847	ADM847	Student 847	Keerthana	\N	Varma	Female	\N	9638034778	student847@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9373245042	9780300345	\N	\N	847	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
852	ENR848	ADM848	Student 848	Praneeth	\N	Murthy	Male	\N	9793259784	student848@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9389508268	9438652109	\N	\N	848	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
853	ENR849	ADM849	Student 849	Harsha	\N	Varma	Male	\N	9666739710	student849@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9756332702	9778918973	\N	\N	849	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
854	ENR850	ADM850	Student 850	Deepika	\N	Reddy	Male	\N	9668891932	student850@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9270889373	9908937648	\N	\N	850	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
855	ENR851	ADM851	Student 851	Keerthana	\N	Reddy	Male	\N	9725561649	student851@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9869334105	9974674511	\N	\N	851	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
856	ENR852	ADM852	Student 852	Sai Kiran	\N	Naidu	Female	\N	9676325754	student852@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9170589427	9675631094	\N	\N	852	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
857	ENR853	ADM853	Student 853	Manideep	\N	Kumar	Female	\N	9713150966	student853@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9864558836	9621741741	\N	\N	853	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
858	ENR854	ADM854	Student 854	Deepika	\N	Varma	Male	\N	9739497148	student854@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9271563872	9113349483	\N	\N	854	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
859	ENR855	ADM855	Student 855	Manideep	\N	Varma	Male	\N	9297968267	student855@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9738245524	9988899607	\N	\N	855	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
860	ENR856	ADM856	Student 856	Lokesh	\N	Rao	Male	\N	9946247431	student856@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9958698845	9473596934	\N	\N	856	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
861	ENR857	ADM857	Student 857	Lokesh	\N	Kumar	Female	\N	9268793829	student857@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9298635974	9666094691	\N	\N	857	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
862	ENR858	ADM858	Student 858	Bhavya	\N	Kumar	Male	\N	9617914695	student858@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9434221620	9990719787	\N	\N	858	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
863	ENR859	ADM859	Student 859	Harsha	\N	Reddy	Female	\N	9681119164	student859@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9987433434	9885778680	\N	\N	859	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
864	ENR860	ADM860	Student 860	Bhavya	\N	Varma	Female	\N	9569544753	student860@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9410384132	9341588415	\N	\N	860	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
865	ENR861	ADM861	Student 861	Navya	\N	Naidu	Female	\N	9745891769	student861@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9143605345	9169600934	\N	\N	861	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
866	ENR862	ADM862	Student 862	Harsha	\N	Varma	Male	\N	9323096072	student862@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9114125818	9617009273	\N	\N	862	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
867	ENR863	ADM863	Student 863	Praneeth	\N	Naidu	Female	\N	9951848818	student863@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9187571754	9864183124	\N	\N	863	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
868	ENR864	ADM864	Student 864	Bhavya	\N	Varma	Female	\N	9333839602	student864@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9148550132	9641737384	\N	\N	864	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
869	ENR865	ADM865	Student 865	Keerthana	\N	Reddy	Male	\N	9968132326	student865@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9386789192	9434390207	\N	\N	865	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
870	ENR866	ADM866	Student 866	Lokesh	\N	Rao	Female	\N	9514761805	student866@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9766515420	9981639512	\N	\N	866	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
871	ENR867	ADM867	Student 867	Keerthana	\N	Reddy	Female	\N	9652668497	student867@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9506999313	9112333827	\N	\N	867	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
872	ENR868	ADM868	Student 868	Navya	\N	Murthy	Male	\N	9252717976	student868@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9529905852	9440097057	\N	\N	868	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
873	ENR869	ADM869	Student 869	Navya	\N	Murthy	Male	\N	9240740798	student869@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9105157049	9659967203	\N	\N	869	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
874	ENR870	ADM870	Student 870	Navya	\N	Rao	Male	\N	9678274312	student870@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9369087881	9101553108	\N	\N	870	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
875	ENR871	ADM871	Student 871	Deepika	\N	Rao	Male	\N	9518022610	student871@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9181718397	9162913029	\N	\N	871	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
876	ENR872	ADM872	Student 872	Praneeth	\N	Naidu	Male	\N	9635237611	student872@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9938891286	9488330365	\N	\N	872	\N	\N	t	Nellore	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
877	ENR873	ADM873	Student 873	Navya	\N	Rao	Female	\N	9183505822	student873@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9648512883	9282627051	\N	\N	873	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
878	ENR874	ADM874	Student 874	Sindhu	\N	Kumar	Male	\N	9567539947	student874@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9405291940	9896109870	\N	\N	874	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
879	ENR875	ADM875	Student 875	Sai Teja	\N	Rao	Female	\N	9539247576	student875@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9124582855	9641549164	\N	\N	875	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
880	ENR876	ADM876	Student 876	Sravani	\N	Kumar	Male	\N	9609142403	student876@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9195988822	9741271397	\N	\N	876	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
881	ENR877	ADM877	Student 877	Sai Kiran	\N	Murthy	Female	\N	9226556892	student877@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9257896437	9721951997	\N	\N	877	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
882	ENR878	ADM878	Student 878	Lokesh	\N	Naidu	Female	\N	9119779296	student878@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9402747130	9548524373	\N	\N	878	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
883	ENR879	ADM879	Student 879	Praneeth	\N	Murthy	Female	\N	9581814056	student879@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9932864630	9206521112	\N	\N	879	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
884	ENR880	ADM880	Student 880	Deepika	\N	Murthy	Female	\N	9925105563	student880@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9571869162	9654639254	\N	\N	880	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
885	ENR881	ADM881	Student 881	Harsha	\N	Varma	Female	\N	9775254384	student881@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9178920945	9228874082	\N	\N	881	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
886	ENR882	ADM882	Student 882	Bhavya	\N	Kumar	Male	\N	9151224662	student882@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9995010512	9263848910	\N	\N	882	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
887	ENR883	ADM883	Student 883	Keerthana	\N	Kumar	Female	\N	9824594195	student883@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9481287714	9776603361	\N	\N	883	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
888	ENR884	ADM884	Student 884	Lokesh	\N	Varma	Female	\N	9249978510	student884@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9375456687	9769517168	\N	\N	884	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
889	ENR885	ADM885	Student 885	Sai Kiran	\N	Naidu	Female	\N	9625263735	student885@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9827769412	9251680526	\N	\N	885	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
890	ENR886	ADM886	Student 886	Deepika	\N	Reddy	Female	\N	9797670522	student886@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9215905445	9443094475	\N	\N	886	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
891	ENR887	ADM887	Student 887	Praneeth	\N	Rao	Female	\N	9850314212	student887@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9293190188	9818610385	\N	\N	887	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
892	ENR888	ADM888	Student 888	Bhavya	\N	Naidu	Female	\N	9880053469	student888@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9246697755	9414306994	\N	\N	888	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
893	ENR889	ADM889	Student 889	Sravani	\N	Naidu	Male	\N	9835066999	student889@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9641397273	9234816322	\N	\N	889	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
894	ENR890	ADM890	Student 890	Manideep	\N	Naidu	Male	\N	9954434543	student890@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9285413434	9570971657	\N	\N	890	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
895	ENR891	ADM891	Student 891	Lokesh	\N	Varma	Male	\N	9156165520	student891@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9616420443	9703073610	\N	\N	891	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
896	ENR892	ADM892	Student 892	Deepika	\N	Murthy	Male	\N	9583914722	student892@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9383288646	9601400078	\N	\N	892	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
897	ENR893	ADM893	Student 893	Praneeth	\N	Kumar	Male	\N	9533187472	student893@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9699382796	9640139741	\N	\N	893	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
898	ENR894	ADM894	Student 894	Sindhu	\N	Murthy	Female	\N	9339503175	student894@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9575535987	9156211849	\N	\N	894	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
899	ENR895	ADM895	Student 895	Harsha	\N	Naidu	Male	\N	9911503004	student895@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9745220864	9634313784	\N	\N	895	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
900	ENR896	ADM896	Student 896	Deepika	\N	Reddy	Male	\N	9594367689	student896@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9201527868	9519976066	\N	\N	896	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
901	ENR897	ADM897	Student 897	Lokesh	\N	Kumar	Female	\N	9612535460	student897@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9207751196	9757827691	\N	\N	897	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
902	ENR898	ADM898	Student 898	Praneeth	\N	Kumar	Female	\N	9671516626	student898@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9310560939	9889990444	\N	\N	898	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
903	ENR899	ADM899	Student 899	Sai Teja	\N	Reddy	Female	\N	9254593601	student899@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9228459111	9953311521	\N	\N	899	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
904	ENR900	ADM900	Student 900	Sindhu	\N	Kumar	Male	\N	9841799044	student900@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9477747652	9205584064	\N	\N	900	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
905	ENR901	ADM901	Student 901	Lokesh	\N	Reddy	Male	\N	9414886594	student901@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9432646438	9228650338	\N	\N	901	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
906	ENR902	ADM902	Student 902	Sai Teja	\N	Naidu	Female	\N	9694753958	student902@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9302861137	9163020358	\N	\N	902	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
907	ENR903	ADM903	Student 903	Keerthana	\N	Rao	Female	\N	9939799601	student903@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9123264435	9602386951	\N	\N	903	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
908	ENR904	ADM904	Student 904	Sravani	\N	Reddy	Female	\N	9421074175	student904@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9676999735	9833304912	\N	\N	904	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
909	ENR905	ADM905	Student 905	Keerthana	\N	Varma	Female	\N	9178644526	student905@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9645421353	9922666423	\N	\N	905	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
910	ENR906	ADM906	Student 906	Keerthana	\N	Rao	Female	\N	9654474604	student906@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9760800786	9829651732	\N	\N	906	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
911	ENR907	ADM907	Student 907	Sai Kiran	\N	Reddy	Female	\N	9394301662	student907@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9719845629	9639388334	\N	\N	907	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
912	ENR908	ADM908	Student 908	Navya	\N	Rao	Male	\N	9585711480	student908@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9393986479	9396470064	\N	\N	908	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
913	ENR909	ADM909	Student 909	Manideep	\N	Reddy	Male	\N	9719986086	student909@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9860524717	9595222558	\N	\N	909	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
914	ENR910	ADM910	Student 910	Manideep	\N	Kumar	Female	\N	9223698804	student910@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9514486371	9532021030	\N	\N	910	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
915	ENR911	ADM911	Student 911	Sindhu	\N	Naidu	Male	\N	9614121055	student911@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9220989160	9754320788	\N	\N	911	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
916	ENR912	ADM912	Student 912	Manideep	\N	Rao	Female	\N	9223573907	student912@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9356376574	9211822819	\N	\N	912	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
917	ENR913	ADM913	Student 913	Manideep	\N	Naidu	Female	\N	9120953979	student913@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9968054570	9689965674	\N	\N	913	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
918	ENR914	ADM914	Student 914	Sai Kiran	\N	Varma	Female	\N	9665334702	student914@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9868969299	9345229035	\N	\N	914	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
919	ENR915	ADM915	Student 915	Harsha	\N	Kumar	Male	\N	9603725488	student915@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9395161053	9850122870	\N	\N	915	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
920	ENR916	ADM916	Student 916	Sai Kiran	\N	Kumar	Female	\N	9560358231	student916@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9258300262	9742663217	\N	\N	916	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
921	ENR917	ADM917	Student 917	Sai Kiran	\N	Varma	Female	\N	9942709557	student917@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9856626774	9311527102	\N	\N	917	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
922	ENR918	ADM918	Student 918	Lokesh	\N	Reddy	Male	\N	9821274682	student918@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9901484600	9256708548	\N	\N	918	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
923	ENR919	ADM919	Student 919	Keerthana	\N	Reddy	Female	\N	9188907263	student919@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9409111621	9344645274	\N	\N	919	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
924	ENR920	ADM920	Student 920	Bhavya	\N	Naidu	Male	\N	9620864765	student920@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9805959315	9183617841	\N	\N	920	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
925	ENR921	ADM921	Student 921	Sravani	\N	Murthy	Female	\N	9245143989	student921@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9746203428	9163048750	\N	\N	921	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
926	ENR922	ADM922	Student 922	Harsha	\N	Murthy	Female	\N	9850885176	student922@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9203725804	9243523026	\N	\N	922	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
927	ENR923	ADM923	Student 923	Bhavya	\N	Varma	Female	\N	9690726740	student923@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9310002699	9194465003	\N	\N	923	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
928	ENR924	ADM924	Student 924	Manideep	\N	Murthy	Male	\N	9643463066	student924@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9754165969	9987429264	\N	\N	924	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
929	ENR925	ADM925	Student 925	Sravani	\N	Naidu	Female	\N	9601247074	student925@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9122402019	9235604498	\N	\N	925	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
930	ENR926	ADM926	Student 926	Navya	\N	Murthy	Female	\N	9779842277	student926@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9972556978	9915723607	\N	\N	926	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
931	ENR927	ADM927	Student 927	Sravani	\N	Rao	Female	\N	9984339817	student927@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9222170545	9364132967	\N	\N	927	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
932	ENR928	ADM928	Student 928	Praneeth	\N	Murthy	Female	\N	9767775609	student928@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9961550863	9574268402	\N	\N	928	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
933	ENR929	ADM929	Student 929	Sai Kiran	\N	Murthy	Male	\N	9784894716	student929@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9161885912	9938560487	\N	\N	929	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
934	ENR930	ADM930	Student 930	Harsha	\N	Varma	Male	\N	9745169496	student930@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9912451733	9118317170	\N	\N	930	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
935	ENR931	ADM931	Student 931	Lokesh	\N	Varma	Male	\N	9180857911	student931@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9623371306	9175919370	\N	\N	931	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
936	ENR932	ADM932	Student 932	Lokesh	\N	Reddy	Female	\N	9129165477	student932@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9693816878	9956174522	\N	\N	932	\N	\N	t	Guntur	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
937	ENR933	ADM933	Student 933	Praneeth	\N	Varma	Female	\N	9840481569	student933@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9529000094	9579201665	\N	\N	933	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
938	ENR934	ADM934	Student 934	Praneeth	\N	Varma	Female	\N	9622119239	student934@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9987427595	9120249978	\N	\N	934	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
939	ENR935	ADM935	Student 935	Bhavya	\N	Kumar	Female	\N	9735231519	student935@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9806447700	9455944553	\N	\N	935	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
940	ENR936	ADM936	Student 936	Sai Teja	\N	Kumar	Male	\N	9817696246	student936@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9693295702	9717415348	\N	\N	936	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
941	ENR937	ADM937	Student 937	Bhavya	\N	Murthy	Male	\N	9531305497	student937@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9297328128	9148488528	\N	\N	937	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
942	ENR938	ADM938	Student 938	Manideep	\N	Rao	Female	\N	9262039441	student938@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9105328241	9403233560	\N	\N	938	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
943	ENR939	ADM939	Student 939	Manideep	\N	Murthy	Male	\N	9910068050	student939@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9900864693	9959036715	\N	\N	939	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
944	ENR940	ADM940	Student 940	Sravani	\N	Varma	Male	\N	9512767039	student940@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9930706295	9168421065	\N	\N	940	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
945	ENR941	ADM941	Student 941	Sravani	\N	Naidu	Female	\N	9799304203	student941@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9162926914	9420965987	\N	\N	941	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
946	ENR942	ADM942	Student 942	Praneeth	\N	Varma	Male	\N	9482600867	student942@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9183157629	9483351557	\N	\N	942	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
947	ENR943	ADM943	Student 943	Sindhu	\N	Varma	Male	\N	9533603398	student943@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9359773724	9471486847	\N	\N	943	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
948	ENR944	ADM944	Student 944	Deepika	\N	Reddy	Male	\N	9938104908	student944@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9343450070	9299819929	\N	\N	944	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
949	ENR945	ADM945	Student 945	Bhavya	\N	Murthy	Male	\N	9419088713	student945@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9981201814	9835602367	\N	\N	945	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
950	ENR946	ADM946	Student 946	Praneeth	\N	Kumar	Male	\N	9944809154	student946@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9836915410	9181644780	\N	\N	946	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
951	ENR947	ADM947	Student 947	Keerthana	\N	Naidu	Female	\N	9916526886	student947@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9534704350	9744745610	\N	\N	947	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
952	ENR948	ADM948	Student 948	Deepika	\N	Reddy	Male	\N	9699307912	student948@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9498585518	9178288656	\N	\N	948	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
953	ENR949	ADM949	Student 949	Harsha	\N	Rao	Male	\N	9982244103	student949@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9881058012	9970956397	\N	\N	949	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
954	ENR950	ADM950	Student 950	Sai Teja	\N	Varma	Male	\N	9757191756	student950@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9757471554	9696244296	\N	\N	950	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
955	ENR951	ADM951	Student 951	Deepika	\N	Rao	Female	\N	9818970044	student951@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9751301775	9668157133	\N	\N	951	\N	\N	t	Guntur	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
956	ENR952	ADM952	Student 952	Manideep	\N	Reddy	Male	\N	9264399920	student952@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9262448946	9728998509	\N	\N	952	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
957	ENR953	ADM953	Student 953	Manideep	\N	Kumar	Female	\N	9528487723	student953@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9721318059	9525799280	\N	\N	953	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
958	ENR954	ADM954	Student 954	Deepika	\N	Varma	Male	\N	9798752654	student954@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9912215097	9373251845	\N	\N	954	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
959	ENR955	ADM955	Student 955	Manideep	\N	Kumar	Female	\N	9489812650	student955@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9299459645	9756897149	\N	\N	955	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
960	ENR956	ADM956	Student 956	Sindhu	\N	Varma	Male	\N	9113010502	student956@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9585979999	9238563499	\N	\N	956	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
961	ENR957	ADM957	Student 957	Sindhu	\N	Murthy	Female	\N	9139601641	student957@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9384700167	9591855448	\N	\N	957	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
962	ENR958	ADM958	Student 958	Bhavya	\N	Kumar	Male	\N	9491923296	student958@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9613191397	9387917301	\N	\N	958	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
963	ENR959	ADM959	Student 959	Keerthana	\N	Naidu	Female	\N	9810428332	student959@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9438200330	9328563577	\N	\N	959	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
964	ENR960	ADM960	Student 960	Keerthana	\N	Varma	Female	\N	9856060988	student960@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9823403825	9751610421	\N	\N	960	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
965	ENR961	ADM961	Student 961	Keerthana	\N	Reddy	Male	\N	9343699940	student961@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9669623472	9911829347	\N	\N	961	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
966	ENR962	ADM962	Student 962	Lokesh	\N	Rao	Female	\N	9947643046	student962@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9692215442	9668751993	\N	\N	962	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
967	ENR963	ADM963	Student 963	Sai Kiran	\N	Varma	Male	\N	9898079514	student963@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9698647174	9665293468	\N	\N	963	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
968	ENR964	ADM964	Student 964	Sai Teja	\N	Varma	Male	\N	9400475525	student964@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9255483446	9469063343	\N	\N	964	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
969	ENR965	ADM965	Student 965	Lokesh	\N	Reddy	Female	\N	9695005120	student965@school.com	\N	\N	Hindu	\N	AB+	Venkata Rao	Lakshmi	9991255671	9755037346	\N	\N	965	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
970	ENR966	ADM966	Student 966	Sindhu	\N	Reddy	Male	\N	9583675353	student966@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9149991061	9496118149	\N	\N	966	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
971	ENR967	ADM967	Student 967	Keerthana	\N	Naidu	Female	\N	9654744866	student967@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9948740662	9214151293	\N	\N	967	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
972	ENR968	ADM968	Student 968	Praneeth	\N	Varma	Female	\N	9899012420	student968@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9231610413	9580592824	\N	\N	968	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
973	ENR969	ADM969	Student 969	Harsha	\N	Varma	Female	\N	9118296316	student969@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9354681781	9484886544	\N	\N	969	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
974	ENR970	ADM970	Student 970	Lokesh	\N	Kumar	Male	\N	9649866006	student970@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9676103468	9556346727	\N	\N	970	\N	\N	t	Nellore	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
975	ENR971	ADM971	Student 971	Harsha	\N	Murthy	Female	\N	9466238238	student971@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9228752074	9123636165	\N	\N	971	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
976	ENR972	ADM972	Student 972	Navya	\N	Rao	Male	\N	9448569423	student972@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9617662003	9471849628	\N	\N	972	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
977	ENR973	ADM973	Student 973	Deepika	\N	Naidu	Female	\N	9202135710	student973@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9883973809	9500691688	\N	\N	973	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
978	ENR974	ADM974	Student 974	Manideep	\N	Varma	Female	\N	9198363445	student974@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9382043319	9276698954	\N	\N	974	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
979	ENR975	ADM975	Student 975	Navya	\N	Murthy	Female	\N	9143195201	student975@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9368001028	9806826340	\N	\N	975	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
980	ENR976	ADM976	Student 976	Keerthana	\N	Kumar	Male	\N	9642626781	student976@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9299850720	9393488658	\N	\N	976	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
981	ENR977	ADM977	Student 977	Harsha	\N	Naidu	Female	\N	9162632881	student977@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9331878066	9728590159	\N	\N	977	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
982	ENR978	ADM978	Student 978	Deepika	\N	Rao	Female	\N	9654885884	student978@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9718301402	9405078711	\N	\N	978	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	6	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
983	ENR979	ADM979	Student 979	Bhavya	\N	Kumar	Female	\N	9808210427	student979@school.com	\N	\N	Christian	\N	A+	Venkata Rao	Lakshmi	9863520164	9575398588	\N	\N	979	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
984	ENR980	ADM980	Student 980	Lokesh	\N	Murthy	Male	\N	9680241687	student980@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9979480113	9349234483	\N	\N	980	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
985	ENR981	ADM981	Student 981	Manideep	\N	Kumar	Male	\N	9537744908	student981@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9428458419	9391475668	\N	\N	981	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
986	ENR982	ADM982	Student 982	Sai Kiran	\N	Rao	Male	\N	9634523267	student982@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9177040630	9548928780	\N	\N	982	\N	\N	t	Guntur	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
987	ENR983	ADM983	Student 983	Sindhu	\N	Kumar	Male	\N	9391191741	student983@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9236255965	9960146819	\N	\N	983	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
988	ENR984	ADM984	Student 984	Deepika	\N	Murthy	Male	\N	9530745254	student984@school.com	\N	\N	Christian	\N	B+	Venkata Rao	Lakshmi	9142270666	9885406100	\N	\N	984	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
989	ENR985	ADM985	Student 985	Sindhu	\N	Reddy	Male	\N	9692370616	student985@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9716858595	9344536512	\N	\N	985	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
990	ENR986	ADM986	Student 986	Sai Teja	\N	Naidu	Male	\N	9901699845	student986@school.com	\N	\N	Muslim	\N	A+	Venkata Rao	Lakshmi	9715991370	9412193973	\N	\N	986	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
991	ENR987	ADM987	Student 987	Praneeth	\N	Murthy	Female	\N	9693508328	student987@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9927305438	9105084400	\N	\N	987	\N	\N	t	Nellore	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
992	ENR988	ADM988	Student 988	Navya	\N	Reddy	Female	\N	9117960411	student988@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9391516472	9748672415	\N	\N	988	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
993	ENR989	ADM989	Student 989	Manideep	\N	Murthy	Female	\N	9970722406	student989@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9203135045	9675822041	\N	\N	989	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
994	ENR990	ADM990	Student 990	Harsha	\N	Murthy	Male	\N	9380082896	student990@school.com	\N	\N	Christian	\N	AB+	Venkata Rao	Lakshmi	9788187981	9340227572	\N	\N	990	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
995	ENR991	ADM991	Student 991	Lokesh	\N	Rao	Female	\N	9935521436	student991@school.com	\N	\N	Hindu	\N	B+	Venkata Rao	Lakshmi	9989241773	9947234541	\N	\N	991	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
996	ENR992	ADM992	Student 992	Sai Teja	\N	Murthy	Female	\N	9788400987	student992@school.com	\N	\N	Muslim	\N	B+	Venkata Rao	Lakshmi	9948420069	9503232158	\N	\N	992	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Blue	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
997	ENR993	ADM993	Student 993	Navya	\N	Naidu	Male	\N	9867044597	student993@school.com	\N	\N	Hindu	\N	O+	Venkata Rao	Lakshmi	9443020399	9654654077	\N	\N	993	\N	\N	t	Vijayawada	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	7	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
998	ENR994	ADM994	Student 994	Deepika	\N	Varma	Female	\N	9949409768	student994@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9301103824	9593208881	\N	\N	994	\N	\N	t	Nellore	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
999	ENR995	ADM995	Student 995	Keerthana	\N	Reddy	Female	\N	9536846870	student995@school.com	\N	\N	Hindu	\N	A+	Venkata Rao	Lakshmi	9889548346	9840907722	\N	\N	995	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
1000	ENR996	ADM996	Student 996	Sai Kiran	\N	Varma	Male	\N	9232287559	student996@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9512300532	9626549539	\N	\N	996	\N	\N	t	Guntur	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
1001	ENR997	ADM997	Student 997	Deepika	\N	Rao	Male	\N	9918833677	student997@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9289872808	9594382114	\N	\N	997	\N	\N	t	Kakinada	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
1002	ENR998	ADM998	Student 998	Sravani	\N	Kumar	Female	\N	9577259591	student998@school.com	\N	\N	Muslim	\N	O+	Venkata Rao	Lakshmi	9627549827	9895300313	\N	\N	998	\N	\N	t	Visakhapatnam	Andhra Pradesh	India	English	Red	General	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
1003	ENR999	ADM999	Student 999	Sindhu	\N	Kumar	Male	\N	9579204696	student999@school.com	\N	\N	Muslim	\N	AB+	Venkata Rao	Lakshmi	9852491162	9967016852	\N	\N	999	\N	\N	t	Rajahmundry	Andhra Pradesh	India	English	Yellow	General	\N	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
1004	ENR1000	ADM1000	Student 1000	Lokesh	\N	Varma	Female	\N	9229163969	student1000@school.com	\N	\N	Christian	\N	O+	Venkata Rao	Lakshmi	9620556606	9732029126	\N	\N	1000	\N	\N	t	Tirupati	Andhra Pradesh	India	English	Green	General	\N	\N	\N	\N	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2026-05-29 20:35:03.79178	2026-05-29 20:35:03.79178	1	\N	f	\N	f	\N	\N	\N	\N	\N
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.subjects (id, school_id, subject_name, subject_code, created_at) FROM stdin;
1	1	Mathematics	MATH101	2026-05-29 00:34:40.532
2	1	Science	SCI101	2026-05-30 10:38:52.275499
3	1	English	ENG101	2026-05-30 10:38:52.275499
4	1	Social	SOC101	2026-05-30 10:38:52.275499
5	1	Computer Science	CS101	2026-05-30 10:38:52.275499
\.


--
-- Data for Name: teacher_attendance; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.teacher_attendance (id, teacher_id, attendance_date, status, remarks, created_at) FROM stdin;
1	1	2026-05-29	Absent		2026-05-29 02:54:04.557
2	43	2026-05-29	Present		2026-05-29 23:23:13.175
3	47	2026-05-30	Present		2026-05-30 12:23:11.304
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.teachers (id, school_id, user_id, employee_id, qualification, experience_years, joining_date, salary, department, created_at, first_name, last_name, gender, phone, email, designation, address, is_active, updated_at) FROM stdin;
1	1	\N	EMP001	M.Sc Mathematics	8	\N	\N	Mathematics	2026-05-29 02:12:25.207895	Ramesh test	Kumar	Male	9876543210	ramesh@test.com	Teacher	\N	t	2026-05-29 02:35:41.541
2	1	\N	EMP1	M.Ed	14	\N	\N	English	2026-05-29 20:35:35.303513	Anitha	Rao	\N	9487852731	teacher1@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
3	1	\N	EMP2	M.Ed	15	\N	\N	Hindi	2026-05-29 20:35:35.303513	Srinivas	Reddy	\N	9604738613	teacher2@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
4	1	\N	EMP3	M.Ed	9	\N	\N	English	2026-05-29 20:35:35.303513	Suresh	Naidu	\N	9942584232	teacher3@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
5	1	\N	EMP4	M.Ed	1	\N	\N	Hindi	2026-05-29 20:35:35.303513	Anitha	Naidu	\N	9298104529	teacher4@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
6	1	\N	EMP5	M.Ed	4	\N	\N	Hindi	2026-05-29 20:35:35.303513	Swapna	Kumar	\N	9857513952	teacher5@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
7	1	\N	EMP6	M.Ed	13	\N	\N	English	2026-05-29 20:35:35.303513	Srinivas	Rao	\N	9821802862	teacher6@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
8	1	\N	EMP7	M.Ed	4	\N	\N	Social	2026-05-29 20:35:35.303513	Srinivas	Rao	\N	9834503497	teacher7@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
9	1	\N	EMP8	M.Ed	2	\N	\N	English	2026-05-29 20:35:35.303513	Ramesh	Naidu	\N	9370523990	teacher8@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
10	1	\N	EMP9	M.Ed	10	\N	\N	Hindi	2026-05-29 20:35:35.303513	Swapna	Kumar	\N	9977911157	teacher9@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
11	1	\N	EMP10	M.Ed	6	\N	\N	Science	2026-05-29 20:35:35.303513	Sailaja	Kumar	\N	9536198212	teacher10@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
12	1	\N	EMP11	M.Ed	15	\N	\N	Social	2026-05-29 20:35:35.303513	Srinivas	Reddy	\N	9481753224	teacher11@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
13	1	\N	EMP12	M.Ed	10	\N	\N	Hindi	2026-05-29 20:35:35.303513	Anitha	Reddy	\N	9243606969	teacher12@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
14	1	\N	EMP13	M.Ed	1	\N	\N	English	2026-05-29 20:35:35.303513	Ramesh	Kumar	\N	9432354767	teacher13@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
15	1	\N	EMP14	M.Ed	7	\N	\N	Science	2026-05-29 20:35:35.303513	Prasad	Naidu	\N	9766565014	teacher14@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
16	1	\N	EMP15	M.Ed	4	\N	\N	Hindi	2026-05-29 20:35:35.303513	Suresh	Kumar	\N	9469408177	teacher15@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
17	1	\N	EMP16	M.Ed	9	\N	\N	Science	2026-05-29 20:35:35.303513	Haritha	Naidu	\N	9828928961	teacher16@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
18	1	\N	EMP17	M.Ed	13	\N	\N	English	2026-05-29 20:35:35.303513	Ramesh	Reddy	\N	9563456511	teacher17@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
19	1	\N	EMP18	M.Ed	3	\N	\N	Mathematics	2026-05-29 20:35:35.303513	Sailaja	Reddy	\N	9153845475	teacher18@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
20	1	\N	EMP19	M.Ed	8	\N	\N	Social	2026-05-29 20:35:35.303513	Prasad	Rao	\N	9123647882	teacher19@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
21	1	\N	EMP20	M.Ed	12	\N	\N	Hindi	2026-05-29 20:35:35.303513	Ramesh	Reddy	\N	9468974262	teacher20@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
22	1	\N	EMP21	M.Ed	10	\N	\N	Social	2026-05-29 20:35:35.303513	Ramesh	Reddy	\N	9468619737	teacher21@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
23	1	\N	EMP22	M.Ed	3	\N	\N	Science	2026-05-29 20:35:35.303513	Ramesh	Rao	\N	9930313035	teacher22@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
24	1	\N	EMP23	M.Ed	1	\N	\N	Science	2026-05-29 20:35:35.303513	Anitha	Rao	\N	9523040396	teacher23@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
25	1	\N	EMP24	M.Ed	13	\N	\N	English	2026-05-29 20:35:35.303513	Anitha	Rao	\N	9759338431	teacher24@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
26	1	\N	EMP25	M.Ed	12	\N	\N	Social	2026-05-29 20:35:35.303513	Suresh	Naidu	\N	9759141758	teacher25@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
27	1	\N	EMP26	M.Ed	10	\N	\N	Science	2026-05-29 20:35:35.303513	Prasad	Rao	\N	9967917841	teacher26@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
28	1	\N	EMP27	M.Ed	8	\N	\N	Hindi	2026-05-29 20:35:35.303513	Sailaja	Reddy	\N	9445127750	teacher27@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
29	1	\N	EMP28	M.Ed	5	\N	\N	Science	2026-05-29 20:35:35.303513	Anitha	Naidu	\N	9470030773	teacher28@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
30	1	\N	EMP29	M.Ed	1	\N	\N	Social	2026-05-29 20:35:35.303513	Prasad	Naidu	\N	9954907856	teacher29@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
31	1	\N	EMP30	M.Ed	15	\N	\N	Mathematics	2026-05-29 20:35:35.303513	Swapna	Rao	\N	9352221245	teacher30@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
32	1	\N	EMP31	M.Ed	3	\N	\N	English	2026-05-29 20:35:35.303513	Haritha	Kumar	\N	9214959654	teacher31@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
33	1	\N	EMP32	M.Ed	14	\N	\N	Social	2026-05-29 20:35:35.303513	Sailaja	Reddy	\N	9409046310	teacher32@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
34	1	\N	EMP33	M.Ed	12	\N	\N	Social	2026-05-29 20:35:35.303513	Sailaja	Rao	\N	9619926238	teacher33@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
35	1	\N	EMP34	M.Ed	5	\N	\N	Mathematics	2026-05-29 20:35:35.303513	Suresh	Naidu	\N	9849854669	teacher34@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
36	1	\N	EMP35	M.Ed	11	\N	\N	Hindi	2026-05-29 20:35:35.303513	Ramesh	Kumar	\N	9599522664	teacher35@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
37	1	\N	EMP36	M.Ed	14	\N	\N	Hindi	2026-05-29 20:35:35.303513	Anitha	Reddy	\N	9901305599	teacher36@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
38	1	\N	EMP37	M.Ed	12	\N	\N	Social	2026-05-29 20:35:35.303513	Srinivas	Rao	\N	9288654502	teacher37@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
39	1	\N	EMP38	M.Ed	4	\N	\N	English	2026-05-29 20:35:35.303513	Swapna	Reddy	\N	9880496050	teacher38@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
40	1	\N	EMP39	M.Ed	12	\N	\N	Science	2026-05-29 20:35:35.303513	Haritha	Kumar	\N	9424933460	teacher39@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
41	1	\N	EMP40	M.Ed	13	\N	\N	Science	2026-05-29 20:35:35.303513	Anitha	Kumar	\N	9102485972	teacher40@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
42	1	\N	EMP41	M.Ed	13	\N	\N	Hindi	2026-05-29 20:35:35.303513	Prasad	Rao	\N	9652373919	teacher41@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
43	1	\N	EMP42	M.Ed	1	\N	\N	English	2026-05-29 20:35:35.303513	Prasad	Naidu	\N	9322836262	teacher42@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
44	1	\N	EMP43	M.Ed	9	\N	\N	Social	2026-05-29 20:35:35.303513	Ramesh	Rao	\N	9777230483	teacher43@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
45	1	\N	EMP44	M.Ed	9	\N	\N	Mathematics	2026-05-29 20:35:35.303513	Ramesh	Rao	\N	9562482477	teacher44@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
46	1	\N	EMP45	M.Ed	6	\N	\N	Science	2026-05-29 20:35:35.303513	Suresh	Reddy	\N	9928505828	teacher45@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
47	1	\N	EMP46	M.Ed	11	\N	\N	English	2026-05-29 20:35:35.303513	Srinivas	Reddy	\N	9924289803	teacher46@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
48	1	\N	EMP47	M.Ed	5	\N	\N	Hindi	2026-05-29 20:35:35.303513	Haritha	Kumar	\N	9734797881	teacher47@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
49	1	\N	EMP48	M.Ed	7	\N	\N	Science	2026-05-29 20:35:35.303513	Srinivas	Kumar	\N	9403565938	teacher48@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
50	1	\N	EMP49	M.Ed	4	\N	\N	Social	2026-05-29 20:35:35.303513	Srinivas	Reddy	\N	9902221914	teacher49@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
51	1	\N	EMP50	M.Ed	8	\N	\N	Social	2026-05-29 20:35:35.303513	Anitha	Reddy	\N	9135355100	teacher50@school.com	Teacher	\N	t	2026-05-29 20:35:35.303513
\.


--
-- Data for Name: teachers_backup; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.teachers_backup (id, school_id, employee_id, first_name, last_name, gender, phone, email, qualification, experience_years, joining_date, department, designation, salary, address, is_active, created_at) FROM stdin;
1	1	EMP001	Ramesh	Kumar	\N	9876543210	ramesh@test.com	\N	\N	\N	Mathematics	Teacher	\N	\N	t	2026-05-29 00:36:10.898296
\.


--
-- Data for Name: transport_assignments; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.transport_assignments (id, student_id, route_id, pickup_point, drop_point) FROM stdin;
\.


--
-- Data for Name: transport_routes; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.transport_routes (id, school_id, route_name, vehicle_number, driver_name, driver_phone, created_at) FROM stdin;
\.


--
-- Data for Name: transport_stops; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.transport_stops (id, school_id, stop_name, stop_time, created_at) FROM stdin;
\.


--
-- Data for Name: transport_vehicles; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.transport_vehicles (id, school_id, vehicle_number, vehicle_type, capacity, driver_name, driver_phone, created_at) FROM stdin;
1	1	AP39AB1234	Bus	60	Ravi Kumar	9876543210	2026-05-30 11:04:11.226669
2	1	AP39CD5678	Bus	50	Suresh Kumar	9876543211	2026-05-30 11:04:11.226669
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: schooladmin
--

COPY public.users (id, school_id, full_name, email, phone, password_hash, role, is_active, last_login, created_at) FROM stdin;
2	1	tvkrao	tvkrao@gmail.com	\N	$2b$10$NTQr9AbTr9MG2r/km2JWXu6C8tf7fl/f2cQ1uYg9i5aCJeTsbvxrC	PRINCIPAL	t	\N	2026-05-31 10:14:00.828
1	1	Sankar Admin	admin@erp.com	\N	$2b$10$J9Jq8IZO3EJ30kHksQ.m3eS15QEMovGV4p9ver4kH6UZtFNdVGSS2	SUPER_ADMIN	t	\N	2026-05-29 00:10:03.520314
\.


--
-- Name: academic_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.academic_years_id_seq', 2, true);


--
-- Name: admission_leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.admission_leads_id_seq', 1, true);


--
-- Name: ai_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.ai_settings_id_seq', 1, false);


--
-- Name: ai_student_analysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.ai_student_analysis_id_seq', 1, false);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- Name: attendance_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.attendance_master_id_seq', 206, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.classes_id_seq', 20, true);


--
-- Name: communication_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.communication_logs_id_seq', 1, false);


--
-- Name: exam_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.exam_schedule_id_seq', 1, true);


--
-- Name: exam_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.exam_types_id_seq', 7, true);


--
-- Name: exams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.exams_id_seq', 3, true);


--
-- Name: fee_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.fee_categories_id_seq', 9, true);


--
-- Name: fee_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.fee_payments_id_seq', 2, true);


--
-- Name: fees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.fees_id_seq', 4, true);


--
-- Name: hostel_allocations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.hostel_allocations_id_seq', 1, false);


--
-- Name: hostel_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.hostel_rooms_id_seq', 1, true);


--
-- Name: hostel_students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.hostel_students_id_seq', 1, false);


--
-- Name: hostel_wardens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.hostel_wardens_id_seq', 1, false);


--
-- Name: hostels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.hostels_id_seq', 1, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: lead_followups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.lead_followups_id_seq', 1, false);


--
-- Name: marks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.marks_id_seq', 9, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: payment_receipts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.payment_receipts_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.permissions_id_seq', 68, true);


--
-- Name: question_bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.question_bank_id_seq', 4, true);


--
-- Name: question_paper_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.question_paper_questions_id_seq', 4, true);


--
-- Name: question_papers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.question_papers_id_seq', 1, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 68, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.roles_id_seq', 13, true);


--
-- Name: school_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.school_profile_id_seq', 1, false);


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.schools_id_seq', 2, true);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.sections_id_seq', 61, true);


--
-- Name: smtp_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.smtp_settings_id_seq', 1, false);


--
-- Name: student_exam_analysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.student_exam_analysis_id_seq', 1, false);


--
-- Name: student_exam_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.student_exam_answers_id_seq', 1, false);


--
-- Name: student_fee_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.student_fee_assignments_id_seq', 1, false);


--
-- Name: student_marks_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.student_marks_entry_id_seq', 1, false);


--
-- Name: student_promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.student_promotions_id_seq', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.students_id_seq', 1004, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.subjects_id_seq', 5, true);


--
-- Name: teacher_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.teacher_attendance_id_seq', 3, true);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.teachers_id_seq', 51, true);


--
-- Name: transport_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.transport_assignments_id_seq', 1, false);


--
-- Name: transport_routes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.transport_routes_id_seq', 1, false);


--
-- Name: transport_stops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.transport_stops_id_seq', 1, false);


--
-- Name: transport_vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.transport_vehicles_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schooladmin
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: admission_leads admission_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.admission_leads
    ADD CONSTRAINT admission_leads_pkey PRIMARY KEY (id);


--
-- Name: ai_settings ai_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.ai_settings
    ADD CONSTRAINT ai_settings_pkey PRIMARY KEY (id);


--
-- Name: ai_student_analysis ai_student_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.ai_student_analysis
    ADD CONSTRAINT ai_student_analysis_pkey PRIMARY KEY (id);


--
-- Name: attendance_master attendance_master_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.attendance_master
    ADD CONSTRAINT attendance_master_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: communication_logs communication_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.communication_logs
    ADD CONSTRAINT communication_logs_pkey PRIMARY KEY (id);


--
-- Name: exam_schedule exam_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.exam_schedule
    ADD CONSTRAINT exam_schedule_pkey PRIMARY KEY (id);


--
-- Name: exam_types exam_types_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.exam_types
    ADD CONSTRAINT exam_types_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: fee_categories fee_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fee_categories
    ADD CONSTRAINT fee_categories_pkey PRIMARY KEY (id);


--
-- Name: fee_payments fee_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_pkey PRIMARY KEY (id);


--
-- Name: fees fees_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_pkey PRIMARY KEY (id);


--
-- Name: hostel_allocations hostel_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_allocations
    ADD CONSTRAINT hostel_allocations_pkey PRIMARY KEY (id);


--
-- Name: hostel_rooms hostel_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_pkey PRIMARY KEY (id);


--
-- Name: hostel_students hostel_students_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_students
    ADD CONSTRAINT hostel_students_pkey PRIMARY KEY (id);


--
-- Name: hostel_wardens hostel_wardens_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_wardens
    ADD CONSTRAINT hostel_wardens_pkey PRIMARY KEY (id);


--
-- Name: hostels hostels_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostels
    ADD CONSTRAINT hostels_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: lead_followups lead_followups_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.lead_followups
    ADD CONSTRAINT lead_followups_pkey PRIMARY KEY (id);


--
-- Name: marks marks_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payment_receipts payment_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.payment_receipts
    ADD CONSTRAINT payment_receipts_pkey PRIMARY KEY (id);


--
-- Name: payment_receipts payment_receipts_receipt_number_key; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.payment_receipts
    ADD CONSTRAINT payment_receipts_receipt_number_key UNIQUE (receipt_number);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: question_bank question_bank_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.question_bank
    ADD CONSTRAINT question_bank_pkey PRIMARY KEY (id);


--
-- Name: question_paper_questions question_paper_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.question_paper_questions
    ADD CONSTRAINT question_paper_questions_pkey PRIMARY KEY (id);


--
-- Name: question_papers question_papers_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.question_papers
    ADD CONSTRAINT question_papers_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: school_profile school_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.school_profile
    ADD CONSTRAINT school_profile_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: schools schools_school_code_key; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_school_code_key UNIQUE (school_code);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: smtp_settings smtp_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.smtp_settings
    ADD CONSTRAINT smtp_settings_pkey PRIMARY KEY (id);


--
-- Name: student_exam_analysis student_exam_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_exam_analysis
    ADD CONSTRAINT student_exam_analysis_pkey PRIMARY KEY (id);


--
-- Name: student_exam_answers student_exam_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_exam_answers
    ADD CONSTRAINT student_exam_answers_pkey PRIMARY KEY (id);


--
-- Name: student_fee_assignments student_fee_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_fee_assignments
    ADD CONSTRAINT student_fee_assignments_pkey PRIMARY KEY (id);


--
-- Name: student_marks_entry student_marks_entry_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_marks_entry
    ADD CONSTRAINT student_marks_entry_pkey PRIMARY KEY (id);


--
-- Name: student_promotions student_promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_promotions
    ADD CONSTRAINT student_promotions_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: teacher_attendance teacher_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.teacher_attendance
    ADD CONSTRAINT teacher_attendance_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_employee_id_key UNIQUE (employee_id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: transport_assignments transport_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_assignments
    ADD CONSTRAINT transport_assignments_pkey PRIMARY KEY (id);


--
-- Name: transport_routes transport_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_pkey PRIMARY KEY (id);


--
-- Name: transport_stops transport_stops_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_stops
    ADD CONSTRAINT transport_stops_pkey PRIMARY KEY (id);


--
-- Name: transport_vehicles transport_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_vehicles
    ADD CONSTRAINT transport_vehicles_pkey PRIMARY KEY (id);


--
-- Name: student_marks_entry uq_student_question; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.student_marks_entry
    ADD CONSTRAINT uq_student_question UNIQUE (student_id, exam_schedule_id, question_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ai_student_analysis ai_student_analysis_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.ai_student_analysis
    ADD CONSTRAINT ai_student_analysis_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: ai_student_analysis ai_student_analysis_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.ai_student_analysis
    ADD CONSTRAINT ai_student_analysis_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: attendance attendance_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: audit_logs audit_logs_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: classes classes_class_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_class_teacher_id_fkey FOREIGN KEY (class_teacher_id) REFERENCES public.teachers(id);


--
-- Name: classes classes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: exams exams_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: fee_payments fee_payments_fee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_fee_id_fkey FOREIGN KEY (fee_id) REFERENCES public.fees(id);


--
-- Name: fee_payments fee_payments_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: fees fees_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: fees fees_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: hostel_rooms hostel_rooms_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: marks marks_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: marks marks_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: marks marks_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: notifications notifications_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: sections sections_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: sections sections_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: subjects subjects_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: teachers teachers_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: transport_routes transport_routes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: users users_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schooladmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- PostgreSQL database dump complete
--

\unrestrict UtCuDzTCn0YOUX6uk7wfFV5dTG5bzhRU0bcEsDgnOV61TJ0fcxJxkJTrMZoxKY3

