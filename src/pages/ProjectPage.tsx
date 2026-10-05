import { Link, Navigate, useParams } from "react-router-dom";
import RichText from "../components/RichText";
import { ArrowRightIcon } from "../components/site/icons";
import { StatusLabel } from "../components/site/ProjectList";
import { PageHeader } from "../components/site/Section";
import { BODY_TEXT, CARD, CARD_LINK, FOCUS_RING, PIXEL_LABEL, PROSE } from "../components/site/styles";
import { projects, type Project } from "../data/site";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const LABEL = "text-xs font-medium uppercase tracking-[0.14em] text-ink/45";

function NeighbourLink({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  const next = direction === "next";
  return (
    <Link to={`/work/${project.id}`} rel={next ? "next" : "prev"} className={`${CARD_LINK} h-full ${next ? "text-right" : ""}`}>
      {/* SVG arrows: text arrows render as emoji on some systems, and the pixel font has none. */}
      <span className={`flex items-center gap-1.5 ${next ? "justify-end" : ""} ${PIXEL_LABEL}`}>
        {!next && <ArrowRightIcon className="h-3 w-3 rotate-180" />}
        {next ? "Next project" : "Previous project"}
        {next && <ArrowRightIcon className="h-3 w-3" />}
      </span>
      <span className="mt-1.5 block font-medium text-ink group-hover:text-accent">{project.title}</span>
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
      />

      {/* Desktop: the story on the left (capped line length), the facts card on the right. */}
      <div className="mt-[clamp(1.5rem,1rem+2vw,2.5rem)] grid items-start gap-[clamp(1.25rem,0.8rem+2vw,3rem)] lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className={PROSE}>
          <p className="text-[clamp(1.05rem,0.98rem+0.35vw,1.25rem)] leading-relaxed text-ink/85">
            <RichText text={project.summary} />
          </p>

          <h2 className={`mt-10 ${LABEL}`}>What I did</h2>
          <ul className="mt-4 space-y-3">
            {project.details.map((item) => (
              <li key={item} className={`flex gap-3 ${BODY_TEXT}`}>
                <span aria-hidden="true" className="mt-[0.55em] font-pixel text-[7px] leading-none text-accent">
                  ▶
                </span>
                <span>
                  <RichText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside aria-label="Project facts" className={CARD}>
          <dl className="space-y-4">
            {project.status && (
              <div>
                <dt className={PIXEL_LABEL}>Status</dt>
                <dd className="mt-1.5">
                  <StatusLabel text={project.status} />
                </dd>
              </div>
            )}
            {project.period && (
              <div>
                <dt className={PIXEL_LABEL}>When</dt>
                <dd className="mt-1 text-[0.94rem] text-ink/85">{project.period}</dd>
              </div>
            )}
            <div>
              <dt className={PIXEL_LABEL}>My part</dt>
              <dd className="mt-1 text-[0.94rem] text-ink/85">{project.role}</dd>
            </div>
            <div>
              <dt className={PIXEL_LABEL}>Built with</dt>
              <dd className="mt-1.5">
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li key={tech} className="border border-ink/15 px-2 py-0.5 text-xs text-ink/75">
                      {tech}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <nav aria-label="More projects" className="mt-[clamp(2.5rem,2rem+2vw,4rem)] grid gap-3 sm:grid-cols-2">
        <div>{previous && <NeighbourLink project={previous} direction="previous" />}</div>
        <div>{next && <NeighbourLink project={next} direction="next" />}</div>
      </nav>
    </article>
  );
}
