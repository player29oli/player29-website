"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import { AdminFields } from "@/components/admin/admin-fields";
import { Logo } from "@/components/brand/logo";
import { SocialIcon } from "@/components/brand/social-icon";
import { Button } from "@/components/ui/button";
import { logoutAction, saveContentAction } from "@/lib/auth/actions";
import {
  detectSocialNetwork,
  NETWORK_LABELS,
  socialAccessibleName,
} from "@/lib/content/social";
import {
  createSection,
  SECTION_LABELS,
  SECTION_TYPES,
  type ContentStoreKind,
  type HomepageSection,
  type SectionType,
  type SiteContent,
} from "@/lib/content/schema";
import { cn } from "@/lib/utils";

type Tab = "homepage" | "chrome" | "footer" | "site" | "privacy" | "notFound";

type AdminEditorProps = {
  initialContent: SiteContent;
  csrfToken: string;
  editorEmail: string;
  persistTo: "blob" | "file";
  loadedFrom: ContentStoreKind;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "homepage", label: "Homepage" },
  { id: "chrome", label: "Navigation" },
  { id: "footer", label: "Footer" },
  { id: "site", label: "Site details" },
  { id: "privacy", label: "Privacy" },
  { id: "notFound", label: "404 page" },
];

export function AdminEditor({
  initialContent,
  csrfToken,
  editorEmail,
  persistTo,
  loadedFrom,
}: AdminEditorProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [tab, setTab] = useState<Tab>("homepage");
  const [selectedId, setSelectedId] = useState(initialContent.sections[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = useMemo(
    () => content.sections.find((section) => section.id === selectedId) ?? null,
    [content.sections, selectedId],
  );

  function update(next: SiteContent) {
    setContent(next);
    setMessage(null);
  }

  function updateSection(id: string, patch: HomepageSection) {
    update({
      ...content,
      sections: content.sections.map((section) => (section.id === id ? patch : section)),
    });
  }

  function moveSection(id: string, direction: -1 | 1) {
    const index = content.sections.findIndex((section) => section.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= content.sections.length) return;
    const sections = [...content.sections];
    const [item] = sections.splice(index, 1);
    sections.splice(nextIndex, 0, item);
    update({ ...content, sections });
  }

  function removeSection(id: string) {
    const section = content.sections.find((item) => item.id === id);
    const label = section ? SECTION_LABELS[section.type] : "this section";
    if (!window.confirm(`Remove the ${label} section from the homepage?`)) return;
    const sections = content.sections.filter((item) => item.id !== id);
    update({ ...content, sections });
    if (selectedId === id) setSelectedId(sections[0]?.id ?? "");
  }

  function addSection(type: SectionType) {
    const section = createSection(type);
    update({ ...content, sections: [...content.sections, section] });
    setSelectedId(section.id);
    setTab("homepage");
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await saveContentAction(csrfToken, content);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setContent(result.content);
      setMessage("Saved. Refresh the public site to see the latest copy.");
    });
  }

  return (
    <div id="main" className="flex min-h-full flex-1 flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-white/95 backdrop-blur-[8px]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-4">
            <Logo variant="light" compact href="/" />
            <p className="text-sm font-semibold text-ink/70">Content editor</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-muted-text mr-2 text-sm">{editorEmail}</p>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 min-h-11 items-center rounded-[13px] border border-ink/15 px-4 text-sm font-semibold"
            >
              View site
            </Link>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="cta">
                Sign out
              </Button>
            </form>
            <Button type="button" size="cta" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:flex-row">
        <aside className="lg:w-72 lg:shrink-0">
          <nav aria-label="Editor sections" className="flex flex-col gap-1">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex min-h-11 items-center rounded-[14px] px-3 text-left text-sm font-semibold",
                  tab === item.id ? "bg-ink text-white" : "text-ink/80 hover:bg-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <p className="text-muted-text mt-6 text-xs leading-relaxed">
            {persistTo === "blob"
              ? "Saves to Vercel Blob for this deployment."
              : "Saves to a local .data/content.json file on this machine."}{" "}
            Currently showing {loadedFrom === "default" ? "committed default copy" : loadedFrom === "blob" ? "Blob storage" : "the local file"}.
          </p>
        </aside>

        <div className="min-w-0 flex-1">
          {error ? (
            <p role="alert" className="mb-4 rounded-[14px] bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {error}
            </p>
          ) : null}
          {message ? (
            <p role="status" className="mb-4 rounded-[14px] bg-white px-4 py-3 text-sm font-medium text-ink">
              {message}
            </p>
          ) : null}

          {tab === "homepage" ? (
            <HomepagePanel
              sections={content.sections}
              selectedId={selectedId}
              selected={selected}
              onSelect={setSelectedId}
              onMove={moveSection}
              onRemove={removeSection}
              onAdd={addSection}
              onChange={updateSection}
              csrfToken={csrfToken}
            />
          ) : null}

          {tab === "chrome" ? (
            <ChromePanel
              content={content}
              onChange={update}
              csrfToken={csrfToken}
            />
          ) : null}

          {tab === "footer" ? (
            <FooterPanel content={content} onChange={update} />
          ) : null}

          {tab === "site" ? (
            <SitePanel content={content} onChange={update} />
          ) : null}

          {tab === "privacy" ? (
            <PrivacyPanel content={content} onChange={update} />
          ) : null}

          {tab === "notFound" ? (
            <NotFoundPanel content={content} onChange={update} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function HomepagePanel({
  sections,
  selectedId,
  selected,
  onSelect,
  onMove,
  onRemove,
  onAdd,
  onChange,
  csrfToken,
}: {
  sections: HomepageSection[];
  selectedId: string;
  selected: HomepageSection | null;
  onSelect: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  onAdd: (type: SectionType) => void;
  onChange: (id: string, patch: HomepageSection) => void;
  csrfToken: string;
}) {
  const [addType, setAddType] = useState<SectionType>("richText");

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
      <div className="rounded-[18px] border border-ink/8 bg-white p-3">
        <p className="px-2 pb-2 text-xs font-semibold tracking-wide text-ink/50 uppercase">
          Sections
        </p>
        <ul className="flex flex-col gap-1">
          {sections.length === 0 ? (
            <li className="text-muted-text px-2 py-3 text-sm">
              No homepage sections yet. Add one below.
            </li>
          ) : (
            sections.map((section, index) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onSelect(section.id)}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between rounded-[12px] px-3 text-left text-sm font-semibold",
                    section.id === selectedId ? "bg-surface text-ink" : "text-ink/75 hover:bg-surface/70",
                  )}
                >
                  <span>
                    {index + 1}. {SECTION_LABELS[section.type]}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="mt-4 border-t border-ink/8 pt-3">
          <label htmlFor="add-section" className="sr-only">
            Section type to add
          </label>
          <select
            id="add-section"
            value={addType}
            onChange={(event) => setAddType(event.target.value as SectionType)}
            className="h-11 w-full rounded-[13px] border border-input bg-white px-3 text-sm"
          >
            {SECTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {SECTION_LABELS[type]}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            size="cta"
            className="mt-2 w-full"
            onClick={() => onAdd(addType)}
            disabled={sections.length >= 24}
          >
            Add section
          </Button>
        </div>
      </div>

      <div className="rounded-[18px] border border-ink/8 bg-white p-5 md:p-6">
        {selected ? (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <h2 className="font-display mr-auto text-xl font-semibold">
                {SECTION_LABELS[selected.type]}
              </h2>
              <Button
                type="button"
                variant="outline"
                size="cta"
                onClick={() => onMove(selected.id, -1)}
                disabled={sections[0]?.id === selected.id}
              >
                Move up
              </Button>
              <Button
                type="button"
                variant="outline"
                size="cta"
                onClick={() => onMove(selected.id, 1)}
                disabled={sections.at(-1)?.id === selected.id}
              >
                Move down
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="cta"
                onClick={() => onRemove(selected.id)}
              >
                Remove
              </Button>
            </div>
            <AdminFields.Section
              section={selected}
              onChange={(patch) => onChange(selected.id, patch)}
              csrfToken={csrfToken}
            />
          </>
        ) : (
          <p className="text-muted-text text-sm">Select a section to edit its copy.</p>
        )}
      </div>
    </div>
  );
}

function ChromePanel({
  content,
  onChange,
  csrfToken,
}: {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
  csrfToken: string;
}) {
  void csrfToken;
  const nav = content.chrome.navigation;

  function setNav(next: typeof nav) {
    onChange({ ...content, chrome: { ...content.chrome, navigation: next } });
  }

  return (
    <div className="rounded-[18px] border border-ink/8 bg-white p-5 md:p-6">
      <h2 className="font-display mb-6 text-xl font-semibold">Header and navigation</h2>
      <div className="grid gap-6">
        <AdminFields.Text
          id="header-cta-label"
          label="Header button label"
          value={content.chrome.headerCta.label}
          onChange={(value) =>
            onChange({
              ...content,
              chrome: { ...content.chrome, headerCta: { ...content.chrome.headerCta, label: value } },
            })
          }
        />
        <AdminFields.Text
          id="header-cta-href"
          label="Header button link"
          value={content.chrome.headerCta.href}
          onChange={(value) =>
            onChange({
              ...content,
              chrome: { ...content.chrome, headerCta: { ...content.chrome.headerCta, href: value } },
            })
          }
        />
        <div>
          <p className="mb-3 text-sm font-medium">Navigation links</p>
          <div className="grid gap-4">
            {nav.map((item, index) => (
              <div key={`nav-${index}`} className="grid gap-3 rounded-[16px] bg-surface/70 p-4 md:grid-cols-[1fr_1fr_auto]">
                <AdminFields.Text
                  id={`nav-label-${index}`}
                  label="Label"
                  value={item.label}
                  onChange={(value) => {
                    const next = [...nav];
                    next[index] = { ...item, label: value };
                    setNav(next);
                  }}
                />
                <AdminFields.Text
                  id={`nav-href-${index}`}
                  label="Link"
                  value={item.href}
                  onChange={(value) => {
                    const next = [...nav];
                    next[index] = { ...item, href: value };
                    setNav(next);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="cta"
                  className="self-end"
                  onClick={() => setNav(nav.filter((_, itemIndex) => itemIndex !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="cta"
            className="mt-4"
            onClick={() => setNav([...nav, { label: "New link", href: "/#" }])}
            disabled={nav.length >= 16}
          >
            Add navigation link
          </Button>
        </div>
      </div>
    </div>
  );
}

function FooterPanel({
  content,
  onChange,
}: {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
}) {
  const socials = content.chrome.socials;

  function setChrome<K extends keyof SiteContent["chrome"]>(
    key: K,
    value: SiteContent["chrome"][K],
  ) {
    onChange({ ...content, chrome: { ...content.chrome, [key]: value } });
  }

  function setSite<K extends keyof SiteContent["site"]>(
    key: K,
    value: SiteContent["site"][K],
  ) {
    onChange({ ...content, site: { ...content.site, [key]: value } });
  }

  function setSocials(next: typeof socials) {
    const linkedin =
      next.find((item) => /linkedin\.com/i.test(item.href))?.href ?? "";
    onChange({
      ...content,
      site: { ...content.site, linkedin },
      chrome: { ...content.chrome, socials: next },
    });
  }

  return (
    <div className="rounded-[18px] border border-ink/8 bg-white p-5 md:p-6">
      <h2 className="font-display mb-2 text-xl font-semibold">Footer</h2>
      <p className="text-muted-text mb-6 text-sm">
        Company details and social links shown at the bottom of public pages.
        Socials without a URL stay hidden on the live site.
      </p>
      <div className="grid gap-6">
        <AdminFields.Text
          id="footer-legal-name"
          label="Company name"
          value={content.site.legalName}
          onChange={(value) => setSite("legalName", value)}
        />
        <AdminFields.Textarea
          id="footer-blurb"
          label="Footer description"
          value={content.chrome.footerBlurb}
          onChange={(value) => setChrome("footerBlurb", value)}
        />
        <AdminFields.Text
          id="footer-email"
          label="Public email"
          value={content.site.email}
          onChange={(value) => setSite("email", value)}
        />
        <AdminFields.Text
          id="footer-company-number"
          label="Company number"
          value={content.site.companyNumber}
          onChange={(value) => setSite("companyNumber", value)}
        />
        <AdminFields.Textarea
          id="footer-office"
          label="Registered office"
          value={content.site.registeredOffice}
          onChange={(value) => setSite("registeredOffice", value)}
        />
        <AdminFields.Text
          id="footer-copyright"
          label="Copyright prefix"
          value={content.chrome.copyrightPrefix}
          onChange={(value) => setChrome("copyrightPrefix", value)}
        />
        <AdminFields.Text
          id="footer-privacy-label"
          label="Privacy link label"
          value={content.chrome.privacyLabel}
          onChange={(value) => setChrome("privacyLabel", value)}
        />
        <AdminFields.Text
          id="footer-privacy-href"
          label="Privacy link"
          value={content.chrome.privacyHref}
          onChange={(value) => setChrome("privacyHref", value)}
        />
        <div>
          <p className="mb-3 text-sm font-medium">Social links</p>
          <p className="text-muted-text mb-4 text-sm">
            Add a label and URL. LinkedIn, Instagram, X, YouTube, TikTok,
            Facebook and GitHub get a matching icon. Anything else uses a
            generic link icon. Do not add profiles that are not live.
          </p>
          <div className="grid gap-4">
            {socials.length === 0 ? (
              <p className="text-muted-text text-sm">No social links yet.</p>
            ) : (
              socials.map((item, index) => (
                <div
                  key={`social-${index}`}
                  className="grid gap-3 rounded-[16px] bg-surface/70 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <AdminFields.Text
                      id={`social-label-${index}`}
                      label="Label"
                      value={item.label}
                      onChange={(value) => {
                        const next = [...socials];
                        next[index] = { ...item, label: value };
                        setSocials(next);
                      }}
                    />
                    <AdminFields.Text
                      id={`social-href-${index}`}
                      label="URL"
                      value={item.href}
                      onChange={(value) => {
                        const next = [...socials];
                        next[index] = { ...item, href: value };
                        setSocials(next);
                      }}
                    />
                  </div>
                  {item.href.trim() ? (
                    <p className="flex items-center gap-2 text-sm text-muted-text">
                      <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 text-sm font-semibold text-ink">
                        <SocialIcon network={detectSocialNetwork(item.href)} />
                        <span>{socialAccessibleName(item.label, item.href)}</span>
                      </span>
                      <span>
                        Icon: {NETWORK_LABELS[detectSocialNetwork(item.href)]}
                      </span>
                    </p>
                  ) : (
                    <p className="text-muted-text text-sm">
                      Hidden on the public site until a URL is added.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="cta"
                      onClick={() => {
                        if (index === 0) return;
                        const next = [...socials];
                        const [moved] = next.splice(index, 1);
                        next.splice(index - 1, 0, moved);
                        setSocials(next);
                      }}
                      disabled={index === 0}
                    >
                      Move up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="cta"
                      onClick={() => {
                        if (index >= socials.length - 1) return;
                        const next = [...socials];
                        const [moved] = next.splice(index, 1);
                        next.splice(index + 1, 0, moved);
                        setSocials(next);
                      }}
                      disabled={index >= socials.length - 1}
                    >
                      Move down
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="cta"
                      onClick={() =>
                        setSocials(socials.filter((_, itemIndex) => itemIndex !== index))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="cta"
            className="mt-4"
            onClick={() => setSocials([...socials, { label: "", href: "" }])}
            disabled={socials.length >= 16}
          >
            Add social link
          </Button>
        </div>
      </div>
    </div>
  );
}

function SitePanel({
  content,
  onChange,
}: {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
}) {
  function setSite<K extends keyof SiteContent["site"]>(key: K, value: SiteContent["site"][K]) {
    onChange({ ...content, site: { ...content.site, [key]: value } });
  }
  return (
    <div className="rounded-[18px] border border-ink/8 bg-white p-5 md:p-6">
      <h2 className="font-display mb-6 text-xl font-semibold">Company and metadata</h2>
      <div className="grid gap-6">
        <AdminFields.Text id="site-name" label="Brand name" value={content.site.name} onChange={(value) => setSite("name", value)} />
        <AdminFields.Text id="legal-name" label="Legal name" value={content.site.legalName} onChange={(value) => setSite("legalName", value)} />
        <AdminFields.Text id="tagline" label="Tagline" value={content.site.tagline} onChange={(value) => setSite("tagline", value)} />
        <AdminFields.Text id="title" label="Browser title" value={content.site.title} onChange={(value) => setSite("title", value)} />
        <AdminFields.Textarea id="description" label="Meta description" value={content.site.description} onChange={(value) => setSite("description", value)} />
        <AdminFields.Text id="email" label="Public email" value={content.site.email} onChange={(value) => setSite("email", value)} />
        <AdminFields.Text id="company-number" label="Company number" value={content.site.companyNumber} onChange={(value) => setSite("companyNumber", value)} />
        <AdminFields.Textarea id="registered-office" label="Registered office" value={content.site.registeredOffice} onChange={(value) => setSite("registeredOffice", value)} />
      </div>
    </div>
  );
}

function PrivacyPanel({
  content,
  onChange,
}: {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
}) {
  const privacy = content.privacy;
  function setPrivacy(patch: Partial<SiteContent["privacy"]>) {
    onChange({ ...content, privacy: { ...privacy, ...patch } });
  }
  return (
    <div className="rounded-[18px] border border-ink/8 bg-white p-5 md:p-6">
      <h2 className="font-display mb-2 text-xl font-semibold">Privacy page</h2>
      <p className="text-muted-text mb-6 text-sm">
        Use {"{email}"} and {"{legalName}"} in a paragraph to insert the live public email or legal name as a link where appropriate.
      </p>
      <div className="grid gap-6">
        <AdminFields.Text id="privacy-kicker" label="Kicker" value={privacy.kicker} onChange={(value) => setPrivacy({ kicker: value })} />
        <AdminFields.Text id="privacy-title" label="Title" value={privacy.title} onChange={(value) => setPrivacy({ title: value })} />
        <AdminFields.Textarea id="privacy-updated" label="Introductory note" value={privacy.lastUpdated} onChange={(value) => setPrivacy({ lastUpdated: value })} />
        <AdminFields.Text id="privacy-back" label="Back link label" value={privacy.backLabel} onChange={(value) => setPrivacy({ backLabel: value })} />
        {privacy.sections.map((block, index) => (
          <div key={`privacy-${index}`} className="grid gap-3 rounded-[16px] bg-surface/70 p-4">
            <AdminFields.Text
              id={`privacy-heading-${index}`}
              label={`Section ${index + 1} heading`}
              value={block.heading}
              onChange={(value) => {
                const sections = [...privacy.sections];
                sections[index] = { ...block, heading: value };
                setPrivacy({ sections });
              }}
            />
            <AdminFields.Paragraphs
              id={`privacy-copy-${index}`}
              label="Paragraphs"
              value={block.paragraphs}
              onChange={(paragraphs) => {
                const sections = [...privacy.sections];
                sections[index] = { ...block, paragraphs };
                setPrivacy({ sections });
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="cta"
              onClick={() =>
                setPrivacy({
                  sections: privacy.sections.filter((_, itemIndex) => itemIndex !== index),
                })
              }
            >
              Remove section
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="cta"
          onClick={() =>
            setPrivacy({
              sections: [...privacy.sections, { heading: "", paragraphs: [""] }],
            })
          }
        >
          Add privacy section
        </Button>
      </div>
    </div>
  );
}

function NotFoundPanel({
  content,
  onChange,
}: {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
}) {
  return (
    <div className="rounded-[18px] border border-ink/8 bg-white p-5 md:p-6">
      <h2 className="font-display mb-6 text-xl font-semibold">404 page</h2>
      <div className="grid gap-6">
        <AdminFields.Text
          id="nf-kicker"
          label="Kicker"
          value={content.notFound.kicker}
          onChange={(value) => onChange({ ...content, notFound: { ...content.notFound, kicker: value } })}
        />
        <AdminFields.Text
          id="nf-title"
          label="Title"
          value={content.notFound.title}
          onChange={(value) => onChange({ ...content, notFound: { ...content.notFound, title: value } })}
        />
        <AdminFields.Textarea
          id="nf-body"
          label="Body"
          value={content.notFound.body}
          onChange={(value) => onChange({ ...content, notFound: { ...content.notFound, body: value } })}
        />
        <AdminFields.Text
          id="nf-cta"
          label="Button label"
          value={content.notFound.ctaLabel}
          onChange={(value) => onChange({ ...content, notFound: { ...content.notFound, ctaLabel: value } })}
        />
      </div>
    </div>
  );
}
