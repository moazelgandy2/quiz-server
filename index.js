const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");

const prisma = new PrismaClient();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.json());
const port = process.env.PORT || 3001;

app.get("/quizzes", async (req, res) => {
  const quizzes = await prisma.quizzes.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  if (!quizzes) {
    res.json({ error: "No quizzes found" });
    return;
  }
  res.json(quizzes);
});

app.get("/lastQuiz", async (req, res) => {
  const quiz = await prisma.quizzes.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  if (!quiz) {
    res.json({ error: "No quiz found" });
    return;
  }
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

app.post("/student", async (req, res) => {
  const { name, quizId, score } = req.body;
  const student = await prisma.students.create({
    data: {
      name,
      quizId: Number(quizId),
      score: Number(score),
    },
  });
  if (!student) {
    res.json({ error: "Student not created" });
    return;
  }
  res.json(student);
});

app.get("/firstQuiz", async (req, res) => {
  const quiz = await prisma.quizzes.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });
  if (!quiz) {
    res.json({ error: "No quiz found" });
    return;
  }
  res.json(quiz);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
