import type { ReactNode } from "react";
import PsychicText from "../components/PsychicText";
import { StatusLabel } from "../components/site/ProjectList";
import { PageHeader } from "../components/site/Section";
import { BUTTON_PRIMARY, CARD, LINK_CLASS, formatMonth } from "../components/site/styles";
import { contact, education, experience, personalProjects, profile, projects, resume, skills, spokenLanguages } from "../data/site";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/** Résumé text is plain: drop the **keyword** markers the site uses for emphasis. */
const plain = (text: string) => text.replace(/\*\*/g, "");

const SECTION_LABEL = "text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50";

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-x-8 gap-y-2 border-t border-dashed border-ink/15 py-5 md:grid-cols-[9rem_1fr] print:grid-cols-[6.5rem_1fr] print:gap-x-5 print:py-2.5">
      <h3 className={`${SECTION_LABEL} md:pt-1 print:pt-0.5`}>{title}</h3>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** A concise CV: the site's content, in the order recruiters read it, with a downloadable ATS-friendly PDF. */
export default function ResumePage() {
  useDocumentTitle("Resume");
  const job = experience[0];

  return (
    <>
      <div className="print-hidden">
        <PageHeader title="Resume">
          <p>
            <PsychicText split="words" text="The short version, for recruiters. Download the one-page, ATS-friendly PDF." />
          </p>
        </PageHeader>
        <a href={resume.pdf} download className={`mt-6 ${BUTTON_PRIMARY}`}>
          Download PDF
        </a>
      </div>

      <article
        className={`${CARD} mt-[clamp(1.5rem,1rem+2vw,2.5rem)] max-w-[56rem] text-[0.94rem] leading-relaxed text-ink/85 print:mt-0 print:max-w-none print:text-[9.5pt] print:leading-snug`}
      >
        <header className="pb-5 print:pb-3">
          <h2 className="font-serif text-[clamp(1.9rem,1.6rem+1.2vw,2.5rem)] leading-tight text-ink print:text-[22pt]">{profile.name}</h2>
          <p className="mt-1 font-medium text-accent">{resume.headline}</p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/65">
            <span>{profile.location}</span>
            <a href={`mailto:${contact.email}`} className={LINK_CLASS}>
              {contact.email}
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className={LINK_CLASS}>
              LinkedIn
            </a>
            <a href={contact.github} target="_blank" rel="noreferrer" className={LINK_CLASS}>
              GitHub
            </a>
          </p>
        </header>

        <ResumeSection title="Summary">
          <p>{resume.summary}</p>
        </ResumeSection>

        <ResumeSection title="Skills">
          <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[8.5rem_1fr]">
            {skills.map((group) => (
              <div key={group.label} className="contents">
                <dt className="font-medium text-ink">{group.label}</dt>
                <dd className="mb-1.5 text-ink/75 sm:mb-0">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </ResumeSection>

        <ResumeSection title="Experience">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="font-semibold text-ink">
              {job.role} — {job.company}, {job.location}
            </p>
            <p className="text-sm text-ink/55">
              {formatMonth(job.start)} – {job.end ? formatMonth(job.end) : "Present"}
            </p>
          </div>
          <p className="mt-1 text-ink/75">{job.summary}</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-ink/35 print:mt-1.5 print:space-y-1">
            {job.highlights.map((item) => (
              <li key={item.label} className="print:break-inside-avoid">
                <span className="font-medium text-ink">
                  {item.label}
                  {item.status ? ` (${item.status.toLowerCase()})` : ""}:
                </span>{" "}
                {plain(item.text)}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink/65">
            <span className="font-medium text-ink">Impact:</span>{" "}
            {job.metrics.map((metric) => `${metric.value} ${metric.label}`).join(" · ")}
          </p>
        </ResumeSection>

        <ResumeSection title="Projects">
          <ul className="space-y-2.5 print:space-y-1.5">
            {projects.slice(0, 4).map((project) => (
              <li key={project.id} className="print:break-inside-avoid">
                <span className="inline-flex flex-wrap items-center gap-2 font-medium text-ink">
                  {project.title}
                  {project.status && <StatusLabel text={project.status} />}
                </span>
                <span className="block text-ink/75">{project.blurb}</span>
                <span className="block text-xs text-ink/50">{project.stack.join(" · ")}</span>
              </li>
            ))}
            {personalProjects.map((project) => (
              <li key={project.title} className="print:break-inside-avoid">
                <span className="font-medium text-ink">{project.title}</span>
                <span className="text-sm text-ink/50"> · personal project</span>
                <span className="block text-ink/75">{project.description}</span>
                <span className="block text-xs text-ink/50">{project.stack.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection title="Education">
          <ul className="space-y-2.5">
            {education.map((entry) => (
              <li key={entry.degree} className="grid grid-cols-[1fr_auto] gap-x-4">
                <span>
                  <span className="block font-medium text-ink">{entry.degree}</span>
                  <span className="block text-ink/70">{entry.school}</span>
                </span>
                <span className="text-right text-sm text-ink/60">
                  {entry.year} · {entry.detail}
                </span>
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection title="Languages">
          <p>{spokenLanguages.join(", ")}</p>
        </ResumeSection>
      </article>
    </>
  );
}
