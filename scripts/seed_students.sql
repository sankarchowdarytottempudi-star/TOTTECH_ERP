INSERT INTO students
(
school_id,
enrollment_number,
admission_number,
first_name,
last_name,
name,
gender,
phone,
email,
city,
state,
country,
religion,
blood_group,
father_name,
mother_name,
father_phone,
mother_phone,
school_class,
roll_number,
medium,
category,
house,
is_active
)

SELECT
1,
'ENR' || gs,
'ADM' || gs,

(
ARRAY[
'Sai Teja',
'Sai Kiran',
'Praneeth',
'Harsha',
'Lokesh',
'Manideep',
'Sravani',
'Bhavya',
'Deepika',
'Navya',
'Sindhu',
'Keerthana'
]
)[floor(random()*12+1)],

(
ARRAY[
'Rao',
'Reddy',
'Naidu',
'Kumar',
'Varma',
'Murthy'
]
)[floor(random()*6+1)],

'Student ' || gs,

CASE
WHEN random() > 0.5
THEN 'Male'
ELSE 'Female'
END,

'9' ||
floor(
100000000 + random()*900000000
),

'student' || gs || '@school.com',

(
ARRAY[
'Vijayawada',
'Guntur',
'Visakhapatnam',
'Tirupati',
'Rajahmundry',
'Kakinada',
'Nellore'
]
)[floor(random()*7+1)],

'Andhra Pradesh',
'India',

(
ARRAY[
'Hindu',
'Christian',
'Muslim'
]
)[floor(random()*3+1)],

(
ARRAY[
'A+',
'B+',
'O+',
'AB+'
]
)[floor(random()*4+1)],

'Venkata Rao',
'Lakshmi',

'9' ||
floor(
100000000 + random()*900000000
),

'9' ||
floor(
100000000 + random()*900000000
),

((random()*9)+1)::int::text,

gs::text,

'English',

'General',

(
ARRAY[
'Red',
'Blue',
'Green',
'Yellow'
]
)[floor(random()*4+1)],

true

FROM generate_series(
1,
1000
) gs;
