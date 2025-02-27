import { BlendMode, PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import { getUserData } from "./fetchUserData.js";

// Constants
const TEMPLATE_PATH = "/Users/timkiebler/HTML/Secure089/Secure089/backend/contractAutoFill/BadgeFront.pdf";
const OUTPUT_PATH = "backend/contractAutoFill/filled-badge.pdf";

// Main function to fetch user data and fill the PDF
export async function fetchUserAndFillBadge(email) {
  try {
    const userData = await getUserData(email);
    if (!userData) {
      throw new Error("User not found");
    }

    //await fillPDF(userData);
    const pdfBytes = await fillPDF(userData);
    console.log("PDF saved as: filled-badge.pdf");
    return pdfBytes;
  } catch (error) {
    console.error("Error fetching user data or filling PDF:", error);
  }
}

// Function to fill the PDF with user data
async function fillPDF(userData) {
  const pdfDoc = await loadPDFTemplate();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const [ firstPage ] = pdfDoc.getPages();
  

  const name = userData.firstName + " " + userData.lastName;
  fillGuardIDField(firstPage, font, userData.additionalData?.guardId);
  fillNameField(firstPage, font, name);
  fillBadgeNumberField(firstPage, font, generateBadgeNumber().toString());

  //await savePDF(pdfDoc);
  const pdfBytes = await pdfDoc.save(); // Save the PDF and return the bytes
  return pdfBytes;
}

// Function to load the PDF template
async function loadPDFTemplate() {
  const templateBytes = fs.readFileSync(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  return pdfDoc;
}

// Function to fill the guardID field
function fillGuardIDField(page, font, guardID) {
    //drawTextOnPdf({ x: 297, y: 740 }, guardID, font, page);
    drawTextOnPdf({ x: 310, y: 290 }, guardID, font, page);
}

// Function to fill the name field
function fillNameField(page, font, name) {
    drawTextOnPdf({ x: 310, y: 235 }, name, font, page);
}

// Function to fill the badgeNumber field
function fillBadgeNumberField(page, font, badgeNumber) {
    drawTextOnPdf({ x: 290, y: 175 }, badgeNumber, font, page);
}

// Function to draw text on the PDF
function drawTextOnPdf(position, text, font, page) {
  
  page.drawText(text, {
    x: position.x,
    y: position.y,
    size: 33, //position.size || 20,
    font,
    color: rgb(0, 0, 0),
  });
}

function generateBadgeNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Function to save the modified PDF
async function savePDF(pdfDoc) {
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(OUTPUT_PATH, pdfBytes);
}

// Example usage
//fetchUserAndFillBadge("tim.kiebler@gmx.de");