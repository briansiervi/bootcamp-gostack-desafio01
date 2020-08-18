const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({
      error: 'Invalid repository.'
    });
  }

  const {title, url, techs} = request.body;
  const repositoryIndex = repositories.findIndex(repo => repo.id == id);
  const repository = {title, url, techs};

  repositories[repositoryIndex].title = repository.title;
  repositories[repositoryIndex].url = repository.url;
  repositories[repositoryIndex].techs = repository.techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({
      error: 'Invalid repository.'
    });
  }

  const repositoryIndex = repositories.findIndex(repo => repo.id == id);
  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({
      error: 'Invalid repository.'
    });
  }

  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: 'Repository not found.'
    });
  }

  const repository = repositories[repositoryIndex];
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
