function predict() {
  // ml model prediction
  // expected parameter (model, image)

  // dummy return
  const diseases = [
    "Apple Scab",
    "Black Rot",
    "Cedar Apple Rust",
    "Bacterial Spot",
    "Powdery Mildew",
    "Gray Leaf Spot",
    "Common Rust",
    "Northern Leaf Blight",
    "Esca",
    "Leaf Blight",
    "Huanglongbing",
    "Early Blight",
    "Late Blight",
    "Leaf Scorch",
    "Leaf Mold",
    "Septoria Leaf Spot",
    "Spider Mites",
    "Target Spot",
    "Tomato Yellow Leaf Curl Virus",
    "Tomato Mosaic Virus"
  ];
  const disease = diseases[Math.floor(Math.random() * 20)]
  const percentage = Math.random() * 100;

  return { disease, percentage };
}

module.exports = predict;
