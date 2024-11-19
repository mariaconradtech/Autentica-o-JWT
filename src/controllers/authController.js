const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const secretKey = process.env.SECRET_KEY;

const login = (request, response) => {
  const { username, password } = request.body;

  if (username === "professor.lucas" && password === "1234") {
    const payload = {
      sub: username,
      name: "Lucas José de Souza",
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
    return response.json({ message: "Login bem-sucedido!", token });
  }

  response.status(401).json({ message: "Credenciais inválidas" });
};

const verifyToken = (request, response, next) => {
  const token = request.headers["authorization"];

  if (!token) {
    return response.status(403).json({ message: "Token não fornecido" });
  }

  try {
    const bearerToken = token.split(" ")[1];
    const decoded = jwt.verify(bearerToken, secretKey);
    request.user = decoded;
    next();
  } catch (error) {
    return response.status(403).json({ message: "Token inválido ou expirado" });
  }
};

const protectedContent = (request, response) => {
  response.json({ message: "Conteúdo protegido acessado!", user: request.user });
};

const profile = (request, response) => {
  response.json({ message: "Perfil protegido acessado!", user: request.user });
};

const settings = (request, response) => {
  response.json({ message: "Configurações protegidas acessadas!", user: request.user });
};

app.post("/login", login);
app.get("/protected", verifyToken, protectedContent);
app.get("/profile", verifyToken, profile);
app.get("/settings", verifyToken, settings);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
