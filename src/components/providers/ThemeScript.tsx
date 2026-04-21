"use client";

import { useServerInsertedHTML } from "next/navigation";

interface Props {
  script: string;
}

/**
 * Injects an inline <script> into the SSR HTML stream via useServerInsertedHTML.
 * This avoids the React 19 warning about <script> tags inside component trees,
 * because the element is inserted before React's client-side reconciliation begins.
 * The component renders nothing on the client.
 */
export function ThemeScript({ script }: Props) {
  useServerInsertedHTML(() => (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <script dangerouslySetInnerHTML={{ __html: script }} />
  ));
  return null;
}
