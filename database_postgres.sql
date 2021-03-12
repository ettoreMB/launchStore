CREATE TABLE "prodcuts" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "deleted_at" timestamp,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

INSERT INTO categories(name) VALUES ('comida');
INSERT INTO categories(name) VALUES ('eletrônicos');
INSERT INTO categories(name) VALUES ('automóveis');

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL,
  "product_id" int
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "cep" text,
  "address" text,
  "reset_token" text,
  "reset_token_expires" text, 
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "orders" (
  "id" SERIAL  PRIMARY KEY,
  "seller_id" int NOT NULL,
  "buyer_id" int NOT NULL,
  "product_id" int NOT NULL,
  "price" int NOT NULL,
  "quantity" int NOT NULL,
  "total" int not NULL,
  "status" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);


--foreign Key
ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");
ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "product_with_deleted" ("id") ON DELETE CASCADE;


ALTER TABLE "orders" ADD FOREIGN KEY ("seller_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD FOREIGN KEY ("buyer_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

--session  pg simple
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");


--procedures

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at =NOW();
  RETURN NEW;
END;
$$LANGUAGE plpgsql;


-- auto updated at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON product_with_deleted
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- Soft Delete -- 
CREATE OR REPLACE RULE delete_product AS
ON DELETE TO product_with_deleted DO INSTEAD
UPDATE products
SET deleted_at = now()
WHERE products.id = old.id;

-- Cretae View Products 
CREATE VIEW products_without_deleted AS
SELECT * FROM products WHERE deleted_at IS NULL;

--renomear view e table
ALTER TABLE products RENAME TO product_with_deleted;
ALTER VIEW products_without_deleted RENAME TO products;

--Delete querys ---
DELETE FROM users;
DELETE FROM products;
DELETE FROM files;

ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1	