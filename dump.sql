create database projeto;

create table usuarios(
  id serial primary key,
  nome text not null,
  email text unique not null,
  senha text not null
);

create table categorias(
  id serial primary key,
  descricao text
);

insert into categorias (descricao)
values ('informática'),
	('celulares'),
  ('beleza e perfumaria'),
  ('mercado'),
  ('livros e papelaria'),
  ('brinquedos'),
  ('moda'),
  ('bebe'),
  ('games');

-- sprint 2
create table produtos(
  id serial primary key,
  descricao text,
  quantidade_estoque int,
  valor int not null,
  categoria_id int references categorias(id)
);

create table clientes(
  id serial primary key,
  nome text not null,
  email text unique not null,
  cpf text unique not null,
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  estado text
);