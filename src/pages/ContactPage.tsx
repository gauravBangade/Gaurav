import PsychicText from "../components/PsychicText";
import ContactForm from "../components/site/ContactForm";
import { GitHubIcon, LinkedInIcon, MailIcon } from "../components/site/icons";
import { PageHeader } from "../components/site/Section";
import { useSite } from "../components/site/siteContext";
import { CARD, FOCUS_RING, LINK_CLASS, PIXEL_LABEL } from "../components/site/styles";
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

      {/* Desktop: the form with a "reach me directly" card beside it. */}
      <div className="mt-[clamp(1.5rem,1rem+2vw,2.5rem)] grid items-start gap-[clamp(1rem,0.6rem+1.5vw,2rem)] lg:grid-cols-[minmax(0,1fr)_19rem]">
        <ContactForm />

        <aside aria-label="Other ways to reach me" className={CARD}>
          <span className={PIXEL_LABEL}>Reach me directly</span>
          <ul className="mt-4 space-y-3.5 text-[0.94rem]">
            <li>
              <span className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 shrink-0 text-ink/40" />
                <a href={`mailto:${contact.email}`} className={`cursor-pokeball break-all ${LINK_CLASS}`}>
                  {contact.email}
                </a>
              </span>
              <button
                type="button"
                onClick={copyEmail}
                className={`ml-[1.6rem] mt-2 border border-ink/15 px-2.5 py-0.5 text-xs text-ink/60 transition hover:border-ink/35 hover:text-ink ${FOCUS_RING}`}
              >
                Copy address
              </button>
            </li>
            <li className="flex items-center gap-2.5">
              <LinkedInIcon className="h-4 w-4 shrink-0 text-ink/40" />
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <GitHubIcon className="h-4 w-4 shrink-0 text-ink/40" />
              <a href={contact.github} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}
