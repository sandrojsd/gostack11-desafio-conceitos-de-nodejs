const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { json } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title, 
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository){
    return response.status(400).json({ error: 'repository not exists'});
  }

  repository.title = title ? title : repository.title;
  repository.url = url ? url : repository.url;
  repository.techs = techs ? techs : repository.techs;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'repository not exists'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository){
    return response.status(400).json({ error: 'repository not exists'});
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
