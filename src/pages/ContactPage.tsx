import PsychicText from "../components/PsychicText";
import ContactForm from "../components/site/ContactForm";
import { GitHubIcon, LinkedInIcon, MailIcon } from "../components/site/icons";
import { PageHeader } from "../components/site/Section";
import { useSite } from "../components/site/siteContext";
import { FOCUS_RING, LINK_CLASS } from "../components/site/styles";
import { contact } from "../data/site";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function ContactPage() {
  const { copyEmail } = useSite();
  useDocumentTitle("Contact");

  return (
    <>
      <PageHeader title="Get in touch">
        <p>
          <PsychicText
            split="words"
            text="Have a role, a project or a question about something I’ve built? Send a message and it lands straight in my inbox."
          />
        </p>
      </PageHeader>

      <ContactForm className="mt-10" />

      <h2 className="mt-12 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">Or reach me directly</h2>
      <ul className="mt-4 space-y-3 text-[15px]">
        <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <MailIcon className="h-4 w-4 text-ink/40" />
          <a href={`mailto:${contact.email}`} className={`cursor-pokeball ${LINK_CLASS}`}>
            {contact.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className={`rounded-full border border-ink/15 px-2.5 py-0.5 text-xs text-ink/60 transition hover:border-ink/35 hover:text-ink ${FOCUS_RING}`}
          >
            Copy
          </button>
        </li>
        <li className="flex items-center gap-3">
          <LinkedInIcon className="h-4 w-4 text-ink/40" />
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className={LINK_CLASS}>
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
        <li className="flex items-center gap-3">
          <GitHubIcon className="h-4 w-4 text-ink/40" />
          <a href={contact.github} target="_blank" rel="noreferrer" className={LINK_CLASS}>
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </>
  );
}
