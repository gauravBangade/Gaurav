import { Link } from "react-router-dom";
import PsychicText from "../components/PsychicText";
import { StatusLabel, WorkProjectGrid } from "../components/site/ProjectList";
import { Section } from "../components/site/Section";
import SkillsCarousel from "../components/site/SkillsCarousel";
import TrainerCardHero from "../components/site/TrainerCardHero";
import { ArrowRightIcon, MailIcon } from "../components/site/icons";
import {
  BODY_TEXT,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  CARD,
  CARD_LINK,
  FOCUS_RING,
  LINK_CLASS,
  PIXEL_LABEL,
  PROSE,
  formatMonth,
} from "../components/site/styles";
import { contact, education, experience, projects, spokenLanguages } from "../data/site";
import { party, spriteSrc } from "../data/party";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const GAP = "gap-[clamp(0.75rem,0.5rem+0.8vw,1.25rem)]";

/** "See all" style link on the right of a section heading. */
function SectionLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className={`flex items-center gap-1 rounded text-sm text-ink/60 transition hover:text-accent ${FOCUS_RING}`}>
      {children}
      <ArrowRightIcon className="h-3.5 w-3.5" />
    </Link>
  );
}

function ExperienceCard() {
  const job = experience[0];

  return (
    <article className={CARD}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h3 className="text-lg font-semibold">
            <PsychicText split="words" text={job.company} />
          </h3>
          <p className="text-[0.94rem] text-ink/65">
            <PsychicText split="words" text={`${job.role} · ${job.location}`} />
          </p>
        </div>
        <p className="text-sm text-ink/50">
          <time dateTime={job.start}>{formatMonth(job.start)}</time>
          <span aria-hidden="true"> — </span>
          <span className="sr-only"> to </span>
          {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : "Present"}
        </p>
      </div>

      <p className={`mt-3 ${PROSE} ${BODY_TEXT}`}>
        <PsychicText split="words" text={job.summary} />
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
        {job.metrics.map((metric) => (
          // dt stays first for the dl's semantics; order-first draws the value above it, top-aligned.
          <div key={metric.label} className="flex flex-col border-l-2 border-dotted border-ink/20 pl-3">
            <dt className="text-xs leading-snug text-ink/55">{metric.label}</dt>
            <dd className="order-first text-[clamp(1.15rem,1rem+0.6vw,1.5rem)] font-semibold text-ink">{metric.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 border-t border-dashed border-ink/15 pt-4">
        <h4 className={PIXEL_LABEL}>What I work on</h4>
        <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {job.highlights.map((item) => (
            <li key={item.label} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.94rem] text-ink/85">
              <span aria-hidden="true" className="font-pixel text-[7px] text-accent">
                ▶
              </span>
              <PsychicText split="words" text={item.label} />
              {item.status && <StatusLabel text={item.status} />}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function EducationCards() {
  return (
    <ul className={`grid sm:grid-cols-2 ${GAP}`}>
      {education.map((entry) => (
        <li key={entry.degree} className={`${CARD} flex flex-col`}>
          <span className={PIXEL_LABEL}>{entry.degree.match(/\(([^)]+)\)/)?.[1] ?? "Degree"}</span>
          <h3 className="mt-2 font-semibold leading-snug">
            <PsychicText split="words" text={entry.degree.replace(/\s*\([^)]+\)/, "")} />
          </h3>
          <p className="mt-1 text-[0.94rem] text-ink/65">
            <PsychicText split="words" text={entry.school} />
          </p>
          <p className="mt-auto pt-3 text-sm font-medium text-ink/80">{entry.detail}</p>
        </li>
      ))}
    </ul>
  );
}

function OffTheClock() {
  return (
    <div className={`grid lg:grid-cols-2 ${GAP}`}>
      <div className={CARD}>
        <span className={PIXEL_LABEL}>Side quests</span>
        <p className={`mt-2 ${BODY_TEXT}`}>
          <PsychicText split="words" text="Outside work I build small tools — like the" />{" "}
          <Link to="/json-toolkit" className={LINK_CLASS}>
            <PsychicText split="words" text="JSON Toolkit" />
          </Link>{" "}
          <PsychicText
            split="words"
            text={`on this site — and spend more time than I’d admit planning Pokémon teams. I speak ${spokenLanguages
              .slice(0, -1)
              .join(", ")} and ${spokenLanguages.at(-1)}.`}
          />
        </p>
      </div>

      <Link to="/party" className={`${CARD_LINK} flex flex-col`}>
        <span className="flex items-center justify-between">
          <span className={PIXEL_LABEL}>Current party</span>
          <ArrowRightIcon className="h-4 w-4 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-accent" />
        </span>
        <span className="mt-2 flex flex-wrap items-center">
          {party.map((member) => (
            <img
              key={member.id}
              src={spriteSrc(member.id)}
              alt={member.name}
              title={member.name}
              draggable="false"
              className="pixelated -my-1 h-12 w-12 sm:h-14 sm:w-14"
            />
          ))}
        </span>
        <span className="mt-auto pt-2 text-sm text-ink/60 group-hover:text-accent">Pick one and use its move</span>
      </Link>
    </div>
  );
}

function ContactCard() {
  return (
    <div className={`${CARD} flex flex-col gap-5 md:flex-row md:items-center md:justify-between`}>
      <p className={`${PROSE} ${BODY_TEXT}`}>
        <PsychicText split="words" text="Have a role, a project or a question about something I’ve built? I’d like to hear about it." />
      </p>
      <div className="flex shrink-0 flex-wrap gap-3">
        <Link to="/contact" className={BUTTON_PRIMARY}>
          Send a message
        </Link>
        <a href={`mailto:${contact.email}`} className={BUTTON_SECONDARY}>
          <MailIcon />
          Email
        </a>
      </div>
    </div>
  );
}

/** Home: who I am, then one short stop per area, each pointing to the page with the detail. */
export default function HomePage() {
  useDocumentTitle();

  return (
    <>
      <TrainerCardHero />

      <Section id="skills" title="Skills">
        <SkillsCarousel />
      </Section>

      <Section id="experience" title="Experience" action={<SectionLink to="/resume">Full resume</SectionLink>}>
        <ExperienceCard />
      </Section>

      <Section id="projects" title="Projects" action={<SectionLink to="/work">All projects</SectionLink>}>
        <WorkProjectGrid items={projects.slice(0, 3)} />
      </Section>

      <Section id="education" title="Education">
        <EducationCards />
      </Section>

      <Section id="off-the-clock" title="Off the clock">
        <OffTheClock />
      </Section>

      <Section id="contact" title="Contact">
        <ContactCard />
      </Section>
    </>
  );
}
