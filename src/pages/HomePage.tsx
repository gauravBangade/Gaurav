import { Link } from "react-router-dom";
import PsychicText from "../components/PsychicText";
import RichText from "../components/RichText";
import PsyduckHero from "../components/site/PsyduckHero";
import { SideProjectList, StatusLabel, WorkProjectList } from "../components/site/ProjectList";
import { Section } from "../components/site/Section";
import { useSite } from "../components/site/siteContext";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CalendarIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
} from "../components/site/icons";
import {
  BODY_TEXT,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  FOCUS_RING,
  LINK_CLASS,
  formatMonth,
} from "../components/site/styles";
import { contact, education, experience, personalProjects, profile, projects, skills, spokenLanguages } from "../data/site";
import { party, spriteSrc } from "../data/party";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const SUBHEADING = "mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink/45";

const SOCIAL_LINK = `inline-flex items-center gap-1.5 rounded text-sm text-ink/60 transition hover:text-ink ${FOCUS_RING}`;

function Hero() {
  const { psyduckRef, phase, aftermath, confusion } = useSite();

  return (
    <section aria-label="Introduction" className="pt-8 sm:pt-10">
      <PsyduckHero spriteRef={psyduckRef} phase={phase} aftermath={aftermath} onBlast={confusion} />

      <h1 tabIndex={-1} className="mt-5 font-serif text-[3rem] leading-none focus:outline-none sm:text-[3.75rem]">
        <PsychicText split="words" text={profile.name} />
      </h1>
      <p className="mt-3 text-lg text-ink/80 sm:text-xl">
        <span className="font-medium text-accent">
          <PsychicText split="words" text={profile.role} />
        </span>{" "}
        <span aria-hidden="true" className="text-ink/25">
          ·
        </span>{" "}
        <PsychicText split="words" text={profile.focus} />
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink/55">
        <li className="flex items-center gap-1.5">
          <BriefcaseIcon className="h-4 w-4 text-ink/40" />
          <span className="sr-only">Works at </span>
          <PsychicText split="words" text={profile.company} />
        </li>
        <li className="flex items-center gap-1.5">
          <MapPinIcon className="h-4 w-4 text-ink/40" />
          <span className="sr-only">Based in </span>
          <PsychicText split="words" text={profile.location} />
        </li>
        <li className="flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4 text-ink/40" />
          <PsychicText split="words" text={`Since ${formatMonth(profile.since)}`} />
        </li>
      </ul>

      <p className={`mt-5 max-w-xl ${BODY_TEXT}`}>
        <RichText text={profile.intro} />
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link to="/contact" className={BUTTON_PRIMARY}>
          Get in touch
        </Link>
        <Link to="/work" className={BUTTON_SECONDARY}>
          View my work
        </Link>
        <span className="ml-1 flex items-center gap-4">
          <a href={contact.github} target="_blank" rel="noreferrer" className={SOCIAL_LINK}>
            <GitHubIcon />
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className={SOCIAL_LINK}>
            <LinkedInIcon />
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      </div>
    </section>
  );
}

function ExperienceList() {
  return (
    <ol className="space-y-12">
      {experience.map((job) => (
        <li key={job.company + job.start}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <h3 className="text-lg font-semibold">
              <PsychicText split="words" text={job.company} />
            </h3>
            <p className="text-sm text-ink/50">
              <time dateTime={job.start}>{formatMonth(job.start)}</time>
              <span aria-hidden="true"> — </span>
              <span className="sr-only"> to </span>
              {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : "Present"}
            </p>
          </div>
          <p className="text-[15px] text-ink/65">
            <PsychicText split="words" text={`${job.role} · ${job.location}`} />
          </p>
          <p className={`mt-4 ${BODY_TEXT}`}>
            <PsychicText split="words" text={job.summary} />
          </p>

          <ul aria-label="Impact" className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
            {job.metrics.map((metric) => (
              <li key={metric.label}>
                <span className="font-semibold text-ink">{metric.value}</span>{" "}
                <span className="text-ink/55">{metric.label}</span>
              </li>
            ))}
          </ul>

          {/* Label | sentence, like Skills: scannable in a few seconds. */}
          <dl className="mt-7 grid gap-x-8 gap-y-5 border-t border-ink/10 pt-6 sm:grid-cols-[11rem_1fr] sm:gap-y-4">
            {job.highlights.map((item) => (
              <div key={item.label} className="contents">
                <dt className="flex flex-wrap items-center gap-2 self-start text-sm font-medium text-ink sm:pt-0.5">
                  <PsychicText split="words" text={item.label} />
                  {item.status && <StatusLabel text={item.status} />}
                </dt>
                <dd className="-mt-4 text-[15px] leading-relaxed text-ink/70 sm:mt-0">
                  <RichText text={item.text} />
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
  );
}

function SkillsList() {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-[9.5rem_1fr]">
      {skills.map((group) => (
        <div key={group.label} className="contents">
          <dt className="pt-px text-sm text-ink/50">
            <PsychicText split="words" text={group.label} />
          </dt>
          <dd className="-mt-3 text-[15px] leading-relaxed text-ink/85 sm:mt-0">
            <PsychicText split="words" text={group.items.join(", ")} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function EducationList() {
  return (
    <ul className="space-y-6">
      {education.map((entry) => (
        // A fixed right column keeps the grade aligned however long the school name runs.
        <li key={entry.degree} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6">
          <div className="min-w-0">
            <h3 className="font-semibold">
              <PsychicText split="words" text={entry.degree} />
            </h3>
            <p className="mt-0.5 text-[15px] text-ink/60">
              <PsychicText split="words" text={entry.school} />
            </p>
          </div>
          <p className="text-sm text-ink/50">
            <PsychicText split="words" text={entry.detail} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Interests: the one place Pokémon get a proper mention on the home page. */
function BeyondWork() {
  return (
    <>
      <p className={BODY_TEXT}>
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

      <Link
        to="/party"
        className={`group mt-6 flex items-center gap-4 rounded-2xl border border-ink/10 bg-card px-4 py-3 transition hover:border-ink/25 ${FOCUS_RING}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium uppercase tracking-[0.14em] text-ink/45">Current party</span>
          <span className="mt-1 flex flex-wrap items-center gap-x-1">
            {party.map((member) => (
              <img
                key={member.id}
                src={spriteSrc(member.id)}
                alt={member.name}
                title={member.name}
                draggable="false"
                className="pixelated -my-1 h-11 w-11 sm:h-12 sm:w-12"
              />
            ))}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm text-ink/60 group-hover:text-accent">
          <span className="hidden sm:inline">Meet the party</span>
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </Link>
    </>
  );
}

function GetInTouch() {
  return (
    <>
      <p className={`max-w-xl ${BODY_TEXT}`}>
        <PsychicText
          split="words"
          text="Have a role, a project or a question about something I’ve built? I’d like to hear about it."
        />
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link to="/contact" className={BUTTON_PRIMARY}>
          Send a message
        </Link>
        <a href={`mailto:${contact.email}`} className={BUTTON_SECONDARY}>
          <MailIcon />
          {contact.email}
        </a>
      </div>
    </>
  );
}

export default function HomePage() {
  useDocumentTitle();

  return (
    <>
      <Hero />

      <Section id="experience" title="Experience">
        <ExperienceList />
      </Section>

      <Section
        id="work"
        title="Selected work"
        action={
          <Link to="/work" className={`flex items-center gap-1 text-sm text-ink/60 hover:text-accent ${FOCUS_RING}`}>
            All work <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <h3 className={SUBHEADING}>At work</h3>
        <WorkProjectList items={projects.slice(0, 3)} />
        <h3 className={`mt-8 ${SUBHEADING}`}>Side projects</h3>
        <SideProjectList items={personalProjects} />
      </Section>

      <Section id="skills" title="Skills">
        <SkillsList />
      </Section>

      <Section id="education" title="Education">
        <EducationList />
      </Section>

      <Section id="beyond-work" title="Beyond work">
        <BeyondWork />
      </Section>

      <Section id="contact" title="Get in touch">
        <GetInTouch />
      </Section>
    </>
  );
}
