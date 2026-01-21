const fs = require("fs/promises");
const path = require("path");
const puppeteer = require("puppeteer");

const TEMPLATE_PATH = path.resolve(__dirname, "../templates/ticket.html");
const OUTPUT_DIR = path.resolve(__dirname, "../public/tickets");

// Ensure OUTPUT_DIR exists (create if not)
async function ensureOutputDir() {
  try {
    await fs.access(OUTPUT_DIR);
  } catch {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
}

async function generateTicketPDF(ticketData) {
  await ensureOutputDir();

  // Read template
  let template = await fs.readFile(TEMPLATE_PATH, "utf8");

  // Build passenger rows HTML
  const passengerRows = ticketData.passengers
    .map(
      (p, i) => `<tr>
  <td>${i + 1}</td>
  <td>${p.name}</td>
  <td>${p.gender}</td>
  <td>${p.age}</td>
  <td>${p.seat}</td>
</tr>`
    )
    .join("");

  // Replace placeholders (simple but effective)
  template = template
    .replace(/{{source}}/g, ticketData.source)
    .replace(/{{destination}}/g, ticketData.destination)
    .replace(/{{journeyDay}}/g, ticketData.journeyDay)
    .replace(/{{journeyDate}}/g, ticketData.journeyDate)
    .replace(/{{reportingTime}}/g, ticketData.reportingTime)
    .replace(/{{departureTime}}/g, ticketData.departureTime)
    .replace(/{{boardingPoint}}/g, ticketData.boardingPoint)
    .replace(/{{landmark}}/g, ticketData.landmark || "")
    .replace(/{{busName}}/g, ticketData.busName)
    .replace(/{{busType}}/g, ticketData.busType)
    .replace(/{{passengerName}}/g, ticketData.passengers.map((p) => p.name).join(", "))
    .replace(/{{seatNumbers}}/g, ticketData.passengers.map((p) => p.seat).join(", "))
    .replace(/{{passengerRows}}/g, passengerRows)
    .replace(/{{ticketId}}/g, ticketData.ticketId)
    .replace(/{{pnr}}/g, ticketData.pnr || "N/A")
    .replace(/{{totalFare}}/g, ticketData.totalPaid.toFixed(2))
    .replace(/{{supportPhone}}/g, ticketData.supportPhone || "1800-123-456")
    .replace(/{{supportEmail}}/g, ticketData.supportEmail || "support@timebus.com")
    .replace(/{{logoUrl}}/g, ticketData.logoUrl || "./assets/logo.png")
    .replace(/{{helpIconUrl}}/g, ticketData.helpIconUrl || "./assets/help-icon.png");

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Set HTML content
  await page.setContent(template, { waitUntil: "networkidle0" });

  // Generate PDF buffer
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });

  await browser.close();

  // Save file
  const fileName = `ticket-${ticketData.ticketId}.pdf`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  await fs.writeFile(filePath, pdfBuffer);

  // Return accessible URL (set BASE_URL in env for production)
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl}/tickets/${fileName}`;
}

module.exports = generateTicketPDF;
