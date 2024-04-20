const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(cors({ origin: "*" })); // Allow requests from all origins

app.get("/quizzes", async (req, res) => {
  const quizzes = await prisma.quizzes.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json(quizzes);
});

app.get("/lastQuiz", async (req, res) => {
  const quiz = await prisma.quizzes.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  const quizId = quiz.id;
  res.json(quizId);
});

app.get("/secret", async (req, res) => {
  const secret = await prisma.secret.findFirst({
    where: {
      valid: true,
    },
  });
  if (secret == null) {
    const backUp = {
      secret: "01556271045",
    };
    res.json(backUp);
    return;
  }
  res.json(secret);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
