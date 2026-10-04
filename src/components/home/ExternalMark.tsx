/** Visual cue that a link opens elsewhere; the real hint lives in the sr-only text. */
export default function ExternalMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-0.5">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </>
  );
}
