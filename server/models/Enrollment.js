const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    course: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    approved: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = Enrollment = mongoose.model("enrollments", EnrollmentSchema);
