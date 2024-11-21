const { Schema, model } = require("mongoose");

const calendarData = new Schema({
    guildId: {
        type: String,
        required: true,
    },
  monday: {
    type: String,
    default: "undefined",
  },
  tuesday: {
    type: String,
    default: "undefined",
  },
  wednesday: {
    type: String,
    default: "undefined",
  },
  thursday: {
    type: String,
    default: "undefined",
  },
  friday: {
    type: String,
    default: "undefined",
  },
  saturday: {
    type: String,
    default: "undefined",
  },
  sunday: {
    type: String,
    default: "undefined",
  },
});

module.exports = model("calendarData", calendarData);