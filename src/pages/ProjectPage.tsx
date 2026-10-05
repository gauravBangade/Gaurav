import { Link, Navigate, useParams } from "react-router-dom";
import PsychicText from "../components/PsychicText";
import RichText from "../components/RichText";
import { ArrowRightIcon } from "../components/site/icons";
import { StatusLabel } from "../components/site/ProjectList";
import { PageHeader } from "../components/site/Section";
import { BODY_TEXT, FOCUS_RING } from "../components/site/styles";
import { projects, type Project } from "../data/site";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const LABEL = "text-xs font-medium uppercase tracking-[0.14em] text-ink/45";

function NeighbourLink({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  const next = direction === "next";
  return (
    <Link
      to={`/work/${project.id}`}
      rel={next ? "next" : "prev"}
      className={`group block rounded-lg py-2 ${next ? "text-right sm:ml-auto" : ""} ${FOCUS_RING}`}
    >
      <span className={`block ${LABEL}`}>{next ? "Next" : "Previous"}</span>
      <span className="mt-1 block font-medium text-ink group-hover:text-accent">
        {!next && <span aria-hidden="true">← </span>}
        {project.title}
        {next && <span aria-hidden="true"> →</span>}
      </span>
    </Link>
  );
}

/** One work project: what it is, what I did, what it's built with — and the way to the next one. */
export default function ProjectPage() {
  const { id } = useParams();
  const index = projects.findIndex((project) => project.id === id);
  const project = projects[index];
  useDocumentTitle(project?.title ?? "Work");

  if (!project) return <Navigate to="/work" replace />;

  const previous = projects[index - 1];
  const next = projects[index + 1];

  return (
    <article>
      <PageHeader
        title={project.title}
        before={
          <Link
            to="/work"
            className={`mb-6 inline-flex items-center gap-1.5 rounded text-sm text-ink/55 transition hover:text-ink ${FOCUS_RING}`}
          >
            <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
            All work
          </Link>
        }
      >
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/55">
          {project.status && <StatusLabel text={project.status} />}
          <PsychicText split="words" text={[project.period, project.role].filter(Boolean).join(" · ")} />
        </p>
      </PageHeader>

      <p className="mt-8 text-lg leading-relaxed text-ink/85">
        <RichText text={project.summary} />
      </p>

      <h2 className={`mt-12 ${LABEL}`}>What I did</h2>
      <ul className="mt-4 space-y-3">
        {project.details.map((item) => (
          <li key={item} className={`relative pl-5 ${BODY_TEXT}`}>
            <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-accent/70" />
            <RichText text={item} />
          </li>
        ))}
      </ul>

      <h2 className={`mt-12 ${LABEL}`}>Built with</h2>
      <p className="mt-3 text-[15px] text-ink/80">{project.stack.join(", ")}</p>

      <nav aria-label="More projects" className="mt-16 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2">
        <div>{previous && <NeighbourLink project={previous} direction="previous" />}</div>
        <div className="sm:text-right">{next && <NeighbourLink project={next} direction="next" />}</div>
      </nav>
    </article>
  );
}
