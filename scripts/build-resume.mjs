/**
 * Builds public/Gaurav-Bangade-Resume.pdf from src/data/site.ts, so the PDF
 * and the /resume page always say the same thing.
 *
 *   npm run resume
 *
 * Needs Node 22.18+ (it imports site.ts directly) and Google Chrome. Set
 * CHROME_PATH if Chrome lives somewhere else.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const site = await import(pathToFileURL(join(root, "src/data/site.ts")).href);
const { contact, education, experience, personalProjects, profile, resume, skills, spokenLanguages } = site;

const chrome = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const out = join(root, "public", resume.pdf.replace(/^\//, ""));

const esc = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** **keyword** markers become bold. */
const rich = (text) => esc(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const month = (ym) => `${months[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const jobs = experience
  .map(
    (job) => `
    <div class="row"><b>${esc(job.role)} | ${esc(job.company)}, ${esc(job.location)}</b><span>${month(job.start)} – ${job.end ? month(job.end) : "Present"}</span></div>
    <ul>${job.highlights
      .map((h) => `<li><b>${esc(h.label)}${h.status ? ` (${esc(h.status.toLowerCase())})` : ""}:</b> ${rich(h.text)}</li>`)
      .join("")}</ul>`,
  )
  .join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(profile.name)} – Resume</title>
<style>
  @page { size: A4; margin: 13mm 15mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 9.6pt; line-height: 1.36; color: #111; }
  h1 { margin: 0; font-size: 21pt; letter-spacing: 0.02em; }
  .headline { margin: 2px 0 3px; font-weight: bold; font-size: 10.5pt; }
  .contact { margin: 0; }
  .contact a { color: #1a4fa0; text-decoration: none; }
  h2 { margin: 9px 0 4px; padding-bottom: 2px; border-bottom: 1.2px solid #111; font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.04em; }
  p { margin: 0; }
  ul { margin: 3px 0 0; padding-left: 15px; }
  li { margin: 0 0 2.5px; }
  .row { display: flex; justify-content: space-between; gap: 12px; }
  .row span { white-space: nowrap; }
  .skills li, .edu li { margin-bottom: 1.5px; }
</style></head><body>
  <h1>${esc(profile.name.toUpperCase())}</h1>
  <p class="headline">${esc(resume.headline)}</p>
  <p class="contact">${esc(profile.location)} | <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a> | <a href="${esc(contact.linkedin)}">${esc(bare(contact.linkedin))}</a> | <a href="${esc(contact.github)}">${esc(bare(contact.github))}</a> | <a href="${esc(contact.website)}">${esc(bare(contact.website))}</a></p>

  <h2>Summary</h2>
  <p>${esc(resume.summary)}</p>

  <h2>Experience</h2>
  ${jobs}

  <h2>Technical Skills</h2>
  <ul class="skills">${skills.map((g) => `<li><b>${esc(g.label)}:</b> ${esc(g.items.join(", "))}</li>`).join("")}</ul>

  <h2>Side Projects</h2>
  <ul>${personalProjects.map((p) => `<li><b>${esc(p.title)}</b> (${esc(p.stack.join(", "))}): ${esc(p.description)}</li>`).join("")}</ul>

  <h2>Education</h2>
  <ul class="edu">${education
    .map((e) => `<li><div class="row"><span><b>${esc(e.degree)}</b>, ${esc(e.school)}</span><span>${esc(e.detail)} | ${esc(e.year)}</span></div></li>`)
    .join("")}</ul>

  <h2>Languages</h2>
  <p>${esc(spokenLanguages.join(", "))}</p>
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), "resume-"));
const page = join(dir, "resume.html");
writeFileSync(page, html);
try {
  execFileSync(chrome, ["--headless", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${out}`, pathToFileURL(page).href], { stdio: "pipe" });
  console.log(`Wrote ${out}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
