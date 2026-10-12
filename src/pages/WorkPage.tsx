import PsychicText from "../components/PsychicText";
import { SideProjectGrid, WorkProjectGrid } from "../components/site/ProjectList";
import { PageHeader, Section } from "../components/site/Section";
import { MUTED, PROSE } from "../components/site/styles";
import { personalProjects, profile, projectGroups, projects } from "../data/site";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function WorkPage() {
  useDocumentTitle("Work");

  return (
    <>
      <PageHeader title="Work">
        <p>
          <PsychicText
            split="words"
            text={`What I’ve built as a ${profile.role.toLowerCase()} at ${profile.company}, and on my own. Each work project opens into the details.`}
          />
        </p>
      </PageHeader>

      <Section id="at-work" title="At work">
        <div className="space-y-[clamp(2rem,1.5rem+1.5vw,3rem)]">
          {projectGroups.map((group) => (
            <section key={group.id} aria-labelledby={`group-${group.id}-title`}>
              <h3 id={`group-${group.id}-title`} className="text-[1.15rem] font-semibold text-ink">
                <PsychicText split="words" text={group.title} />
              </h3>
              <p className={`mt-1 mb-4 ${PROSE} ${MUTED}`}>{group.intro}</p>
              <WorkProjectGrid
                items={group.projectIds.flatMap((id) => projects.filter((project) => project.id === id))}
                showFeatured
              />
            </section>
          ))}
        </div>
      </Section>

      <Section id="side-projects" title="Side projects">
        <SideProjectGrid items={personalProjects} />
      </Section>
    </>
  );
}
