const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = 5000;
const weatherModel = require("./model");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/postWeather", async (req, res) => {
  const { city, unit, temp, description } = req.body;

  if (!city || !unit) {
    return res.status(400).json({ error: "City and unit are required." });
  }

  try {
    const weather = new weatherModel({
      city,
      unit,
      temp,
      description,
    });
    await weather.save();

    res.json({ message: "Data received and saved successfully!", weather });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Unable to save weather data." });
  }
});

app.get("/getWeather", async (req, res) => {
  try {
    const weatherData = await weatherModel.find();
    res.json(weatherData);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Unable to retrieve weather data." });
  }
});

app.delete("/deleteWeather/:city", async (req, res) => {
  try {
    const cityToDelete = req.params.city;

    if (!cityToDelete || cityToDelete.length === 0) {
      return res
        .status(400)
        .send({ message: "City name is required for deletion" });
    }

    const deletionResult = await weatherModel.deleteOne({
      city: cityToDelete,
    });

    if (deletionResult.deletedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "City not found" });
    }

    res.send({ success: true, message: `${cityToDelete} deleted` });
  } catch (error) {
    res.status(500).send("Error deleting weather data.");
    console.log(error);
  }
});

mongoose
  .connect(
    "<Add your database link>",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
