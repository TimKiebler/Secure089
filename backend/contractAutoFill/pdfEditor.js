import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import { getUserData } from "./fetchUserData.js";

// Constants
const TEMPLATE_PATH = "backend/contractAutoFill/Personalfragebogen-KB-MJ.pdf";
const OUTPUT_PATH = "backend/contractAutoFill/filled-contract.pdf";

// Main function to fetch user data and fill the PDF
async function fetchUserAndFillPDF(email) {
  try {
    const userData = await getUserData(email);
    if (!userData) {
      throw new Error("User not found");
    }

    await fillPDF(userData);
    console.log("PDF saved as: filled-contract.pdf");
  } catch (error) {
    console.error("Error fetching user data or filling PDF:", error);
  }
}

// Function to fill the PDF with user data
async function fillPDF(userData) {
  const pdfDoc = await loadPDFTemplate();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const form = pdfDoc.getForm();
  const [firstPage, secondPage, thirdPage] = pdfDoc.getPages();

  fillFormFields(form, userData);
  fillGenderField(firstPage, font, userData.additionalData?.gender);
  fillInsuranceField(firstPage, font, userData.additionalData?.insuranceDetails?.insuranceType);
  fillJobTypeField(firstPage, font, userData.additionalData?.otherJobDetails?.jobType);
  fillSecondPage(secondPage, font, userData.firstName, userData.lastName, userData.additionalData?.taxDetails?.socialSecurityNumber);
  fillThirdPage(thirdPage, font, "Adrian Meta", "74240237");

  await savePDF(pdfDoc);
}

// Function to load the PDF template
async function loadPDFTemplate() {
  const templateBytes = fs.readFileSync(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  return pdfDoc;
}

// Function to fill form fields with user data
function fillFormFields(form, userData) {
  const fieldMapping = {
    "Vorname (Minijob)": userData.firstName,
    "Nachname (Minijob)": userData.lastName,
    "E-Mail-Adresse (Minijob)": userData.email,
    "Telefonnummer (Minijob)": userData.additionalData?.phoneNumber,
    "Geburtsdatum (Minijob)": userData.additionalData?.dateOfBirth,
    "Staatsangehrigkeit (Minijob)": userData.additionalData?.nationality,
    "Geburtsname (Minijob)": userData.additionalData?.birthDetails?.birthName,
    "Geburtsort (Minijob)": userData.additionalData?.birthDetails?.birthPlace,
    "Geburtsland (Minijob)": userData.additionalData?.birthDetails?.birthCountry,
    "Straße und Hausnummer (Minijob)": `${userData.additionalData?.address?.street} ${userData.additionalData?.address?.houseNumber}`,
    "Postleitzahl (Minijob)": userData.additionalData?.address?.postalCode,
    "Ort (Minijob)": userData.additionalData?.address?.city,
    "Steueridentifikationsnummer (Minijob)": userData.additionalData?.taxDetails?.taxId,
    "Sozial-/Rentenversicherungsnummer (Minijob)": userData.additionalData?.taxDetails?.socialSecurityNumber,
    "Krankenkasse (Minijob)": userData.additionalData?.insuranceDetails?.healthInsurance,
    "Name des Kreditinstituts (Minijob)": userData.additionalData?.bankDetails?.bankName,
    "Kontoinhaber (Minijob)": userData.additionalData?.bankDetails?.bankAccountHolder,
    "IBAN (Minijob)": userData.additionalData?.bankDetails?.iban,
    "Arbeitgeber 1 (Minijob)": userData.additionalData?.otherJobDetails?.companyName,
    "Beginn der Beschäftigung 1 (Minijob)": userData.additionalData?.otherJobDetails?.startDate,
    "Verdienst in Euro pro Monat 1 (Minijob)": userData.additionalData?.otherJobDetails?.salary,
  };

  for (const [fieldName, value] of Object.entries(fieldMapping)) {
    if (value && form.getTextField(fieldName)) {
      form.getTextField(fieldName).setText(value);
    }
  }
}

// Function to fill the gender field
function fillGenderField(page, font, gender) {
  const positions = {
    maennlich: { x: 62, y: 725 },
    weiblich: { x: 98, y: 725 },
    divers: { x: 136, y: 725 },
  };

  if (positions[gender]) {
    drawTextOnPdf(positions[gender], "X", font, page);
  }
}

// Function to fill the insurance type field
function fillInsuranceField(page, font, insuranceType) {
  const positions = {
    gesetzlich: { x: 62, y: 413 },
    privat: { x: 118, y: 413 },
  };

  if (positions[insuranceType]) {
    drawTextOnPdf(positions[insuranceType], "X", font, page);
  }
}

// Function to fill the job type field
function fillJobTypeField(page, font, jobType) {
  const positions = {
    geringfügig: { x: 143, y: 285 },
    sozialversicherungspflichtig: { x: 143, y: 272 },
  };

  if (positions[jobType]) {
    drawTextOnPdf(positions[jobType], "X", font, page);
  }
}

// Function to fill the second page
function fillSecondPage(page, font, firstName, lastName, socialSecurityNumber) {
  drawTextOnPdf({ x: 110, y: 390, size: 12 }, firstName, font, page);
  drawTextOnPdf({ x: 110, y: 353, size: 12 }, lastName, font, page);
  drawTextOnPdf({ x: 197, y: 320, size: 15 }, spacedNumber(socialSecurityNumber), font, page);
}

// Function to fill the third page
function fillThirdPage(page, font, ceo, CompanyID) {
  drawTextOnPdf({ x: 115, y: 640, size: 12 }, ceo, font, page);
  drawTextOnPdf({ x: 140, y: 614, size: 15 }, spacedNumber(CompanyID), font, page);
}

// Function to draw text on the PDF
function drawTextOnPdf(position, text, font, page) {
  page.drawText(text, {
    x: position.x,
    y: position.y,
    size: position.size || 12,
    font,
    color: rgb(0, 0, 0),
  });
}

// Function to format a number with spaces
function spacedNumber(number) {
  return String(number)
    .split("")
    .map((digit) => ` ${digit} `)
    .join("");
}

// Function to save the modified PDF
async function savePDF(pdfDoc) {
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(OUTPUT_PATH, pdfBytes);
}

// Example usage
fetchUserAndFillPDF("tim.kiebler@gmx.de");