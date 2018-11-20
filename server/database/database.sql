CREATE DATABASE sendit_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;


CREATE TABLE public.users
(
    userid SERIAL,
    firstname VARCHAR (100) NOT NULL,
    lastname VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL,
    password VARCHAR (100) NOT NULL,
    isadmin boolean NOT NULL DEFAULT false,
    createdat timestamp with time zone NOT NULL,
    updatedat timestamp with time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (userid),
    CONSTRAINT users_email_key UNIQUE (email)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;



CREATE TABLE public.parcels
(
    parcelid SERIAL,
    weight FLOAT NOT NULL,
	description VARCHAR (255),
    deliverymethod VARCHAR (50) NOT NULL,
	pickupaddress VARCHAR (150) NOT NULL,
	pickupcity VARCHAR (100) NOT NULL,
	pickupstate VARCHAR (100) NOT NULL,
	pickupdate DATE NOT NULL,
    destinationaddress VARCHAR (150) NOT NULL,
	destinationcity VARCHAR (100) NOT NULL,
	destinationstate VARCHAR (100) NOT NULL,
	deliverystatus VARCHAR (50) NOT NULL DEFAULT 'Placed'::character varying,
	presentlocation VARCHAR (100) NOT NULL DEFAULT 'Not available'::character varying,
	trackingno VARCHAR (100) NOT NULL,
	price real NOT NULL,
	senton timestamp with time zone DEFAULT NULL,
	deliveredon timestamp with time zone DEFAULT NULL,
	receivername VARCHAR (50) NOT NULL,
	receiverphone VARCHAR (50) NOT NULL,
	userid integer NOT NULL,
    createdat timestamp with time zone NOT NULL,
    updatedat timestamp with time zone NOT NULL,
    CONSTRAINT parcels_trackingno_key UNIQUE (trackingno),
    CONSTRAINT parcels_userid_fkey FOREIGN KEY (userid)
        REFERENCES public.users (userid) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.parcels
    OWNER to postgres;