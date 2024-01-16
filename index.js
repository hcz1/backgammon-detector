const cv = require("@u4/opencv4nodejs");
const Jimp = require("jimp");

async function extractBackgammonBoard(imagePath) {
  // Load the image
  const image = await Jimp.read(imagePath);
  const mat = new cv.Mat(
    image.bitmap.data,
    image.bitmap.height,
    image.bitmap.width,
    cv.CV_8UC4
  );

  // Convert to grayscale
  const gray = mat.cvtColor(cv.COLOR_BGR2GRAY);

  // Apply Canny edge detection
  const edges = gray.canny(50, 150);

  // Find contours
  const contours = edges.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // Filter contours based on shape and size to identify the backgammon board
  // This step will depend on the specific characteristics of your images
  const boardContour = contours.sort((c1, c2) => c2.area - c1.area)[0];

  // Extract the region of interest
  const roi = mat.getRegion(boardContour.boundingRect());

  // Convert the ROI to a Jimp image and save it
  const boardImage = new Jimp({
    data: Buffer.from(roi.getData()),
    width: roi.cols,
    height: roi.rows,
  });
  await boardImage.writeAsync("board.png");
}

extractBackgammonBoard("photo.jpg");
