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

