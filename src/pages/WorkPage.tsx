import PsychicText from "../components/PsychicText";
import { SideProjectGrid, WorkProjectGrid } from "../components/site/ProjectList";
import { PageHeader, Section } from "../components/site/Section";
import { personalProjects, profile, projects } from "../data/site";
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
        <WorkProjectGrid items={projects} />
      </Section>

      <Section id="side-projects" title="Side projects">
        <SideProjectGrid items={personalProjects} />
      </Section>
    </>
  );
}
