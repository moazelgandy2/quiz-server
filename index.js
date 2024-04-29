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
    where: {
      valid: true,
    },
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
    where: {
      valid: true,
    },
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
      secret: "masterkey",
    };
    res.json(backUp);
    return;
  }
  res.json(secret);
});

app.post("/student", async (req, res) => {
  const { name, quizId, score } = req.body;

  // Check if the provided quizId exists in the database
  const checkQuizId = await prisma.quizzes.findFirst({
    where: {
      id: Number(quizId),
    },
  });

  // If the provided quizId doesn't exist, set it to the latest quiz ID
  let correctedQuizId = quizId;
  if (!checkQuizId) {
    const latestQuiz = await prisma.quizzes.findFirst({
      orderBy: {
        id: "desc",
      },
    });
    correctedQuizId = latestQuiz ? latestQuiz.id : null;
  }

  try {
    // Create the student record with the corrected quizId
    const student = await prisma.students.create({
      data: {
        name,
        quizId: Number(correctedQuizId),
        score: Number(score),
      },
    });

    res.json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student." });
  }
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
